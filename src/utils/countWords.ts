export function countWords(text:string) {
    const matches = text.trim().match(/[\w\d\’\'-]+/gi);
    return matches ? matches.length : 0;
}