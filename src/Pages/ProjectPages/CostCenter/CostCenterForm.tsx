/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { FormTypes } from "../../../interfaces/Components"
import { CostCenterModel } from "../../../interfaces/ProjectInterfaces/CostCenter/costCenterModel";
import { NodeType, NodeTypeOptions } from "../../../interfaces/Components/NodeType";
import { useCreateCostCenterMutation, useGetCostCenterByIdQuery, useUpdateCostCenterMutation } from "../../../Apis/CostCenterApi";
import BaseForm from "../../../Components/Forms/BaseForm";
import { ApiResponse } from "../../../interfaces/ApiResponse";
import { toastify } from "../../../Helper/toastify";
import { Box, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from "@mui/material";
import { useGetChartOfAccountsQuery } from "../../../Apis/ChartOfAccountsApi";
import DeleteIcon from '@mui/icons-material/Delete';
import InputSelect from "../../../Components/Inputs/InputSelect";
import CostCenterType, { CostCenterTypeOptions } from "../../../interfaces/ProjectInterfaces/CostCenter/costCenterType";
import InputAutoComplete from "../../../Components/Inputs/InputAutoCompelete";
import { CostCentersSchema } from "../../../interfaces/ProjectInterfaces/CostCenter/validation-costCenter";
import * as yup from 'yup';

function CostCenterForm({ formType, parentId, handleCloseForm, id }: {id: string, formType: FormTypes, parentId: string | null, handleCloseForm: () => void }) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const costCenterResult = useGetCostCenterByIdQuery(id)
    const [model, setModel] = useState<CostCenterModel>({
        id: "",
        parentId: parentId || null,
        name: "",
        nameSecondLanguage: "",
        nodeType: NodeType.Domain,
        percent: 0,
        costCenterType: CostCenterType.NotRelated,
        chartOfAccounts: []
    });
    const [isLoading, setIsLoading] = useState<boolean>(
        formType != FormTypes.Add
    );

    const [createCostCenter] = useCreateCostCenterMutation();
    const [updateCostCenter] = useUpdateCostCenterMutation();
    const { data } = useGetChartOfAccountsQuery(null);
    const [selectedChartOfAccounts, setSelectedChartOfAccounts] = useState([]);
    

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

    useEffect(() => {
        if(formType != FormTypes.Add){
            if (!costCenterResult.isLoading) {
                setModel(costCenterResult.data.result);
                setIsLoading(false);
            }
        }
    }, [costCenterResult.isLoading, costCenterResult?.data?.result,formType]);
    

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
        console.log(data, "charts of accounts")
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


    useEffect(() => {
        if (model.chartOfAccounts.length > 0) {
            const filterdData = data?.result.filter((item: any) =>
                model.chartOfAccounts.includes(item?.id)
            )
            setSelectedChartOfAccounts(filterdData);
        }
    }, [model?.chartOfAccounts, data?.result]);

    const handleDeleteRow = (id: string) => {
        const updatedChartOfAccounts = model.chartOfAccounts.filter(itemId => itemId !== id);
        setModel(prevModel => ({
            ...prevModel,
            chartOfAccounts: updatedChartOfAccounts
        }));
        setSelectedChartOfAccounts(data?.result.filter((item: any) => updatedChartOfAccounts.includes(item.id)));
    };

        useEffect(() => {
            console.log(errors)
        },[errors])
        
        useEffect(() => {
            console.log(model)
        },[model])
    
    if(isLoading) return (
        <div
            className="d-flex flex-row align-items-center justify-content-center"
            style={{ height: "100px" }}
        >
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    )

    return (
        <div className="h-full">
            <BaseForm
                formType={formType}
                isModal
                handleAdd={handleAdd}
                handleUpdate={handleUpdate}
                handleDelete={undefined}
                handleCloseForm={handleCloseForm}
            >
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    gap={2}
                >
                    <Box
                        display={'flex'}
                        gap={1}
                    >
                        <TextField
                            type="text"
                            label="Name (required)"
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.name}
                            name="name"
                            onChange={(e) => {
                                setModel({ ...model, name: e.target.value })
                            }}
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                        <TextField
                            type="text"
                            label="Second language name (required)"
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.nameSecondLanguage}
                            onChange={(e) => {
                                setModel({ ...model, nameSecondLanguage: e.target.value })
                            }}
                            name="nameSecondLanguage"
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
                        error={!!errors.nodeType}
                        helperText={!!errors.nodeType}
                    />

                    {model?.nodeType === NodeType.Domain && (
                        <>
                            <Box
                                display={'flex'}
                                gap={1}
                            >
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
                                    helperText={!!errors.costCenterType}
                                />
                                <TextField
                                    type="number"
                                    name="percent"
                                    label="percent %"
                                    value={model?.percent}
                                    onChange={(e) => {
                                        setModel({
                                            ...model,
                                            percent: parseFloat(e.target.value)
                                        })
                                    }}
                                    error={!!errors.percent}
                                    helperText={errors.percent}
                                />
                            </Box>
                            {model?.costCenterType === CostCenterType.RelatedToAccount && (
                                <InputAutoComplete
                                    options={data?.result && data?.result?.map(
                                        (item: { name: string; id: string }) => {
                                            console.log(item)
                                            return({
                                            label: item.name,
                                            value: item.id,
                                        })
                                    }) || null}
                                    label={"Chart of Accounts"}
                                    value={
                                        data?.result && data?.result
                                            ?.map((item: { name: string; id: string }) => ({
                                                label: item.name,
                                                value: item.id,
                                            }))
                                            ?.filter(
                                                (e: { value: string }) =>
                                                    model.chartOfAccounts.find(c => c === e.value)
                                            ) || null
                                    }
                                    disabled={formType === FormTypes.Details}
                                    onChange={(value: string[] | undefined) => {
                                        setModel((prevModel) =>
                                            prevModel ? {
                                                ...prevModel,
                                                chartOfAccounts: value || []
                                            } : prevModel
                                        );
                                    }}
                                    multiple
                                    name={"chartofAccounts"}
                                    handleBlur={null}
                                    error={!!errors.chartOfAccounts}
                                    helperText={errors.chartOfAccounts}
                                />
                            )}
                            {model?.costCenterType === CostCenterType.RelatedToAccount && (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">العمليات</TableCell>
                                                <TableCell align="center">الحساب</TableCell>
                                                <TableCell align="center">الكود</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedChartOfAccounts?.map((item: any, index) => (
                                                <TableRow key={index}>
                                                    <TableCell align="center">
                                                        <IconButton onClick={() => handleDeleteRow(item?.id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell align="center">{item?.name}</TableCell>
                                                    <TableCell align="center">{item?.code}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </>
                    )}

                </Box>
            </BaseForm>
        </div>
    )
}

export default CostCenterForm