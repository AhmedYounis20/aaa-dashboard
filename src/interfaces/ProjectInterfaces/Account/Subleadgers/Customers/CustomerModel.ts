import ChartOfAccountModel from "../../ChartOfAccount/ChartOfAccountModel";
import CustomerType from "./CustomerType";

interface CustomerModel {
  id:string;
  name: string;
  nameSecondLanguage: string;
  parentId: string | null;
  nodeType: number;
  code: string;
  phone: string;
  mobile: string;
  email: string;
  taxNumber: string;
  address: string;
  customerType: CustomerType;
  notes: string;
  chartOfAccount?: ChartOfAccountModel;
}

export default CustomerModel;