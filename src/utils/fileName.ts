export function fileName(path: string, keepEntension = true) {
  if (path === '') {
    throw new Error("Path can't be empty");
  }

  if (keepEntension) {
    return path.split(/\\|\//).at(-1);
  }

  // biome-ignore lint/style/noNonNullAssertion: safe assert
  return path
    .split(/\\|\//)
    .at(-1)!
    .replace(/\.[a-z]+/, '');
}
