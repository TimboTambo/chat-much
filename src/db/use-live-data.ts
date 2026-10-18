import { addDatabaseChangeListener } from 'expo-sqlite';
import { useEffect, useState } from 'react';

/**
 * Runs a synchronous read and re-runs it whenever any of `tables` changes.
 * Drizzle's `useLiveQuery` only watches the query's base table, which misses
 * joins (for example friends + catch_ups). Pass a stable `read` (module-level
 * or memoized); a new `read` re-runs immediately.
 */
export function useLiveData<T>(read: () => T, tables: readonly string[]): T {
  const [state, setState] = useState(() => ({ read, data: read() }));
  if (state.read !== read) {
    setState({ read, data: read() });
  }

  useEffect(() => {
    let scheduled = false;
    // A batch insert fires one event per row; refresh once per tick.
    const subscription = addDatabaseChangeListener(({ tableName }) => {
      if (scheduled || !tables.includes(tableName)) return;
      scheduled = true;
      setTimeout(() => {
        scheduled = false;
        setState({ read, data: read() });
      }, 0);
    });
    return () => subscription.remove();
  }, [read, tables]);

  return state.data;
}
