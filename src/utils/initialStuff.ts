interface Choice {
  action: string;
  pageId: number;
}

interface Format {
  textColor?: string;
  textFont?: string;
  btnColor?: string;
  btnFont?: string;
  background?: string;
  page?: string;
}

interface Page {
  id: number;
  isFirst: boolean;
  name: string;
  text: string;
  next: Array<Choice>;
  format: Format;
}

interface Settings {
  author: string;
  gameTitle: string;
  pageCount: number;
}

interface Game {
  settings: Settings;
  assets: {
    images: Array<string>;
  };
  format: Format;
  pages: Array<Page>;
}

const initialChoice = {
  action: 'Go to the base page',
  pageId: 1,
};

function initialPage(id = 1): Page {
  return {
    id,
    isFirst: false,
    name: 'EMPTY',
    text: 'This is a new page',
    next: [initialChoice],
    format: {},
  };
}

const initialGame = {
  settings: {
    author: '',
    gameTitle: '',
    pageCount: 2,
  },
  assets: {
    images: [],
  },
  format: {
    textColor: 'initial',
    textFont: 'sans-serif',
    btnColor: '492e10',
    btnFont: 'sans-serif',
    background: '#dbfffd',
    page: '#a9e5e2',
  },
  pages: [
    {
      id: 1,
      isFirst: true,
      name: 'main',
      text: 'This is a first page',
      next: [
        {
          action: 'Go to the second page',
          pageId: 2,
        },
      ],
      format: {},
    },
    {
      id: 2,
      name: 'page2',
      isFirst: false,
      text: 'This is a second page',
      next: [
        {
          action: 'Go to the first page',
          pageId: 1,
        },
      ],
      format: {},
    },
  ],
};

export {
  initialChoice,
  initialPage,
  initialGame,
  Page,
  Game,
  Choice,
  Format,
  Settings,
};
