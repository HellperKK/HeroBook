import type { Format } from "./Format";
import type { Texts } from "./Texts";

export type Settings = {
	author: string;
	folderName: string;
	gameTitle: string;
	texts: Texts;
	expert: boolean;
	format: Format;
	firstPage: number;
};
