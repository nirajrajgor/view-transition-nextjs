import { PokemonExplorer } from "@/app/_components/pokemon-explorer";
import { getPokemonList } from "@/lib/pokeapi";

export default async function Home() {
  const pokemon = await getPokemonList();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-8 lg:px-10">
        <PokemonExplorer pokemon={pokemon} />
      </main>
    </div>
  );
}
