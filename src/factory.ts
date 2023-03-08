import type { AnyGraph, FactoryStep } from './types';

const buildStep = <G extends AnyGraph>(graph: G): FactoryStep<G> => ({
  add: (k, ...needs) => buildStep({ ...graph, [k]: needs }),
  commit: () => graph,
});

export const factory = () => buildStep<Record<never, never>>({});
