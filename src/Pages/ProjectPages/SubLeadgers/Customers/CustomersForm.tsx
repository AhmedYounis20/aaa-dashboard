import { useEffect, useState } from 'react';
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import { ApiResponse } from '../../../../interfaces/ApiResponse';
import { toastify } from '../../../../Helper/toastify';
import InputSelect from '../../../../Components/Inputs/InputSelect';
import { NodeType, NodeTypeOptions } from '../../../../interfaces/Components/NodeType';
import { TextField, TextareaAutosize } from '@mui/material';
import { CustomerTypeOptions } from '../../../../interfaces/ProjectInterfaces/Subleadgers/Customers/CustomerType';
import { useDeleteCustomerByIdMutation, useGetCustomersByIdQuery, useUpdateCustomerMutation } from '../../../../Apis/CustomersApi';
import CustomerModel from '../../../../interfaces/ProjectInterfaces/Subleadgers/Customers/CustomerModel';

const CustomersForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
}> = ({ formType, id, handleCloseForm }) => {
  const [deleteFunc] = useDeleteCustomerByIdMutation();
  const [model, setModel] = useState<CustomerModel>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const customerResult = useGetCustomersByIdQuery(id);
  const [update] = useUpdateCustomerMutation();
  useEffect(() => {
    if (!customerResult.isLoading) {
      setModel(customerResult.data.result);
      if (customerResult.data?.result.nodeType === 0) {
        setModel((prevModel) => ({
          ...prevModel,
          code: customerResult.data.result.chartOfAccount.code,
        }));
      }
      setIsLoading(false);
    }
  }, [customerResult.isLoading]);

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
      response.error?.data?.errorMessages?.map((error : string) => {
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
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
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
                              setModel((prevModel) => ({
                                ...prevModel,
                                name: event.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="col col-md-6">
                          <InputSelect
                            options={CustomerTypeOptions}
                            label={"Customer Type"}
                            defaultValue={model?.customerType}
                            disabled={formType !== FormTypes.Add}
                            multiple={false}
                            onChange={({ target }) => {
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      customerType: target.value,
                                    }
                                  : undefined
                              );
                            }}
                          />
                        </div>
                      </div>
                      <div className="row mb-4">
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
                        <div className="col col-md-6">
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label="Mobile"
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.mobile}
                            onChange={(event) =>
                              setModel((prevModel) => ({
                                ...prevModel,
                                mobile: event.target.value,
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
                            label="Tax Number"
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.taxNumber}
                            onChange={(event) =>
                              setModel((prevModel) => ({
                                ...prevModel,
                                taxNumber: event.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="col col-md-6">
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label="Address"
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.address}
                            onChange={(event) =>
                              setModel((prevModel) => ({
                                ...prevModel,
                                address: event.target.value,
                              }))
                            }
                          />
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

export default CustomersForm;
