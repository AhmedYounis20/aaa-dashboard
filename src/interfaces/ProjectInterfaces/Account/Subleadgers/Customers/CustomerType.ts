enum CustomerType {
  Consumer,
  WholeSale,
  SemiWholesale,
  Distributor,
  Online,
}

export const CustomerTypeOptions = Object.entries(CustomerType)
  .filter(([, value]) => typeof value === "number")
  .map(([key, value]) => ({ label: key, value }));

export default CustomerType;