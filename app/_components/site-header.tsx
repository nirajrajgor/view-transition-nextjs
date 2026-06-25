import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="text-2xl font-bold text-zinc-950">
          Pokemon
        </Link>

        <p className="text-sm font-semibold text-zinc-500">Next.js Demo</p>
      </div>
    </header>
  );
}
