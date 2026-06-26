import type {
  PokemonDetails,
  PokemonSummary,
  PokemonType,
} from "@/lib/pokemon";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";
const POKEMON_LIMIT = 20;

class PokeApiRequestError extends Error {
  constructor(public status: number) {
    super(`PokeAPI request failed: ${status}`);
  }
}

type PokemonListResponse = {
  results: Array<{
    name: string;
    url: string;
  }>;
};

type PokemonDetailsResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
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
  abilities: Array<{
    ability: {
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
    throw new PokeApiRequestError(response.status);
  }

  return response.json() as Promise<T>;
}

export function isPokeApiNotFoundError(error: unknown) {
  return error instanceof PokeApiRequestError && error.status === 404;
}

function getBaseStat(stats: PokemonDetailsResponse["stats"], name: string) {
  return stats.find((stat) => stat.stat.name === name)?.base_stat ?? 0;
}

function normalizePokemonSummary(
  pokemon: PokemonDetailsResponse,
): PokemonSummary {
  const image =
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    pokemon.sprites.front_default;

  if (!image) {
    throw new Error(`Pokemon image missing: ${pokemon.name}`);
  }

  return {
    id: pokemon.id,
    name: pokemon.name,
    image,
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

function normalizePokemonDetails(
  pokemon: PokemonDetailsResponse,
): PokemonDetails {
  return {
    ...normalizePokemonSummary(pokemon),
    height: pokemon.height,
    weight: pokemon.weight,
    abilities: pokemon.abilities.map((entry) => entry.ability.name),
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

  return pokemon.map(normalizePokemonSummary);
}

export async function getPokemon(name: string) {
  const pokemon = await fetchJson<PokemonDetailsResponse>(
    `${POKEAPI_BASE_URL}/pokemon/${name}`,
  );

  return normalizePokemonDetails(pokemon);
}

// Returns the previous/next Pokemon names in list order. Only fetches the list
// endpoint (names), which is cached, so it's cheap to call per detail page.
export async function getPokemonNeighbors(name: string) {
  const list = await fetchJson<PokemonListResponse>(
    `${POKEAPI_BASE_URL}/pokemon?limit=${POKEMON_LIMIT}&offset=0`,
  );

  const names = list.results.map((entry) => entry.name);
  const index = names.indexOf(name);

  return {
    prev: index > 0 ? names[index - 1] : null,
    next: index !== -1 && index < names.length - 1 ? names[index + 1] : null,
  };
}
