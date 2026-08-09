import { getProjectBySlug, getProjectSlugs } from "@/lib/projects";
import { mdxComponents } from "@/components/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function Project({ params }: Props) {
  const { slug } = await params;

  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { title, date } = project.frontmatter;

  return (
    <article className="mx-auto w-full max-w-3xl py-8">
      <header className="mb-10">
        <h1 className="font-web-title text-4xl leading-tight md:text-5xl">
          {title}
        </h1>
        <p className="font-body mt-2 text-sm md:text-base">{date}</p>
      </header>

      <div className="article-body">
        <MDXRemote source={project.content} components={mdxComponents} />
      </div>
    </article>
  );
}
