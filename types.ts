export enum JokeCategory {
  Any = "Any",
  Programming = "Programming",
  Misc = "Misc",
  Dark = "Dark",
  Pun = "Pun",
  Spooky = "Spooky",
  Christmas = "Christmas"
}

export enum JokeType {
  Single = "single",
  TwoPart = "twopart"
}

export interface JokeFlags {
  nsfw: boolean;
  religious: boolean;
  political: boolean;
  racist: boolean;
  sexist: boolean;
  explicit: boolean;
}

export interface JokeData {
  error: boolean;
  category: JokeCategory;
  type: JokeType;
  joke?: string;
  setup?: string;
  delivery?: string;
  flags: JokeFlags;
  id: number;
  safe: boolean;
  lang: string;
}

export interface JokeSettings {
  categories: JokeCategory[];
  blacklistFlags: (keyof JokeFlags)[];
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
  gradient: string;
}