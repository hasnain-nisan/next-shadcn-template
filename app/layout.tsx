import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { avantGarde, sourceSans } from "./fonts";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

// Keep Poppins for slide decks/deliverables context
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Transparent Partner Admin Panel",
  description: "Real-time insights for interviews, projects, and clients",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${avantGarde.variable} ${sourceSans.variable} ${poppins.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
