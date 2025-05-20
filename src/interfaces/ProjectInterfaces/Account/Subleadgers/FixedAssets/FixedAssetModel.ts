import FixedAssetType from "./FixedAssetType";

interface FixedAssetModel {
  id:string;
  name: string;
  nameSecondLanguage: string;
  parentId: string | null;
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