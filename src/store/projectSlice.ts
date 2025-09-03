import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { emptyProject } from '../utils/game/empty/emptyProject';
import type { Format } from '../utils/game/Format';
import type { Project } from '../utils/game/Project';
import type { Settings } from '../utils/game/Settings';

const initialState: Project = emptyProject;

export const projectSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    addPage: (_state) => {},
    changeGlobalSettings: (state, action: PayloadAction<Partial<Settings>>) => {
      Object.assign(state.settings, action.payload);
    },
    changeGlobalFormat: (state, action: PayloadAction<Partial<Format>>) => {
      Object.assign(state.settings.format, action.payload);
    },
    changePageFormat: (state, action: PayloadAction<{ format: Partial<Format>; pageId: number }>) => {
      const page = state.pages.find((page) => page.id === action.payload.pageId);

      if (!page) return;

      for (const [key, value] of Object.entries(action.payload.format)) {
        const trueKey = key as keyof Format;
        if (value === undefined && page.format[trueKey] !== undefined) {
          delete page.format[trueKey];
        } else {
          page.format[trueKey] = value;
        }
      }
    },
  },
});

export const { addPage, changeGlobalSettings, changeGlobalFormat, changePageFormat } = projectSlice.actions;

export default projectSlice.reducer;
