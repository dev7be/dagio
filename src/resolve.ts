import type { AnyDepsDict, Resolved } from './types/core';

export const resolve = <T extends AnyDepsDict>(deps: T): Resolved<T> =>
  Object.keys(deps).reduce(
    (acc, c) => ({ ...acc, [c]: deps[c]() }),
    {} as Resolved<T>,
  );

export const resolved =
  <T extends AnyDepsDict, U>(fn: (deps: Resolved<T>) => U) =>
  (deps: T) =>
    fn(resolve(deps));
