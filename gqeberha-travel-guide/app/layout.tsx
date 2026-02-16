import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The PE Passport | Gqeberha's Complete Travel Guide",
  description: "Discover hidden gems, top attractions, restaurants, and accommodations in Gqeberha. Your complete guide to the Friendly City.",
  keywords: ["Gqeberha", "travel guide", "Port Elizabeth", "attractions", "restaurants", "hotels"],
  authors: [{ name: "The PE Passport" }],
  openGraph: {
    title: "The PE Passport | Gqeberha Travel Guide",
    description: "Discover hidden gems, top attractions, restaurants, and accommodations in Gqeberha.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white dark:bg-slate-950">
        {children}
      </body>
    </html>
  );
}
