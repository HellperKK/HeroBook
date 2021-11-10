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

interface State {
  settings: Settings;
  assets: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images: any;
  };
  format: Format;
  pages: Array<Page>;
}

function initialChoice(): Choice {
  return { action: 'Go to the base page', pageId: 1 };
}

function initialPage(): Page {
  return {
    id: 1,
    isFirst: false,
    name: 'EMPTY',
    text: 'This is a new page',
    next: [initialChoice()],
    format: {},
  };
}

function initialState(): State {
  return {
    settings: {
      author: '',
      gameTitle: '',
      pageCount: 2,
    },
    assets: {
      images: {},
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
}

export { initialChoice, initialPage, initialState, Page, State, Choice };
