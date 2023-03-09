import type { AnyIndex, Expand } from './utility';

export type AnyGraph<K extends AnyIndex = AnyIndex> = Record<
  K,
  ReadonlyArray<K>
> &
  Record<symbol, never>;

export type AnyDepsDict<K extends AnyIndex = AnyIndex> = Record<
  K,
  () => unknown
>;

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
> = Expand<Pick<V, DepsOf<G, K> & keyof V>>;

export type CommitStep<T> = { commit: () => { [k in keyof T]: T[k] } };

export type OnStep<
  G extends AnyGraph,
  V extends ValuesFor<G>,
> = keyof V extends keyof G
  ? {
      on: <K extends Leafs<G, keyof V>, U>(
        k: K,
        fn: (v: PickDepsValues<G, V, K>) => U,
      ) => TraverseStep<G, V & { [k in K]: () => U }>;
    }
  : never;

export type TraverseStep<
  G extends AnyGraph,
  V extends ValuesFor<G>,
> = keyof G extends keyof V ? CommitStep<V> : OnStep<G, V>;

export type Unused<T extends AnyIndex, Used extends AnyIndex> = T extends Used
  ? never
  : T;

export type AddStep<G extends AnyGraph> = {
  add: <
    K extends Exclude<AnyIndex, symbol>,
    Needs extends ReadonlyArray<keyof G>,
  >(
    k: Unused<K, keyof G>,
    ...needs: Needs
  ) => DefineStep<G & Readonly<{ [k in K]: Needs }>>;
};

export type DefineStep<G extends AnyGraph> = CommitStep<G> & AddStep<G>;

export type Resolved<T extends AnyDepsDict> = Expand<{
  [k in keyof T]: ReturnType<T[k]>;
}>;
