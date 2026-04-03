import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MobileNav from "@/components/Navigation/MobileNav";
import "./globals.css";
import { Sidebar } from "@/components/Navigation/Sidebar";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Мой Календарь",
  description: "Планировщик задач и привычек",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Sidebar />
        <div className="md:ml-64">{children}</div>
        <MobileNav />
      </body>
    </html>
  );
}
