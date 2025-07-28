/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { FormTypes } from "../../../../../interfaces/Components"
import {
  costCenterMapper,
  CostCenterModel,
} from "../../../../../interfaces/ProjectInterfaces/Account/CostCenters/costCenterModel";
import {
  NodeType,
  NodeTypeOptions,
} from "../../../../../interfaces/Components/NodeType";
import {
  createCostCenter,
  deleteCostCenter,
  getCostCenterById,
  updateCostCenter,
} from "../../../../../Apis/Account/CostCenterApi";
import BaseForm from "../../../../../Components/Forms/BaseForm";
import { Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, FormHelperText } from "@mui/material";
import { getChartOfAccounts } from "../../../../../Apis/Account/ChartOfAccountsApi";
// import DeleteIcon from '@mui/icons-material/Delete';
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import CostCenterType, {
  CostCenterTypeOptions,
} from "../../../../../interfaces/ProjectInterfaces/Account/CostCenters/costCenterType";
import InputAutoComplete from "../../../../../Components/Inputs/InputAutoCompelete";
import { CostCentersSchema } from "../../../../../interfaces/ProjectInterfaces/Account/CostCenters/validation-costCenter";
import * as yup from 'yup';
import { ChartOfAccountModel } from "../../../../../interfaces/ProjectInterfaces";
import { Delete } from "@mui/icons-material";
import InputText from "../../../../../Components/Inputs/InputText";
import InputNumber from "../../../../../Components/Inputs/InputNumber";
import { useTranslation } from "react-i18next";

function CostCenterForm({
  formType,
  parentId,
  handleCloseForm,
  id,
  afterAction,
}: {
  id: string;
  formType: FormTypes;
  parentId: string | null;
  handleCloseForm: () => void;
 afterAction: () => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [model, setModel] = useState<CostCenterModel>({
    id: "",
    parentId: parentId || null,
    name: "",
    nameSecondLanguage: "",
    nodeType: NodeType.Category,
    percent: 0,
    costCenterType: CostCenterType.NotRelated,
    chartOfAccounts: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(
    formType != FormTypes.Add
  );

  const {t} = useTranslation();
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccountModel[]>(
    []
  );
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
    if (formType !== FormTypes.Add ) {
          const fetchData = async () => {
            const result = await getCostCenterById(id);
            
            if (result && result.isSuccess) {
              console.log("entry:",result);
              // Ensure a new object reference is created to trigger re-render
              setModel(costCenterMapper(result.result));

              setIsLoading(false);
            }
          };
        fetchData();

      }
    }
  , [formType,id]);

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
    if ((await validate()) === false) return false;
    const response= await createCostCenter(model);
    if (response.isSuccess) {
      console.log(response);
      afterAction();
      return true;
    }
    return false;
  };

  const handleUpdate = async () => {
    console.log(chartOfAccounts, "charts of accounts");
    const response = await updateCostCenter(id,model);
    if (response.isSuccess) {
      console.log(response);
      afterAction();
      return true;
    }
    return false;
  };

  const handleDelete = async () => {
    const response= await deleteCostCenter(id);
       if (response.isSuccess) {
      console.log(response);
      afterAction();
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (model.chartOfAccounts.length >= 0) {
      const filterdData = chartOfAccounts.filter((item: ChartOfAccountModel) =>
        // model.chartOfAccounts.includes(item?.id)
        (model.chartOfAccounts as string[]).includes(item.id)
      );
      setSelectedChartOfAccounts(filterdData);
    }
  }, [model?.chartOfAccounts, chartOfAccounts]);

  const handleDeleteRow = (id: string) => {
    setModel((prevModel) => ({
      ...prevModel,
      chartOfAccounts: prevModel.chartOfAccounts.filter((e) => e != id),
    }));
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  useEffect(() => {
    console.log(model);
  }, [model]);

  return (
    <div className="h-full">
      <BaseForm
        formType={formType}
        isModal
        handleAdd={handleAdd}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        handleCloseForm={handleCloseForm}
        size="medium"
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
                label={t("Name")}
                isRquired
                variant="outlined"
                fullWidth
                disabled={formType === FormTypes.Details}
                value={model?.name}
                onChange={(e) => {
                  setModel({ ...model, name: e });
                }}
                error={!!errors.name}
              />
              <InputText
                type="text"
                label={t("NameSecondLanguage")}
                isRquired
                variant="outlined"
                fullWidth
                disabled={formType === FormTypes.Details}
                value={model?.nameSecondLanguage}
                onChange={(e) => {
                  setModel({ ...model, nameSecondLanguage: e });
                }}
                error={!!errors.nameSecondLanguage}
              />
            </Box>
            <InputSelect
              options={NodeTypeOptions.map((e) => ({
                ...e,
                label: t(e.label),
              }))}
              label={t("NodeType")}
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
            />
            {errors.nodeType && (
              <FormHelperText error>{t(errors.nodeType)}</FormHelperText>
            )}

            {model?.nodeType === NodeType.Domain && (
              <>
                <Box display={"flex"} gap={1}>
                  <InputSelect
                    options={CostCenterTypeOptions.map((e) => ({
                      ...e,
                      label: t(e.label),
                    }))}
                    label={t("CostCenterType")}
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
                  />
                  {errors.costCenterType && (
                    <FormHelperText error>{t(errors.costCenterType)}</FormHelperText>
                  )}
                  <InputNumber
                    label={t("Percent")}
                    value={model?.percent}
                    onChange={(value) => {
                      setModel({
                        ...model,
                        percent: value,
                      });
                    }}
                    inputType="percent"
                    error={!!errors.percent}
                    helperText={errors.percent ? t(errors.percent) : undefined}
                    disabled={formType === FormTypes.Details}
                  />
                </Box>
                {model?.costCenterType === CostCenterType.RelatedToAccount && (
                  <InputAutoComplete
                    options={chartOfAccounts?.map(
                      (item: { name: string; id: string }) => {
                        return {
                          label: item.name,
                          value: item.id,
                        };
                      }
                    )}
                    label={t("ChartOfAccounts")}
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
                    multiple={true}
                    name={"chartofAccounts"}
                    handleBlur={null}
                    error={!!errors.chartOfAccounts}
                    helperText={t(errors.chartOfAccounts)}
                  />
                )}
                {model?.costCenterType === CostCenterType.RelatedToAccount && (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">{t("Account")}</TableCell>
                          <TableCell align="center">{t("Code")}</TableCell>
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