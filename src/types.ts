export type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: O[K] }
    : never
  : T;

export type SKey<T> = keyof T & string;

export type AnyGraph<K extends string = string> = {
  [k in K]: ReadonlyArray<K>;
};

export type AnyDepsDict<K extends string = string> = {
  [k in K]: () => unknown;
};

export type DepsOf<
  G extends AnyGraph,
  K extends SKey<G>,
> = G[K] extends ReadonlyArray<infer U> ? U : never;

export type Leafs<G extends AnyGraph, Done extends SKey<G> = never> = {
  [k in SKey<G>]: Exclude<DepsOf<G, k>, Done> extends never ? k : never;
}[Exclude<SKey<G>, Done>];

export type ValuesFor<G> = { [k in SKey<G>]?: () => unknown };
