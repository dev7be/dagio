import type { AnyGraph, Define } from './types';

export const extend = ((
  graph: Readonly<Record<string, readonly string[]>> = {},
) => {
  const $graph = { ...graph };
  const step = {
    add: (k: string, ...deps: string[]) => {
      if ($graph[k]) throw new Error(`Duplicate node: '${k}'`);

      deps.forEach((d) => {
        if (!$graph[d]) throw new Error(`Unknown node: '${d}'`);
      });

      $graph[k] = deps;
      return step;
    },
    commit: () => $graph,
  };
  return step;
}) as <G extends AnyGraph>(graph: G) => Define<G>;

export const define = extend as () => Define<AnyGraph<never>>;
