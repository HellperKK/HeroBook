import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { emptyProject } from '../utils/game/empty/emptyProject';
import type { ChoiceFormat, Format, TextFormat } from '../utils/game/Format';
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
    changeBlockFormat: (
      state,
      action: PayloadAction<{ format: Partial<Format>; blockPosition: number; pageId: number }>,
    ) => {
      const page = state.pages.find((page) => page.id === action.payload.pageId);
      if (!page) return;

      const block = page.content[action.payload.blockPosition];
      if (!block) return;

      switch (block.type) {
        case 'image':
        case 'video':
          return;
        case 'text':
          for (const [key, value] of Object.entries(action.payload.format)) {
            const trueKey = key as keyof TextFormat;
            if (value === undefined && block.format[trueKey] !== undefined) {
              delete block.format[trueKey];
            } else {
              block.format[trueKey] = value;
            }
          }
          break;
        case 'choice':
          for (const [key, value] of Object.entries(action.payload.format)) {
            const trueKey = key as keyof ChoiceFormat;
            if (value === undefined && block.format[trueKey] !== undefined) {
              delete block.format[trueKey];
            } else {
              block.format[trueKey] = value;
            }
          }
          break;
        default:
          break;
      }
    },
    changeBlockSettings: (
      state,
      action: PayloadAction<{ settings: unknown; blockPosition: number; pageId: number }>,
    ) => {
      const page = state.pages.find((page) => page.id === action.payload.pageId);
      if (!page) return;

      const block = page.content[action.payload.blockPosition];
      if (!block) return;

      Object.assign(block, action.payload.settings);
    },
  },
});

export const {
  addPage,
  changeGlobalSettings,
  changeGlobalFormat,
  changePageFormat,
  changeBlockSettings,
  changeBlockFormat,
} = projectSlice.actions;

export default projectSlice.reducer;
