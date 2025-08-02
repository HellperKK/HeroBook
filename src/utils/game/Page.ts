import type { Block } from "./Block";
import type { Format } from "./Format";

export type Page = {
	id: number;
	isFirst: boolean;
	name: string;
	content: Array<Block>;
	format?: Partial<Format>;
};
