import type { JSXElementConstructor, ReactElement } from 'react';

// biome-ignore lint/suspicious/noExplicitAny: uses react definition
export function reactElementToArray<P, T extends string | JSXElementConstructor<any>>(
  node: ReactElement<P, T> | ReactElement<P, T>[] | undefined,
): ReactElement<P, T>[] {
  if (node === undefined) {
    return [];
  }

  if (Array.isArray(node)) {
    return node;
  }

  return [node];
}
