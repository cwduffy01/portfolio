import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export type ProjectFrontmatter = {
    title: string;
    slug: string;
    date: string;
    tags: string[];
    cover: string;
    summary: string;
    featured: boolean;
};

export type Project = {
    slug: string;
    frontmatter: ProjectFrontmatter;
    content: string;
};

function toTimestamp(date: string): number {
    const [mm, dd, yy] = date.split(".").map(Number);
    const year = 2000 + yy;
    return new Date(year, mm - 1, dd).getTime();
}

export function getProjectSlugs(): string[] {
    const filenames = fs.readdirSync(PROJECTS_DIR);

    return filenames
        .filter((name) => name.endsWith(".mdx") && !name.startsWith("_"))
        .map((name) => name.replace(/\.mdx$/, ""));
}

export function getProjectBySlug(slug: string): Project | null {
    const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    return {
        slug, 
        frontmatter: data as ProjectFrontmatter,
        content
    };
}

export function getAllProjects(): Project[] {
    return getProjectSlugs()
        .map((slug) => getProjectBySlug(slug))
        .filter((project): project is Project => project !== null)
        .sort(
            (a, b) =>
                toTimestamp(b.frontmatter.date) - toTimestamp(a.frontmatter.date)
        );
}