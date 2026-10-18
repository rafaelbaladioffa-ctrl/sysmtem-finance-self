import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finanças do casal",
  description: "Base privada para controle financeiro pessoal e compartilhado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
