import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layouts/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import DynamicHeader from "@/components/layouts/DynamicHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pet Realm",
  description: "Your one-stop platform for pets, products, and services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <DynamicHeader />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
