import AttachmentModel from "../../../../BaseModels/AttachmentModel";
import ChartOfAccountModel from "../../ChartOfAccount/ChartOfAccountModel";

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
  // API response optional properties
  chartOfAccount?: ChartOfAccountModel;
  attachment?: {
    id?: string;
    attachmentId?: string;
    fileName: string;
    fileContentType?: string;
    contentType?: string;
    contentUrl?: string;
    fileData?: string;
    fileContent?: string;
  };
}

export default BranchModel;
