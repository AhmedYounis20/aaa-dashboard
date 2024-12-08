import AttachmentModel from "../../../BaseModels/BranchModel";

interface BranchModel {
  id: string;
  name: string;
  nameSecondLanguage: string;
  parentId: string | null;
  nodeType: number;
  code: string;
  phone: string;
  address: string;
  notes: string;
  logo: AttachmentModel | null;
}

export default BranchModel;