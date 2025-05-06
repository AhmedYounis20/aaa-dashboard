import { AccountNature } from "../ChartOfAccount/AccountNature";

interface EntryCostCenter {
    costCenterId : string | null;
    amount : number;
    accountNature : AccountNature;
}

export default EntryCostCenter;