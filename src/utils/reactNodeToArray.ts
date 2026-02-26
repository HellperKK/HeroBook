import React, { ReactElement } from "react";

export function reactElementToArray(
  node: ReactElement | ReactElement[] | undefined
): ReactElement[] {
  if (node === undefined) {
    return [];
  }

  if (Array.isArray(node)) {
    return node;
  }

  return [node];
}
