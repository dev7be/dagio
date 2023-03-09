import type { AnyGraph } from './types';

export type Define<G extends AnyGraph> = {
  add: <K extends string, Needs extends ReadonlyArray<keyof G & string>>(
    k: Exclude<K, keyof G & string>,
    ...needs: Needs
  ) => Define<G & Readonly<{ [k in K]: Needs }>>;

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
