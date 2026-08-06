import Image from "next/image";
import Link from "next/link";

export default function ProjectCard() {
    return (
        <Link href="/" className="flex flex-col w-64 group">
            <div id="project-title" className="flex justify-between items-baseline">
                <span className="font-header text-3xl transition-transform duration-300 group-hover:scale-105 origin-bottom-left">Sphynx V1</span>
                <span className="text-sm">04.28.26</span>
            </div>
            <Image
                src="/images/projects/sphynx-v1/cover.jpg"
                alt="Sphynx v1"
                width={300}
                height={400}
                unoptimized
                id="project-cover"
                className="h-auto grayscale transition-[filter] duration-300 group-hover:grayscale-0"
            />
            <div className="overflow-hidden">
                <div
                    className="flex w-max animate-marquee [animation-play-state:paused] group-hover:[animation-play-state:running]"
                >
                    <span className="font-header text-xl">
                        {"alleycat // 3d printing // 3d modeling // neotropolis //\u00A0"}
                    </span>
                    <span className="font-header text-xl" aria-hidden="true">
                        {"alleycat // 3d printing // 3d modeling // neotropolis //\u00A0"}
                    </span>
                </div>
            </div>
        </Link>
    )
}