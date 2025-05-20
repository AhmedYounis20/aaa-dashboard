export enum DepreciationApplication {
  WithYearClosed,
  Monthly,
}

export const DepreciationApplicationOptions = Object.entries(DepreciationApplication)
  .filter(([, value]) => typeof value === "number")
  .map(([key, value]) => ({ label: key, value }));

export default DepreciationApplication;