import { IconButton, TextField } from "@mui/material";
import InputAutoComplete from "../../../../../Components/Inputs/InputAutoCompelete";
import { FormTypes } from "../../../../../interfaces/Components";
import { AccountNature } from "../../../../../interfaces/ProjectInterfaces/Account/ChartOfAccount/AccountNature";
import { CostCenterModel } from "../../../../../interfaces/ProjectInterfaces/Account/CostCenters/costCenterModel";
import EntryCostCenter from "../../../../../interfaces/ProjectInterfaces/Account/Entries/EntryCostCenter";
import { Add, Delete } from "@mui/icons-material";
import {v4 as uuid } from "uuid";
const EntryCostCentersComponent: React.FC<{
  formType: FormTypes;
  entryCostCenters: EntryCostCenter[];
  costCenters: CostCenterModel[];
  errors: Record<string, string>;
  onChange: (entryCostCenters: EntryCostCenter[]) => void;
}> = ({ formType, entryCostCenters, onChange, costCenters, errors={} }) => {
  // Function to create a new cost center entry
  const createCostCenter = (accountNature: AccountNature): EntryCostCenter => ({
    accountNature,
    amount: 0,
    costCenterId: null,
    id: uuid(),
  });

  // Handle change for cost center selection
  const handleCostCenterChange = (id: string, value: string | null) => {
    const updatedCenters = entryCostCenters.map((center) =>
      center.id === id ? { ...center, costCenterId: value } : center
    );
    onChange(updatedCenters);
  };

  const handleDeleteCostCenter = (id:string)=>{
    const updatedCenters = entryCostCenters.filter((center) =>center.id !== id );
    onChange(updatedCenters);
  }
  // Handle change for amount input
  const handleAmountChange = (id: string, value: number) => {
    const updatedCenters = entryCostCenters.map((center) =>
      center.id === id ? { ...center, amount: value } : center
    );
    onChange(updatedCenters);
  };

  // Render a single entry for cost center
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
              e.accountNature == AccountNature.Debit ? "Debit" : "Credit"
            } Cost Center`}
            value={e?.costCenterId}
            disabled={formType === FormTypes.Details}
            onChange={(value: string | null) =>
              handleCostCenterChange(idx, value)
            }
            multiple={false}
            name="Branches"
            handleBlur={null}
            error={null}
            helperText={null}
          />
        </div>
        <div className="col col-md-4">
          <TextField
            type="number"
            className="form-input form-control"
            label="Amount"
            variant="outlined"
            fullWidth
            size="small"
            disabled={formType === FormTypes.Details}
            value={e?.amount}
            onChange={(event) =>
              handleAmountChange(idx, parseFloat(event.target.value) || 0)
            }
            error={
              !!errors[
                `costCenters[${entryCostCenters.findIndex(
                  (e) => e.id == idx
                )}].amount`
              ]
            }
            helperText={
              errors[
                `costCenters[${entryCostCenters.findIndex(
                  (e) => e.id == idx
                )}].amount`
              ]
            }
          />
        </div>
        <div className="col col-md-2">
          {formType !== FormTypes.Details && (
            <IconButton
              onClick={() =>
                handleDeleteCostCenter(idx)
              }
            >
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
          Debit Cost Centers
        </div>
        <div className="col col-md-6">
          Credit Cost Centers
        </div>
      </div>
      <div className="row">
        {([AccountNature.Debit, AccountNature.Credit] as AccountNature[]).map(
          (nature) => (
            <div className="col col-md-6" key={nature}>
              {entryCostCenters
                .filter((e) => e.accountNature === nature)
                .map((item) => renderCostCenterEntry(item, item.id))}
                {formType !== FormTypes.Details && (

                  <IconButton
                  onClick={() =>
                    onChange([...entryCostCenters, createCostCenter(nature)])
                  }
                  >
                <Add />
              </IconButton>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default EntryCostCentersComponent;
