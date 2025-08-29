import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { emptyProject } from "../utils/game/empty/emptyProject";
import type { Format } from "../utils/game/Format";
import type { Project } from "../utils/game/Project";
import type { Settings } from "../utils/game/Settings";

export interface Asset {
	name: string;
	content: string;
}

export interface AssetGroup {
	images: Array<Asset>;
	musics: Array<Asset>;
	sounds: Array<Asset>;
}

const initialState: Project = emptyProject;

export const projectSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		addPage: (_state) => {},
		changeGlobalSettings: (state, action: PayloadAction<Partial<Settings>>) => {
			state.settings = { ...state.settings, ...action.payload };
		},
		changeGlobalFormat: (state, action: PayloadAction<Partial<Format>>) => {
			state.settings.format = { ...state.settings.format, ...action.payload };
		},
		changePageFormat: (
			state,
			action: PayloadAction<{ format: Partial<Format>; pageId: number }>,
		) => {
			const page = state.pages.find(
				(page) => page.id === action.payload.pageId,
			);

			if (!page) return;

			page.format = { ...page.format, ...action.payload.format };			
		},
		clearPageFormat: (
			state,
			action: PayloadAction<{ property: keyof Format; pageId: number }>,
		) => {
			const page = state.pages.find(
				(page) => page.id === action.payload.pageId,
			);

			if (!page) return;

			delete page.format[action.payload.property];
		},
	},
});

export const { addPage, changeGlobalSettings, changeGlobalFormat, changePageFormat, clearPageFormat } =
	projectSlice.actions;

export default projectSlice.reducer;
