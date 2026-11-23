import type { FetchDataResult } from "./types";

export type ServerPageState<T> = {
  items: T[];
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  error: boolean;
};

export function emptyServerPage<T>(): ServerPageState<T> {
  return {
    items: [],
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    error: false,
  };
}

/**
 * Maps a paginated API result into table page state.
 * `isSuccess === false` (or a thrown/empty result) becomes an error page,
 * not a silent empty table.
 */
export function mapServerFetchResult<T>(
  result: FetchDataResult<T> | null | undefined
): ServerPageState<T> {
  if (!result?.isSuccess || !result.result) {
    return { ...emptyServerPage<T>(), error: true };
  }

  const page = result.result;
  return {
    items: page.items || [],
    totalCount: page.totalCount || 0,
    totalPages: page.totalPages || 0,
    hasNextPage: page.hasNextPage || false,
    hasPreviousPage: page.hasPreviousPage || false,
    error: false,
  };
}
