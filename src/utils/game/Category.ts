import type { Page } from "./Page";

export type Category = {
	name: string;
	visible: boolean;
	pages: Array<Page>;
};
