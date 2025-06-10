export enum ItemType {
  Stock,
  Service,
}

export const ItemTypeOptions = Object.entries(ItemType)
  .filter(([, value]) => typeof value === "number")
  .map(([key, value]) => ({ label: key, value }));