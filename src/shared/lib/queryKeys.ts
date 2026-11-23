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
  branches: {
    all: ["branches"] as const,
    detail: (id: string) => ["branches", id] as const,
    default: (parentId: string | null) => ["branches", "default", parentId] as const,
  },
  customers: {
    all: ["customers"] as const,
    detail: (id: string) => ["customers", id] as const,
    default: (parentId: string | null) => ["customers", "default", parentId] as const,
  },
  suppliers: {
    all: ["suppliers"] as const,
    detail: (id: string) => ["suppliers", id] as const,
    default: (parentId: string | null) => ["suppliers", "default", parentId] as const,
  },
  cashInBoxes: {
    all: ["cashInBoxes"] as const,
    detail: (id: string) => ["cashInBoxes", id] as const,
    default: (parentId: string | null) => ["cashInBoxes", "default", parentId] as const,
  },
  fixedAssets: {
    all: ["fixedAssets"] as const,
    detail: (id: string) => ["fixedAssets", id] as const,
    default: (parentId: string | null, fixedAssetType?: number) =>
      ["fixedAssets", "default", parentId, fixedAssetType] as const,
  },
  chartOfAccounts: {
    all: ["chartOfAccounts"] as const,
    detail: (id: string) => ["chartOfAccounts", id] as const,
    default: (parentId: string | null) => ["chartOfAccounts", "default", parentId] as const,
  },
  costCenters: {
    all: ["costCenters"] as const,
    detail: (id: string) => ["costCenters", id] as const,
  },
  collectionBooks: {
    all: ["collectionBooks"] as const,
    detail: (id: string) => ["collectionBooks", id] as const,
  },
  financialPeriods: {
    all: ["financialPeriods"] as const,
    detail: (id: string) => ["financialPeriods", id] as const,
    default: ["financialPeriods", "default"] as const,
  },
  glSettings: {
    all: ["glSettings"] as const,
  },
  accountGuides: {
    all: ["accountGuides"] as const,
    detail: (id: string) => ["accountGuides", id] as const,
  },
  products: {
    all: ["products"] as const,
    detail: (id: string) => ["products", id] as const,
  },
  variants: {
    all: ["variants"] as const,
    detail: (id: string) => ["variants", id] as const,
  },
  inventoryTransfers: {
    all: ["inventoryTransfers"] as const,
    byStatus: (status: string) => ["inventoryTransfers", "status", status] as const,
    detail: (id: string) => ["inventoryTransfers", id] as const,
  },
  inventoryTransactions: {
    all: ["inventoryTransactions"] as const,
    detail: (id: string) => ["inventoryTransactions", id] as const,
  },
} as const;

/** Shared reference data (branches, COA, etc.) — longer than the global 2-minute default. */
export const REF_DATA_STALE_TIME_MS = 1000 * 60 * 30;
