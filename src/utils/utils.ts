/* eslint-disable @typescript-eslint/no-explicit-any */
import JSZip from 'jszip';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

import { initialGame, initialPage, Page } from './initialStuff';

type Partial<Type> = {
  [Property in keyof Type]?: Type[Property];
};

const findPage = (pages: Array<Page>, id: number) => {
  const page = pages.find((p) => p.id === id);
  if (page !== undefined) {
    return page;
  }

  return initialPage(1);
};

const pageIsLinked = (pages: Array<Page>, page: Page) => {
  const linkPages = pages.filter((pageLink) =>
    pageLink.next.some((nex) => nex.pageId === page.id)
  );
  return linkPages.length !== 0;
};

const readImage = (file: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};

const nothing = () => {};

const download = (filename: string, text: string) => {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
  );
  element.setAttribute('download', filename);

  element.click();
};

const formatStory = (obj: Array<Page>) => {
  let count = 0;

  obj.forEach((page) => {
    // eslint-disable-next-line no-plusplus
    page.id = ++count;
    page.format = {};
  });

  obj.forEach((page) => {
    page.next = page.next?.map((nex: any) => {
      const nextPage = obj.find((p) => p.name === nex.page) ?? obj[0];

      return {
        action: nex.action,
        // eslint-disable-next-line @typescript-eslint/no-shadow
        pageId: nextPage.id,
      };
    });
  });

  obj[0].isFirst = true;

  return [obj, count];
};

const openFiles = (
  accept: Array<string> = [],
  multiple = false
): Promise<FileList> => {
  return new Promise((resolve, reject) => {
    const fileSelector = document.createElement('input');
    fileSelector.type = 'file';
    fileSelector.multiple = multiple;

    if (accept.length > 0) {
      fileSelector.accept = accept.join(',');
    }

    fileSelector.addEventListener('change', () => {
      if (fileSelector.files !== null) {
        resolve(fileSelector.files);
      } else {
        reject(new Error('no file selected'));
      }
    });
    fileSelector.click();
  });
};

const openAZip = async () => {
  const files = await openFiles(['.zip']);
  const file = files[0];
  const zip = new JSZip();
  return zip.loadAsync(file);
};

const loadState = async () => {
  const zip = await openAZip();
  let game = initialGame;

  const data = zip.file('data.json');
  if (data !== null) {
    const text = await data.async('text');
    game = JSON.parse(text);
  }

  const images = zip.folder('assets/images');

  const assets = new Map<string, string>();

  if (images !== null) {
    Object.entries(images.files).forEach(async (pair) => {
      const matches = pair[0].match(/assets\/images\/(.+)/);
      if (matches) {
        const img = await pair[1].async('blob').then((blob) => readImage(blob));
        assets.set(matches[1], img);
      }
    });
  }

  return { game, assets, zip };
};

const noExt = (name: string) => name.split('.').shift();

const identity = <T>(x: T): T => x;

const safeMarkdown = (md: string): string => DOMPurify.sanitize(marked(md));

const safeFileName = (fileName: string) => fileName.replaceAll(/\s+/g, '-');

// const fileName = (file: string) => /(.+)\..+/.exec(file)[1];

export {
  Partial,
  download,
  formatStory,
  openFiles,
  openAZip,
  findPage,
  nothing,
  identity,
  readImage,
  noExt,
  safeMarkdown,
  pageIsLinked,
  safeFileName,
  loadState,
};
