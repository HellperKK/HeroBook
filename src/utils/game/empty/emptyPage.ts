import type { Page } from "../Page";

export const emptyPage: Page = {
	id: 0,
	isFirst: true,
	name: "base page",
	content: [{ type: "text", content: "This is a placeholder content" }],
};
