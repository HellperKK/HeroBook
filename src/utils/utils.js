/* eslint-disable no-restricted-syntax */
const download = (filename, text) => {
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

const formatStory = (obj) => {
  let count = 0;

  for (const page of obj) {
    // eslint-disable-next-line no-plusplus
    page.id = ++count;
    page.format = {};
  }

  for (const page of obj) {
    page.next = page.next.map((nex) => ({
      action: nex.action,
      // eslint-disable-next-line @typescript-eslint/no-shadow
      pageId: obj.find((page) => page.name === nex.page).id,
    }));
  }

  obj[0].isFirst = true;

  return [obj, count];
};

const openAFile = (then) => {
  const fileSelector = document.createElement('input');
  fileSelector.type = 'file';
  fileSelector.multiple = false;
  fileSelector.addEventListener('change', () => then(fileSelector.files[0]));
  fileSelector.click();
};

const jsonReplacer = (_key, value) => {
  if (value === undefined) return value;
  if (value.constructor === Array) {
    return Object.fromEntries(value);
  }

  return value;
};

const jsonReviver = (key, _value) => {
  // console.log(key, _value)
  if (key === 'images') {
    return new Map(Object.entries(_value));
  }

  return _value;
};

const jsonSerializer = (obj) => JSON.stringify(obj, jsonReplacer, 4);

const jsonUnerializer = (str) => JSON.parse(str, jsonReviver);

const fileName = (file) => /(.+)\..+/.exec(file)[1];

export {
  download,
  formatStory,
  openAFile,
  jsonSerializer,
  jsonUnerializer,
  fileName,
};
