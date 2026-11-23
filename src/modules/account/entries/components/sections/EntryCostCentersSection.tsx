import { IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import InputAutoComplete from "@/Components/Inputs/InputAutoComplete";
import InputNumber from "@/Components/Inputs/InputNumber";
import { FormTypes } from "@/interfaces/Components";
import { AccountNature } from "@/interfaces/ProjectInterfaces/Account/ChartOfAccount/AccountNature";
import type { CostCenterModel } from "@/interfaces/ProjectInterfaces/Account/CostCenters/costCenterModel";
import type EntryCostCenter from "@/interfaces/ProjectInterfaces/Account/Entries/EntryCostCenter";

export interface EntryCostCentersSectionProps {
  formType: FormTypes;
  entryCostCenters: EntryCostCenter[];
  costCenters: CostCenterModel[];
  errors: Record<string, string>;
  onChange: (entryCostCenters: EntryCostCenter[]) => void;
}

export default function EntryCostCentersSection({
  formType,
  entryCostCenters,
  onChange,
  costCenters,
  errors = {},
}: EntryCostCentersSectionProps) {
  const { t } = useTranslation();

  const createCostCenter = (accountNature: AccountNature): EntryCostCenter => ({
    accountNature,
    amount: 0,
    costCenterId: null,
    id: uuid(),
  });

  const handleCostCenterChange = (id: string, value: string | null) => {
    onChange(
      entryCostCenters.map((center) =>
        center.id === id ? { ...center, costCenterId: value } : center
      )
    );
  };

  const handleDeleteCostCenter = (id: string) => {
    onChange(entryCostCenters.filter((center) => center.id !== id));
  };

  const handleAmountChange = (id: string, value: number) => {
    onChange(
      entryCostCenters.map((center) => (center.id === id ? { ...center, amount: value } : center))
    );
  };

  const renderCostCenterEntry = (e: EntryCostCenter, idx: string) => (
    <div className="card card-body mb-3" key={`cost-center-${idx}`}>
      <div className="row mb-2">
        <div className="col col-md-6">
          <InputAutoComplete
            size="small"
            options={costCenters?.map((item) => ({
              ...item,
              label: item.name,
              value: item.id,
            }))}
            label={`${
              e.accountNature == AccountNature.Debit ? t("Debit") : t("Credit")
            } ${t("CostCenters")}`}
            value={e?.costCenterId}
            disabled={formType === FormTypes.Details}
            onChange={(value: string | null) => handleCostCenterChange(idx, value)}
            multiple={false}
            name="Branches"
            handleBlur={null}
            error={null}
            helperText={null}
          />
        </div>
        <div className="col col-md-4">
          <InputNumber
            className="form-input form-control"
            label={t("Amount")}
            variant="outlined"
            fullWidth
            size="small"
            disabled={formType === FormTypes.Details}
            value={e?.amount}
            onChange={(value) => handleAmountChange(idx, value)}
            error={
              !!errors[`costCenters[${entryCostCenters.findIndex((c) => c.id == idx)}].amount`]
            }
            helperText={
              errors[`costCenters[${entryCostCenters.findIndex((c) => c.id == idx)}].amount`]
            }
          />
        </div>
        <div className="col col-md-2">
          {formType !== FormTypes.Details && (
            <IconButton onClick={() => handleDeleteCostCenter(idx)}>
              <Delete />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="card card-body">
      <div className="row mb-2">
        <div className="col col-md-6">
          {t("Debit")} {t("CostCenters")}
        </div>
        <div className="col col-md-6">
          {t("Credit")} {t("CostCenters")}
        </div>
      </div>
      <div className="row">
        {([AccountNature.Debit, AccountNature.Credit] as AccountNature[]).map((nature) => (
          <div className="col col-md-6" key={nature}>
            {entryCostCenters
              .filter((e) => e.accountNature === nature)
              .map((item) => renderCostCenterEntry(item, item.id))}
            {formType !== FormTypes.Details && (
              <IconButton onClick={() => onChange([...entryCostCenters, createCostCenter(nature)])}>
                <Add />
              </IconButton>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
