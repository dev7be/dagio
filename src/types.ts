export type Index = string | number | symbol;

export type AnyGraph<K extends Index = Index> = Record<K, ReadonlyArray<K>>;

export type DepsOf<
  G extends AnyGraph,
  K extends keyof G,
> = G[K] extends ReadonlyArray<infer U> ? U : never;

export type DepsOfMinus<
  G extends AnyGraph,
  K extends keyof G,
  Skip extends keyof G = never,
> = Exclude<DepsOf<G, K>, Skip>;

export type Leafs<G extends AnyGraph, Skip extends keyof G = never> = {
  [k in keyof G]: DepsOfMinus<G, k, Skip> extends never ? k : never;
}[Exclude<keyof G, Skip>];

export type ValuesFor<G> = { [k in keyof G]?: () => unknown };

export type PickDepsValues<
  G extends AnyGraph,
  V extends ValuesFor<G>,
  K extends keyof G,
> = Pick<V, DepsOf<G, K> & keyof V>;

export type CommitStep<T> = { commit: () => { [k in keyof T]: T[k] } };
export type SetStep<
  G extends AnyGraph,
  V extends ValuesFor<G>,
> = keyof V extends keyof G
  ? {
      set: <K extends Leafs<G, keyof V>, U>(
        k: K,
        fn: (v: PickDepsValues<G, V, K>) => U,
      ) => TraverseStep<G, V & { [k in K]: () => U }>;
    }
  : never;

export type TraverseStep<
  G extends AnyGraph,
  V extends ValuesFor<G>,
> = keyof G extends keyof V ? CommitStep<V> : SetStep<G, V>;

export type Unused<T extends Index, Used extends Index> = T extends Used
  ? never
  : T;

export type AddStep<Deps extends AnyGraph> = {
  add: <K extends Index, Needs extends ReadonlyArray<keyof Deps>>(
    k: Unused<K, keyof Deps>,
    ...needs: Needs
  ) => DefineStep<Deps & Readonly<{ [k in K]: Needs }>>;
};

export type DefineStep<Deps extends AnyGraph> = CommitStep<Deps> &
  AddStep<Deps>;
