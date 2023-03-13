import type { AnyGraph, Traverse } from './types';

const pick = (src: Record<string, any>, keys: readonly string[]) =>
  Object.fromEntries(keys.map((k) => [k, src[k]]));

const core = (graph: AnyGraph, values: Record<string, () => any> = {}) => {
  const total = Object.keys(graph).length;
  const commitStep = { commit: () => values };

  let count = 0;
  const onStep = {
    on: (k: string, v: (arg: any) => any) => {
      if (values[k]) throw new Error(`Duplicate '${k}'`);
      values[k] = () => v(pick(values, graph[k]));
      count += 1;
      return total === count ? commitStep : onStep;
    },
  };

  return total === 0 ? commitStep : onStep;
};

export const traverse = core as <G extends AnyGraph>(
  graph: G,
) => Traverse<G, Record<never, never>>;
