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

/** Consecutive image runs this long (or longer) become a click-through gallery. */
const GALLERY_MIN = 5;

type MarkdownImage = {
    alt: string;
    src: string;
    /** Visible caption. Omitted when the image has no caption. */
    title?: string;
};

function escapeAttr(value: string): string {
    return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/**
 * `![alt](src)` or `![alt](src "caption")`.
 * Captions use a markdown title so existing articles (alt only) stay unchanged.
 */
function parseMarkdownImage(line: string): MarkdownImage | null {
    const trimmed = line.trim();
    if (!trimmed.startsWith("![") || !trimmed.endsWith(")")) return null;

    const altEnd = trimmed.indexOf("](");
    if (altEnd < 2) return null;

    const alt = trimmed.slice(2, altEnd);
    const inner = trimmed.slice(altEnd + 2, -1).trim();
    const titled = inner.match(/^(\S+)\s+(?:"([^"]*)"|'([^']*)')$/);

    if (!titled) {
        return { alt, src: inner };
    }

    const title = titled[2] ?? titled[3];
    return {
        alt,
        src: titled[1],
        title: title || undefined,
    };
}

function isImageOnlyBlock(block: string): boolean {
    const lines = block
        .trim()
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    return lines.length > 0 && lines.every((line) => parseMarkdownImage(line) !== null);
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
            const image = parseMarkdownImage(line);
            if (!image) return line;
            const title = image.title
                ? ` title="${escapeAttr(image.title)}"`
                : "";
            return `<img src="${escapeAttr(image.src)}" alt="${escapeAttr(image.alt)}"${title} />`;
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
                const image = parseMarkdownImage(line);
                if (!image) return line;
                const title = image.title
                    ? ` title="${escapeAttr(image.title)}"`
                    : "";
                return `<img src="${escapeAttr(image.src)}" alt="${escapeAttr(image.alt)}"${title} />`;
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