import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { emptyProject } from "../utils/game/empty/emptyProject";
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
		initProject: (
			state,
			action: PayloadAction<Partial<Settings>>,
		) => {
			state.settings = { ...state.settings, ...action.payload };
		},
		changeGlobalSettings: (state, action: PayloadAction<Partial<Settings>>) => {
			state.settings = { ...state.settings, ...action.payload };
		},
	},
});

export const { addPage, initProject, changeGlobalSettings } = projectSlice.actions;

export default projectSlice.reducer;
