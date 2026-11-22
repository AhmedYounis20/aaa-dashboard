import { useCallback, useRef } from "react";

/**
 * Runs an async action keyed by `key` and ignores stale completions
 * when a newer call for the same key has started.
 */
export function useLatestAsync() {
  const tokensRef = useRef<Map<string, number>>(new Map());

  const runLatest = useCallback(
    async <T,>(
      key: string,
      action: (signal: { isCurrent: () => boolean }) => Promise<T>
    ): Promise<T | undefined> => {
      const nextToken = (tokensRef.current.get(key) ?? 0) + 1;
      tokensRef.current.set(key, nextToken);

      const isCurrent = () => tokensRef.current.get(key) === nextToken;
      const result = await action({ isCurrent });
      return isCurrent() ? result : undefined;
    },
    []
  );

  const invalidate = useCallback((key: string) => {
    const nextToken = (tokensRef.current.get(key) ?? 0) + 1;
    tokensRef.current.set(key, nextToken);
  }, []);

  return { runLatest, invalidate };
}
