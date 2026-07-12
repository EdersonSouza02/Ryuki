import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ryuki • Assistente de Pesquisa no Terminal",
  description: "Busca na web em tempo real, respostas com IA via Groq, histórico persistente e exportação. Tudo no seu terminal.",
  keywords: ["CLI", "terminal", "search", "AI", "assistente", "pesquisa"],
  authors: [{ name: "EdersonSouza02", url: "https://github.com/EdersonSouza02" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
