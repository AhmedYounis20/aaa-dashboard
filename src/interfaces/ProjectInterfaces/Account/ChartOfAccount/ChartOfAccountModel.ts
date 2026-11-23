import { AccountNature } from "./AccountNature";
import { SubLedgerType } from "./SubLedgerType";

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
  subLeadgerType?: SubLedgerType;
}

export default ChartOfAccountModel;
