import { useEffect, useState } from 'react';
import BaseForm from '../../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../../interfaces/Components/FormType';
import { FormControlLabel, Stack, Switch, TextField, Typography } from '@mui/material';
import GlSettingsModel from '../../../../../interfaces/ProjectInterfaces/Account/GlSettings/GlSettingsModel';
import { DecimalDigitsNumberOptions } from '../../../../../interfaces/ProjectInterfaces/Account/GlSettings/DecimalDigitsNumber';
import InputSelect from '../../../../../Components/Inputs/InputSelect';
import DepreciationApplication, { DepreciationApplicationOptions } from '../../../../../interfaces/ProjectInterfaces/Account/GlSettings/DepreciationApplication';
import Loader from '../../../../../Components/Loader';
import { GLSettingsSchema } from '../../../../../interfaces/ProjectInterfaces/Account/GlSettings/validation-GLSettings';
import * as yup from 'yup';
import {
  getGlSettings,
  updateGlSettings,
} from "../../../../../Apis/Account/GlSettingsApi";


const GlSettingsRoot: React.FC = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [model, setModel] = useState<GlSettingsModel>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchData = async () => {
        const result = await getGlSettings();
        if (result) {
          setModel(result.result);
          setIsLoading(false);
        }
      };
      fetchData();
    }, []);

  const validate = async () => {
    try {
      await GLSettingsSchema.validate(model, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const validationErrorsMap: Record<string, string> = {};
      (validationErrors as yup.ValidationError).inner.forEach((error) => {
        if (error.path) validationErrorsMap[error.path] = error.message;
      });
      setErrors(validationErrorsMap);
      return false;
    }
  };


       const handleUpdate = async () => {
        if(await validate() === false) return false;
        if(await validate() === false) return false;
         if (model) {
            const result = await updateGlSettings(model);
            if (result && result.isSuccess) {
              setModel(
                result.result
              );
            }
         }
         return false;
       };







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
                      error={!!errors.decimalDigitsNumber}
                      // helperText={errors.decimalDigitsNumber}
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
                        error={!!errors.depreciationApplication}
                        // helperText={errors.depreciationApplication}
                      />
                    </div>
                    {/* <div className="col col-md-6"></div> */}
                  </div>
                  {model?.depreciationApplication ==
                    DepreciationApplication.Monthly && (
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
                                  monthDays: Number.parseInt(
                                    event.target.value || '0'
                                  ),
                                }
                              : prevModel
                          )
                        }
                        error={!!errors.monthDay}
                        helperText={errors.monthDay}
                      />
                    </div>
                  )}
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
