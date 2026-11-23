import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { v4 as uuid } from "uuid";
import { FormTypes } from "@/interfaces/Components/FormType";
import { CostCenterModel } from "@/interfaces/ProjectInterfaces/Account/CostCenters/costCenterModel";
import { getCostCenters } from "@/Apis/Account/CostCenterApi";
import { NodeType } from "@/interfaces/Components/NodeType";
import InputNumber from "@/Components/Inputs/InputNumber";
import InputAutoComplete from "@/Components/Inputs/InputAutoComplete";
import type { ItemCostCenter } from "./types";

const ItemCostCentersInput: React.FC<{
  formType: FormTypes;
  costCenters: ItemCostCenter[];
  handleUpdate: (costCenters: ItemCostCenter[]) => void;
  handleTranslate: (key: string) => string;
  errors: Record<string, string>;
}> = ({ formType, costCenters: itemCostCenters, handleUpdate, handleTranslate, errors = {} }) => {
  const [costCenters, setCostCenters] = useState<CostCenterModel[]>([]);

  useEffect(() => {
    if (formType !== FormTypes.Delete) {
      const fetchData = async () => {
        const result = await getCostCenters();
        if (result?.result) {
          setCostCenters(result.result.filter((e) => e.nodeType === NodeType.Domain));
        }
      };
      fetchData();
    }
  }, [formType]);

  const createCostCenter = (): ItemCostCenter => ({
    id: uuid(),
    costCenterId: null,
    percent: 0,
  });

  const handleCostCenterChange = (id: string | undefined, value: string | null) => {
    const updated = itemCostCenters.map((item) => {
      if (item.id === id) {
        const selected = costCenters.find((c) => c.id === value);
        return {
          ...item,
          costCenterId: value,
          name: selected?.name ?? "",
          nameSecondLanguage: selected?.nameSecondLanguage ?? "",
        };
      }
      return item;
    });
    handleUpdate(updated);
  };

  const handlePercentChange = (id: string | undefined, value: number | null) => {
    const updated = itemCostCenters.map((item) =>
      item.id === id ? { ...item, percent: value ?? 0 } : item
    );
    handleUpdate(updated);
  };

  const handleDelete = (id: string | undefined) => {
    handleUpdate(itemCostCenters.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    handleUpdate([...itemCostCenters, createCostCenter()]);
  };

  const renderCostCenter = (item: ItemCostCenter, index: number) => (
    <div className="card card-body mb-3" key={item.id ?? item.costCenterId ?? uuid()}>
      <div className="row mb-2">
        <div className="col col-md-6">
          <InputAutoComplete
            size="small"
            options={costCenters?.map((c) => ({
              label: c.name,
              value: c.id,
            }))}
            label={handleTranslate("CostCenter")}
            value={item.costCenterId}
            disabled={formType === FormTypes.Details}
            onChange={(value: string | null) => handleCostCenterChange(item.id, value)}
            multiple={false}
            handleBlur={null}
            error={!!errors[`costCenters[${index}].costCenterId`]}
            helperText={handleTranslate(errors[`costCenters[${index}].costCenterId`])}
          />
        </div>
        <div className="col col-md-4">
          <InputNumber
            className="form-input form-control"
            label={handleTranslate("Percent")}
            variant="outlined"
            fullWidth
            size="small"
            disabled={formType === FormTypes.Details}
            value={item.percent ?? 0}
            inputType="percent"
            onChange={(value) => handlePercentChange(item.id, value)}
            error={!!errors[`costCenters[${index}].percent`]}
            helperText={handleTranslate(errors[`costCenters[${index}].percent`])}
          />
        </div>
        <div className="col col-md-2">
          {formType !== FormTypes.Details && (
            <IconButton onClick={() => handleDelete(item.id)}>
              <Delete />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="card card-body">
      <h6 className="mb-3">{handleTranslate("CostCenters")}</h6>
      {itemCostCenters.map((item, index) => renderCostCenter(item, index))}
      {formType !== FormTypes.Details && (
        <div>
          <IconButton onClick={handleAdd}>
            <Add />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default ItemCostCentersInput;
