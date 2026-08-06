export const queryKeys = {
  currencies: {
    all: ["currencies"] as const,
    detail: (id: string) => ["currencies", id] as const,
  },
  packingUnits: {
    all: ["packingUnits"] as const,
    detail: (id: string) => ["packingUnits", id] as const,
  },
  manufacturerCompanies: {
    all: ["manufacturerCompanies"] as const,
    detail: (id: string) => ["manufacturerCompanies", id] as const,
  },
} as const;
