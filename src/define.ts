import type { AnyGraph, Define } from './types';

export const extend = ((graph: Record<string, string[]> = {}) => {
  const step = {
    add: (k: string, ...deps: string[]) => {
      graph[k] = deps;
      return step;
    },
    commit: () => graph,
  };
  return step;
}) as <G extends AnyGraph>(graph: G) => Define<G>;

export const define = extend as () => Define<AnyGraph<never>>;
