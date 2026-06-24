import type { PokemonSummary, PokemonType } from "@/lib/pokemon";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";
const POKEMON_LIMIT = 30;

type PokemonListResponse = {
  results: Array<{
    name: string;
    url: string;
  }>;
};

type PokemonDetailsResponse = {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: {
        front_default: string | null;
      };
    };
  };
  types: Array<{
    slot: number;
    type: {
      name: PokemonType;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    next: {
      revalidate: 60 * 60 * 24,
    },
  });

  if (!response.ok) {
    throw new Error(`PokeAPI request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function getBaseStat(stats: PokemonDetailsResponse["stats"], name: string) {
  return stats.find((stat) => stat.stat.name === name)?.base_stat ?? 0;
}

function normalizePokemon(pokemon: PokemonDetailsResponse): PokemonSummary {
  return {
    id: pokemon.id,
    name: pokemon.name,
    image:
      pokemon.sprites.other?.["official-artwork"]?.front_default ??
      pokemon.sprites.front_default ??
      "",
    types: pokemon.types
      .sort((a, b) => a.slot - b.slot)
      .map((entry) => entry.type.name),
    stats: {
      hp: getBaseStat(pokemon.stats, "hp"),
      attack: getBaseStat(pokemon.stats, "attack"),
      defense: getBaseStat(pokemon.stats, "defense"),
    },
  };
}

export async function getPokemonList() {
  const list = await fetchJson<PokemonListResponse>(
    `${POKEAPI_BASE_URL}/pokemon?limit=${POKEMON_LIMIT}&offset=0`,
  );

  const pokemon = await Promise.all(
    list.results.map((entry) => fetchJson<PokemonDetailsResponse>(entry.url)),
  );

  return pokemon.map(normalizePokemon);
}
