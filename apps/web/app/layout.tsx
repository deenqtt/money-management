import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Money Management",
  description: "Telegram-first personal money management MVP"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
