import type { Page } from "./Page";
import type { Settings } from "./Settings";

export type Project = {
	version: "2.0.0";
	settings: Settings;
	pages: Array<Page>;
	// categories: Array<Category>;
};
