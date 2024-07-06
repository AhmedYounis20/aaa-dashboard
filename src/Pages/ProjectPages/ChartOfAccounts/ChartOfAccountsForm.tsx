import { useEffect, useState } from 'react';
import { useDeleteChartOfAcountByIdMutation, useGetChartOfAccountsByIdQuery } from '../../../Apis/ChartOfAccountsApi';
import BaseForm from '../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../interfaces/Components/FormType';
import { ApiResponse } from '../../../interfaces/ApiResponse';
import { toastify } from '../../../Helper/toastify';
import { AccountNatureOptions, ChartOfAccountModel } from '../../../interfaces/ProjectInterfaces';
import { FormControlLabel, Switch, TextField } from '@mui/material';
import InputSelect from '../../../Components/Inputs/InputSelect';
import InputAutoComplete from '../../../Components/Inputs/InputAutoCompelete';
import { useGetAccountGuidesQuery } from '../../../Apis/AccountGuidesApi';
import { useFormik } from 'formik';
import { chartsOfAccountSchema } from '../../../interfaces/ProjectInterfaces/ChartOfAccount/validation';

const defaultInitialValues: ChartOfAccountModel = {
  id: '',
  name: '',
  nameSecondLanguage: '',
  parentId: '',
  accountGuidId: '',
  code: '',
  isPostedAccount: false,
  isActiveAccount: true,
  isStopDealing: true,
  isDepreciable: false,
  accountNature: 0,
}

const ChartOfAccountsForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
}> = ({ formType, id, handleCloseForm }) => {

  const [deleteChartOfAccount] = useDeleteChartOfAcountByIdMutation();
  const accountGuidesResult = useGetAccountGuidesQuery(null);
  const [model, setModel] = useState<ChartOfAccountModel>();
  const chartOfAccountResult = useGetChartOfAccountsByIdQuery(id);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const onSubmit = () => {
    console.log(values);
  }

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue
  } = useFormik(
    {
      initialValues: model && model || defaultInitialValues,
      validationSchema: chartsOfAccountSchema,
      onSubmit,
      enableReinitialize: true,
    })


  useEffect(() => {
    if (!chartOfAccountResult.isLoading && chartOfAccountResult.data?.result) {
      const data = chartOfAccountResult.data.result;
      setModel(data);
      setIsLoading(false);
    }
  }, [chartOfAccountResult.isLoading, chartOfAccountResult?.data?.result]);

  const handleDelete = async (): Promise<boolean> => {
    const response: ApiResponse = await deleteChartOfAccount(id);
    if (response.data) {
      return true;
    }

    else {
      console.log(response);
      response.error?.data?.errorMessages?.map((error: string) => {
        toastify(error, "error");
        console.log(error);
      }
      );
      return false;
    }
  };

  const handleUpdate = async (): Promise<boolean> => {
    console.log(values)
    return true;
  }


  useEffect(() => {
    console.table(values)
  }, [values])

  return (
    <div className="container h-full">
      <BaseForm
        formType={formType}
        handleCloseForm={handleCloseForm}
        handleAdd={handleDelete}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        isModal={true}
      >
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
              {formType === FormTypes.Delete ? (
                <p>are you sure, you want delete {model?.nameSecondLanguage}</p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col col-md-6">
                      <TextField
                        name='name'
                        type="text"
                        className="form-input form-control"
                        label="Name"
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model && values?.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.name && touched.name ? true : false}
                      />
                      {errors.name && <p>{errors?.name}</p>}
                    </div>
                    <div className="col col-md-6">
                      <TextField
                        name='nameSecondLanguage'
                        type="text"
                        className="form-input form-control"
                        label="NameSecondLanguage"
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={values?.nameSecondLanguage}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.nameSecondLanguage && touched.nameSecondLanguage ? true : false}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col col-md-6">
                      <TextField
                        name='code'
                        type="text"
                        className="form-input form-control"
                        label="Code"
                        variant="outlined"
                        fullWidth
                        disabled
                        value={values?.code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    <div className="col col-md-6">
                      <InputSelect
                        options={AccountNatureOptions}
                        label={"AccountNature"}
                        defaultValue={values?.accountNature.toString()}
                        disabled={formType === FormTypes.Details}
                        multiple={false}
                        name={'accountNature'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col col-md-6">
                      <InputAutoComplete
                        name='accountGuidId'
                        label={"Account Guide"}
                        onChange={setFieldValue}
                        value={
                          accountGuidesResult?.data?.result
                            ?.map((item: { name: string; id: string }) => ({
                              label: item.name,
                              value: item.id,
                            }))
                            ?.find((e: {value: string}) => e.value === values.accountGuidId) || null
                        }
                        options={accountGuidesResult && accountGuidesResult.data?.result.map(
                          (item: { name: string; id: string }) => ({
                            label: item.name,
                            value: item.id,
                          })
                        )}
                        handleBlur={handleBlur}
                        disabled={formType === FormTypes.Details}
                        multiple={false}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col col-md-6">
                      <FormControlLabel
                        control={
                          <Switch
                            name='isPostedAccount'
                            checked={values.isPostedAccount}
                            value={values.isPostedAccount}
                            disabled={formType === FormTypes.Details}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        }
                        label="isPostedAccount"
                      />
                    </div>
                    <div className="col col-md-6">
                      <FormControlLabel
                        control={
                          <Switch
                            name='isActiveAccount'
                            checked={values.isActiveAccount}
                            value={values.isActiveAccount}
                            disabled={formType === FormTypes.Details}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        }
                        label="isActiveAccount"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col col-md-6">
                      <FormControlLabel
                        control={
                          <Switch
                            name='isStopDealing'
                            checked={values.isStopDealing}
                            value={values.isStopDealing}
                            disabled={formType === FormTypes.Details}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        }
                        label="IsStopDealing"
                      />
                    </div>
                    <div className="col col-md-6">
                      <FormControlLabel
                        control={
                          <Switch
                            name='isDepreciable'
                            checked={values.isDepreciable}
                            value={values.isDepreciable}
                            disabled={formType === FormTypes.Details}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />
                        }
                        label="isDepreciable"
                      />
                    </div>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </BaseForm>
    </div>
  );
};

export default ChartOfAccountsForm;
