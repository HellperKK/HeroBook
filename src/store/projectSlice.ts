import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { freshId } from '../utils/freshId';
import type { ChoiceBlock, ImageBlock, TextBlock } from '../utils/game/Block';
import { emptyChoice } from '../utils/game/empty/emptyChoice';
import { emptyPage } from '../utils/game/empty/emptyPage';
import { emptyProject } from '../utils/game/empty/emptyProject';
import { emptyText } from '../utils/game/empty/emptyText';
import type { ChoiceFormat, Format, MediaFormat, TextFormat } from '../utils/game/Format';
import type { Page } from '../utils/game/Page';
import type { Project } from '../utils/game/Project';
import type { Settings } from '../utils/game/Settings';
import { emptyImage } from '../utils/game/empty/emptyImage';

type ProjectState = {
  project: Project;
  inEditor: boolean;
};

const initialState: ProjectState = {
  project: emptyProject,
  inEditor: false
};

export const projectSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    loadProject: (state, action: PayloadAction<Project>) => {
      state.project = action.payload;
    },
    editProject: (state, action: PayloadAction<Project>) => {
      state.project = action.payload;
      state.inEditor = true;
    },
    quitEditor: (state) => {
      state.project = emptyProject;
      state.inEditor = false;
    },
    changeGlobalSettings: (state, action: PayloadAction<Partial<Settings>>) => {
      Object.assign(state.project.settings, action.payload);
    },
    changeGlobalFormat: (state, action: PayloadAction<Partial<Format>>) => {
      Object.assign(state.project.settings.format, action.payload);
    },
    changePageFormat: (state, action: PayloadAction<{ format: Partial<Format>; pageId: number }>) => {
      const page = state.project.pages.find((page) => page.id === action.payload.pageId);
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
    changePageSettings: (state, action: PayloadAction<{ page: Partial<Page>; pageId: number }>) => {
      const page = state.project.pages.find((page) => page.id === action.payload.pageId);
      if (!page) return;

      Object.assign(page, action.payload.page);
    },
    changeBlockFormat: (
      state,
      action: PayloadAction<{ format: Partial<Format>; blockPosition: number; pageId: number }>,
    ) => {
      const page = state.project.pages.find((page) => page.id === action.payload.pageId);
      if (!page) return;

      const block = page.content[action.payload.blockPosition];
      if (!block) return;

      switch (block.type) {
        case 'image':
          for (const [key, value] of Object.entries(action.payload.format as MediaFormat)) {
            const trueKey = key as keyof MediaFormat;
            if (value === undefined && block.format[trueKey] !== undefined) {
              delete block.format[trueKey];
            } else {
              block.format[trueKey] = value;
            }
          }
          break;
        case 'video':
          return;
        case 'text':
          for (const [key, value] of Object.entries(action.payload.format as TextFormat)) {
            const trueKey = key as keyof TextFormat;
            if (value === undefined && block.format[trueKey] !== undefined) {
              delete block.format[trueKey];
            } else {
              block.format[trueKey] = value;
            }
          }
          break;
        case 'choice':
          for (const [key, value] of Object.entries(action.payload.format as ChoiceFormat)) {
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
      const page = state.project.pages.find((page) => page.id === action.payload.pageId);
      if (!page) return;

      const block = page.content[action.payload.blockPosition];
      if (!block) return;

      Object.assign(block, action.payload.settings);
    },
    inserBlockAt: (state, action: PayloadAction<{ blockType: string; blockPosition: number; pageId: number }>) => {
      const page = state.project.pages.find((page) => page.id === action.payload.pageId);
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
        case 'image': {
          const block: ImageBlock = { ...emptyImage, id: freshId(page.content) };
          page.content.splice(action.payload.blockPosition, 0, block);
          break;
        }

        default:
          break;
      }
    },
    deleteBlockAt: (state, action: PayloadAction<{ blockPosition: number; pageId: number }>) => {
      const page = state.project.pages.find((page) => page.id === action.payload.pageId);
      if (!page) return;

      page.content.splice(action.payload.blockPosition, 1);
    },
    addPage: (state) => {
      const id = freshId(state.project.pages);
      const newPage = { ...emptyPage, id, name: `Page ${id}` };
      state.project.pages.push(newPage);
    },
    addPageFromChoice: (state, action: PayloadAction<{ blockPosition: number; pageId: number; newId: number }>) => {
      const page = state.project.pages.find((page) => page.id === action.payload.pageId);
      if (!page) return;

      const block = page.content[action.payload.blockPosition];
      if (!block) return;
      if (block.type !== 'choice') return;

      const newPage = { ...emptyPage, id: action.payload.newId };
      state.project.pages.push(newPage);
      block.pageId = action.payload.newId;
    },
    deletePagePage: (state, action: PayloadAction<{ pageId: number }>) => {
      const pagePosition = state.project.pages.findIndex((page) => page.id === action.payload.pageId);
      if (pagePosition === -1) return;

      state.project.pages.splice(pagePosition, 1);
    },
  },
});

export const {
  loadProject,
  editProject,
  quitEditor,
  addPage,
  addPageFromChoice,
  deletePagePage,
  changeGlobalSettings,
  changeGlobalFormat,
  changePageSettings,
  changePageFormat,
  changeBlockSettings,
  changeBlockFormat,
  inserBlockAt,
  deleteBlockAt,
} = projectSlice.actions;

export default projectSlice.reducer;
