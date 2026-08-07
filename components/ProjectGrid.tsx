"use client";

import ProjectCard from "./ProjectCard"
import { FiFilter } from "react-icons/fi"

import { useState, useEffect, useRef } from "react";
import { Project } from "@/lib/projects";

export default function ProjectGrid ({
    projects
} : {
    projects: Project[]
}

) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const cardRefs = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const shouldTrack = window.matchMedia(
          "(hover: none), (max-width: 767px)"
        ).matches;
      
        if (!shouldTrack) {
          setActiveIndex(null); // desktop: hover only
          return;
        }
      
        const nodes = cardRefs.current.filter(Boolean) as HTMLElement[];
      
        const observer = new IntersectionObserver(
            () => {
              const viewportCenter = window.innerHeight / 2;
              let bestIndex = -1;
              let bestDistance = Infinity;
              nodes.forEach((node, index) => {
                const rect = node.getBoundingClientRect();
                const cardCenter = rect.top + rect.height / 2;
                const distance = Math.abs(cardCenter - viewportCenter);
                if (distance < bestDistance) {
                  bestDistance = distance;
                  bestIndex = index;
                }
              });
              if (bestIndex !== -1) {
                setActiveIndex((prev) => (prev === bestIndex ? prev : bestIndex));
              }
            },
            {
              root: null,
              // wider band = fewer edge cases; center-distance does the real picking
              rootMargin: "-30% 0px -30% 0px",
              threshold: [0, 0.5, 1],
            }
          );
      
        nodes.forEach((node) => observer.observe(node));
        return () => observer.disconnect();
      }, []);


    return (
        <div className="mx-auto w-fit max-w-full  py-4 md:py-10">
            <div className="flex items-center justify-between">
                <span className="font-web-subtitle text-accent text-3xl md:text-5xl">portfolio</span>
                <button
                    type="button"
                    className="text-accent"
                >
                    <FiFilter className="size-6 md:size-10"/>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4 pb-40 md:py-6">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        ref={(el) => {
                            cardRefs.current[index] = el;
                        }}
                    >
                        <ProjectCard
                            title={project.frontmatter.title}
                            slug={project.slug}
                            date={String(project.frontmatter.date)}
                            tags={project.frontmatter.tags}
                            isActive={activeIndex === index}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
