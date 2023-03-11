export type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: O[K] }
    : never
  : T;

type SKey<T> = keyof T & string;

export type AnyGraph<K extends string = string> = {
  [k in K]: ReadonlyArray<K>;
};

export type AnyDepsDict<K extends string = string> = {
  [k in K]: () => unknown;
};

type DepsOf<G extends AnyGraph, K extends SKey<G>> = G[K] extends ReadonlyArray<
  infer U
>
  ? U
  : never;

type Leafs<G extends AnyGraph, Done extends SKey<G> = never> = {
  [k in SKey<G>]: Exclude<DepsOf<G, k>, Done> extends never ? k : never;
}[Exclude<SKey<G>, Done>];

type ValuesFor<G> = { [k in SKey<G>]?: () => unknown };

export type Define<G extends AnyGraph> = {
  add: <K extends string, Deps extends ReadonlyArray<SKey<G>>>(
    k: Exclude<K, SKey<G>>,
    ...deps: Deps
  ) => Define<G & Readonly<{ [k in K]: Deps }>>;

  commit: () => { [k in SKey<G>]: G[k] };
};

export type Resolved<T extends AnyDepsDict> = Expand<{
  [k in SKey<T>]: ReturnType<T[k]>;
}>;

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
      ) => Traverse<G, V & { [k in K]: () => U }>;
    }
  : never;

export type Traverse<
  G extends AnyGraph,
  V extends ValuesFor<G>,
> = keyof G extends keyof V ? CommitStep<G, V> : OnStep<G, V>;
