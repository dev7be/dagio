import type { AnyDepsDict, Expand, SKey } from './types';

export type Resolved<T extends AnyDepsDict> = Expand<{
  [k in SKey<T>]: ReturnType<T[k]>;
}>;

export const resolve = <T extends AnyDepsDict>(deps: T): Resolved<T> =>
  Object.keys(deps).reduce(
    (acc, c) => ({ ...acc, [c]: deps[c]() }),
    {} as Resolved<T>,
  );

export const resolved =
  <T extends AnyDepsDict, U>(fn: (deps: Resolved<T>) => U) =>
  (deps: T) =>
    fn(resolve(deps));
