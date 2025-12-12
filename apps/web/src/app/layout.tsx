import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { CartProvider } from "@/providers/CartProvider";
import QueryProvider from "@/providers/QueryProvider";
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
  title: "Modern Ecommerce Store",
  description: "Built with Next.js and NestJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <QueryProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <main className='flex-1 pt-16'>{children}</main>
            <Footer />
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
