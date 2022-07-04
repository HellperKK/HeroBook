import { initialPage, Page } from './initialStuff';

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

export { findPage, pageIsLinked };
