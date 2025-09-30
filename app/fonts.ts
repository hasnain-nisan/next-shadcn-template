import localFont from "next/font/local";
import { Source_Sans_3, Oswald } from "next/font/google";

// ITC Avant Garde Gothic for headers (web/social)
// Using Oswald as temporary fallback until licensed font files are added
// To use licensed fonts: uncomment localFont section below and comment out Oswald
export const avantGarde = Oswald({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-avant-garde",
  display: "swap",
});

/* 
// Uncomment this section when you have the licensed ITC Avant Garde Gothic files
// Place font files in public/fonts/itc-avant-garde/ 
export const avantGarde = localFont({
  src: [
    {
      path: "./fonts/itc-avant-garde/ITCAvantGardeStd-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/itc-avant-garde/ITCAvantGardeStd-Bold.woff",
      weight: "700", 
      style: "normal",
    },
  ],
  variable: "--font-avant-garde",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
*/

// Source Sans Pro for body text (web/social) 
// Using Google Fonts version as fallback - can be replaced with local files
export const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source-sans",
  display: "swap",
});

// Keep Poppins for slide decks/deliverables (per typography rules)
// Already loaded in layout.tsx - will be kept for headers in slide context