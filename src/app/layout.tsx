import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"; // Remove incorrect import
import { GeistSans } from "geist/font/sans"; // Correct import for Geist Sans
import { GeistMono } from "geist/font/mono"; // Correct import for Geist Mono
import "./globals.css";
import Layout from "./components/Layout";
// import { ClientLayout } from "./components/client-layout";

// Remove old initialization
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
// 
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "TBook - Your Digital Library",
  description: "Read and write books online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">
      {/* Use the className directly from the imported font objects */}
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
