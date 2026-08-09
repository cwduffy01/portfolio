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

const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)]+)\)\s*$/;
/** Consecutive image runs this long (or longer) become a click-through gallery. */
const GALLERY_MIN = 5;

function escapeAttr(value: string): string {
    return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function isImageOnlyBlock(block: string): boolean {
    const lines = block
        .trim()
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    return lines.length > 0 && lines.every((line) => IMAGE_LINE.test(line));
}

function imageLinesFromBlock(block: string): string[] {
    return block
        .trim()
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}

function markdownImagesToImgTags(lines: string[]): string {
    return lines
        .map((line) => {
            const match = line.match(IMAGE_LINE);
            if (!match) return line;
            const [, alt, src] = match;
            return `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" />`;
        })
        .join("\n");
}

/**
 * Allow markdown image syntax inside explicit <Gallery>…</Gallery> blocks
 * by converting them to <img> tags MDX can pass as children.
 */
function normalizeExplicitGalleries(content: string): string {
    return content.replace(/<Gallery>([\s\S]*?)<\/Gallery>/g, (_full, inner: string) => {
        const lines = inner
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
                const match = line.match(IMAGE_LINE);
                if (!match) return line;
                const [, alt, src] = match;
                return `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" />`;
            });
        return `<Gallery>\n${lines.join("\n")}\n</Gallery>`;
    });
}

/**
 * Wrap runs of consecutive image-only markdown blocks:
 * - 2–4 images → <MediaRow> (side by side)
 * - 5+ images → <Gallery> (horizontal scroll)
 */
export function groupConsecutiveImages(content: string): string {
    const withGalleries = normalizeExplicitGalleries(content);
    const blocks = withGalleries.split(/\n{2,}/);
    const out: string[] = [];
    let i = 0;

    while (i < blocks.length) {
        if (!isImageOnlyBlock(blocks[i])) {
            out.push(blocks[i]);
            i += 1;
            continue;
        }

        const run: string[] = [];
        while (i < blocks.length && isImageOnlyBlock(blocks[i])) {
            run.push(...imageLinesFromBlock(blocks[i]));
            i += 1;
        }

        if (run.length === 1) {
            out.push(run[0]);
            continue;
        }

        const imgs = markdownImagesToImgTags(run);
        const tag = run.length >= GALLERY_MIN ? "Gallery" : "MediaRow";
        out.push(`<${tag}>\n${imgs}\n</${tag}>`);
    }

    return out.join("\n\n");
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
        content: groupConsecutiveImages(content),
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