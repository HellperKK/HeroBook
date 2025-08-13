import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { emptyProject } from "../utils/game/empty/emptyProject";
import type { Project } from "../utils/game/Project";

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
		addPage: (_state, _action: PayloadAction<string>) => {
		},
	},
});

export const { addPage } = projectSlice.actions;

export default projectSlice.reducer;
