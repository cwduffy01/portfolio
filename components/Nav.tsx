import NavLink from "./NavLink";
import Link from "next/link";

export default function Nav() {
    return (
        <div className="p-6 select-none">
            <div className="flex w-full justify-between items-center">
                <div className="text-6xl font-web-title text-accent">
                    <Link href="/">carbs</Link>
                </div>
                <div className="flex text-4xl font-web-subtitle gap-8">
                    <NavLink href="/about">about</NavLink>
                    <NavLink href="/portfolio">portfolio</NavLink>
                    <NavLink href="/contact">contact</NavLink>
                </div>
            </div>
            <hr className="border-t-2 border-dashed border-neutral-950" />
        </ div>
    );
}