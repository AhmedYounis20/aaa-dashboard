import FixedAssetType from "./FixedAssetType";
import ChartOfAccountModel from "../../ChartOfAccount/ChartOfAccountModel";

interface FixedAssetModel {
  id: string;
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
  // API response optional properties
  chartOfAccount?: ChartOfAccountModel;
  accumlatedAccount?: ChartOfAccountModel;
  expensesAccount?: ChartOfAccountModel;
}

export default FixedAssetModel;