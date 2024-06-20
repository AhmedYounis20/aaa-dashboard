import { AccountNature } from "./AccountNature";

interface ChartOfAccountModel {
  id: string;
  name: string;
  nameSecondLanguage: string;
  parentId: string;
  accountGuidId: string;
  code: string;
  isPostedAccount: boolean;
  isStopDealing: boolean;
  isDepreciable: boolean;
  isActiveAccount: boolean;
  accountNature: number;
}

export default ChartOfAccountModel;