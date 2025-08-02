import type { Format } from "./Format";
import type { Texts } from "./Texts";

export type Settings = {
	author: string;
	gameTitle: string;
	texts: Texts;
	expert: boolean;
	format: Format;
};
