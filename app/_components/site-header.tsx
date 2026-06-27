import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="text-2xl font-bold text-zinc-950">
          Next.js View Transitions
        </Link>

        <a
          href="https://github.com/nirajrajgor/view-transition-nextjs"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-zinc-500 transition hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
