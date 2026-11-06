const linkClass = "text-accent underline underline-offset-2";

export default function Contact() {
  return (
    // Outer flex centers the box; text-left keeps the content left-justified inside it.
    <main className="flex flex-1 items-center justify-center px-6 py-8">
      <div className="max-w-2xl text-left">
        <h1 className="font-title mb-3 text-4xl">
          Here are the best ways to contact me, sorted from most responsive to
          least responsive:
        </h1>
        <ul className="font-body my-4 space-y-1">
          <li className="leading-relaxed">
            Email:{" "}
            <a href="mailto:cwduffy01@gmail.com" className={linkClass}>
              cwduffy01@gmail.com
            </a>
          </li>
          <li className="leading-relaxed">
            Discord:{" "}
            <a href="https://discordapp.com/users/395768320348913664" className={linkClass}>
              carbs7
            </a>
          </li>
          <li className="leading-relaxed">
            Text:{" "}
            <a href="sms:+16787902924" className={linkClass}>
              678-790-2924
            </a>
          </li>
          <li className="leading-relaxed">
            LinkedIn:{" "}
            <a
              href="https://www.linkedin.com/in/carsonduffy/"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              linkedin.com/in/carsonduffy
            </a>
          </li>
          <li className="leading-relaxed">
            Carrier Pigeon:{" "}
            <a
              href="https://www.pigeongram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Click here
            </a>
          </li>
        </ul>
      </div>
    </main>
  );
}
