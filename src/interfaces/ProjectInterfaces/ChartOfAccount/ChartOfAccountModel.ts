import { AccountNature } from "./AccountNature";
import { SubLeadgerType } from "./SubLeadgerType";

interface ChartOfAccountModel {
  id: string;
  name: string;
  nameSecondLanguage: string;
  parentId: string | null;
  accountGuidId: string;
  code: string;
  isPostedAccount: boolean;
  isStopDealing: boolean;
  isDepreciable: boolean;
  isActiveAccount: boolean;
  accountNature: AccountNature;
  description?: string;
  subLeadgerType?: SubLeadgerType;
}

export default ChartOfAccountModel;

