import type { AnyGraph, DefineStep } from './types/core';

const defineStep = <G extends AnyGraph>(graph: G): DefineStep<G> => ({
  add: (k, ...needs) => defineStep({ ...graph, [k]: needs }),
  commit: () => graph,
});

export const define = () => defineStep<Record<never, never>>({});
