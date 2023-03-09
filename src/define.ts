import type { AnyGraph, CommitStep } from './types';

export type AddStep<G extends AnyGraph> = {
  add: <K extends string, Needs extends ReadonlyArray<keyof G & string>>(
    k: Exclude<K, keyof G & string>,
    ...needs: Needs
  ) => DefineStep<G & Readonly<{ [k in K]: Needs }>>;
};

export type DefineStep<G extends AnyGraph> = CommitStep<G> & AddStep<G>;

const defineStep = <G extends AnyGraph>(graph: G): DefineStep<G> => ({
  add: (k, ...needs) => defineStep({ ...graph, [k]: needs }),
  commit: () => graph,
});

export const define = () => defineStep<Record<never, never>>({});
