export enum CostCenterType {
  NotRelated,
  RelatedToAccount,
}
export const CostCenterTypeOptions = Object.entries(CostCenterType)
  .filter(([, value]) => typeof value === "number")
  .map(([key, value]) => ({ label: key, value }));
  
export enum Type {
  Domain,
  Category,
}


export default CostCenterType;