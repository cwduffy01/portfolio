import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({
    isActive
} : {
    isActive: boolean
}
) {
    return (
        <Link href="/" data-active={isActive ? "" : undefined} className="group flex w-full max-w-64 flex-col">
            <div id="project-title" className="flex justify-between items-baseline">
                <span className="font-header text-3xl transition-transform duration-300 group-hover:scale-105 group-data-[active]:scale-105 origin-bottom-left">Sphynx V1</span>
                <span className="text-sm">04.28.26</span>
            </div>
            <Image
                src="/images/projects/sphynx-v1/cover-portrait.jpg"
                alt="Sphynx v1"
                width={300}
                height={400}
                unoptimized
                id="project-cover"
                className="w-full hidden md:block grayscale transition-[filter] duration-300 group-hover:grayscale-0 group-data-[active]:grayscale-0"
            />
            <Image
                src="/images/projects/sphynx-v1/cover-landscape.jpg"
                alt="Sphynx v1"
                width={400}
                height={300}
                unoptimized
                id="project-cover"
                className="w-full md:hidden grayscale transition-[filter] duration-300 group-hover:grayscale-0 group-data-[active]:grayscale-0"
            />

            <div className="overflow-hidden">
                <div
                    className="flex w-max animate-marquee [animation-play-state:paused] group-hover:[animation-play-state:running] group-data-[active]:[animation-play-state:running]"
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