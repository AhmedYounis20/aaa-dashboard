import { useEffect, useState } from 'react';
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import { AccountGuideModel } from '../../../../interfaces/ProjectInterfaces';
import { FormControlLabel, Switch, TextField } from '@mui/material';
import { useGetGlSettingsQuery } from '../../../../Apis/GlSettingsApi';
import GlSettingsModel from '../../../../interfaces/ProjectInterfaces/GlSettings/GlSettingsModel';
import DecimalDigitsNumber, { DecimalDigitsNumberOptions } from '../../../../interfaces/ProjectInterfaces/GlSettings/DecimalDigitsNumber';
import InputSelect from '../../../../Components/Inputs/InputSelect';
import { DepreciationApplicationOptions } from '../../../../interfaces/ProjectInterfaces/GlSettings/DepreciationApplication';


const GlSettingsRoot : React.FC = () => {
  const accountGuidesResult = useGetGlSettingsQuery(null);
  const [model, setModel] = useState<GlSettingsModel>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!accountGuidesResult.isLoading) {
      setModel(accountGuidesResult.data.result);
      setIsLoading(false);
    }
  }, [accountGuidesResult.isLoading]);

  // const handleDelete = async (): Promise<boolean> => {
  //   const response: ApiResponse = await deleteChartOfAccount(id);
  //   if(response.data){

  //     return true;
  //   }
  //   else {
  //     console.log(response);

  //     response.error?.data?.errorMessages?.map((error) =>{
  //     toastify(error, "error");
  //   console.log(error);
  //     }
  //     );
  //     return false;
  //   }
  // };

  return (
    <div className=" h-full">
      <BaseForm formType={FormTypes.Edit} isModal={false}>
      <h2 className="mb-3"> GlSettings</h2>
        <div>
          {isLoading ? (
            <div
              className="d-flex flex-row align-items-center justify-content-center"
              style={{ height: "100px" }}
            >
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <>
              <div className="row mb-3">
                <div className="col col-md-6">
                  <TextField
                    type="number"
                    className="form-input form-control"
                    label="month Days"
                    variant="outlined"
                    fullWidth
                    value={model?.monthDays}
                    onChange={(event) =>
                      setModel({
                        ...model,
                        monthDays: Number.parseInt(event.target.value),
                      })
                    }
                  />
                </div>
                <div className="col col-md-6">
                  <InputSelect
                    options={DecimalDigitsNumberOptions}
                    label={"Decimal Digits Number"}
                    defaultValue={model?.decimalDigitsNumber}
                    multiple={false}
                    onChange={({ target }) => {
                      setModel((prevModel) =>
                        prevModel
                          ? {
                              ...prevModel,
                              decimalDigitsNumber: target.value,
                            }
                          : undefined
                      );
                    }}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col col-md-6">
                  <InputSelect
                    options={DepreciationApplicationOptions}
                    label={"Depreciation Application"}
                    defaultValue={model?.depreciationApplication}
                    multiple={false}
                    onChange={({ target }) => {
                      setModel((prevModel) =>
                        prevModel
                          ? {
                              ...prevModel,
                              depreciationApplication: target.value,
                            }
                          : undefined
                      );
                    }}
                  />
                </div>
                <div className="col col-md-6"></div>
              </div>
              <div className="row mb-3">
                <div className="col col-md-6">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={model?.isAllowingEditVoucher}
                        onChange={({ target }) =>
                          setModel({
                            ...model,
                            isAllowingEditVoucher: target.checked,
                          })
                        }
                      />
                    }
                    label="Is Allowing Edit Voucher"
                  />
                </div>
                <div className="col col-md-6">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={model?.isAllowingNegativeBalances}
                        onChange={({ target }) =>
                          setModel({
                            ...model,
                            isAllowingNegativeBalances: target.checked,
                          })
                        }
                      />
                    }
                    label="is Allowing Negative Balances"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col col-md-6">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={model?.isAllowingDeleteVoucher}
                        onChange={({ target }) =>
                          setModel({
                            ...model,
                            isAllowingDeleteVoucher: target.checked,
                          })
                        }
                      />
                    }
                    label="Is Allowing Delete Voucher"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </BaseForm>
    </div>
  );
};

export default GlSettingsRoot;
