import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'sonner';
import './globals.css';
import { Providers } from '@/components/Providers'; // Ajuste o caminho se necessário (ex: '../components/Providers')

const inter = Inter({ subsets: ["latin"]});

export const metadata: Metadata = {
  title: 'Alugue Banheiro',
  description: 'Sistema de gestão de locação de banheiros químicos e caçambas',
  icons: {
    icon: "/adaptive-icon.png",
    shortcut: "/adaptive-icon.png",
    apple: "/adaptive.png",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-slate-50 text-emerald-900 antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-right" richColors expand={true} />
      </body>
    </html>
  );
}