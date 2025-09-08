import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { freshId } from '../utils/freshId';
import type { ChoiceBlock, TextBlock } from '../utils/game/Block';
import { emptyChoice } from '../utils/game/empty/emptyChoice';
import { emptyProject } from '../utils/game/empty/emptyProject';
import { emptyText } from '../utils/game/empty/emptyText';
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
    inserBlockAt: (state, action: PayloadAction<{ blockType: string; blockPosition: number; pageId: number }>) => {
      const page = state.pages.find((page) => page.id === action.payload.pageId);
      if (!page) return;

      switch (action.payload.blockType) {
        case 'text': {
          const block: TextBlock = { ...emptyText, id: freshId(page.content) };
          page.content.splice(action.payload.blockPosition, 0, block);
          break;
        }
        case 'choice': {
          const block: ChoiceBlock = { ...emptyChoice, id: freshId(page.content) };
          page.content.splice(action.payload.blockPosition, 0, block);
          break;
        }

        default:
          break;
      }
    },
    deleteBlockAt: (state, action: PayloadAction<{ blockPosition: number; pageId: number }>) => {
      const page = state.pages.find((page) => page.id === action.payload.pageId);
      if (!page) return;

      page.content.splice(action.payload.blockPosition, 1);
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
  inserBlockAt,
  deleteBlockAt,
} = projectSlice.actions;

export default projectSlice.reducer;
