import Image from "next/image";
import Link from "next/link";

export default function ConstructionMessage() {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-md sm:text-3xl">
          this page is currently <br />under construction
        </h1>
        <Link href="https://youtu.be/60-e0oK7gE0?si=F-qftSPwpywI7IGX">
          <Image
            src="/screwbot_factory.gif"
            alt="Under construction"
            width={400}
            height={400}
            unoptimized
            className="border-4 border-accent"
          />
        </Link>
        <h2 className="text-sm sm:text-2xl">please come back later</h2>
      </main>
    );
  }