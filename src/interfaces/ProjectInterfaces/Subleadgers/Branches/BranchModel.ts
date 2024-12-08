interface BranchModel {
  id:string;
  name: string;
  nameSecondLanguage: string;
  parentId: string | null;
  nodeType: number;
  code: string;
  phone:string;
  address: string;
  notes: string;
  logo : File | null;
}

export default BranchModel;