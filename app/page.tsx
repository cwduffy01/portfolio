import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-54 px-16 bg-zinc-50 dark:bg-black">
        <div className="flex flex-col items-center gap-6 sm:gap-12 text-center">
          <h1 className="text-md sm:text-3xl font-semibold leading-6 sm:leading-10 tracking-tight text-black dark:text-zinc-50">
            this website is currently <br />under construction
          </h1>
          <Image
            src="/screwbot_factory.gif"
            alt="Under construction"
            width={400}
            height={400}
            unoptimized // keeps GIF animation reliable
          />
          <h2 className="text-sm sm:text-2xl font-semibold leading-6 sm:leading-10 tracking-tight text-black dark:text-zinc-50">
            please come back later
          </h2>
        </div>
      </main>
    </div>
  );
}
