import type { ChoiceFormat } from "./Format";

type BlockBase = {
	id: number;
};
export type Choice = BlockBase & {
	type: "choice";
	text: string;
	pageId: number;
	action: string;
	format?: Partial<ChoiceFormat>;
};
export type Block =
	| (BlockBase & {
			type: "text";
			content: string;
	  })
	| (BlockBase & {
			type: "image";
			path: string;
	  })
	| (BlockBase & {
			type: "video";
			path: string;
	  })
	| Choice;
