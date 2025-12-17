import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import StyledComponentsRegistry from "@/providers/AntdRegistry";
import { AuthProvider } from "@/providers/auth-provider";
import { CartProvider } from "@/providers/CartProvider";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/theme-provider";
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
    <html lang='en' suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <StyledComponentsRegistry>
          <QueryProvider>
            <AuthProvider>
              <CartProvider>
                <ThemeProvider>
                  <Navbar />
                  <CartDrawer />
                  <main className='flex-1 pt-16'>{children}</main>
                  <Footer />
                </ThemeProvider>
              </CartProvider>
            </AuthProvider>
          </QueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
