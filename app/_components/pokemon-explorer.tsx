"use client";

import {
  useMemo,
  useState,
  startTransition,
  ViewTransition,
  addTransitionType,
} from "react";
import type { PokemonSummary } from "@/lib/pokemon";
import { PokemonCard } from "./pokemon-card";

const SORTS = [
  { id: "number", label: "By #" },
  { id: "attack", label: "By Attack" },
  { id: "name", label: "By Name" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

function sortPokemon(list: PokemonSummary[], sort: SortId): PokemonSummary[] {
  const copy = [...list];
  if (sort === "attack")
    return copy.sort((a, b) => b.stats.attack - a.stats.attack);
  if (sort === "name") return copy.sort((a, b) => a.name.localeCompare(b.name));
  return copy.sort((a, b) => a.id - b.id);
}

type PokemonExplorerProps = {
  pokemon: PokemonSummary[];
};

export function PokemonExplorer({ pokemon }: PokemonExplorerProps) {
  const [active, setActive] = useState<SortId>("number");

  const sorted = useMemo(() => sortPokemon(pokemon, active), [pokemon, active]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Sort Pokémon"
      >
        {SORTS.map((sort) => (
          <button
            key={sort.id}
            type="button"
            role="tab"
            aria-selected={active === sort.id}
            onClick={() =>
              startTransition(() => {
                addTransitionType("sort");
                setActive(sort.id);
              })
            }
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 ${
              active === sort.id
                ? "bg-zinc-900 text-white"
                : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:ring-zinc-300"
            }`}
          >
            {sort.label}
          </button>
        ))}
      </div>
      <ViewTransition
        key={active}
        name="my-content"
        share="auto"
        enter="auto"
        default="none"
      >
        <section className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((entry, index) => (
            <PokemonCard
              key={entry.id}
              pokemon={entry}
              priority={index === 0}
            />
          ))}
        </section>
      </ViewTransition>
    </div>
  );
}
