# dagio

Work in progress, use at your own discretion.

## Docs

### `define()`

`define()` is used to build DAGs. It makes it impossible to introduce cycles by design as you can only reference nodes that have already been defined.

```typescript
const dag = define()
  .add('a')
  .add('b')
  .add('c', 'a', 'b')
  .add('d', 'c')
  .add('e', 'b', 'c')
  .commit();

/*
const dag: {
  readonly a: [];
  readonly b: [];
  readonly c: ["a", "b"];
  readonly d: ["c"];
  readonly e: ["b", "c"];
}
*/
```

### `traverse()`

`traverse()` lets you traverse a DAG while generating data for each node.

```typescript
traverse(dag)
  .on('a', () => 20)
  .on('b', () => 5)
  .on('c', ({ a, b }) => a() + b())
  .on('d', ({ c }) => c() * 2)
  .on('e', ({ b, c }) => [b(), c()].join(','))
  .commit();

/*
{
  a: () => number;
  b: () => number;
  c: () => number;
  d: () => number;
  e: () => string;
}
*/
```

### Utilities

#### `resolve()`

`resolve()` takes a dictionary of arg-less functions and returns a dictionary with all of these functions evaluated.

```typescript
resolve(
  traverse(dag)
    .on('a', () => 20)
    .on('b', () => 5)
    .on('c', (deps) =>
      Object.values(resolve(deps)).reduce((acc, c) => acc + c, 0),
    )
    .on('d', ({ c }) => c() * 2)
    .on('e', (deps) => Object.values(resolve(deps)).join(','))
    .commit(),
);

/*
{
  a: number;
  b: number;
  c: number;
  d: number;
  e: string;
}
*/
```

#### `resolved()`

`resolved()` wraps a function to resolve its arguments.

```typescript
traverse(dag)
  .on('a', () => 20)
  .on('b', () => 5)
  .on(
    'c',
    resolved((deps) => Object.values(deps).reduce((acc, c) => acc + c, 0)),
  )
  .on('d', ({ c }) => c() * 2)
  .on(
    'e',
    resolved((deps) => Object.values(deps).join(',')),
  )
  .commit();

/*
{
  a: number;
  b: number;
  c: number;
  d: number;
  e: string;
}
```
