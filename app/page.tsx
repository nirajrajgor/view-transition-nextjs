import { PokemonGrid } from "@/app/_components/pokemon-grid";
import { getPokemonList } from "@/lib/pokeapi";

export default async function Home() {
  const pokemon = await getPokemonList();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-8 lg:px-10">
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-red-600">
              View Transition Next.js Demo
            </p>
            <h1 className="mt-2 text-4xl font-bold text-zinc-950">Pokemon</h1>
          </div>
          <p className="max-w-md text-sm leading-6 text-zinc-600">
            A compact Pokemon index with artwork, type, and core battle stats.
          </p>
        </header>

        <PokemonGrid pokemon={pokemon} />
      </main>
    </div>
  );
}
