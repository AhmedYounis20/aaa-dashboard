import FixedAssetType from "./FixedAssetType";

interface FixedAssetModel {
  name: string;
  nameSecondLanguage: string;
  parentId: string;
  nodeType: number;
  code: string;
  accumelatedCode: string;
  expensesCode: string;
  serial: string;
  version: string;
  manufactureCompany: string;
  isDepreciable: boolean;
  assetLifeSpanByYears: number;
  depreciationRate: number;
  fixedAssetType: FixedAssetType;
  notes: string;
}

export default FixedAssetModel;