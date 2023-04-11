export type AnyGraph<K extends string = string> = {
  readonly [k in K]: readonly K[];
};

export type AnyDepsDict<K extends string = string> = {
  readonly [k in K]: () => unknown;
};

type DepsOf<G extends AnyGraph, K extends keyof G> = G[K][number];

type Leafs<G extends AnyGraph, Done = never> = Exclude<
  {
    [k in keyof G]: Exclude<DepsOf<G, k>, Done> extends never ? k : never;
  }[keyof G],
  Done
>;

export type Define<G extends AnyGraph> = {
  add: <K extends string, Deps extends ReadonlyArray<keyof G>>(
    k: Exclude<K, keyof G>,
    ...deps: Deps
  ) => Define<G & Readonly<{ [k in K]: Deps }>>;

  commit: () => { [k in keyof G]: G[k] };
};

export type Resolved<T extends AnyDepsDict> = {
  [k in keyof T]: ReturnType<T[k]>;
};

type PickDepsValues<G extends AnyGraph, V, K extends keyof G> = {
  [k in DepsOf<G, K> & keyof V]: V[k];
};

type CommitStep<V> = {
  commit: () => { [k in keyof V]: V[k] };
};

// utility type for DX
type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type OnStep<G extends AnyGraph, V> = {
  on: <K extends Leafs<G, keyof V>, U>(
    k: K,
    fn: (v: Expand<PickDepsValues<G, V, K>>) => U,
  ) => Traverse<G, V & { [k in K]: () => U }>;
};

export type Traverse<G extends AnyGraph, V> = keyof G extends keyof V
  ? CommitStep<V>
  : OnStep<G, V>;
