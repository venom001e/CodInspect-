import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import LenisScroll from "@/components/lenis";

const geistSans = Geist({
    variable: "--geist-sans",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <LenisScroll />
                {children}
            </body>
        </html>
    );
}
