export enum DiscountType {
  Percent,
  Value,
}

export const DiscountTypeOptions = Object.entries(DiscountType)
  .filter(([, value]) => typeof value === "number")
  .map(([key, value]) => ({ label: key, value }));