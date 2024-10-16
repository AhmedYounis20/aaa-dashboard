import { NodeType } from "../../Components/NodeType";
import CostCenterType from "./costCenterType";

export interface CostCenterModel {
    id: string;
    notes?: string;
    name: string;
    nameSecondLanguage: string;
    parentId: string | null;
    nodeType: NodeType;
    percent: number;
    costCenterType: CostCenterType;
    chartOfAccounts: string[] | [];
}
