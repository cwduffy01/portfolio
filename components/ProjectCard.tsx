import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({
    title,
    slug,
    date,
    tags,
    isActive
} : {
    title: string,
    slug: string,
    date: string,
    tags: string[],
    isActive: boolean
}
) {
    const tagString = tags.join(" // ") + " //\u00A0"

    return (
        <Link href={`/portfolio/${slug}`} data-active={isActive ? "" : undefined} className="group flex w-full max-w-64 flex-col">
            <div id="project-title" className="flex flex-col justify-between items-baseline">
                <span className="font-header text-3xl transition-transform duration-300 group-hover:scale-105 group-data-[active]:scale-105 origin-bottom-left">{title}</span>
                <span className="text-sm">{date}</span>
            </div>
            <Image
                src={`/images/projects/${slug}/cover-portrait.jpg`}
                alt={title}
                width={300}
                height={400}
                unoptimized
                id="project-cover"
                className="w-full hidden md:block grayscale transition-[filter] duration-300 group-hover:grayscale-0 group-data-[active]:grayscale-0"
            />
            <Image
                src={`/images/projects/${slug}/cover-landscape.jpg`}
                alt={title}
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
                        {tagString}
                    </span>
                    <span className="font-header text-xl" aria-hidden="true">
                        {tagString}
                    </span>
                </div>
            </div>
        </Link>
    )
}