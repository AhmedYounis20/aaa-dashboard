export enum ProductNodeType {
  Domain,
  Category,
  SubDomain,
}

export const ProductNodeTypeOptions = Object.entries(ProductNodeType)
  .filter(([, value]) => typeof value === "number")
  .map(([key, value]) => ({ label: key, value }));
