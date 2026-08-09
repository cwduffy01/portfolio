"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

const BASE_CLASS = "mx-auto my-8 block h-auto max-w-full object-contain";
/** Caps wide (landscape) media by width; w-full keeps it inside the article on small screens */
const LANDSCAPE_CLASS = "w-[90%] max-w-lg md:w-full";
/** Caps tall (portrait) media by height */
const PORTRAIT_CLASS = "max-h-80 w-auto md:max-h-96";

const VIDEO_EXT = /\.(mov|mp4|webm|ogg)(\?.*)?$/i;

function isVideoSrc(src: string | undefined): boolean {
  return !!src && VIDEO_EXT.test(src);
}

function join(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

function sizeClassFor(orientation: "landscape" | "portrait" | null) {
  if (orientation === "portrait") return PORTRAIT_CLASS;
  if (orientation === "landscape") return LANDSCAPE_CLASS;
  // Before load: keep both so nothing flashes oversized
  return join(LANDSCAPE_CLASS, PORTRAIT_CLASS);
}

type Slide = { src: string; alt: string };

function Lightbox({
  slides,
  index,
  onClose,
  onIndexChange,
}: {
  slides: Slide[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const total = slides.length;
  const active = slides[index];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (total > 1 && e.key === "ArrowRight") {
        onIndexChange((index + 1) % total);
      } else if (total > 1 && e.key === "ArrowLeft") {
        onIndexChange((index - 1 + total) % total);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, total, onClose, onIndexChange]);

  if (!mounted || !active) return null;

  return createPortal(
    <div
      className="mdx-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={active.alt || "Enlarged image"}
      onClick={onClose}
    >
      <button
        type="button"
        className="mdx-lightbox-close font-body"
        aria-label="Close"
        onClick={onClose}
      >
        ✕
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={active.src}
        alt={active.alt}
        className="mdx-lightbox-img"
        onClick={(e) => e.stopPropagation()}
      />
      {total > 1 && (
        <div
          className="mdx-lightbox-nav font-body"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => onIndexChange((index - 1 + total) % total)}
          >
            ←
          </button>
          <span>
            {index + 1} / {total}
          </span>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => onIndexChange((index + 1) % total)}
          >
            →
          </button>
        </div>
      )}
    </div>,
    document.body,
  );
}

export function MediaImg({
  lightbox = true,
  ...props
}: ComponentPropsWithoutRef<"img"> & { lightbox?: boolean }) {
  const { src, alt, className, ...rest } = props;
  const srcString = typeof src === "string" ? src : undefined;
  const [orientation, setOrientation] = useState<
    "landscape" | "portrait" | null
  >(null);
  const [open, setOpen] = useState(false);
  const closeLightbox = useCallback(() => setOpen(false), []);

  // MDX image syntax is also used for video files in the content.
  if (isVideoSrc(srcString)) {
    return (
      <video
        src={srcString}
        controls
        playsInline
        aria-label={alt || undefined}
        className={join(BASE_CLASS, sizeClassFor(orientation), className)}
        onLoadedMetadata={(e) => {
          const { videoWidth, videoHeight } = e.currentTarget;
          setOrientation(videoHeight > videoWidth ? "portrait" : "landscape");
        }}
      />
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- MDX media sizes vary; keep v1 simple */}
      <img
        src={src}
        alt={alt ?? ""}
        className={join(
          BASE_CLASS,
          sizeClassFor(orientation),
          lightbox && "mdx-lightbox-trigger",
          className,
        )}
        onClick={
          lightbox && srcString
            ? () => setOpen(true)
            : undefined
        }
        onLoad={(e) => {
          const { naturalWidth, naturalHeight } = e.currentTarget;
          setOrientation(naturalHeight > naturalWidth ? "portrait" : "landscape");
        }}
        {...rest}
      />
      {open && srcString && (
        <Lightbox
          slides={[{ src: srcString, alt: alt ?? "" }]}
          index={0}
          onClose={closeLightbox}
          onIndexChange={closeLightbox}
        />
      )}
    </>
  );
}

/** Groups consecutive MDX images into a responsive side-by-side row. */
export function MediaRow({ children }: { children: ReactNode }) {
  // JSX <img> inside MDX does not use components.img — rebuild via MediaImg
  // so sizing + lightbox behave like singular markdown images.
  const slides = slidesFromChildren(children);

  if (slides.length === 0) return null;

  return (
    <div className="mdx-media-row my-6">
      {slides.map((slide) => (
        <MediaImg key={slide.src} src={slide.src} alt={slide.alt} />
      ))}
    </div>
  );
}

function slidesFromChildren(children: ReactNode): Slide[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) return [];
    const props = child.props as { src?: unknown; alt?: unknown };
    if (typeof props.src !== "string") return [];
    return [
      {
        src: props.src,
        alt: typeof props.alt === "string" ? props.alt : "",
      },
    ];
  });
}

/**
 * Horizontal-scroll image gallery with lightbox. Use <Gallery>…</Gallery>,
 * or via auto-wrap of 5+ consecutive markdown images.
 */
export function Gallery({ children }: { children: ReactNode }) {
  const slides = slidesFromChildren(children);
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (slides.length === 0) return null;

  if (slides.length === 1) {
    return <MediaImg src={slides[0].src} alt={slides[0].alt} />;
  }

  return (
    <>
      <div
        className="mdx-gallery my-8"
        role="region"
        aria-label="Image gallery"
      >
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            className="mdx-gallery-thumb"
            onClick={() => setLightbox(i)}
            aria-label={`View larger: ${slide.alt || `image ${i + 1}`}`}
          >
            <MediaImg src={slide.src} alt={slide.alt} lightbox={false} />
          </button>
        ))}
      </div>
      {lightbox !== null && (
        <Lightbox
          slides={slides}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onIndexChange={setLightbox}
        />
      )}
    </>
  );
}

/** Explicit MDX component — raw <iframe> overrides are unreliable with MDXRemote. */
export function YouTube({
  src,
  title = "YouTube video",
}: {
  src: string;
  title?: string;
}) {
  return (
    <div className="my-8 flex w-full justify-center">
      <div className="relative aspect-video w-full max-w-lg">
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  );
}
