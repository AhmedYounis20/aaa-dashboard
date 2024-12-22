import { useEffect, useState } from 'react';
import BaseForm from '../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../interfaces/Components/FormType';
import { IconButton, TextareaAutosize, TextField } from '@mui/material';
import EntryModel from '../../../interfaces/ProjectInterfaces/Entries/Entry';
import { ApiResponse } from '../../../interfaces/ApiResponse';
import { toastify } from '../../../Helper/toastify';
import yup from 'yup';
import FinancialTransactionModel from '../../../interfaces/ProjectInterfaces/Entries/FinancialTransaction';
import { AccountNature } from '../../../interfaces/ProjectInterfaces/ChartOfAccount/AccountNature';
import { useCreateEntryMutation, useDeleteEntryMutation, useGetEntryByIdQuery, useUpdateEntryMutation } from '../../../Apis/EntriesApi';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import InputFile from '../../../Components/Inputs/InputFile';
import AttachmentModel from '../../../interfaces/BaseModels/AttachmentModel';
import InputAutoComplete from '../../../Components/Inputs/InputAutoCompelete';
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { Add, Delete } from '@mui/icons-material';
import { EntrySchema } from '../../../interfaces/ProjectInterfaces/Entries/entry-validation';
import { useGetCurrenciesQuery } from '../../../Apis/CurrenciesApi';
import CurrencyModel from '../../../interfaces/ProjectInterfaces/Currencies/CurrencyModel';
import BranchModel from '../../../interfaces/ProjectInterfaces/Subleadgers/Branches/BranchModel';
import { useGetBranchesQuery } from '../../../Apis/BranchesApi';



const EntriesForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
}> = ({ formType, id, handleCloseForm }) => {
  const currencyResult = useGetEntryByIdQuery(id, {
    skip: formType == FormTypes.Add,
  });
    const currenciesApiResult = useGetCurrenciesQuery({
      skip: formType == FormTypes.Delete,
    });

        const branchesApiResult = useGetBranchesQuery({
          skip: formType == FormTypes.Delete,
        });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [updateEntry] = useUpdateEntryMutation();
  const [createEntry] = useCreateEntryMutation();
  const [deleteEntry] = useDeleteEntryMutation();
  const [isLoading, setIsLoading] = useState<boolean>(
    formType != FormTypes.Add
  );
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [currencies, setCurrencies] = useState<CurrencyModel[]>([]);
  const [branches, setBranches] = useState<BranchModel[]>([]);
  const [transactionNumber,setTransactionNumber]=useState<number>(1);

  useEffect( ()=>{
    if(currenciesApiResult.isSuccess && !currenciesApiResult.isLoading){
      setCurrencies(currenciesApiResult.data.result);
    }
  },[currenciesApiResult,currenciesApiResult.isLoading,currenciesApiResult.isSuccess,currencies]);

    useEffect(() => {
      if (branchesApiResult.isSuccess && !branchesApiResult.isLoading) {
        setBranches(branchesApiResult.data.result);
      }
    }, [
      branchesApiResult,
      branchesApiResult.isLoading,
      branchesApiResult.isSuccess,
      branches,
    ]);

 
  const createFinancialTransaction: () => FinancialTransactionModel = () => {
    const transaction: FinancialTransactionModel = {
      creditAccountId: "",
      debitAccountId: "",
      accountNature: AccountNature.Debit,
      amount: 0,
      chequeBankId: null,
      chequeCollectionDate: null,
      chequeIssueDate: null,
      chequeNumber: null,
      collectionDate: null,
      creditCardLastDigits: null,
      notes: null,
      number: null,
      orderNumber: transactionNumber,
      promissoryCollectionDate: null,
      promissoryIdentityCard: null,
      promissoryName: null,
      promissoryNumber: null,
      wireTransferReferenceNumber: null,
    };
    if(transactionNumber==1)
      setTransactionNumber(prev=>prev+1);
    return transaction;
  };
  const [model, setModel] = useState<EntryModel>({
    id: id,
    exchangeRate: 0,
    entryNumber: "",
    branchId: "",
    currencyId: "",
    entryDate: new Date(),
    documentNumber: "",
    financialPeriodId: "",
    notes: "",
    receiverName: "",
    financialTransactions: [createFinancialTransaction()],
    attachments: [],
    financialPeriodNumber:""
  });
  useEffect(() => {
    const currency = currencies.find((e) => e.id == model.currencyId);
    console.log(currency);
    setModel((prev) =>
      prev
        ? { ...prev, exchangeRate: currency ? currency.exchangeRate : 0 }
        : prev
    );
  }, [model.currencyId, model.exchangeRate]);
  const removetransaction : (transactionNumber :number)=>void =(transactionNumber : number)=>{
    const transactions =model.financialTransactions.filter(e=> e.orderNumber!=transactionNumber);
    const updatedTransactions =transactions.map(e=> e.orderNumber < transactionNumber ? e: {...e,orderNumber:e.orderNumber-1});
    setModel((prevModel)=> prevModel ? {...prevModel,financialTransactions:updatedTransactions}:prevModel);
  }

  const onAddFinancialTrancastion =()=>{
   setModel((prevModel) => ({
     ...prevModel,
     financialTransactions: [
       ...prevModel.financialTransactions,
       createFinancialTransaction(),
     ],
   }));
   setTransactionNumber(prev=>{console.log(prev);  return prev+1;});
  }
  useEffect(() => {
    if (formType != FormTypes.Add && !isUpdated) {
      if (!currencyResult.isLoading) {
        setModel(currencyResult?.data?.result);
        setIsLoading(false);
      }
    }
  }, [currencyResult.isLoading, currencyResult, formType, isUpdated]);

  const validate = async () => {
    try {
      await EntrySchema.validate(model, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const validationErrorsMap: Record<string, string> = {};
      (validationErrors as yup.ValidationError).inner.forEach((error: any) => {
        if (error.path) validationErrorsMap[error.path] = error.message;
      });
      console.log(validationErrorsMap);
      setErrors(validationErrorsMap);
      return false;
    }
  };

  const handleDelete = async (): Promise<boolean> => {
    const response: ApiResponse = await deleteEntry(id);
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

  const handleUpdate = async () => {
    if ((await validate()) === false) return false;

    const response: ApiResponse = await updateEntry(model);
    setIsUpdated(true);
    if (response.data) {
      toastify(response.data.successMessage);
      return true;
    } else if (response.error) {
      toastify(response.error.data.errorMessages[0], "error");
      return false;
    }
    return false;
  };

  const handleAdd = async () => {
    if ((await validate()) === false) return false;

    const response: ApiResponse = await createEntry(model);
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


  return (
    <div className="h-full">
      <BaseForm
        formType={formType}
        isModal
        handleAdd={handleAdd}
        handleDelete={handleDelete}
        handleCloseForm={handleCloseForm}
        handleUpdate={handleUpdate}
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
                <p>
                  are you sure, you want delete entry with entry number{" "}
                  {model?.entryNumber}
                </p>
              ) : (
                <>
                  <div className="row mb-2">
                    <div className="col col-md-6">
                      <div className="row mb-2">
                        <div className="col col-md-12">
                          <div className="row">
                            <div className="col col-md-6">
                              <TextField
                                type="text"
                                className="form-input form-control"
                                label="Financial Period Number"
                                variant="outlined"
                                fullWidth
                                size="small"
                                disabled={true}
                                value={model?.financialPeriodNumber}
                                error={!!errors.financialPeriodNumber}
                                helperText={errors.financialPeriodNumber}
                              />
                            </div>
                            <div className="col col-md-6">
                              <TextField
                                type="text"
                                size="small"
                                className="form-input form-control"
                                label="Entry Number"
                                variant="outlined"
                                fullWidth
                                disabled={true}
                                value={model?.entryNumber}
                                error={!!errors.entryNumber}
                                helperText={errors.entryNumber}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col col-md-12">
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label="Document Number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.entryNumber}
                            onChange={(event: { target: { value: string } }) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      documentNumber: event.target.value,
                                    }
                                  : prevModel
                              )
                            }
                            error={!!errors.documentNumber}
                            helperText={errors.documentNumber}
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col col-md-8">
                          <InputAutoComplete
                            size={"small"}
                            error={undefined}
                            helperText={undefined}
                            options={currencies?.map(
                              (item: { name: string; id: string }) => ({
                                label: item.name,
                                value: item.id,
                              })
                            )}
                            label={"Currency"}
                            value={ model?.currencyId}
                            disabled={formType === FormTypes.Details}
                            onChange={(value: string | undefined) => {
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      currencyId: value || "",
                                    }
                                  : prevModel
                              );
                              console.log(value);
                            }}
                            multiple={false}
                            name={"Currencies"}
                            handleBlur={null}
                          />
                        </div>
                        <div className="col col-md-4">
                          <TextField
                            type="number"
                            className="form-input form-control"
                            label="Exchange Rate (required)"
                            variant="outlined"
                            fullWidth
                            size="small"
                            disabled={formType === FormTypes.Details}
                            value={model?.exchangeRate}
                            onChange={(event) =>
                              setModel({
                                ...model,
                                exchangeRate: Number.parseFloat(
                                  event.target.value || "0"
                                ),
                              })
                            }
                            error={!!errors.exchangeRate}
                            helperText={errors.exchangeRate}
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col col-md-12">
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label="Receiver Name"
                            variant="outlined"
                            fullWidth
                            size="small"
                            disabled={formType === FormTypes.Details}
                            value={model?.entryNumber}
                            onChange={(event: { target: { value: string } }) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      symbol: event.target.value,
                                    }
                                  : prevModel
                              )
                            }
                            error={!!errors.symbol}
                            helperText={errors.symbol}
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col col-md-12">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer
                              components={["DateTimePicker", "DateTimePicker"]}
                            >
                              <DateTimePicker
                                label="Entry Date"
                                viewRenderers={{
                                  hours: renderTimeViewClock,
                                  minutes: renderTimeViewClock,
                                  seconds: renderTimeViewClock,
                                }}
                                value={
                                  model?.entryDate
                                    ? dayjs(model.entryDate)
                                    : null
                                }
                                onChange={(value) => {
                                  if (value) {
                                    setModel((prevModel) =>
                                      prevModel
                                        ? {
                                            ...prevModel,
                                            entryDate: value.toDate(), // Ensure startDate is a Date
                                          }
                                        : prevModel
                                    );
                                  }
                                }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </div>
                      </div>
                    </div>
                    <div className="col col-md-6">
                      <div className="row mb-2">
                        <div className="col col-md-12">
                          <InputAutoComplete
                            size={"small"}
                            error={undefined}
                            helperText={undefined}
                            options={branches?.map(
                              (item: { name: string; id: string }) => ({
                                label: item.name,
                                value: item.id,
                              })
                            )}
                            label={"Branch"}
                            // value={
                            //   accountGuidesResult?.data?.result
                            //     ?.map((item: { name: string; id: string }) => ({
                            //       label: item.name,
                            //       value: item.id,
                            //     }))
                            //     ?.find(
                            //       (e: { value: string }) =>
                            //         e.value === model?.accountGuidId
                            //     ) || null
                            // }
                            value={model?.branchId}
                            disabled={formType === FormTypes.Details}
                            onChange={(value: string | undefined) => {
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      branchId: value || "",
                                    }
                                  : prevModel
                              );
                              console.log(value);
                            }}
                            multiple={false}
                            name={"Branch"}
                            handleBlur={null}
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col col-md-12">
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label="Financial Collector (required)"
                            variant="outlined"
                            fullWidth
                            size="small"
                            disabled={formType === FormTypes.Details}
                            value={model?.entryNumber}
                            onChange={(event: { target: { value: string } }) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      symbol: event.target.value,
                                    }
                                  : prevModel
                              )
                            }
                            error={!!errors.symbol}
                            helperText={errors.symbol}
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col col-md-12">
                          <TextareaAutosize
                            className="form-input form-control"
                            disabled={formType === FormTypes.Details}
                            value={model?.notes}
                            aria-label="notes"
                            placeholder="notes..."
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
                      <div className="row mb-2">
                        <div className="col col-md-12">
                          <InputFile
                            value={model.attachments}
                            multiSelect={true}
                            allowedTypes={[]}
                            disabled={false}
                            onFilesChange={(attachments: AttachmentModel[]) => {
                              setModel((prevModel) =>
                                prevModel
                                  ? { ...prevModel, attachments: attachments }
                                  : prevModel
                              );
                            }}
                            onlySelectedTypes={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {model.financialTransactions.map((e, idx) => (
                    <div className="card card-body mb-2" key={e.orderNumber}>
                      <div className="row mb-2">
                        <div className="col col-md-5">
                          <InputAutoComplete
                            size={"small"}
                            options={[]}
                            // options={accountGuidesResult?.data?.result?.map(
                            //   (item: { name: string; id: string }) => ({
                            //     label: item.name,
                            //     value: item.id,
                            //   })
                            // )}
                            label={"Debt Account"}
                            // value={
                            //   accountGuidesResult?.data?.result
                            //     ?.map((item: { name: string; id: string }) => ({
                            //       label: item.name,
                            //       value: item.id,
                            //     }))
                            //     ?.find(
                            //       (e: { value: string }) =>
                            //         e.value === model?.accountGuidId
                            //     ) || null
                            // }
                            value={null}
                            disabled={formType === FormTypes.Details}
                            onChange={(value: string | undefined) => {
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      accountGuidId: value || "",
                                    }
                                  : prevModel
                              );
                            }}
                            multiple={false}
                            name={"DebtAccount"}
                            handleBlur={null}
                            error={
                              !!errors[
                                `financialTransactions[${idx}].debitAccountId`
                              ]
                            }
                            helperText={
                              errors[
                                `financialTransactions[${idx}].debitAccountId`
                              ]
                            }
                          />
                        </div>
                        <div className="col col-md-2">
                          <div
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <IconButton>
                              {" "}
                              <SyncAltIcon />
                            </IconButton>
                          </div>
                        </div>
                        <div className="col col-md-5">
                          <InputAutoComplete
                            size={"small"}
                            error={
                              !!errors[
                                `financialTransactions[${idx}].creditAccountId`
                              ]
                            }
                            helperText={
                              errors[
                                `financialTransactions[${idx}].creditAccountId`
                              ]
                            }
                            options={[]}
                            // options={accountGuidesResult?.data?.result?.map(
                            //   (item: { name: string; id: string }) => ({
                            //     label: item.name,
                            //     value: item.id,
                            //   })
                            // )}
                            label={"Credit Account"}
                            // value={
                            //   accountGuidesResult?.data?.result
                            //     ?.map((item: { name: string; id: string }) => ({
                            //       label: item.name,
                            //       value: item.id,
                            //     }))
                            //     ?.find(
                            //       (e: { value: string }) =>
                            //         e.value === model?.accountGuidId
                            //     ) || null
                            // }
                            disabled={formType === FormTypes.Details}
                            onChange={(value: string | undefined) => {
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      accountGuidId: value || "",
                                    }
                                  : prevModel
                              );
                              console.log(value);
                            }}
                            value={null}
                            multiple={false}
                            name={"DebtAccount"}
                            handleBlur={null}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col col-md-6">
                          <div className="row mb-2">
                            <div className="col col-md-6">
                              <TextField
                                type="text"
                                className="form-input form-control"
                                label="Financial Period Number"
                                variant="outlined"
                                fullWidth
                                size="small"
                                disabled={formType === FormTypes.Details}
                                value={model?.entryNumber}
                                onChange={(event: {
                                  target: { value: string };
                                }) =>
                                  setModel((prevModel) =>
                                    prevModel
                                      ? {
                                          ...prevModel,
                                          symbol: event.target.value,
                                        }
                                      : prevModel
                                  )
                                }
                                error={!!errors.symbol}
                                helperText={errors.symbol}
                              />
                            </div>
                            <div className="col col-md-6">
                              <TextField
                                type="text"
                                className="form-input form-control"
                                label="Financial Period Number"
                                variant="outlined"
                                fullWidth
                                size="small"
                                disabled={formType === FormTypes.Details}
                                value={model?.entryNumber}
                                onChange={(event: {
                                  target: { value: string };
                                }) =>
                                  setModel((prevModel) =>
                                    prevModel
                                      ? {
                                          ...prevModel,
                                          symbol: event.target.value,
                                        }
                                      : prevModel
                                  )
                                }
                                error={!!errors.symbol}
                                helperText={errors.symbol}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col col-md-6">
                          <TextareaAutosize
                            className="form-input form-control"
                            disabled={formType === FormTypes.Details}
                            value={e?.notes ?? ""}
                            aria-label="notes"
                            placeholder="notes..."
                            minRows={2}
                            onChange={(event) => {
                              console.log(e.orderNumber);
                              console.log(
                                `financialTransactions[${idx}].creditAccountId`
                              );
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      financialTransactions:
                                        prevModel.financialTransactions.map(
                                          (transaction) =>
                                            transaction.orderNumber ==
                                            e.orderNumber
                                              ? {
                                                  ...transaction,
                                                  notes: event.target.value,
                                                }
                                              : transaction
                                        ),
                                    }
                                  : prevModel
                              );
                            }}
                          />
                        </div>
                      </div>
                      {model.financialTransactions.length > 1 && (
                        <div>
                          <IconButton
                            onClick={() => removetransaction(e.orderNumber)}
                          >
                            <Delete />
                          </IconButton>
                        </div>
                      )}
                    </div>
                  ))}

                  <div>
                    <IconButton onClick={() => onAddFinancialTrancastion()}>
                      <Add />
                    </IconButton>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </BaseForm>
    </div>
  );
};

export default EntriesForm;