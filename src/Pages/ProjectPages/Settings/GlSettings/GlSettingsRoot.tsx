import { useEffect, useState } from 'react';
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import { FormControlLabel, Stack, Switch, TextField, Typography } from '@mui/material';
import { useGetGlSettingsQuery, useUpdateGlSettingsMutation } from '../../../../Apis/GlSettingsApi';
import GlSettingsModel from '../../../../interfaces/ProjectInterfaces/GlSettings/GlSettingsModel';
import { DecimalDigitsNumberOptions } from '../../../../interfaces/ProjectInterfaces/GlSettings/DecimalDigitsNumber';
import InputSelect from '../../../../Components/Inputs/InputSelect';
import DepreciationApplication, { DepreciationApplicationOptions } from '../../../../interfaces/ProjectInterfaces/GlSettings/DepreciationApplication';
import Loader from '../../../../Components/Loader';
import { ApiResponse } from '../../../../interfaces/ApiResponse';
import { toastify } from '../../../../Helper/toastify';

const GlSettingsRoot: React.FC = () => {
  const accountGuidesResult = useGetGlSettingsQuery(null);
  const [model, setModel] = useState<GlSettingsModel>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [update]=  useUpdateGlSettingsMutation();
  useEffect(() => {
    if (!accountGuidesResult.isLoading) {
      setModel(accountGuidesResult.data.result);
      setIsLoading(false);
    }
  }, [accountGuidesResult.isLoading,accountGuidesResult]);

       const handleUpdate = async () => {
         if (model) {
           const response: ApiResponse = await update(model);
           if (response.data) {
             toastify(response.data.successMessage);
             return true;
           } else if (response.error) {
             toastify(response.error.data.errorMessages[0], "error");
             return false;
           }
         }
         return false;
       };

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
    <div className="h-full">
      <BaseForm
        formType={FormTypes.Edit}
        isModal={false}
        handleUpdate={handleUpdate}
        handleAdd={undefined}
        handleDelete={undefined}
        handleCloseForm={undefined}
      >
        <div>
          <Typography variant="h2" mb={3}>
            {" "}
            GL Settings
          </Typography>
          <div>
            {isLoading ? (
              <Loader />
            ) : (
              <div>
                <Stack spacing={2}>
                  <div>
                    <TextField
                      type="number"
                      className="form-input form-control"
                      label="month Days"
                      variant="outlined"
                      fullWidth
                      value={model?.monthDays}
                      onChange={(event) =>
                        setModel((prevModel) =>
                          prevModel
                            ? {
                                ...prevModel,
                                monthDays: Number.parseInt(event.target.value),
                              }
                            : prevModel
                        )
                      }
                    />
                  </div>
                  <div>
                    <InputSelect
                      options={DecimalDigitsNumberOptions}
                      label={"Decimal Digits Number"}
                      defaultValue={model?.decimalDigitsNumber}
                      multiple={false}
                      onChange={({ target }: { target: { value: number } }) => {
                        setModel((prevModel) =>
                          prevModel
                            ? {
                                ...prevModel,
                                decimalDigitsNumber: target.value,
                              }
                            : undefined
                        );
                      }}
                      name={"DecimalDigitsNumber"}
                      onBlur={undefined}
                    />
                  </div>
                  <div>
                    <div>
                      <InputSelect
                        options={DepreciationApplicationOptions}
                        label={"Depreciation Application"}
                        defaultValue={model?.depreciationApplication}
                        multiple={false}
                        onChange={({
                          target,
                        }: {
                          target: { value: DepreciationApplication };
                        }) => {
                          setModel((prevModel) =>
                            prevModel
                              ? {
                                  ...prevModel,
                                  depreciationApplication: target.value,
                                }
                              : undefined
                          );
                        }}
                        name={"DepreciationApplication"}
                        onBlur={undefined}
                      />
                    </div>
                    {/* <div className="col col-md-6"></div> */}
                  </div>
                </Stack>
                <div>
                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={model?.isAllowingEditVoucher}
                          onChange={({
                            target,
                          }: {
                            target: { checked: boolean };
                          }) =>
                            setModel((prevModel) =>
                              prevModel
                                ? {
                                    ...prevModel,
                                    isAllowingEditVoucher: target.checked,
                                  }
                                : prevModel
                            )
                          }
                        />
                      }
                      label="Is Allowing Edit Voucher"
                    />
                  </div>
                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={model?.isAllowingNegativeBalances}
                          onChange={({
                            target,
                          }: {
                            target: { checked: boolean };
                          }) =>
                            setModel((prevModel) =>
                              prevModel
                                ? {
                                    ...prevModel,
                                    isAllowingNegativeBalances: target.checked,
                                  }
                                : prevModel
                            )
                          }
                        />
                      }
                      label="is Allowing Negative Balances"
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={model?.isAllowingDeleteVoucher}
                          onChange={({
                            target,
                          }: {
                            target: { checked: boolean };
                          }) =>
                            setModel((prevModel) =>
                              prevModel
                                ? {
                                    ...prevModel,
                                    isAllowingDeleteVoucher: target.checked,
                                  }
                                : prevModel
                            )
                          }
                        />
                      }
                      label="Is Allowing Delete Voucher"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </BaseForm>
    </div>
  );
};

export default GlSettingsRoot;
