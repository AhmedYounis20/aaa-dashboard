import ChartOfAccountModel from "../../ChartOfAccount/ChartOfAccountModel";

export interface TaxModel {
  id: string;
  name: string;
  nameSecondLanguage: string;
  parentId: string | null;
  nodeType: number;
  code: string;
  notes: string;
  percent: number;
  chartOfAccountId?: string;
  chartOfAccount?: ChartOfAccountModel;
}
export interface TaxInputModel {
  id: string;
  name: string;
  nameSecondLanguage: string;
  parentId: string | null;
  nodeType: number;
  code: string;
  notes: string;
  percent: number;
  chartOfAccountId?: string;
}

