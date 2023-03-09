import type {
  AnyGraph,
  CommitStep,
  DepsOf,
  Expand,
  Leafs,
  ValuesFor,
} from './types';

type PickDepsValues<
  G extends AnyGraph,
  V extends ValuesFor<G>,
  K extends keyof G & string,
> = Expand<Pick<V, DepsOf<G, K> & keyof V>>;

export type OnStep<
  G extends AnyGraph,
  V extends ValuesFor<G>,
> = keyof V extends keyof G
  ? {
      on: <K extends Leafs<G, keyof V & string>, U>(
        k: K,
        fn: (v: PickDepsValues<G, V, K>) => U,
      ) => TraverseStep<G, V & { [k in K]: () => U }>;
    }
  : never;

export type TraverseStep<
  G extends AnyGraph,
  V extends ValuesFor<G>,
> = keyof G extends keyof V ? CommitStep<V> : OnStep<G, V>;

const pickDepsValues = <
  G extends AnyGraph,
  V extends ValuesFor<G>,
  K extends keyof G & keyof V & string,
>(
  graph: G,
  values: V,
  key: K,
) =>
  Object.fromEntries(graph[key].map((k) => [k, values[k]])) as PickDepsValues<
    G,
    V,
    K
  >;

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
