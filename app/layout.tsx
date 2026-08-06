import type { Metadata } from "next";
import "./globals.css";

import { Kumar_One } from "next/font/google";
import { Kumar_One_Outline } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import { VT323 } from "next/font/google";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const kumarOne = Kumar_One({
  weight: "400", // Kumar One only has 400
  subsets: ["latin"],
  variable: "--font-kumar-one",
});

const kumarOneOutline = Kumar_One_Outline({
  weight: "400", // Kumar One Outline only has 400
  subsets: ["latin"],
  variable: "--font-kumar-one-outline",
});

const jetBrainsMono = JetBrains_Mono({
  weight: ["400"], // You can add more weights if needed
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const vt323 = VT323({
  weight: "400", // VT323 only has 400
  subsets: ["latin"],
  variable: "--font-vt323",
});

export const metadata: Metadata = {
  title: "Carson Duffy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${kumarOne.variable} ${kumarOneOutline.variable} ${jetBrainsMono.variable} ${vt323.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col px-6">
        <Nav/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
