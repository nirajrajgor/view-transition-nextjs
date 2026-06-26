import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TypeBadge } from "@/app/_components/type-badge";
import {
  getPokemon,
  getPokemonNeighbors,
  isPokeApiNotFoundError,
} from "@/lib/pokeapi";
import {
  formatPokemonHeight,
  formatPokemonId,
  formatPokemonName,
  formatPokemonWeight,
} from "@/lib/pokemon";
import { ViewTransition } from "react";

type PokemonPageProps = {
  params: Promise<{
    name: string;
  }>;
};

export default async function PokemonPage({ params }: PokemonPageProps) {
  const { name } = await params;
  const pokemon = await getPokemon(name).catch((error: unknown) => {
    if (isPokeApiNotFoundError(error)) {
      notFound();
    }

    throw error;
  });

  const { prev, next } = await getPokemonNeighbors(name);

  return (
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      default="none"
    >
      <div className="flex flex-1 flex-col bg-zinc-50 font-sans">
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-8 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="mb-8 w-fit text-sm font-semibold text-zinc-600 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600"
          >
            Back
          </Link>

          <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
            <div className="flex aspect-square items-center justify-center rounded-lg bg-white">
              <ViewTransition name={`pokemon-${pokemon.id}`} share="morph">
                <Image
                  src={pokemon.image}
                  alt={formatPokemonName(pokemon.name)}
                  width={360}
                  height={360}
                  priority
                  className="h-72 w-72 object-contain sm:h-80 sm:w-80"
                />
              </ViewTransition>
            </div>

            <div>
              <p className="font-mono text-sm font-semibold text-zinc-500">
                {formatPokemonId(pokemon.id)}
              </p>
              <h1 className="mt-2 text-4xl font-bold text-zinc-950">
                {formatPokemonName(pokemon.name)}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                {pokemon.types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-3">
                <Detail
                  label="Height"
                  value={formatPokemonHeight(pokemon.height)}
                />
                <Detail
                  label="Weight"
                  value={formatPokemonWeight(pokemon.weight)}
                />
              </dl>

              <section className="mt-8">
                <h2 className="text-sm font-bold uppercase text-zinc-500">
                  Stats
                </h2>
                <dl className="mt-3 divide-y divide-zinc-100 rounded-lg border border-zinc-200 bg-white">
                  <Stat label="Health" value={pokemon.stats.hp} />
                  <Stat label="Attack" value={pokemon.stats.attack} />
                  <Stat label="Defense" value={pokemon.stats.defense} />
                </dl>
              </section>

              <section className="mt-8">
                <h2 className="text-sm font-bold uppercase text-zinc-500">
                  Abilities
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {pokemon.abilities.map((ability) => (
                    <li
                      key={ability}
                      className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 ring-1 ring-zinc-200"
                    >
                      {formatPokemonName(ability)}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </section>
          <nav
            className="mt-12 flex items-stretch justify-between gap-4 border-t border-zinc-200 pt-6"
            style={{ viewTransitionName: "pagination-nav" }}
          >
            {prev ? (
              <Link
                href={`/pokemon/${prev}`}
                transitionTypes={["nav-back"]}
                className="group flex flex-1 items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                <span
                  aria-hidden
                  className="text-xl text-zinc-400 transition group-hover:-translate-x-0.5 group-hover:text-zinc-600"
                >
                  ←
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold uppercase tracking-wide text-zinc-500">
                    Previous
                  </span>
                  <span className="block truncate text-base font-bold text-zinc-950">
                    {formatPokemonName(prev)}
                  </span>
                </span>
              </Link>
            ) : (
              <span className="flex-1" />
            )}

            {next ? (
              <Link
                href={`/pokemon/${next}`}
                transitionTypes={["nav-forward"]}
                className="group flex flex-1 items-center justify-end gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-right transition hover:border-zinc-300 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                <span className="min-w-0">
                  <span className="block text-xs font-bold uppercase tracking-wide text-zinc-500">
                    Next
                  </span>
                  <span className="block truncate text-base font-bold text-zinc-950">
                    {formatPokemonName(next)}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="text-xl text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-zinc-600"
                >
                  →
                </span>
              </Link>
            ) : (
              <span className="flex-1" />
            )}
          </nav>
        </main>
      </div>
    </ViewTransition>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <dt className="text-xs font-bold uppercase text-zinc-500">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-zinc-950">{value}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="text-sm font-semibold text-zinc-600">{label}</dt>
      <dd className="font-mono text-sm font-bold text-zinc-950">{value}</dd>
    </div>
  );
}
