import type {
  AnyGraph,
  ValuesFor,
  PickDepsValues,
  TraverseStep,
  CommitStep,
} from './types/core';

const pickDepsValues = <
  G extends AnyGraph<keyof G>,
  V extends ValuesFor<G>,
  K extends keyof G & keyof V,
>(
  graph: G,
  values: V,
  key: K,
) => {
  /** @todo how to remove these 'as'? */
  const deps = {};
  graph[key].forEach((k) => {
    (deps as any)[k] = values[k];
  });
  return deps as PickDepsValues<G, V, K>;
};

const step = <G extends AnyGraph, V extends ValuesFor<G>>(
  graph: G,
  values: V,
): TraverseStep<G, V> =>
  (Object.keys(graph).length === Object.keys(values).length
    ? ({
        commit: () => values,
      } satisfies CommitStep<V>)
    : {
        on: (k, v) =>
          step(graph, {
            ...values,
            [k]: () => v(pickDepsValues(graph, values, k)),
          }),
      }) as TraverseStep<G, V>; // @todo how to remove this 'as'?

export const traverse = <T extends AnyGraph>(graph: T) =>
  step<T, Record<never, never>>(graph, {});
