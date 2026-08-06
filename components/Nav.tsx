"use client";

import NavLink from "./NavLink";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HiOutlineMenu } from "react-icons/hi";
import { usePathname } from "next/navigation";

export default function Nav() {
    const [open, setOpen] = useState(false);

    const pathname = usePathname();

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <div className="p-6 select-none">
            <div className="flex w-full justify-between items-center">
                <div className="flex-1 md:hidden"></div>
                <div className="text-5xl md:text-6xl font-web-title leading-none text-accent">
                    <Link href="/">carbs</Link>
                </div>
                <div className="hidden md:flex text-4xl font-web-subtitle gap-8">
                    <NavLink href="/about">about</NavLink>
                    <NavLink href="/portfolio">portfolio</NavLink>
                    <NavLink href="/contact">contact</NavLink>
                </div>
                <button
                    type="button"
                    className="flex flex-1 items-center justify-end md:hidden"
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    onClick={() => setOpen((v) => !v)}
                >
                    <HiOutlineMenu className="size-8 -translate-y-1"/>
                </button>
            </div>
            <hr className="border-t-2 border-dashed border-foreground" />
            {open && (
                <div
                    id="mobile-menu"
                    className="md:hidden inset-0 z-50"
                >
                    <nav className="flex flex-col items-center gap-2 text-2xl pt-4">
                        <NavLink href="/about">about</NavLink>
                        <NavLink href="/portfolio">portfolio</NavLink>
                        <NavLink href="/contact">contact</NavLink>
                    </nav>
                </div>
            )}
            
        </ div>
    );
}