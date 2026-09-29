import './globals.css';
import { Providers } from '@/components/Providers'; // Ajuste o caminho se necessário (ex: '../components/Providers')

export const metadata = {
  title: 'Alugue Banheiro',
  description: 'Sistema de gestão',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}