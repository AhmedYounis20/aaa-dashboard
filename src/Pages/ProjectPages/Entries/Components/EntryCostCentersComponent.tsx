import { IconButton, TextField } from "@mui/material";
import InputAutoComplete from "../../../../Components/Inputs/InputAutoCompelete";
import { FormTypes } from "../../../../interfaces/Components";
import { AccountNature } from "../../../../interfaces/ProjectInterfaces/ChartOfAccount/AccountNature";
import { CostCenterModel } from "../../../../interfaces/ProjectInterfaces/CostCenter/costCenterModel";
import EntryCostCenter from "../../../../interfaces/ProjectInterfaces/Entries/EntryCostCenter";
import { Add } from "@mui/icons-material";

const EntryCostCentersComponent: React.FC<{
  formType: FormTypes;
  entryCostCenters: EntryCostCenter[];
  costCenters: CostCenterModel[];
  onChange: (entryCostCenters: EntryCostCenter[]) => void;
}> = ({ formType, entryCostCenters, onChange, costCenters }) => {

  // Function to create a new cost center entry
  const createCostCenter = (accountNature: AccountNature): EntryCostCenter => ({
    accountNature,
    amount: 0,
    costCenterId: null,
  });

  // Handle change for cost center selection
  const handleCostCenterChange = (id: number, value: string | null) => {
    const updatedCenters = entryCostCenters.map((center, idx) =>
      idx === id ? { ...center, costCenterId: value } : center
    );
    onChange(updatedCenters);
  };

  // Handle change for amount input
  const handleAmountChange = (id: number, value: number) => {
    const updatedCenters = entryCostCenters.map((center, idx) =>
      idx === id ? { ...center, amount: value } : center
    );
    onChange(updatedCenters);
  };

  // Render a single entry for cost center
  const renderCostCenterEntry = (e: EntryCostCenter, idx: number) => (
    <div className="card card-body mb-3" key={`cost-center-${idx}`}>
      <div className="row mb-2">
        <div className="col col-md-8">
          <InputAutoComplete
            size="small"
            options={costCenters?.map((item) => ({
              ...item,
              label: item.name,
              value: item.id,
            }))}
            label="Cost Center"
            value={e?.costCenterId}
            disabled={formType === FormTypes.Details}
            onChange={(value: string | null) =>
              handleCostCenterChange(idx, value)
            }
            multiple={false}
            name="Branches"
            handleBlur={null}
            defaultSelect={true}
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
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="row">
      {([AccountNature.Debit, AccountNature.Credit] as AccountNature[]).map((nature) => (
        <div className="col col-md-6" key={nature}>
          {entryCostCenters
            .filter((e) => e.accountNature === nature)
            .map(renderCostCenterEntry)}
          <IconButton
            onClick={() =>
              onChange([...entryCostCenters, createCostCenter(nature)])
            }
          >
            <Add />
          </IconButton>
        </div>
      ))}
    </div>
  );
};

export default EntryCostCentersComponent;
