interface Getter<V, U> {
  (v: V): U;
}

interface Setter<V, U> {
  (v: V, u: U): V;
}

export interface Lens<V, U> {
  get: Getter<V, U>;
  set: Setter<V, U>;
}

export function composeLenses<W, V, U>(first: Lens<W, V>, second: Lens<V, U>): Lens<W, U> {
  return {
    get: (w) => second.get(first.get(w)),
    set: (w, u) => first.set(w, second.set(first.get(w), u)),
  };
}

export interface Reducer<State> {
  (state: State): State;
}

export function composeReducerWithLens<V, U>({ get, set }: Lens<V, U>, reducer: Reducer<U>): Reducer<V> {
  return (v: V) => set(v, reducer(get(v)));
}
