import type { Metadata } from "next";
import { Playfair_Display, Space_Mono, Inter } from "next/font/google";
import "./globals.css";
import { DarkModeProvider } from "@/lib/darkMode";
import DarkModeToggle from "@/components/DarkModeToggle";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Armed Forces Financial Risk Assessment",
  description:
    "Personalised financial risk profiling for Armed Forces officers. Regression-based scoring. Prescriptive asset allocation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${spaceMono.variable} ${inter.variable} h-full`}
    >
      <head>
        {/* Prevent dark mode flash by applying class before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('darkMode')==='true')document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className="h-full antialiased">
        <DarkModeProvider>
          {children}
          <DarkModeToggle />
        </DarkModeProvider>
      </body>
    </html>
  );
}
