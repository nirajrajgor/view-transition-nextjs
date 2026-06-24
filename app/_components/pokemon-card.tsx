import Image from "next/image";
import type { PokemonSummary } from "@/lib/pokemon";
import { formatPokemonId, formatPokemonName } from "@/lib/pokemon";
import { TypeBadge } from "./type-badge";

type PokemonCardProps = {
  pokemon: PokemonSummary;
  priority?: boolean;
};

export function PokemonCard({ pokemon, priority = false }: PokemonCardProps) {
  return (
    <article className="group flex min-h-80 flex-col rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-zinc-300 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-sm font-semibold text-zinc-500">
          {formatPokemonId(pokemon.id)}
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      </div>

      <div className="relative mt-5 flex aspect-square items-center justify-center rounded-md bg-zinc-50">
        {pokemon.image ? (
          <Image
            src={pokemon.image}
            alt={formatPokemonName(pokemon.name)}
            width={180}
            height={180}
            priority={priority}
            className="h-44 w-44 object-contain transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-44 w-44 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium text-zinc-400">
            No image
          </div>
        )}
      </div>

      <h2 className="mt-5 text-xl font-bold text-zinc-950">
        {formatPokemonName(pokemon.name)}
      </h2>

      <div className="mt-4 border-t border-zinc-100 pt-4">
        <dl className="grid grid-cols-3 gap-2">
          <Stat label="Health" value={pokemon.stats.hp} />
          <Stat label="Attack" value={pokemon.stats.attack} />
          <Stat label="Defense" value={pokemon.stats.defense} />
        </dl>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-zinc-50 px-2 py-2 text-center">
      <dt className="text-[0.68rem] font-bold text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-bold text-zinc-950">{value}</dd>
    </div>
  );
}
