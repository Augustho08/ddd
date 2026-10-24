# FotoLab

Site em Next.js para envio de fotografias, análise de metadados (EXIF, IPTC, XMP e GPS) e um painel administrativo privado para ver, buscar, baixar e excluir as imagens recebidas.

- **Frontend e backend:** Next.js 15 (App Router), React 19, TypeScript e Tailwind CSS.
- **Armazenamento de arquivos:** Vercel Blob em modo **privado**. Os arquivos não têm URL pública.
- **Banco de dados:** Postgres (Neon, pela integração da Vercel). A tabela é criada automaticamente na primeira execução.
- **Autenticação:** login do administrador com sessão em cookie `httpOnly` assinado (JWT HS256).

---

## 1. O que você precisa configurar (uma vez)

Você precisará de duas integrações da Vercel, ambas com plano gratuito (Hobby), e de três variáveis que você define.

| Recurso | Onde configurar | O que é preenchido automaticamente |
|---|---|---|
| Vercel Blob (**Private**) | Projeto > Storage > Create > Blob | `BLOB_READ_WRITE_TOKEN` |
| Neon Postgres | Projeto > Storage (ou Marketplace) > Neon | `DATABASE_URL` |
| Credenciais do admin | Você define | `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET` |

> **Importante:** ao criar o Blob store, escolha **Private**. O código usa `access: 'private'`, e um store público recusará os envios. Confira os limites do plano gratuito na documentação da Vercel, pois eles podem mudar.

Variáveis (ver `.env.example`):

- `ADMIN_USERNAME`: usuário do painel.
- `ADMIN_PASSWORD`: senha forte e única.
- `SESSION_SECRET`: 32 caracteres ou mais. Gere com `openssl rand -base64 48`.

Nunca coloque esses valores no código nem no repositório público.

---

## 2. Publicar na Vercel

**Opção A — pelo GitHub (recomendada)**

1. Crie um repositório privado no GitHub e envie o conteúdo deste ZIP (sem a pasta `node_modules`, que não existe no ZIP).
2. Na Vercel, clique em **Add New > Project** e importe o repositório. O framework é detectado como **Next.js**.
3. Antes de clicar em **Deploy**, em **Environment Variables**, adicione `ADMIN_USERNAME`, `ADMIN_PASSWORD` e `SESSION_SECRET`.
4. Ainda no projeto, em **Storage**, crie um **Blob store (Private)** e conecte-o ao projeto. Crie também a integração **Neon Postgres**. Ambas adicionam as variáveis `BLOB_READ_WRITE_TOKEN` e `DATABASE_URL` automaticamente.
5. Vá em **Deployments** e faça um **Redeploy** para aplicar as variáveis.

**Opção B — pela linha de comando**

```bash
npm install -g vercel
cd fotolab
npm install
vercel link
vercel env add ADMIN_USERNAME
vercel env add ADMIN_PASSWORD
vercel env add SESSION_SECRET
vercel deploy --prod
```

Conecte o Blob e o Neon pelo painel da Vercel (passo 4 acima) para que as variáveis sejam preenchidas.

Depois do deploy, acesse `https://seu-projeto.vercel.app/admin/login` para entrar no painel.

---

## 3. Executar localmente

```bash
npm install
cp .env.example .env.local   # e preencha os valores
npm run dev
```

Abra http://localhost:3000. Para usar o armazenamento real localmente, copie `BLOB_READ_WRITE_TOKEN` e `DATABASE_URL` do painel da Vercel para o `.env.local`.

Testes e build:

```bash
npm test
npm run build
```

---

## 4. Estrutura do projeto

```
app/
  page.tsx                  página inicial e envio
  resultado/page.tsx        análise da imagem enviada
  privacidade/page.tsx      aviso de privacidade e consentimento
  admin/page.tsx            painel (protegido)
  admin/login/page.tsx      login do administrador
  api/upload/token/         emissão de token para upload direto ao Blob privado
  api/images/               validação, extração de metadados e registro
  api/admin/...             login, logout, listagem, download, miniatura e exclusão
components/                 UploadForm e AdminGallery
lib/                        análise, banco, sessão, validação e formatação
middleware.ts               protege /admin e /api/admin
tests/                      testes de validação de arquivos
```

---

## 5. Segurança e privacidade

- **Validação real do arquivo:** o formato é identificado pelos bytes iniciais, não só pela extensão. Arquivos com conteúdo inválido são apagados do armazenamento.
- **Limite de tamanho:** 25 MB, checado no navegador e novamente no servidor.
- **Consentimento:** o envio exige a confirmação explícita do usuário. A rota de token e a de processamento recusam envios sem consentimento.
- **Arquivos privados:** o Blob é privado. Toda leitura passa por uma rota que verifica a sessão de administrador.
- **Sessão:** cookie `httpOnly`, `sameSite=strict` e `secure` em produção, válido por 8 horas.
- **Sem segredos no frontend:** credenciais e tokens existem apenas no servidor.
- **Cabeçalhos:** `X-Frame-Options`, `nosniff`, `Referrer-Policy` e `Cache-Control: no-store` nas áreas administrativas.
- **Exclusão:** remove o original, a miniatura e o registro no banco.

---

## 6. Limitações conhecidas

- **Tamanho de envio:** o upload vai direto do navegador ao Blob, então o limite de ~4,5 MB das funções da Vercel não se aplica. O limite do próprio app é de 25 MB.
- **HEIC:** o formato é lido e os metadados são extraídos, mas a miniatura pode não ser gerada, dependendo do decodificador disponível no ambiente. Nesse caso o painel mostra um rótulo no lugar da miniatura e o original continua disponível para download.
- **Limitação de tentativas de login:** há um atraso fixo de cerca de 1 segundo por tentativa incorreta. Para bloqueio mais forte em produção, use a funcionalidade de Rate Limiting da Vercel ou um serviço como Upstash.
- **Uploads órfãos:** se o navegador enviar o arquivo mas a confirmação falhar, o arquivo pode ficar no Blob sem registro. Você pode removê-lo pelo painel de Storage da Vercel.
- **Conformidade:** o texto em `/privacidade` é um modelo técnico. Revise-o com um profissional jurídico antes de abrir o serviço ao público (LGPD ou legislação equivalente).
