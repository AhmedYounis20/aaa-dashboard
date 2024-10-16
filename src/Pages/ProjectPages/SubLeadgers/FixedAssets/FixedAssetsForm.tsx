import React,{ useEffect, useState } from 'react';
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import { ApiResponse } from '../../../../interfaces/ApiResponse';
import { toastify } from '../../../../Helper/toastify';
import InputSelect from '../../../../Components/Inputs/InputSelect';
import { NodeType, NodeTypeOptions } from '../../../../interfaces/Components/NodeType';
import { FormControlLabel, Switch, TextField } from '@mui/material';
import { useCreateFixedAssetMutation, useDeleteFixedAssetByIdMutation, useGetDefaultModelDataQuery, useGetFixedAssetsByIdQuery, useUpdateFixedAssetMutation } from '../../../../Apis/FixedAssetsApi';
import FixedAssetModel from '../../../../interfaces/ProjectInterfaces/Subleadgers/FixedAssets/FixedAssetModel';
import  FixedAssetType, { FixedAssetTypeOptions } from '../../../../interfaces/ProjectInterfaces/Subleadgers/FixedAssets/FixedAssetType';

const FixedAssetsForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
}> = ({ formType, id,parentId, handleCloseForm }) => {  
  const [deleteFunc] = useDeleteFixedAssetByIdMutation();
  const [model, setModel] = useState<FixedAssetModel>({
    accumelatedCode :"",
    assetLifeSpanByYears :0,
    depreciationRate :0,
    code:"",
    expensesCode:"",
    fixedAssetType : FixedAssetType.Buildings,
    id:"",
    isDepreciable:false,
    manufactureCompany:"",
    name:"",
    nameSecondLanguage:"",
    nodeType : NodeType.Category,
    notes:"",
    parentId:parentId,
    serial:"",
    version:""
  });
  const [isLoading, setIsLoading] = useState<boolean>(
    formType != FormTypes.Add
  );
  const bankResult = useGetFixedAssetsByIdQuery(id,{
    skip: formType == FormTypes.Add
  });
  const [update] = useUpdateFixedAssetMutation();
  const [create] = useCreateFixedAssetMutation();
    const modelDefaultDataResult = useGetDefaultModelDataQuery({parentId : parentId, fixedAssetType : model.fixedAssetType}, {
      skip: formType != FormTypes.Add,
    });

    useEffect(()=>{ 
      if (formType == FormTypes.Add) {
        setModel((prevModel) =>
          prevModel == null
            ? prevModel
            : {
                ...prevModel,
                code: "Loading...",
                accumelatedCode: "Loading...",
                expensesCode: "Loading...",
              }
        );
        modelDefaultDataResult.refetch(); 
      }

    },[model.fixedAssetType,formType]);
  useEffect(() => {

    if(formType == FormTypes.Add){
       if (!modelDefaultDataResult.isLoading) {
         setModel((prevModel) =>
           prevModel
             ? {
                 ...prevModel,
                 code: modelDefaultDataResult?.data?.result?.code,
                 expensesCode:
                   modelDefaultDataResult?.data?.result?.expensesCode,
                 accumelatedCode:
                   modelDefaultDataResult?.data?.result?.accumelatedCode,
               }
             : prevModel
         );
       }
    }
    else {

      if (!bankResult.isLoading) {
        setModel(bankResult.data.result);
        if (bankResult.data?.result.nodeType === 0) {
        setModel((prevModel) =>
          prevModel == null
            ? prevModel
            : {
              ...prevModel,
              code: bankResult.data.result.chartOfAccount.code,
              accumelatedCode: bankResult.data.result.accumlatedAccount.code,
                expensesCode: bankResult.data.result.expensesAccount.code,
              }
            );
      }
      setIsLoading(false);
    }
    }
  }, [bankResult.isLoading, bankResult,formType,modelDefaultDataResult.isLoading,modelDefaultDataResult?.data?.result]);
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
                        name={"nodeType"}
                        onBlur={undefined}
                      />
                    </div>
                  </div>
                  {model?.nodeType === NodeType.Domain && (
                    <div className="card p-4 mx-0 m-2 mt-4">
                      <p>Basic Information</p>
                      <div className="row mb-4">
                        <div className="col col-md-6">
                          <InputSelect
                            error={undefined}
                            options={FixedAssetTypeOptions}
                            label={"Fixed Asset Type"}
                            defaultValue={model?.fixedAssetType}
                            multiple={false}
                            disabled={formType != FormTypes.Add}
                            onChange={({
                              target,
                            }: {
                              target: { value: FixedAssetType };
                            }) => {
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      fixedAssetType: target.value,
                                    }
                                  : prevModel
                              );
                            }}
                            name={"FixedAssetType"}
                            onBlur={undefined}
                          />
                        </div>
                        <div className="col col-md-6">
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label="Code"
                            variant="outlined"
                            fullWidth
                            disabled
                            value={model?.code}
                          />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col col-md-6">
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label="Accumelated Code"
                            variant="outlined"
                            fullWidth
                            disabled
                            value={model?.accumelatedCode}
                          />
                        </div>
                        <div className="col col-md-6">
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label="Expenses Code"
                            variant="outlined"
                            fullWidth
                            disabled
                            value={
                              modelDefaultDataResult.isLoading
                                ? "loading..."
                                : model?.expensesCode
                            }
                          />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col col-md-6">
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label="Serial"
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.serial}
                            onChange={(event) =>
                              setModel((prevModel) =>
                                prevModel == null
                                  ? prevModel
                                  : {
                                      ...prevModel,
                                      serial: event.target.value,
                                    }
                              )
                            }
                          />
                        </div>
                        <div className="col col-md-6">
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label="Version"
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.version}
                            onChange={(event) =>
                              setModel((prevModel) =>
                                prevModel == null
                                  ? prevModel
                                  : {
                                      ...prevModel,
                                      version: event.target.value,
                                    }
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col col-md-6">
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label="Manufacture Company"
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.manufactureCompany}
                            onChange={(event) =>
                              setModel((prevModel) =>
                                prevModel == null
                                  ? prevModel
                                  : {
                                      ...prevModel,
                                      manufactureCompany: event.target.value,
                                    }
                              )
                            }
                          />
                        </div>
                        <div className="col col-md-6">
                          <FormControlLabel
                            control={
                              <Switch
                                checked={model?.isDepreciable}
                                disabled={formType === FormTypes.Details}
                                onChange={({ target }) =>
                                  setModel((prevModel) =>
                                    prevModel
                                      ? {
                                          ...prevModel,
                                          isDepreciable: target.checked,
                                        }
                                      : prevModel
                                  )
                                }
                              />
                            }
                            label="isDepreciable"
                          />
                        </div>
                      </div>
                      {model.isDepreciable && (
                        <div className="row mb-3">
                          <div className="col col-md-6">
                            <TextField
                              type="number"
                              className="form-input form-control"
                              label="Asset Life Span By Years"
                              variant="outlined"
                              fullWidth
                              disabled={formType === FormTypes.Details}
                              value={model?.assetLifeSpanByYears}
                              onChange={(event) => {
                                const value =
                                  event.target.value === ""
                                    ? 0
                                    : Number.parseInt(event.target.value, 10);
                                setModel((prevModel) =>
                                  prevModel
                                    ? {
                                        ...prevModel,
                                        assetLifeSpanByYears: value,
                                        depreciationRate:
                                          value == 0
                                            ? prevModel.depreciationRate
                                            : 100 / value,
                                      }
                                    : prevModel
                                );
                              }}
                            />
                          </div>
                          <div className="col col-md-6">
                            <TextField
                              type="number"
                              className="form-input form-control"
                              label="Depreciation Rate"
                              variant="outlined"
                              fullWidth
                              disabled={formType === FormTypes.Details}
                              value={model?.depreciationRate}
                              
                              onChange={(event) => {
                                const value =
                                  event.target.value === ""
                                    ? 0
                                    : Number.parseFloat(event.target.value);
                                setModel((prevModel) =>
                                  prevModel == null
                                    ? prevModel
                                    : {
                                        ...prevModel,
                                        depreciationRate: value,
                                        assetLifeSpanByYears:
                                          value == 0
                                            ? prevModel.assetLifeSpanByYears
                                            : 100 / value,
                                      }
                                );
                              }}
                            />
                          </div>
                        </div>
                      )}
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

export default FixedAssetsForm;
