import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "../styles/globals.css";
import { TooltipProvider } from "../context/TooltipContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chart Dashboard - Analytics & Insights",
  description:
    "A modern analytics dashboard with interactive charts and real-time data visualization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceMono.variable} antialiased`}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
