import { createStore } from 'redux';
import { lens } from 'lens.ts';
import JSZip from 'jszip';

import {
  initialChoice,
  initialPage,
  initialGame,
  Game,
  Format,
} from './initialStuff';

const gameL = lens<Game>();

export interface State {
  game: Game;
  selectedPage: number;
  pageId: number;
  zip: JSZip;
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
    };

const initialState: State = {
  game: initialGame,
  selectedPage: 0,
  pageId: 0,
  zip: new JSZip(),
};

const removeElem = <T>(pages: Array<T>, index: number): Array<T> => {
  const newPages = pages.slice();
  newPages.splice(index, 1);
  return newPages;
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
    case 'changeTitle':
      return {
        ...state,
        game: gameL.pages[state.selectedPage].name.set(action.title)(
          state.game
        ),
      };
    case 'changeText':
      return {
        ...state,
        game: gameL.pages[state.selectedPage].text.set(action.text)(state.game),
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
    default:
      return state;
  }
}

const store = createStore(reducer);

export default store;
