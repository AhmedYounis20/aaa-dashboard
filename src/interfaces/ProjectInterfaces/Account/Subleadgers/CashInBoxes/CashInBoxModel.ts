interface CashInBoxModel {
  id:string;
  name: string;
  nameSecondLanguage: string;
  parentId: string | null;
  nodeType: number;
  code: string;
  notes: string;
}

export default CashInBoxModel;