import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  Choice,
  Format,
  Game,
  Page,
  Settings,
  initialChoice,
  initialGame,
  initialPage,
} from "../utils/initialStuff";
import JSZip from "jszip";

export interface GameState {
  game: Game;
  selectedPage: number;
  zip: JSZip;
  assets: {
    images: Map<string, string>;
  };
  gameState: any;
}

const initialState: GameState = {
  game: initialGame,
  selectedPage: 0,
  zip: new JSZip(),
  assets: {
    images: new Map<string, string>(),
  },
  gameState: { $state: {} },
};

export const gameSlice = createSlice({
  name: "money",
  initialState,
  reducers: {
    changeSelectedPage: (state, action: PayloadAction<number>) => {
      state.selectedPage = action.payload;
    },
    addPage: (state) => {
      state.game.pages.push(initialPage(state.game.settings.pageCount + 1));
      state.game.settings.pageCount++;
    },
    removePage: (state, action: PayloadAction<number>) => {
      const removeFirst = state.game.pages[action.payload].isFirst;
      state.game.pages.splice(action.payload, 1);

      if (removeFirst) {
        state.game.pages[0].isFirst = true;
      }

      if (state.selectedPage === state.game.pages.length - 1) {
        state.selectedPage--;
      }
    },
    addChoice: (state) => {
      state.game.pages[state.selectedPage].next.push(initialChoice);
    },
    removeChoice: (state, action: PayloadAction<number>) => {
      state.game.pages[state.selectedPage].next.splice(action.payload, 1);
    },
    loadGame: (state, action: PayloadAction<{ game: Game; zip: JSZip }>) => {
      state.game = action.payload.game;
      state.zip = action.payload.zip;
    },
    changePage: (state, action: PayloadAction<Partial<Page>>) => {
      state.game.pages[state.selectedPage] = {
        ...state.game.pages[state.selectedPage],
        ...action.payload,
      };
    },
    changePageAt: (
      state,
      action: PayloadAction<{ page: Partial<Page>; position: number }>
    ) => {
      state.game.pages[action.payload.position] = {
        ...state.game.pages[action.payload.position],
        ...action.payload.page,
      };
    },
    changeChoice: (
      state,
      action: PayloadAction<{ choice: Partial<Choice>; position: number }>
    ) => {
      const next = state.game.pages[action.payload.position].next;
      next[action.payload.position] = {
        ...next[action.payload.position],
        ...action.payload.choice,
      };
    },
    setFirst: (state, action: PayloadAction<number>) => {
      state.game.pages.forEach((page, index) => {
        page.isFirst = index === action.payload;
      });
    },
    setSelectedPage: (state, action: PayloadAction<number>) => {
      state.selectedPage = action.payload;
    },
    updateFormat: (state, action: PayloadAction<Partial<Format>>) => {
      const page = state.game.pages[state.selectedPage];
      page.format = {
        ...page.format,
        ...action.payload,
      };
    },
    updateGlobalFormat: (state, action: PayloadAction<Partial<Format>>) => {
      state.game.format = {
        ...state.game.format,
        ...action.payload,
      };
    },
    addAssets: (
      state,
      action: PayloadAction<{ assets: Map<string, string>; type: string }>
    ) => {
      switch (action.payload.type) {
        case "images":
          const assets = state.assets.images;

          for (const [
            assetName,
            assetContent,
          ] of action.payload.assets.entries()) {
            assets.set(assetName, assetContent);
          }

          state.assets.images = assets;
          break;

        default:
          break;
      }
    },
    removeAsset: (
      state,
      action: PayloadAction<{ name: string; type: string }>
    ) => {
      switch (action.payload.type) {
        case "images":
          const assets = state.assets.images;

          assets.delete(action.payload.name);

          state.assets.images = assets;
          break;

        default:
          break;
      }
    },
    updateSettings: (state, action: PayloadAction<Partial<Settings>>) => {
      state.game.settings = {
        ...state.game.settings,
        ...action.payload,
      };
    },
    changeGameState: (state, action: PayloadAction<any>) => {
      state.gameState = action.payload;
    },
    resetGameState: (state) => {
      state.gameState = { $state: {} };
    },
    newProject: (state) => {
      state = {
        game: initialGame,
        selectedPage: 0,
        zip: new JSZip(),
        assets: {
          images: new Map<string, string>(),
        },
        gameState: { $state: {} },
      };
    },
  },
});

export const {
  changeSelectedPage,
  addPage,
  addAssets,
  addChoice,
  changeChoice,
  changeGameState,
  changePage,
  changePageAt,
  loadGame,
  newProject,
  removeAsset,
  removeChoice,
  removePage,
  resetGameState,
  setFirst,
  setSelectedPage,
  updateFormat,
  updateGlobalFormat,
  updateSettings,
} = gameSlice.actions;

export default gameSlice.reducer;
