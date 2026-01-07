import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CMS Admin",
  description: "E-commerce CMS Administration Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
