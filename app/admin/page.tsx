export default function AdminPage() {
  return (
    <main style={{ minHeight: '100vh', padding: '48px 32px', background: '#0b1020', color: '#edf2ff' }}>
      <section style={{ maxWidth: 960, margin: '0 auto' }}>
        <h1>Painel administrativo</h1>
        <p>Área administrativa da Fotolab.</p>

        <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="/api/admin/logout" style={{ display: 'inline-block', padding: '12px 18px', borderRadius: 10, background: '#ef4444', color: '#fff', textDecoration: 'none' }}>
            Sair
          </a>
        </div>
      </section>
    </main>
  );
}
