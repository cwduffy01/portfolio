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
            <hr className="border-t-2 border-dashed border-foreground" />
            <div className="flex py-3 items-center justify-center">
                <div className="hidden md:flex-1"></div>
                <div>© 2026 Carson Duffy</div>
                <div className="flex flex-1 justify-end gap-3 md:gap-4 [&_svg]:size-6 md:[&_svg]:size-8">
                    <a 
                        href="https://github.com/cwduffy01"
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-foreground transition-all duration-200 hover:text-accent hover:scale-110"
                    >
                        <SiGithub />
                    </a>                 
                    <a 
                        href="https://www.linkedin.com/in/carsonduffy/"
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-foreground transition-all duration-200 hover:text-accent hover:scale-110"
                    >
                        <BsLinkedin />
                    </a>
                    <a 
                        href="https://www.instagram.com/carbs.py/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-foreground transition-all duration-200 hover:text-accent hover:scale-110"
                    >
                        <SiInstagram />
                    </a>
                </div>
            </div>
        </ div>
    );
}