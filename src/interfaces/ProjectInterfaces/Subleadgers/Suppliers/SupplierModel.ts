interface SupplierModel {
  id:string;
  name: string;
  nameSecondLanguage: string;
  parentId: string;
  nodeType: number;
  code: string;
  phone: string;
  mobile: string;
  email: string;
  taxNumber: string;
  address: string;
  companyName: string;
  notes:string;
}

export default SupplierModel;