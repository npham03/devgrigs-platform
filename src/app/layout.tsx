import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/views/shared/Navbar";
import "./globals.css"; // File CSS mặc định của Next.js

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevGrigs Platform",
  description: "Nền tảng kết nối Freelancer và Doanh nghiệp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-black text-gray-900 dark:text-white">
        <Navbar /> {/* Gắn Navbar vào layout tổng */}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
