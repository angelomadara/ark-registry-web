import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/app/context/AuthContext";
import NavBar from "./NavBar";

export const metadata: Metadata = {
  title: "The Ark Registry",
  description: "A digital registry for biodiversity monitoring and species conservation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream text-forest" suppressHydrationWarning>
        <SessionProvider>
          <AuthProvider>
            <NavBar />
            <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
