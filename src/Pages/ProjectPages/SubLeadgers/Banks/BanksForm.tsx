import { useEffect, useState } from 'react';
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import { ApiResponse } from '../../../../interfaces/ApiResponse';
import { toastify } from '../../../../Helper/toastify';
import InputSelect from '../../../../Components/Inputs/InputSelect';
import { NodeType, NodeTypeOptions } from '../../../../interfaces/Components/NodeType';
import { TextField, TextareaAutosize } from '@mui/material';
import { CustomerTypeOptions } from '../../../../interfaces/ProjectInterfaces/Subleadgers/Customers/CustomerType';
import BankModel from '../../../../interfaces/ProjectInterfaces/Subleadgers/Banks/BankModel';
import { useDeleteBankByIdMutation, useGetBanksByIdQuery } from '../../../../Apis/BanksApi';

const BanksForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
}> = ({ formType, id, handleCloseForm }) => {
  const [deleteFunc] = useDeleteBankByIdMutation();
  const [model, setModel] = useState<BankModel>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const bankResult = useGetBanksByIdQuery(id);
  useEffect(() => {
    if (!bankResult.isLoading) {
      setModel(bankResult.data.result);
      if (bankResult.data?.result.nodeType === 0) {
        setModel((prevModel) => ({
          ...prevModel,
          code: bankResult.data.result.chartOfAccount.code,
        }));
      }
      setIsLoading(false);
    }
  }, [bankResult.isLoading]);

  const handleDelete = async (): Promise<boolean> => {
    const response: ApiResponse = await deleteFunc(id);
    if (response.data) {
      return true;
    } else {
      console.log(response);

      response.error?.data?.errorMessages?.map((error) => {
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
                          setModel((prevModel) => ({
                            ...prevModel,
                            name: event.target.value,
                          }))
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
                          setModel((prevModel) => ({
                            ...prevModel,
                            nameSecondLanguage: event.target.value,
                          }))
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
                        onChange={({ target }) => {
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
                              setModel((prevModel) => ({
                                ...prevModel,
                                name: event.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="col col-md-6">
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label="Phone"
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.phone}
                            onChange={(event) =>
                              setModel((prevModel) => ({
                                ...prevModel,
                                phone: event.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col col-md-6">
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label="Bank Account"
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.bankAccount}
                            onChange={(event) =>
                              setModel((prevModel) => ({
                                ...prevModel,
                                bankAccount: event.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="col col-md-6">
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label="Email"
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.email}
                            onChange={(event) =>
                              setModel((prevModel) => ({
                                ...prevModel,
                                email: event.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col col-md-6">
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label="Bank Address"
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.bankAddress}
                            onChange={(event) =>
                              setModel((prevModel) => ({
                                ...prevModel,
                                bankAddress: event.target.value,
                              }))
                            }
                          />
                        </div>
                        <div
                          className="col col-md-6 pt-0"
                          style={{ marginTop: -10 }}
                        >
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col col-md-12">
                          <label className="form-label"> notes</label>
                          <TextareaAutosize
                            className="form-input form-control"
                            disabled={formType === FormTypes.Details}
                            value={model?.notes}
                            aria-label="notes"
                            onChange={(event) =>
                              setModel((prevModel) => ({
                                ...prevModel,
                                notes: event.target.value,
                              }))
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

export default BanksForm;
