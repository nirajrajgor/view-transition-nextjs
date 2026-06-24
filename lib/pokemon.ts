export type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export type PokemonBaseStats = {
  hp: number;
  attack: number;
  defense: number;
};

export type PokemonSummary = {
  id: number;
  name: string;
  image: string;
  types: PokemonType[];
  stats: PokemonBaseStats;
};

export type PokemonDetails = Omit<PokemonSummary, "stats"> & {
  height: number;
  weight: number;
  abilities: string[];
  stats: PokemonBaseStats;
};

export function formatPokemonId(id: number) {
  return `#${id.toString().padStart(3, "0")}`;
}

export function formatPokemonName(name: string) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatPokemonHeight(height: number) {
  return `${height / 10} m`;
}

export function formatPokemonWeight(weight: number) {
  return `${weight / 10} kg`;
}
