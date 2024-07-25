import React, { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ben Spooner Portfolio Website",
  description: "Providing a selection of my projects.",
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>{
        children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
export default RootLayout;