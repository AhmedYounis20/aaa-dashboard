/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const costCenterMapper = (costCenterObject: any): CostCenterModel => {
  const result: CostCenterModel = {
    id: costCenterObject.id,
    parentId: costCenterObject.parentId,
    name: costCenterObject.name,
    nameSecondLanguage: costCenterObject.nameSecondLanguage,
    nodeType: costCenterObject.nodeType,
    percent: costCenterObject.percent,
    costCenterType: costCenterObject.costCenterType,
    chartOfAccounts: costCenterObject.chartOfAccounts.map(
      (e: any) => e.chartOfAccountId
    ),
  };
  return result;
};
