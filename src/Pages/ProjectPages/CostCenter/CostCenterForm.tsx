/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { FormTypes } from "../../../interfaces/Components"
import { costCenterMapper, CostCenterModel } from "../../../interfaces/ProjectInterfaces/CostCenter/costCenterModel";
import { NodeType, NodeTypeOptions } from "../../../interfaces/Components/NodeType";
import { useCreateCostCenterMutation, useDeleteCostCenterMutation, useGetCostCenterByIdQuery, useUpdateCostCenterMutation } from "../../../Apis/CostCenterApi";
import BaseForm from "../../../Components/Forms/BaseForm";
import { ApiResponse } from "../../../interfaces/ApiResponse";
import { toastify } from "../../../Helper/toastify";
import { Box, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from "@mui/material";
import { getChartOfAccounts } from "../../../Apis/ChartOfAccountsApi";
// import DeleteIcon from '@mui/icons-material/Delete';
import InputSelect from "../../../Components/Inputs/InputSelect";
import CostCenterType, { CostCenterTypeOptions } from "../../../interfaces/ProjectInterfaces/CostCenter/costCenterType";
import InputAutoComplete from "../../../Components/Inputs/InputAutoCompelete";
import { CostCentersSchema } from "../../../interfaces/ProjectInterfaces/CostCenter/validation-costCenter";
import * as yup from 'yup';
import { ChartOfAccountModel } from "../../../interfaces/ProjectInterfaces";
import { Delete } from "@mui/icons-material";
import InputText from "../../../Components/Inputs/InputText";

function CostCenterForm({ formType, parentId, handleCloseForm, id }: {id: string, formType: FormTypes, parentId: string | null, handleCloseForm: () => void }) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [model, setModel] = useState<CostCenterModel>({
        id: "",
        parentId: parentId || null,
        name: "",
        nameSecondLanguage: "",
        nodeType: NodeType.Category,
        percent: 0,
        costCenterType: CostCenterType.NotRelated,
        chartOfAccounts: []
    });
    const [isLoading, setIsLoading] = useState<boolean>(
        formType != FormTypes.Add
    );

    const costCenterResult = useGetCostCenterByIdQuery(id);
    const [createCostCenter] = useCreateCostCenterMutation();
    const [updateCostCenter] = useUpdateCostCenterMutation();
    const [deleteCostCenter] = useDeleteCostCenterMutation();
    const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccountModel[]>([]);
    const [selectedChartOfAccounts, setSelectedChartOfAccounts] = useState<
      ChartOfAccountModel[]
    >([]);
  useEffect(() => {
    if (formType != FormTypes.Delete) {
      const fetchData = async () => {
        const result = await getChartOfAccounts();
        if (result) {
          setChartOfAccounts(result.result);
        }
      };
      fetchData();
    }
  }, [formType]);

    useEffect(() => {
        if(formType != FormTypes.Add){
            if (!costCenterResult.isLoading) {
                console.log("result Object " , costCenterResult.data.result.chartOfAccounts.map((e: any)=>e.chartOfAccountId));
                setModel(costCenterMapper(costCenterResult.data.result));

                setIsLoading(false);
            }
            
        }
    }, [costCenterResult.isLoading, costCenterResult?.data?.result,formType]);

    const validate = async () => {
        try {
            await CostCentersSchema.validate(model, { abortEarly: false });
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

    const handleAdd = async () => {
        if(await validate() === false) return false;
        const response: ApiResponse = await createCostCenter(model);
        if (response.data) {
            toastify(response.data.successMessage);
            console.log(response);
            return true;
        } else if (response.error) {
            toastify(response.error.data.errorMessages[0], "error");
            return false;
        }
        return false;
    };
    
    const handleUpdate = async () => {
        console.log(chartOfAccounts, "charts of accounts")
        const response: ApiResponse = await updateCostCenter(model);
        if(response.data) {
            toastify(response.data.successMessage);
            return true;
        } else if (response.error) {
            toastify(response.error.data.errorMessages[0], "error");
            return false;
        }
        return false;
    }

    const handleDelete = async () => {
        const response: ApiResponse = await deleteCostCenter(id);
        if(response.data) {
            toastify(response.data.successMessage)
            return true;
        } else {
            response.error?.data?.errorMessages.map((error: string) => {
                toastify(error, "error");
                console.log(error)
            });
            return false;
        }
    }

    useEffect(() => {
        if (model.chartOfAccounts.length >= 0) {
            const filterdData = chartOfAccounts.filter((item: ChartOfAccountModel) =>
                // model.chartOfAccounts.includes(item?.id)
                (model.chartOfAccounts as string[]).includes(item.id)
            )
            setSelectedChartOfAccounts(filterdData);
        }
    }, [model?.chartOfAccounts, chartOfAccounts]);

    const handleDeleteRow = (id: string) => {
        setModel(prevModel => ({
            ...prevModel,
            chartOfAccounts: prevModel.chartOfAccounts.filter(e=> e != id)
        }));
    };

        useEffect(() => {
            console.log(errors)
        },[errors])
        
        useEffect(() => {
            console.log(model)
        },[model])

    return (
      <div className="h-full">
        <BaseForm
          formType={formType}
          isModal
          handleAdd={handleAdd}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          handleCloseForm={handleCloseForm}
        >
          {isLoading ? (
            <div
              className="d-flex flex-row align-items-center justify-content-center"
              style={{ height: "100px" }}
            >
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <Box display={"flex"} flexDirection={"column"} gap={2}>
              <Box display={"flex"} gap={1}>
                <InputText
                  type="text"
                  label="Name (required)"
                  variant="outlined"
                  fullWidth
                  disabled={formType === FormTypes.Details}
                  value={model?.name}
                  onChange={(e) => {
                    setModel({ ...model, name: e });
                  }}
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <InputText
                  type="text"
                  label="Second language name (required)"
                  variant="outlined"
                  fullWidth
                  disabled={formType === FormTypes.Details}
                  value={model?.nameSecondLanguage}
                  onChange={(e) => {
                    setModel({ ...model, nameSecondLanguage: e });
                  }}
                  error={!!errors.nameSecondLanguage}
                  helperText={errors.nameSecondLanguage}
                />
              </Box>
              <InputSelect
                options={NodeTypeOptions}
                label={"Node Type"}
                defaultValue={model?.nodeType}
                disabled={formType !== FormTypes.Add}
                multiple={false}
                onChange={({ target }: { target: { value: NodeType } }) => {
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
                error={!!errors.nodeType}
                // helperText={errors.nodeType}
              />

              {model?.nodeType === NodeType.Domain && (
                <>
                  <Box display={"flex"} gap={1}>
                    <InputSelect
                      options={CostCenterTypeOptions}
                      label={"Cost Center Type"}
                      defaultValue={model?.costCenterType}
                      disabled={formType !== FormTypes.Add}
                      multiple={false}
                      onChange={({
                        target,
                      }: {
                        target: { value: CostCenterType };
                      }) => {
                        setModel((prevModel) =>
                          prevModel
                            ? {
                                ...prevModel,
                                costCenterType: target.value,
                              }
                            : prevModel
                        );
                      }}
                      name={"costCenterType"}
                      onBlur={undefined}
                      error={!!errors.costCenterType}
                      // helperText={!!errors.costCenterType}
                    />
                    <TextField
                      type="number"
                      name="percent"
                      label="percent %"
                      value={model?.percent}
                      onChange={(e) => {
                        setModel({
                          ...model,
                          percent: parseFloat(e.target.value),
                        });
                      }}
                      error={!!errors.percent}
                      helperText={errors.percent}
                      disabled={formType === FormTypes.Details}
                    />
                  </Box>
                  {model?.costCenterType ===
                    CostCenterType.RelatedToAccount && (
                    <InputAutoComplete
                      options={
                        chartOfAccounts?.map(
                          (item: { name: string; id: string }) => {
                            return {
                              label: item.name,
                              value: item.id,
                            };
                          }
                        )
                      }
                      label={"Chart of Accounts"}
                      value={model.chartOfAccounts}
                      disabled={formType === FormTypes.Details}
                      onChange={(value: string[] | undefined) => {
                        setModel((prevModel) => {
                          console.log("prevModel:", prevModel);
                          console.log("value:", value);
                          return prevModel
                            ? {
                                ...prevModel,
                                chartOfAccounts: value || [],
                              }
                            : prevModel;
                        });
                      }}
                      size={"medium"}
                      multiple
                      name={"chartofAccounts"}
                      handleBlur={null}
                      error={!!errors.chartOfAccounts}
                      helperText={errors.chartOfAccounts}
                    />
                  )}
                  {model?.costCenterType ===
                    CostCenterType.RelatedToAccount && (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>  
                            <TableCell align="center">الحساب</TableCell>
                            <TableCell align="center">الكود</TableCell>
                            <TableCell align="center"></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedChartOfAccounts?.map((item: any, index) => (
                            <TableRow key={index}>
                              <TableCell align="center">{item?.name}</TableCell>
                              <TableCell align="center">{item?.code}</TableCell>
                              <TableCell align="center">
                                <IconButton
                                  onClick={() => handleDeleteRow(item?.id)}
                                >
                                  <Delete />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </>
              )}
            </Box>
          )}
        </BaseForm>
      </div>
    );
}

export default CostCenterForm