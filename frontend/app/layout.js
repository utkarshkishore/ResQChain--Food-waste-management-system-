import { Inter } from "next/font/google";
import "./globals.css";

// Load the "Inter" font (standard for modern apps)
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ResQ-Chain",
  description: "AI Food Rescue App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}