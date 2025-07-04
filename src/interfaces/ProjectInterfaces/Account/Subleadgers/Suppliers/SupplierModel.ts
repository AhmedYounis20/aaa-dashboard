import ChartOfAccountModel from "../../ChartOfAccount/ChartOfAccountModel";

interface SupplierModel {
  id: string;
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
  companyName: string;
  notes: string;
  // API response optional properties
  chartOfAccount?: ChartOfAccountModel;
}

export default SupplierModel;