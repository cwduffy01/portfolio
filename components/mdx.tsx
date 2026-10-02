import { Children, isValidElement, type ComponentPropsWithoutRef } from "react";
import { Gallery, MediaImg, MediaRow, YouTube } from "@/components/MdxMedia";

/** Markdown wraps a lone image in <p>. A <figure> caption cannot live inside <p>. */
function isMediaOnlyParagraph(children: ComponentPropsWithoutRef<"p">["children"]) {
  const items = Children.toArray(children).filter((child) => {
    if (typeof child === "string") return child.trim().length > 0;
    return true;
  });
  return (
    items.length === 1 &&
    isValidElement(items[0]) &&
    items[0].type === MediaImg
  );
}

export const mdxComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="font-header mt-10 mb-4 text-5xl" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="font-header mt-10 mb-3 text-4xl" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="font-header mt-8 mb-2 text-3xl" {...props} />
  ),
  h4: (props: ComponentPropsWithoutRef<"h4">) => (
    <h4 className="font-header mt-6 mb-2 text-2xl" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) =>
    isMediaOnlyParagraph(props.children) ? (
      <>{props.children}</>
    ) : (
      <p className="font-body my-4 leading-relaxed" {...props} />
    ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a className="text-accent underline underline-offset-2" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="font-body my-4 list-disc space-y-1 pl-6" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="font-body my-4 list-decimal space-y-1 pl-6" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-relaxed" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="font-body border-accent text-foreground/80 my-8 border-l-4 py-1 pl-5 text-[0.95em] leading-relaxed italic [&_p]:my-3"
      {...props}
    />
  ),
  img: MediaImg,
  MediaRow,
  Gallery,
  YouTube,
};
