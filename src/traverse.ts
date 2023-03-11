import type { AnyGraph, Traverse } from './types';

const pick = (src: Record<string, any>, keys: readonly string[]) =>
  Object.fromEntries(keys.map((k) => [k, src[k]]));

export const traverse = <G extends AnyGraph>(graph: G) => {
  const values: Record<string, () => any> = {};
  const total = Object.keys(graph).length;
  const commitStep = { commit: () => values };

  let count = 0;
  const onStep = {
    on: (k: string, v: (arg: any) => any) => {
      values[k] = () => v(pick(values, graph[k]));
      count += 1;
      return total === count ? commitStep : onStep;
    },
  };

  return (total === 0 ? commitStep : onStep) as Traverse<
    G,
    Record<never, never>
  >;
};
