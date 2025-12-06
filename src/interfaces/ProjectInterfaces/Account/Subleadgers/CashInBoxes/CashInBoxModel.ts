import ChartOfAccountModel from "../../ChartOfAccount/ChartOfAccountModel";

interface CashInBoxModel {
  id:string;
  name: string;
  nameSecondLanguage: string;
  parentId: string | null;
  nodeType: number;
  code: string;
  notes: string;
  chartOfAccount?: ChartOfAccountModel;
}

export default CashInBoxModel;