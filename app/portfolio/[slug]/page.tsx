import { getProjectBySlug, getProjectSlugs } from "@/lib/projects"
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

type Props = {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function Project({ params }: Props) {
    const { slug } = await params;

    const project = getProjectBySlug(slug);

    if (!project) {
        notFound();
    }
    

    return (
        <div>
            <h1>{project.frontmatter.title}</h1>
            <p>{project.frontmatter.summary}</p>
            <MDXRemote source={project.content} />
        </div>
    )
}