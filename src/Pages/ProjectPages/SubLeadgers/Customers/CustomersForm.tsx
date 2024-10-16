import { useEffect, useState } from "react";
import BaseForm from "../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../interfaces/Components/FormType";
import { ApiResponse } from "../../../../interfaces/ApiResponse";
import { toastify } from "../../../../Helper/toastify";
import InputSelect from "../../../../Components/Inputs/InputSelect";
import {
  NodeType,
  NodeTypeOptions,
} from "../../../../interfaces/Components/NodeType";
import { TextField, TextareaAutosize } from "@mui/material";
import CustomerType, {
  CustomerTypeOptions,
} from "../../../../interfaces/ProjectInterfaces/Subleadgers/Customers/CustomerType";
import {
  useCreateCustomerMutation,
  useDeleteCustomerByIdMutation,
  useGetCustomersByIdQuery,
  useGetDefaultModelDataQuery,
  useUpdateCustomerMutation,
} from "../../../../Apis/CustomersApi";
import CustomerModel from "../../../../interfaces/ProjectInterfaces/Subleadgers/Customers/CustomerModel";

const CustomersForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
}> = ({ formType, id, parentId, handleCloseForm }) => {
  const [deleteFunc] = useDeleteCustomerByIdMutation();
  const [model, setModel] = useState<CustomerModel>({
    name: "",
    nameSecondLanguage: "",
    id: "",
    parentId: parentId,
    nodeType: NodeType.Category,
    code: "",
    email: "",
    notes: "",
    phone: "",
    address:"",
    customerType: CustomerType.Consumer,
    mobile:"",
    taxNumber:"",
  });
  const [isLoading, setIsLoading] = useState<boolean>(formType != FormTypes.Add);
    const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const customerResult = useGetCustomersByIdQuery(id, {
    skip: formType == FormTypes.Add,
  });
  const modelDefaultDataResult = useGetDefaultModelDataQuery(parentId, {
    skip: formType != FormTypes.Add,
  });
  const [update] = useUpdateCustomerMutation();
  const [create] = useCreateCustomerMutation();
  useEffect(() => {
    if (formType != FormTypes.Add && !isUpdated) {
      if (!customerResult.isLoading) {
        setModel(customerResult.data.result);
        if (customerResult.data?.result.nodeType === 0) {
          setModel((prevModel) =>
            prevModel
              ? {
                  ...prevModel,
                  code: customerResult.data.result.chartOfAccount.code,
                }
              : prevModel
          );
        }
        setIsLoading(false);
      }
    }
  }, [customerResult.isLoading, customerResult,formType,isUpdated]);
  useEffect(() => {
    if (formType == FormTypes.Add) {
      if (!modelDefaultDataResult.isLoading) {
        setModel((prevModel) =>
          prevModel
            ? {
                ...prevModel,
                code: modelDefaultDataResult?.data?.result?.code,
              }
            : prevModel
        );
      }
    }
  }, [
    model?.nodeType,
    formType,
    modelDefaultDataResult,
    modelDefaultDataResult.isLoading,
  ]);
  const handleUpdate = async () => {
    if (model) {
      const response: ApiResponse = await update(model);
      setIsUpdated(true);
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
  const handleAdd = async () => {
    if (model) {
      const response: ApiResponse = await create(model);
      if (response.data) {
        toastify(response.data.successMessage);
        return true;
      } else if (response.error) {
        response.error?.data?.errorMessages?.map((error: string) => {
          toastify(error, "error");
        });
        return false;
      }
    }
    return false;
  };
  const handleDelete = async (): Promise<boolean> => {
    const response: ApiResponse = await deleteFunc(id);
    if (response.data) {
      toastify(response.data.successMessage);
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
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        handleAdd={handleAdd}
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
                      error={undefined}
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
                              : prevModel
                          );
                        }}
                        name="NodeType"
                        onBlur={undefined}
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
                        <div className="col col-md-6">
                          <InputSelect
                            error={undefined}
                            options={CustomerTypeOptions}
                            label={"Customer Type"}
                            defaultValue={model?.customerType}
                            disabled={formType !== FormTypes.Add}
                            multiple={false}
                            onChange={({
                              target,
                            }: {
                              target: { value: CustomerType };
                            }) => {
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      customerType: target.value,
                                    }
                                  : prevModel
                              );
                            }}
                            name={"CustomerType"}
                            onBlur={undefined}
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
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      phone: event.target.value,
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
                            label="Mobile"
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.mobile}
                            onChange={(event) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      mobile: event.target.value,
                                    }
                                  : prevModel
                              )
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
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      taxNumber: event.target.value,
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
                            label="Address"
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.address}
                            onChange={(event) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      address: event.target.value,
                                    }
                                  : prevModel
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
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
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      email: event.target.value,
                                    }
                                  : prevModel
                              )
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
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      notes: event.target.value,
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

export default CustomersForm;
