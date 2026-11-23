export const entriesKeys = {
  all: ["entries"] as const,
  lists: () => [...entriesKeys.all, "list"] as const,
  list: (kind: string) => [...entriesKeys.lists(), kind] as const,
  details: () => [...entriesKeys.all, "detail"] as const,
  detail: (kind: string, id: string) => [...entriesKeys.details(), kind, id] as const,
};
