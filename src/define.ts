import type { AnyGraph } from './types';

export type Define<G extends AnyGraph> = {
  add: <K extends string, Deps extends ReadonlyArray<keyof G & string>>(
    k: Exclude<K, keyof G & string>,
    ...deps: Deps
  ) => Define<G & Readonly<{ [k in K]: Deps }>>;

  commit: () => { [k in keyof G]: G[k] };
};

export const define = () => {
  const graph: Record<string, string[]> = {};
  const step = {
    add: (k: string, ...deps: string[]) => {
      graph[k] = deps;
      return step;
    },
    commit: () => graph,
  };
  return step as Define<Record<never, never>>;
};
