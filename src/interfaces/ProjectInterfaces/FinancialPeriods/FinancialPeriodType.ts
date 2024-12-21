export enum FinancialPeriodType {
  OneMonth = 1,
  ThreeMonths = 3,
  SixMonths = 6,
  OneYear = 12,
}

export const financialPeriodOptions = Object.entries(FinancialPeriodType)
  .filter(([, value]) => typeof value === "number")
  .map(([key, value]) => ({ label:key, value }));