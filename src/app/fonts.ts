import {
  Darker_Grotesque,
  Geist,
  Geist_Mono,
} from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const darkerGrotesque = Darker_Grotesque({
  variable: "--font-darker-grotesque",
  subsets: ["latin"],
  weight: "variable",
});

export const fontVariables = `${geistSans.variable} ${geistMono.variable} ${darkerGrotesque.variable}`;
