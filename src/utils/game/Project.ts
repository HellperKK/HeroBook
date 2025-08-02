import type { Category } from "./Category";
import type { Settings } from "./Settings";

export type Project = {
	version: "2.0.0";
	settings: Settings;
	categories: Array<Category>;
};
