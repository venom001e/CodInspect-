"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { MenuIcon } from "lucide-react";
import Link from 'next/link';
import { useState } from "react";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        { href: "/", label: "Home" },
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

                <div className="flex gap-4 items-center">
                    <SignedOut>
                        <Link href="/sign-in" className="hidden md:block px-7 py-2 border border-gray-200 active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900" >
                            Login
                        </Link>
                        <Link href="/sign-up" className="hidden md:block px-7 py-2 bg-green-500 hover:bg-green-600 active:scale-95 transition-all rounded-full text-white">
                            Get Started
                        </Link>
                    </SignedOut>

                    <SignedIn>
                        <Link href="/dashboard" className="hidden md:block px-5 py-2 hover:bg-gray-100 rounded-full text-slate-700 transition">
                            Dashboard
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>

                <button onClick={() => setMenuOpen(true)} className="md:hidden active:scale-90 transition" >
                    <MenuIcon />
                </button>
            </nav>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-100 bg-black/40 text-black backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`} >
                {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="text-white" onClick={() => setMenuOpen(false)}>{link.label}</Link>
                ))}

                <SignedOut>
                    <div className="flex flex-col gap-4 mt-4 w-full px-10">
                        <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="w-full text-center px-7 py-3 bg-white hover:bg-gray-100 transition-all rounded-full text-slate-900 font-medium">
                            Login
                        </Link>
                        <Link href="/sign-up" onClick={() => setMenuOpen(false)} className="w-full text-center px-7 py-3 bg-green-500 hover:bg-green-600 transition-all rounded-full text-white font-medium">
                            Get Started
                        </Link>
                    </div>
                </SignedOut>

                <SignedIn>
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="px-7 py-3 bg-white text-slate-900 rounded-full font-medium">
                        Dashboard
                    </Link>
                    <div className="mt-4">
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </SignedIn>

                <button onClick={() => setMenuOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-white/20 hover:bg-white/30 transition text-white rounded-full flex mt-8" >
                    X
                </button>
            </div>
        </>
    );
}