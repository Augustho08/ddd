import './globals.css';

export const metadata = {
  title: 'Fotolab',
  description: 'Galeria e gestão de imagens da Fotolab',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
