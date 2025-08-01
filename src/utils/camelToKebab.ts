export function camelToKebab(str:string) {
  return str.replaceAll(/[A-Z]/g, (capture) => `-${capture.toLowerCase()}`)
}