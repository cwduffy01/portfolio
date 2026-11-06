import Link from "next/link";
import LogoDotMatrix from "@/components/LogoDotMatrix";

const linkClass = "text-accent underline underline-offset-2";

// Stacked and right-aligned like the business card.
const ROLES = [
  "i am a freelance engineer",
  "developer",
  "designer",
  "fabricator",
  "maker",
  "tinkerer",
  "sorcerer",
  "whatever",
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col-reverse items-center justify-center gap-10 py-8 md:flex-row md:gap-16">
      <div className="max-w-md space-y-4 leading-relaxed">
        <p>hey there! my name is carson duffy.</p>
        <p>
          {/* inline-block: the text after it continues on the baseline of the last role */}
          <span className="inline-block text-right">
            {ROLES.map((role) => (
              <span key={role} className="block">
                {role}
              </span>
            ))}
          </span>{" "}
          you need to manifest your most ambitious creative visions.
        </p>
        <p>
          for examples of my previous work, check out the{" "}
          <Link href="/portfolio" className={linkClass}>
            portfolio
          </Link>{" "}
          tab. if you&apos;re looking to get in touch with me, you can find my
          information in{" "}
          <Link href="/contact" className={linkClass}>
            contact
          </Link>
          .
        </p>
      </div>
      <LogoDotMatrix className="h-[min(40svh,20rem)] w-auto shrink-0 text-accent md:h-[min(60svh,28rem)]" />
    </main>
  );
}
