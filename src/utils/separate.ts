export function separate<A>(values: Array<A>, separator: () => A):Array<A> {
  if (values.length === 0) {
    return [];
  }

  const result: Array<A> = [];
  result.push(values.shift()!);

  for (const value of values) {
    result.push(separator());
    result.push(value);
  }

  return result;
}