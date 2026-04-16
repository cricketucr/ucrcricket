import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UCR Cricket",
  description: "UCR Cricket Club",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
