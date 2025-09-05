import type { ChoiceFormat, MediaFormat, TextFormat } from "./Format";

type BlockBase = {
	id: number;
};
export type ChoiceBlock = BlockBase & {
	type: "choice";
	text: string;
	pageId: number;
	action: string;
	format: Partial<ChoiceFormat>;
};
export type Block =
	| (BlockBase & {
			type: "text";
			content: string;
			format: Partial<TextFormat>;
	  })
	| (BlockBase & {
			type: "image";
			path: string;
			format: Partial<MediaFormat>;
	  })
	| (BlockBase & {
			type: "video";
			path: string;
			format: Partial<MediaFormat>;
	  })
	| ChoiceBlock;
