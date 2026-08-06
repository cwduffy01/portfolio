"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ 
    href, 
    children 
}: {
    href: string,
    children: string
}) {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href);

    return (
        <Link href={href} className="group relative inline-block">
            {isActive ? (
                <span className="font-web-title text-accent">{children}</span>
            ) : (
                <div>
                    <span className="font-web-subtitle [@media(hover:hover)]:transition-opacity [@media(hover:hover)]:group-hover:opacity-0">
                        {children}
                    </span>
                    <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 font-web-title opacity-0 [@media(hover:hover)]:transition-opacity [@media(hover:hover)]:group-hover:opacity-100"
                    >
                        {children}
                    </span>
                </div>
                )
            }
        </Link>
    );
}