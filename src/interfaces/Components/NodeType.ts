export enum NodeType{
  Domain,
  Category}

export const NodeTypeOptions = Object.entries(NodeType)
  .filter(([, value]) => typeof value === "number")
  .map(([key, value]) => ({ label: key, value }));