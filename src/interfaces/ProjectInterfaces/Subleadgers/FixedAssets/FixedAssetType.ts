enum FixedAssetType {
  Lands,
  Buildings,
  Equipment,
  ElectronicDevices,
  OfficeSupplies,
  Furniture,
  VehiclesAndTransportationItems,
  Tools,
}

export const FixedAssetTypeOptions = Object.entries(FixedAssetType)
  .filter(([, value]) => typeof value === "number")
  .map(([key, value]) => ({ label: key, value }));

export default FixedAssetType;