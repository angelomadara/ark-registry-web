/**
 * THIS function can store up to 10MB of data and uses the localStoreage api
 * - Persistent: Survives browser restarts and computer reboots
 * - Better API: Easy key-value operations with getItem(), setItem()
 * - Cross-tab sharing: Data accessible across all tabs of same origin
 * - Mature: Well-established, widely supported
 * - Developer tools: Easy to inspect in browser DevTools
 * DISADVANTAGES
 * - Permanent until cleared: Persists indefinitely unless manually cleared
 * - Privacy concerns: Can be used for tracking
 * - Synchronous: Can block main thread with large data
 * USE ONLY FOR
 * - User preferences and settings
 * - Authentication tokens
 * - Long-term application state
 * - Data that should persist across sessions
 */
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- Dynamic Data Type ---
export type DynamicData = {
  [key: string]: string | number | boolean | object | null | undefined;
};

// --- Store State Interface ---
export interface PersistState {
  data: DynamicData;
}

// --- Store Actions Interface ---
interface PersistStoreActions {
  setData: (data: DynamicData) => void;
  updateData: (partialData: Partial<DynamicData>) => void;
  setValue: (key: string, value: string | number | boolean | object | null | undefined) => void;
  getValue: (key: string) => string | number | boolean | object | null | undefined;
  removeKey: (key: string) => void;
  clearAll: () => void;
  hasKey: (key: string) => boolean;
  getKeys: () => string[];
  getAllData: () => DynamicData;
}

// --- Initial State ---
const initialState: PersistState = {
  data: {},
};

// --- Zustand Store with Persistence ---
export const usePersistStore = create<PersistState & PersistStoreActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Replace the entire data object with a new one
       * @param data - New data object to replace current data
       * @example
       * setData({
       *   username: 'john',
       *   age: 25,
       *   isActive: true,
       *   preferences: { theme: 'dark', notifications: true }
       * });
       */
      setData: (data: DynamicData) => {
        set({ data });
      },

      /**
       * Merge new data with existing data (shallow merge)
       * Existing keys will be overwritten, new keys will be added
       * @param partialData - Partial data object to merge with current data
       * @example
       * Current data: { username: 'john', age: 25 }
       * updateData({ age: 26, city: 'New York' });
       * Result: { username: 'john', age: 26, city: 'New York' }
       */
      updateData: (partialData: Partial<DynamicData>) => {
        set(state => ({
          data: { ...state.data, ...partialData },
        }));
      },

      /**
       * Set a single key-value pair in the data object
       * @param key - The key to set
       * @param value - The value to assign (can be string, number, boolean, object, null, or undefined)
       * @example
       * setValue('username', 'alice');
       * setValue('score', 100);
       * setValue('isLoggedIn', true);
       * setValue('settings', { theme: 'dark', lang: 'en' });
       * setValue('tempData', null);
       */
      setValue: (key: string, value: string | number | boolean | object | null | undefined) => {
        set(state => ({
          data: { ...state.data, [key]: value },
        }));
      },

      /**
       * Get a value by its key from the data object
       * @param key - The key to retrieve
       * @returns The value associated with the key, or undefined if key doesn't exist
       * @example
       * const username = getValue('username'); // returns stored username or undefined
       * const score = getValue('score'); // returns stored score or undefined
       * const settings = getValue('settings'); // returns stored settings object or undefined
       */
      getValue: (key: string) => {
        return get().data[key];
      },

      /**
       * Remove a specific key and its value from the data object
       * @param key - The key to remove
       * @example
       * removeKey('tempData'); // removes 'tempData' key and its value
       * removeKey('oldSettings'); // removes 'oldSettings' key and its value
       */
      removeKey: (key: string) => {
        set(state => {
          const newData = { ...state.data };
          delete newData[key];
          return { data: newData };
        });
      },

      /**
       * Clear all data from the store, resetting it to initial empty state
       * This will remove all keys and values, and clear localStorage
       * @example
       * clearAll(); // Removes all stored data
       */
      clearAll: () => {
        set(initialState);
      },

      /**
       * Check if a specific key exists in the data object
       * @param key - The key to check for existence
       * @returns true if key exists, false otherwise
       * @example
       * if (hasKey('username')) {
       *   console.log('Username is set');
       * }
       *
       * const userExists = hasKey('currentUser'); // returns boolean
       */
      hasKey: (key: string) => {
        return key in get().data;
      },

      /**
       * Get an array of all keys currently stored in the data object
       * @returns Array of string keys
       * @example
       * const allKeys = getKeys(); // ['username', 'age', 'isActive', 'settings']
       *
       * Check if store has any data
       * if (getKeys().length > 0) {
       *   console.log('Store has data');
       * }
       *
       * Iterate through all keys
       * getKeys().forEach(key => {
       *   console.log(`${key}: ${getValue(key)}`);
       * });
       */
      getKeys: () => {
        return Object.keys(get().data);
      },

      /**
       * Get all data as a complete object with all keys and their values
       * @returns Complete data object containing all stored key-value pairs
       * @example
       * const allData = getAllData();
       * // Returns: { username: 'john', age: 25, isActive: true, settings: { theme: 'dark' } }
       *
       * // Useful for debugging or logging all stored data
       * console.log('All stored data:', getAllData());
       *
       * // Check if store is empty
       * const isEmpty = Object.keys(getAllData()).length === 0;
       *
       * // Export all data for backup
       * const backup = getAllData();
       * localStorage.setItem('backup', JSON.stringify(backup));
       */
      getAllData: () => {
        return get().data;
      },
    }),
    {
      name: "persist-storage", // localStorage key
      // Persist all data by default
    },
  ),
);

// --- Devtools Integration ---
if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Persist Store", usePersistStore);
}
