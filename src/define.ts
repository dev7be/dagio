import type { AnyGraph, SKey } from './types';

type Define<G extends AnyGraph> = {
  add: <K extends string, Deps extends ReadonlyArray<SKey<G>>>(
    k: Exclude<K, SKey<G>>,
    ...deps: Deps
  ) => Define<G & Readonly<{ [k in K]: Deps }>>;

  commit: () => { [k in SKey<G>]: G[k] };
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
