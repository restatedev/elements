import { safeParse } from '@stoplight/json';
import { atom, WritableAtom } from 'jotai';

/**
 * @deprecated use `import { atomWithStorage } from 'jotai/utils'` instead
 */
export const persistAtom = <T extends Object>(key: string, atomInstance: WritableAtom<T, T>) => {
  if (typeof window === 'undefined' || window.sessionStorage === undefined) {
    return atomInstance;
  }

  return atom<T, T>(
    get => {
      const storageValue = window.sessionStorage.getItem(key);
      const atomValue = get(atomInstance);

      if (storageValue === null) return atomValue;

      return safeParse(storageValue) ?? atomValue;
    },
    (_, set, update) => {
      try {
        /* setItem can throw when storage is full */
        window.sessionStorage.setItem(key, JSON.stringify(update));
      } catch (error) {
        console.error(error);
      }
      set(atomInstance, update);
    },
  );
};
