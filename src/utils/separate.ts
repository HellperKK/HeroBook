export function separate<A>(values: Array<A>, separator: () => A): Array<A> {
  if (values.length === 0) {
    return [];
  }

  const result: Array<A> = [];
  // biome-ignore lint/style/noNonNullAssertion: allways works since arry is not empty as checked above
  result.push(values.shift()!);

  for (const value of values) {
    result.push(separator());
    result.push(value);
  }

  return result;
}
