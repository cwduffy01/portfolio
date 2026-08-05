import { BsInstagram, BsLinkedin } from "react-icons/bs";
import { CgInstagram } from "react-icons/cg";
import { FaInstagram } from "react-icons/fa6";
import { LiaLinkedin } from "react-icons/lia";
import { LuLinkedin } from "react-icons/lu";
import { SiGithub, SiInstagram } from "react-icons/si";
import { SlSocialLinkedin } from "react-icons/sl";

export default function Footer() {
    return (
        <div className="px-6">
            <hr className="border-t-2 border-dashed border-neutral-950" />
            <div className="flex py-3 items-center justify-center">
                <div className="flex-1"></div>
                <div>© 2026 Carson Duffy</div>
                <div className="flex flex-1 justify-end gap-4">
                    <a href="https://github.com/cwduffy01" className="text-foreground hover:text-accent">
                        <SiGithub className="size-8" />
                    </a>
                    <a href="https://www.linkedin.com/in/carsonduffy/" className="text-foreground hover:text-accent">
                        <BsLinkedin className="size-8" />
                    </a>
                    <a href="https://www.instagram.com/carbs.py/" className="text-foreground hover:text-accent">
                        <SiInstagram className="size-8" />
                    </a>
                </div>
            </div>
        </ div>
    );
}