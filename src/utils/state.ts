import { createStore } from 'redux';
import { lens } from 'lens.ts';
import JSZip from 'jszip';

import {
  initialChoice,
  initialPage,
  initialGame,
  Game,
  Format,
  Settings,
  Page,
  Choice,
} from './initialStuff';

import { Partial } from './utils';

const gameL = lens<Game>();

export interface State {
  game: Game;
  selectedPage: number;
  pageId: number;
  zip: JSZip;
  assets: {
    images: Map<string, string>;
  };
}

type Action =
  | {
      type: 'changeSelectedPage';
      index: number;
    }
  | {
      type: 'addPage';
    }
  | {
      type: 'removePage';
      index: number;
    }
  | {
      type: 'addChoice';
    }
  | {
      type: 'removeChoice';
      index: number;
    }
  | {
      type: 'loadGame';
      game: Game;
      zip: JSZip;
    }
  | {
      type: 'changeTitle';
      title: string;
    }
  | {
      type: 'changeText';
      text: string;
    }
  | {
      type: 'changeImage';
      image: string;
    }
  | {
      type: 'changePage';
      page: Partial<Page>;
    }
  | {
      type: 'changeChoice';
      choice: Partial<Choice>;
      index: number;
    }
  | {
      type: 'setFirst';
      index: number;
    }
  | {
      type: 'setSelectedPage';
      index: number;
    }
  | {
      type: 'updateFormat';
      format: Format;
    }
  | {
      type: 'addAssets';
      files: Map<string, string>;
      fileType: 'images';
    }
  | {
      type: 'removeAsset';
      fileName: string;
      fileType: 'images';
    }
  | {
      type: 'updateSettings';
      settings: Partial<Settings>;
    };

const initialState: State = {
  game: initialGame,
  selectedPage: 0,
  pageId: 0,
  zip: new JSZip(),
  assets: {
    images: new Map<string, string>(),
  },
};

const removeElem = <T>(pages: Array<T>, index: number): Array<T> => {
  const newPages = pages.slice();
  newPages.splice(index, 1);
  return newPages;
};

const mergeMap = <K, V>(map1: Map<K, V>, map2: Map<K, V>): Map<K, V> => {
  const newMap = new Map(map1.entries());
  Array.from(map2.entries()).forEach((pair) => newMap.set(...pair));
  return newMap;
};

const removeMap = <K, V>(map1: Map<K, V>, key: K): Map<K, V> => {
  // eslint-disable-next-line no-console
  console.log(key);
  const newMap = new Map(map1.entries());
  newMap.delete(key);
  return newMap;
};

function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case 'changeSelectedPage':
      return { ...state, selectedPage: action.index };
    case 'addPage':
      return {
        ...state,
        game: gameL.pages.set(
          state.game.pages.concat([initialPage(state.pageId)])
        )(state.game),
        pageId: state.pageId + 1,
      };
    case 'removePage':
      return {
        ...state,
        game: gameL.pages.set(removeElem(state.game.pages, action.index))(
          state.game
        ),
        selectedPage:
          state.selectedPage === state.game.pages.length - 1
            ? state.selectedPage - 1
            : state.selectedPage,
      };
    case 'addChoice':
      return {
        ...state,
        game: gameL.pages[state.selectedPage].next.set(
          state.game.pages[state.selectedPage].next.concat([initialChoice])
        )(state.game),
        pageId: state.pageId + 1,
      };
    case 'removeChoice':
      return {
        ...state,
        game: gameL.pages[state.selectedPage].next.set(
          removeElem(state.game.pages[state.selectedPage].next, action.index)
        )(state.game),
      };
    case 'loadGame':
      return {
        ...state,
        game: action.game,
        zip: action.zip,
      };
    case 'changePage':
      return {
        ...state,
        game: gameL.pages[state.selectedPage].set({
          ...state.game.pages[state.selectedPage],
          ...action.page,
        })(state.game),
      };
    case 'changeChoice':
      return {
        ...state,
        game: gameL.pages[state.selectedPage].next[action.index].set({
          ...state.game.pages[state.selectedPage].next[action.index],
          ...action.choice,
        })(state.game),
      };
    case 'setFirst':
      return {
        ...state,
        game: gameL.pages.set(
          state.game.pages.map((page, index) => ({
            ...page,
            isFirst: action.index === index,
          }))
        )(state.game),
      };
    case 'setSelectedPage':
      return {
        ...state,
        selectedPage: action.index,
      };
    case 'updateFormat':
      return {
        ...state,
        game: gameL.pages[state.selectedPage].format.set({
          ...state.game.pages[state.selectedPage].format,
          ...action.format,
        })(state.game),
      };
    case 'addAssets':
      return {
        ...state,
        assets: {
          ...state.assets,
          [action.fileType]: mergeMap(
            state.assets[action.fileType],
            action.files
          ),
        },
      };

    case 'removeAsset':
      return {
        ...state,
        assets: {
          ...state.assets,
          [action.fileType]: removeMap(
            state.assets[action.fileType],
            action.fileName
          ),
        },
      };

    case 'updateSettings':
      return {
        ...state,
        game: gameL.settings.set({
          ...state.game.settings,
          ...action.settings,
        })(state.game),
      };

    default:
      return state;
  }
}

const store = createStore(reducer);

export default store;
