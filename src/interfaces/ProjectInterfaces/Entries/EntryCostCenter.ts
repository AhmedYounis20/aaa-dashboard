import { AccountNature } from "../ChartOfAccount/AccountNature";

interface EntryCostCenter {
  id: string;
  costCenterId: string | null;
  amount: number;
  accountNature: AccountNature;
}

export default EntryCostCenter;