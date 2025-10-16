import { get, writable } from "svelte/store";

/** Callback to inform of a value updates. */
export type Subscriber<T> = (value: T) => void;

/** Unsubscribes from value updates. */
export type Unsubscriber = () => void;

/** Callback to update a value. */
export type Updater<T> = (value: T) => T;
/** Readable interface for subscribing. */
export interface Readable<T> {
  /**
   * Subscribe on value changes.
   * @param run subscription callback
   * @param invalidate cleanup callback
   */
  subscribe(this: void, run: Subscriber<T>, invalidate?: () => void): Unsubscriber;
}

/** Writable interface for both updating and subscribing. */
export interface Writable<T> extends Readable<T> {
  /**
   * Set value and inform subscribers.
   * @param value to set
   */
  set(this: void, value: T): void;

  /**
   * Update value using callback and inform subscribers.
   * @param updater callback
   */
  update(this: void, updater: Updater<T>): void;
}

export type ReadableStore<T> = Writable<T> & { (): T; get: () => T };
export type BooleanStore = ReadableStore<boolean>;
export type StringStore = ReadableStore<string>;
export type NumberStore = ReadableStore<number>;

export function Store<T>(initial?: T): ReadableStore<T> {
  const store = writable<T>(initial);
  const obj = { ...store, get: () => get(store) };
  const fn = () => obj.get();

  fn.get = obj.get;
  fn.set = obj.set;
  fn.update = obj.update;
  fn.subscribe = obj.subscribe;

  return fn;
}
