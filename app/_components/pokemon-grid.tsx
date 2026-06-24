import type { PokemonSummary } from "@/lib/pokemon";
import { PokemonCard } from "./pokemon-card";

type PokemonGridProps = {
  pokemon: PokemonSummary[];
};

export function PokemonGrid({ pokemon }: PokemonGridProps) {
  return (
    <section className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {pokemon.map((entry, index) => (
        <PokemonCard key={entry.id} pokemon={entry} priority={index === 0} />
      ))}
    </section>
  );
}
