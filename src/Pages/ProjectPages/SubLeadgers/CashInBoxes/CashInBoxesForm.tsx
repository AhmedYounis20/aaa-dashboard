import { useEffect, useState } from 'react';
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import { ApiResponse } from '../../../../interfaces/ApiResponse';
import { toastify } from '../../../../Helper/toastify';
import InputSelect from '../../../../Components/Inputs/InputSelect';
import { NodeType, NodeTypeOptions } from '../../../../interfaces/Components/NodeType';
import {  TextField } from '@mui/material';
import CashInBoxModel from '../../../../interfaces/ProjectInterfaces/Subleadgers/CashInBoxes/CashInBoxModel';
import { useDeleteCashInBoxByIdMutation, useGetCashInBoxesByIdQuery, useUpdateCashInBoxMutation } from '../../../../Apis/CashInBoxesApi';

const CashInBoxesForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
}> = ({ formType, id, handleCloseForm }) => {
  const [deleteFunc] = useDeleteCashInBoxByIdMutation();
  const [model, setModel] = useState<CashInBoxModel>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const cashInBoxResult = useGetCashInBoxesByIdQuery(id);
  const [update] = useUpdateCashInBoxMutation();
  useEffect(() => {
    if (!cashInBoxResult.isLoading) {
      setModel(cashInBoxResult.data.result);
      if (cashInBoxResult.data?.result.nodeType === 0) {
        setModel((prevModel) =>
          prevModel
            ? {
                ...prevModel,
                code: cashInBoxResult.data.result.chartOfAccount.code,
              }
            : prevModel
        );
      }
      setIsLoading(false);
    }
  }, [cashInBoxResult.isLoading, cashInBoxResult?.data?.result]);

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
  const handleDelete = async (): Promise<boolean> => {
    const response: ApiResponse = await deleteFunc(id);
    if (response.data) {
      return true;
    } else {
      console.log(response);

      response.error?.data?.errorMessages?.map((error: string) => {
        toastify(error, "error");
        console.log(error);
      });
      return false;
    }
  };

  return (
    <div className="container h-full">
      <BaseForm
        formType={formType}
        handleCloseForm={handleCloseForm}
        handleDelete={async () => await handleDelete()}
        handleUpdate={handleUpdate}
        handleAdd={async () => await handleDelete()}
        isModal
      >
        <div>
          {isLoading ? (
            <div className="spinner-border text-primary" role="status"></div>
          ) : (
            <>
              {formType === FormTypes.Delete ? (
                <p>are you sure, you want delete {model?.nameSecondLanguage}</p>
              ) : (
                <>
                  <div className="row mb-4">
                    <div className="col col-md-6">
                      <TextField
                        type="text"
                        className="form-input form-control"
                        label="Name (required)"
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.name}
                        onChange={(event) =>
                          setModel((prevModel) =>
                            prevModel
                              ? {
                                  ...prevModel,
                                  name: event.target.value,
                                }
                              : prevModel
                          )
                        }
                      />
                    </div>
                    <div className="col col-md-6">
                      <TextField
                        type="text"
                        className="form-input form-control"
                        label="NameSecondLanguage (required)"
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.nameSecondLanguage}
                        onChange={(event) =>
                          setModel((prevModel) =>
                            prevModel
                              ? {
                                  ...prevModel,
                                  nameSecondLanguage: event.target.value,
                                }
                              : prevModel
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col col-md-6">
                      <InputSelect
                        options={NodeTypeOptions}
                        label={"Node Type"}
                        defaultValue={model?.nodeType}
                        disabled={formType !== FormTypes.Add}
                        multiple={false}
                        onChange={({
                          target,
                        }: {
                          target: { value: NodeType };
                        }) => {
                          setModel((prevModel) =>
                            prevModel
                              ? {
                                  ...prevModel,
                                  nodeType: target.value,
                                }
                              : undefined
                          );
                        }}
                      />
                    </div>
                  </div>
                  {model?.nodeType === NodeType.Domain && (
                    <div className="card p-4 mx-0 m-2 mt-4">
                      <p>Basic Information</p>
                      <div className="row mb-4">
                        <div className="col col-md-6">
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label="Code"
                            variant="outlined"
                            fullWidth
                            disabled
                            value={model?.code}
                            onChange={(event) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      name: event.target.value,
                                    }
                                  : prevModel
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </BaseForm>
    </div>
  );
};

export default CashInBoxesForm;
