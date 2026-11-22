export const queryKeys = {
  currencies: {
    all: ["currencies"] as const,
    detail: (id: string) => ["currencies", id] as const,
  },
  packingUnits: {
    all: ["packingUnits"] as const,
    detail: (id: string) => ["packingUnits", id] as const,
  },
  banks: {
    all: ["banks"] as const,
    detail: (id: string) => ["banks", id] as const,
    default: (parentId: string | null) => ["banks", "default", parentId] as const,
  },
  taxes: {
    all: ["taxes"] as const,
    detail: (id: string) => ["taxes", id] as const,
    default: (parentId: string | null) => ["taxes", "default", parentId] as const,
  },
  sellingPrices: {
    all: ["sellingPrices"] as const,
    detail: (id: string) => ["sellingPrices", id] as const,
  },
  attributes: {
    all: ["attributes"] as const,
    detail: (id: string) => ["attributes", id] as const,
  },
  manufacturerCompanies: {
    all: ["manufacturerCompanies"] as const,
    detail: (id: string) => ["manufacturerCompanies", id] as const,
  },
} as const;
