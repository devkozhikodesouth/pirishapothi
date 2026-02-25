import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import ClientProvider from "./redux/ClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Pirisha pothi",
  description: "Book your Pothi online – SSF Poonoor Sahityotsav",

  icons: {
    icon: [
     // { url: "/favicon.ico" },
      { url: "/images/fevicon.png", sizes: "32x32", type: "image/png" },
      //{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/images/fevicon.png",
  },

  openGraph: {
    title: "Poonoor Sahityotsav – Pothi Booking",
    description: "Book your Pothi online. Easy & secure.",
    url: "https://poonoorsahityotsav.online",
    siteName: "Poonoor Sahityotsav",
    images: [
      {
        url: "https://poonoorsahityotsav.online/images/thumbnail.jpg",
        width: 1200,
        height: 630,
        alt: "Poonoor Sahityotsav Thumbnail",
      },
    ],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProvider>
          <Theme>
            {children}
          </Theme>
        </ClientProvider>
      </body>
    </html>
  );
}
