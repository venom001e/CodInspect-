"use client"

import Image from "next/image";
import { MenuIcon } from "lucide-react";
import Link from 'next/link';
import { useState } from "react";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        { href: "#", label: "Home" },
        { href: "#features", label: "Features" },
        { href: "#testimonials", label: "Testimonials" },
        { href: "#pricing", label: "Pricing" },
    ];

    return (
        <>
            <nav className="z-50 flex items-center justify-between w-full py-4 px-4 md:px-16 lg:px-24 xl:px-32 text-sm">
                <Link href="/">
                    <Image
                        src='/logo.png'
                        alt="Logo"
                        width={130}
                        height={36}
                        className="h-10 w-auto"
                    />
                </Link>

                <div className="hidden md:flex items-center gap-8 transition duration-500 text-slate-800">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="hover:text-green-600 transition">{link.label}</Link>
                    ))}
                </div>

                <div className="flex gap-2">
                    <Link href="/" className="hidden md:block px-7 py-2 bg-green-500 hover:bg-green-600 active:scale-95 transition-all rounded-full text-white">
                        Deploy AI Engineer
                    </Link>
                    <Link href="/" className="hidden md:block px-7 py-2 border border-gray-200 active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900" >
                        Login
                    </Link>
                </div>

                <button onClick={() => setMenuOpen(true)} className="md:hidden active:scale-90 transition" >
                    <MenuIcon />
                </button>
            </nav>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-100 bg-black/40 text-black backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`} >
                {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="text-white">{link.label}</Link>
                ))}
                <button onClick={() => setMenuOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-green-600 hover:bg-green-700 transition text-white rounded-md flex" >
                    X
                </button>
            </div>
        </>
    );
}