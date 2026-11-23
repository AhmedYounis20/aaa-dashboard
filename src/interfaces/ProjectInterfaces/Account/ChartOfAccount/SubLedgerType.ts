export enum SubLedgerType {
  Branch,
  Customer,
  Supplier,
  CashInBox,
  Bank,
  FixedAsset,
}

export const SubLedgerTypeOptions = Object.entries(SubLedgerType)
  .filter(([, value]) => typeof value === "number")
  .map(([key, value]) => ({ label: key, value }));
