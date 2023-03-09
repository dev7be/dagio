export type AnyIndex = string | number | symbol;

export type Expand<T> = T extends Record<string | number | symbol, any>
  ? T extends infer O
    ? { [K in keyof O]: O[K] }
    : never
  : T;
