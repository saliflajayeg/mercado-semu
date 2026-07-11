import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mercado Semu",
  description: "Vende, Compra, Conecta. Todo en un solo lugar.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mercado Semu",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#101c4e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-brand-bg text-brand-ink">
        <ServiceWorkerRegister />
        <AppShell>{children}</AppShell>
        <InstallPrompt />
      </body>
    </html>
  );
}
