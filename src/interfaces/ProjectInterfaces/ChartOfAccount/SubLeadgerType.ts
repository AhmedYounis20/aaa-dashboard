export enum SubLeadgerType {
  Branch,
  Customer,
  Supplier,
  CashInBox,
  Bank,
  FixedAsset,
}

export const SubLeadgerTypeOptions = Object.entries(SubLeadgerType)
  .filter(([, value]) => typeof value === "number")
  .map(([key, value]) => ({ label: key, value }));

