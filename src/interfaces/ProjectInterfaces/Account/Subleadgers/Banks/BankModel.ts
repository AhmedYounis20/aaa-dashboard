import ChartOfAccountModel from "../../ChartOfAccount/ChartOfAccountModel";

interface BankModel {
  id:string;
  name: string;
  nameSecondLanguage: string;
  parentId: string | null;
  nodeType: number;
  code: string;
  phone: string;
  email: string;
  bankAccount: string;
  bankAddress: string;
  notes: string;
  chartOfAccount?: ChartOfAccountModel;
}

export default BankModel;