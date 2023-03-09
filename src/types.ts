export type AnyIndex = string | number | symbol;

export type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: O[K] }
    : never
  : T;

// export type AnyGraph<K extends AnyIndex = AnyIndex> = Record<
//   K,
//   ReadonlyArray<K>
// > &
//   Record<symbol, never>;

export type AnyGraph<K extends string = string> = {
  [k in K]: ReadonlyArray<K>;
};

// export type AnyDepsDict<K extends AnyIndex = AnyIndex> = Record<
//   K,
//   () => unknown
// > &
//   Record<symbol, never>;

export type AnyDepsDict<K extends string = string> = {
  [k in K]: () => unknown;
};

export type CommitStep<T> = { commit: () => { [k in keyof T]: T[k] } };

export type DepsOf<
  G extends AnyGraph,
  K extends keyof G & string,
> = G[K] extends ReadonlyArray<infer U> ? U : never;

export type DepsOfMinus<
  G extends AnyGraph,
  K extends keyof G & string,
  Skip extends keyof G & string = never,
> = Exclude<DepsOf<G, K>, Skip>;

export type Leafs<G extends AnyGraph, Skip extends keyof G & string = never> = {
  [k in keyof G & string]: DepsOfMinus<G, k, Skip> extends never ? k : never;
}[Exclude<keyof G & string, Skip>];

export type ValuesFor<G> = { [k in keyof G]?: () => unknown };

export type PickDepsValues<
  G extends AnyGraph,
  V extends ValuesFor<G>,
  K extends keyof G & string,
> = Expand<Pick<V, DepsOf<G, K> & keyof V>>;

// export type Unused<T extends string, Used extends string> = T extends Used
//   ? never
//   : T;
export type Unused<T extends string, Used extends string> = Exclude<T, Used>;
