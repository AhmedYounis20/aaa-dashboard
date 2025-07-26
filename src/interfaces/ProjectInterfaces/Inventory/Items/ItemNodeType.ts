export enum ItemNodeType{
  Domain,
  Category,
  SubDomain
}

export const ItemNodeTypeOptions = Object.entries(ItemNodeType)
  .filter(([, value]) => typeof value === "number")
  .map(([key, value]) => ({ label: key, value }));