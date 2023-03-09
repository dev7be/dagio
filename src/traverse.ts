import type { AnyGraph, DepsOf, Expand, Leafs, SKey, ValuesFor } from './types';

type PickDepsValues<
  G extends AnyGraph,
  V extends ValuesFor<G>,
  K extends SKey<G>,
> = Expand<Pick<V, DepsOf<G, K> & keyof V>>;

type CommitStep<G extends AnyGraph, V extends ValuesFor<G>> = {
  commit: () => { [k in keyof V]: V[k] };
};

type OnStep<
  G extends AnyGraph,
  V extends ValuesFor<G>,
> = keyof V extends keyof G
  ? {
      on: <K extends Leafs<G, SKey<V>>, U>(
        k: K,
        fn: (v: PickDepsValues<G, V, K>) => U,
      ) => TraverseStep<G, V & { [k in K]: () => U }>;
    }
  : never;

type TraverseStep<
  G extends AnyGraph,
  V extends ValuesFor<G>,
> = keyof G extends keyof V ? CommitStep<G, V> : OnStep<G, V>;

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

  return (total === 0 ? commitStep : onStep) as TraverseStep<
    G,
    Record<never, never>
  >;
};
