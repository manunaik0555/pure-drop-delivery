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

export const metadata = {
  title: "Seetha Mahesh Enterprises | Elite Water Supply Sira",
  description: "Official bulk water distribution by Gowtham Rathod in Sira. Specializing in Half Liter, 1L, and 2L case delivery for weddings, functions, and events.",
  keywords: "Seetha Mahesh Enterprises, Water Sira, Gowtham Rathod, Function Water Supply, Bulk Water Delivery Sira",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
