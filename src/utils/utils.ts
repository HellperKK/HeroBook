/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-syntax */
import JSZip from 'jszip';

const nothing = () => {};

const download = (filename: string, text: string) => {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
  );
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

const formatStory = (obj: Array<any>) => {
  let count = 0;

  for (const page of obj) {
    // eslint-disable-next-line no-plusplus
    page.id = ++count;
    page.format = {};
  }

  for (const page of obj) {
    page.next = page.next.map((nex: any) => {
      const nextPage = obj.find((p) => p.name === nex.page) ?? obj[0];
      return {
        action: nex.action,
        // eslint-disable-next-line @typescript-eslint/no-shadow
        pageId: nextPage,
      };
    });
  }

  obj[0].isFirst = true;

  return [obj, count];
};

const openFiles = (
  then: (files: FileList | null) => void,
  multiple = false
) => {
  const fileSelector = document.createElement('input');
  fileSelector.type = 'file';
  fileSelector.multiple = multiple;
  fileSelector.addEventListener('change', () => then(fileSelector.files));
  fileSelector.click();
};

const openAZip = (then: (zip: JSZip) => void) => {
  openFiles((files) => {
    if (files && files.length > 0) {
      const file = files[0];
      const zip = new JSZip();
      zip.loadAsync(file).then(then).catch(nothing);
    }
  });
};

// const fileName = (file: string) => /(.+)\..+/.exec(file)[1];

export { download, formatStory, openFiles, nothing, openAZip };
