export function oppositeColorRGB(color: string) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `#${(255 - r).toString(16)}${(255 - g).toString(16)}${(255 - b).toString(16)}`;
}
