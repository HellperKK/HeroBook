import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  Category,
  Choice,
  Format,
  Game,
  Page,
  Settings,
  initialCategory,
  initialChoice,
  initialGame,
  initialPage,
} from "../utils/initialStuff";

export interface Asset {
  name: string;
  content: string;
}

export interface AssetGroup {
  images: Array<Asset>;
}

export interface GameState {
  game: Game;
  selectedPage: number;
  assets: AssetGroup;
  gameState: { $state: any };
  resetBool: boolean;
  visulaizingStates: Array<string>;
}

const initialState: GameState = {
  game: initialGame,
  selectedPage: 0,
  assets: {
    images: [],
  },
  gameState: { $state: {} },
  resetBool: false,
  visulaizingStates: [],
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

      if (state.selectedPage === state.game.pages.length) {
        state.selectedPage--;
      }
    },
    addChoice: (state) => {
      state.game.pages[state.selectedPage].next.push(initialChoice);
    },
    removeChoice: (state, action: PayloadAction<number>) => {
      state.game.pages[state.selectedPage].next.splice(action.payload, 1);
    },
    loadGame: (state, action: PayloadAction<{ game: Game }>) => {
      state.game = action.payload.game;
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
      const next = state.game.pages[state.selectedPage].next;
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
    updateGlobalFormat: (state, action: PayloadAction<Format>) => {
      state.game.format = {
        ...state.game.format,
        ...action.payload,
      };
    },
    addAssets: (
      state,
      action: PayloadAction<{ assets: Array<Asset>; type: string }>
    ) => {
      switch (action.payload.type) {
        case "images":
          for (const asset of action.payload.assets) {
            const oldAsset = state.assets.images.find(
              (a) => a.name === asset.name
            );

            if (oldAsset !== undefined) {
              oldAsset.content = asset.content;
            } else {
              state.assets.images.push(asset);
            }
          }

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

          const assetIndex = assets.findIndex(
            (a) => a.name === action.payload.name
          );

          if (assetIndex === -1) {
            return;
          }

          assets.splice(assetIndex, 1);

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
      state.game = initialGame;
      state.selectedPage = 0;
      state.assets = {
        images: [],
      };
      state.gameState = { $state: {} };
      state.resetBool = !state.resetBool;
    },
    addCategory: (state) => {
      const settings = state.game.settings;
      if (!settings.categories) {
        settings.categories = [];
      }
      settings.categories.push(initialCategory);
    },
    removeCategory: (state, action: PayloadAction<number>) => {
      const settings = state.game.settings;
      if (!settings.categories || !(settings.categories.length > 0)) {
        return;
      }
      const categoryName = settings.categories[action.payload].name;

      settings.categories.splice(action.payload, 1);

      for (const pages of state.game.pages) {
        if (pages.category == categoryName) {
          pages.category = "";
        }
      }
    },
    changeCategory: (
      state,
      action: PayloadAction<{ category: Partial<Category>; position: number }>
    ) => {
      const settings = state.game.settings;
      if (settings.categories) {
        const category = settings.categories[action.payload.position];
        settings.categories[action.payload.position] = {
          ...category,
          ...action.payload.category,
        };
      }
    },
    changeVisualState: (
      state,
      action: PayloadAction<{ id: number; content: string }>
    ) => {
      state.visulaizingStates[action.payload.id] = action.payload.content;
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
  addCategory,
  changeCategory,
  removeCategory,
  changeVisualState,
} = gameSlice.actions;

export default gameSlice.reducer;
