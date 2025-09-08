export function freshId(values: Array<{ id: number }>): number {
  let result = 1;
  
  while (values.some((value) => value.id === result)) {
    result++;
  }

  return result;
}
