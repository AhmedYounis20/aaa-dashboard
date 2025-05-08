/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import BaseForm from "../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../interfaces/Components/FormType";
import { IconButton, TextareaAutosize, TextField } from "@mui/material";
import ComplexEntryModel from "../../../../interfaces/ProjectInterfaces/Entries/ComplexEntry";
import { toastify } from "../../../../Helper/toastify";
import yup from "yup";
import ComplexFinancialTransactionModel from "../../../../interfaces/ProjectInterfaces/Entries/ComplexFinancialTransaction";
import { AccountNature } from "../../../../interfaces/ProjectInterfaces/ChartOfAccount/AccountNature";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import InputFile from "../../../../Components/Inputs/InputFile";
import AttachmentModel from "../../../../interfaces/BaseModels/AttachmentModel";
import InputAutoComplete from "../../../../Components/Inputs/InputAutoCompelete";
import { Add, Delete } from "@mui/icons-material";
import { EntrySchema } from "../../../../interfaces/ProjectInterfaces/Entries/entry-validation";
import { useGetCurrenciesQuery } from "../../../../Apis/CurrenciesApi";
import CurrencyModel from "../../../../interfaces/ProjectInterfaces/Currencies/CurrencyModel";
import BranchModel from "../../../../interfaces/ProjectInterfaces/Subleadgers/Branches/BranchModel";
import { useGetBranchesQuery } from "../../../../Apis/BranchesApi";
import updateModel from "../../../../Helper/updateModelHelper";
import { NodeType } from "../../../../interfaces/Components/NodeType";
import { useGetCollectionBooksQuery } from "../../../../Apis/CollectionBooksApi";
import {
  ChartOfAccountModel,
  CollectionBookModel,
} from "../../../../interfaces/ProjectInterfaces";
import { httpGet } from "../../../../Apis/Axios/axiosMethods";
import EntryNumber from "../../../../interfaces/ProjectInterfaces/Entries/EntryNumber";
import { v4 as uuid } from "uuid";
import { PaymentType, PaymentTypeOptions } from "../../../../interfaces/ProjectInterfaces/Entries/PaymentType";
import { SubLeadgerType } from "../../../../interfaces/ProjectInterfaces/ChartOfAccount/SubLeadgerType";
import InputSelect from "../../../../Components/Inputs/InputSelect";
import { getChartOfAccounts } from "../../../../Apis/ChartOfAccountsApi";
import InputDateTimePicker from "../../../../Components/Inputs/InputDateTime";
import InputText from "../../../../Components/Inputs/InputText";
import { createReceiptEntry, deleteReceiptEntry, getReceiptEntryById, updateReceiptEntry } from "../../../../Apis/ReceiptEntriesApi";
const ReceiptVouchersForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  actionAfter : ()=> void;
}> = ({ formType, id, handleCloseForm,actionAfter }) => {
  const url = "entries";
  const currenciesApiResult = useGetCurrenciesQuery({
    skip: formType == FormTypes.Delete,
  });

  const collectionBooksApiResult = useGetCollectionBooksQuery({
    skip: formType == FormTypes.Delete,
  });
  const branchesApiResult = useGetBranchesQuery({
    skip: formType == FormTypes.Delete,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(
    formType != FormTypes.Add
  );
  const [currencies, setCurrencies] = useState<CurrencyModel[]>([]);
  const [branches, setBranches] = useState<BranchModel[]>([]);
  const [transactionNumber, setTransactionNumber] = useState<number>(1);
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccountModel[]>(
    []
  );
    const [collectionBooks, setCollectionBooks] = useState<
      CollectionBookModel[]
    >([]);

  const createFinancialTransaction: () => ComplexFinancialTransactionModel =
    () => {
      const transaction: ComplexFinancialTransactionModel = {
        id: uuid(),
        complementId: uuid(),
        creditAccountId: "",
        debitAccountId: "",
        accountNature: AccountNature.Debit,
        amount: 0,
        chequeBankId: null,
        chequeCollectionDate: null,
        chequeIssueDate: null,
        chequeNumber: null,
        creditCardLastDigits: null,
        notes: null,
        orderNumber: transactionNumber,
        promissoryCollectionDate: null,
        promissoryIdentityCard: null,
        promissoryName: null,
        promissoryNumber: null,
        wireTransferReferenceNumber: null,
        paymentType: PaymentType.Cash,
        isPaymentTransaction: false,
        atmTransferReferenceNumber: null,
        cashAgentName: null,
        cashPhoneNumber: null,
        collectionBookId: null,
      };
      if (transactionNumber == 1) setTransactionNumber((prev) => prev + 1);
      return transaction;
    };
  const [model, setModel] = useState<ComplexEntryModel>({
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
    financialTransactions:
      formType == FormTypes.Add ? [createFinancialTransaction()] : [],
    attachments: [],
    financialPeriodNumber: "",
    costCenters:[]
  });

  //#region listeners
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
      if (
        collectionBooksApiResult.isSuccess &&
        !collectionBooksApiResult.isLoading
      ) {
        setCollectionBooks(collectionBooksApiResult.data.result);
      }
    }, [
      collectionBooksApiResult,
      collectionBooksApiResult.isLoading,
      collectionBooksApiResult.isSuccess,
    ]);
  useEffect(() => {
    if (formType == FormTypes.Add) {
      httpGet<EntryNumber>(`${url}/getEntryNumber`, {
        datetime: model.entryDate,
      }).then((e) => {
        if (!e) return;
        const { result } = e;
        setModel((prevModel) =>
          prevModel
            ? {
                ...prevModel,
                entryNumber: result.entryNumber ?? "",
                financialPeriodId: result.financialPeriodId ?? "",
                financialPeriodNumber: result.financialPeriodNumber ?? "",
                documentNumber:
                  prevModel.documentNumber == null ||
                  prevModel.documentNumber == "" ||
                  prevModel.documentNumber ==
                    `${result.financialPeriodNumber}\\${result.entryNumber}`
                    ? `${result.financialPeriodNumber}\\${result.entryNumber}`
                    : prevModel.documentNumber,
              }
            : prevModel
        );
      });
    }
  }, [model.entryDate]);

  useEffect(() => {
    if (currenciesApiResult.isSuccess && !currenciesApiResult.isLoading) {
      setCurrencies(currenciesApiResult.data.result);
    }
  }, [
    currenciesApiResult,
    currenciesApiResult.isLoading,
    currenciesApiResult.isSuccess,
  ]);
  useEffect(() => {
    if (branchesApiResult.isSuccess && !branchesApiResult.isLoading) {
      setBranches(
        branchesApiResult.data.result.filter(
          (e: BranchModel) => e.nodeType == NodeType.Domain
        )
      );
    }
  }, [
    branchesApiResult,
    branchesApiResult.isLoading,
    branchesApiResult.isSuccess,
  ]);
  //#endregion

  useEffect(() => {
    const currency = currencies.find((e) => e.id == model.currencyId);
    console.log(currency);
    setModel((prev) =>
      prev
        ? { ...prev, exchangeRate: currency ? currency.exchangeRate : 0 }
        : prev
    );
  }, [model.currencyId]);

  const getChartOfAccountsDropDown = (
    paymentType: PaymentType
  ): ChartOfAccountModel[] => {
    const filteredAccounts = chartOfAccounts.filter((item) =>
      paymentType === PaymentType.Cash
        ? item.subLeadgerType === SubLeadgerType.CashInBox
        : item.subLeadgerType === SubLeadgerType.Bank
    );

    return filteredAccounts;
  };

  const removetransaction: (transactionId: string) => void = (
    transactionId: string
  ) => {
    const transactions = model.financialTransactions.filter(
      (e) => e.id != transactionId
    );
    setModel((prevModel) =>
      prevModel
        ? { ...prevModel, financialTransactions: transactions }
        : prevModel
    );

    setErrors((errors) =>
      errors
        ? Object.fromEntries(
            Object.entries(errors).filter(
              ([key]) => !key.startsWith(`financialTransactions`)
            )
          )
        : {}
    );
  };

  const onAddFinancialTrancastion = () => {
    setModel((prevModel) => ({
      ...prevModel,
      financialTransactions: [
        ...prevModel.financialTransactions,
        createFinancialTransaction(),
      ],
    }));
    setTransactionNumber((prev) => {
      console.log(prev);
      return prev + 1;
    });
  };
  useEffect(() => {
    if (formType !== FormTypes.Add) {
      const fetchData = async () => {
        const result = await getReceiptEntryById(id);

        if (result && result.isSuccess) {
          console.log("entry:", result);
          // Ensure a new object reference is created to trigger re-render
          setModel({
            ...result.result, // Assign API result
            financialTransactions: result.result.financialTransactions.map(
              (t: ComplexFinancialTransactionModel) => ({
                ...t,
                debitAccountId: t.debitAccountId || "", // Ensure proper values
                creditAccountId: t.creditAccountId || "",
              })
            ),
          });
          setTransactionNumber(
            result.result.financialTransactions.findLast(
              (e: ComplexFinancialTransactionModel) => e.orderNumber != null
            )?.orderNumber ?? 1
          );
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [formType, id]);
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
    const response = await deleteReceiptEntry(id);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      actionAfter();
      return true;
    } else if (response) {
      if (response.errorMessages?.length == 0) {
        toastify(response.successMessage, "error");
      } else {
        response.errorMessages?.map((val: string) => toastify(val, "error"));
      }
      return false;
    }
    return false;
  };

  const handleUpdate = async () => {
    if ((await validate()) === false) return false;

    SortFinancialTransactions();
    const response = await updateReceiptEntry(model.id, model);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      actionAfter();
      return true;
    } else if (response) {
      if (response.errorMessages?.length == 0) {
        toastify(response.successMessage, "error");
      } else {
        response.errorMessages?.map((val: string) => toastify(val, "error"));
      }
      return false;
    }
    return false;
  };


  const SortFinancialTransactions = () => {
    const financialTransactions = model.financialTransactions;
    for (let i = 1; i <= financialTransactions.length; i++) {
      financialTransactions[i - 1].orderNumber = i;
    }
    setModel({ ...model, financialTransactions: financialTransactions });
  };

  const handleAdd = async () => {
    if ((await validate()) === false) return false;
    SortFinancialTransactions();
    const response = await createReceiptEntry(model);
    console.log(response);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      actionAfter();
      return true;
    } else if (response) {
      if (response.errorMessages?.length == 0) {
        toastify(response.successMessage, "error");
      } else {
        response.errorMessages?.map((val: string) => toastify(val, "error"));
      }
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
          {isLoading || !model ? (
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
                              <InputText
                                label="Financial Period Number"
                                onChange={(value) =>
                                  updateModel(
                                    setModel,
                                    "financialPeriodNumber",
                                    value
                                  )
                                }
                                disabled={true}
                                value={model?.financialPeriodNumber ?? ""}
                                error={!!errors.financialPeriodNumber}
                                helperText={errors.financialPeriodNumber}
                              />
                            </div>
                            <div className="col col-md-6">
                              <InputText
                                label="Entry Number"
                                onChange={(value) =>
                                  updateModel(setModel, "entryNumber", value)
                                }
                                value={model?.entryNumber ?? ""}
                                error={!!errors.entryNumber}
                                helperText={errors.entryNumber}
                                disabled={true}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col col-md-12">
                          <InputText
                            label="Document Number"
                            value={model?.documentNumber ?? ""}
                            onChange={(value) =>
                              updateModel(setModel, "documentNumber", value)
                            }
                            disabled={formType === FormTypes.Details}
                            error={!!errors.documentNumber}
                            helperText={errors.documentNumber}
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col col-md-8">
                          <InputAutoComplete
                            size={"small"}
                            error={!!errors.currencyId}
                            helperText={errors.currencyId}
                            options={currencies?.map(
                              (item: { name: string; id: string }) => ({
                                ...item,
                                label: item.name,
                                value: item.id,
                              })
                            )}
                            label={"Currency"}
                            value={model?.currencyId}
                            disabled={formType === FormTypes.Details}
                            onChange={(value: any) =>
                              updateModel(setModel, "currencyId", value)
                            }
                            multiple={false}
                            name={"Currencies"}
                            handleBlur={null}
                            defaultSelect={true}
                            defaultSelectCondition={(value: CurrencyModel) =>
                              value.isDefault == true
                            }
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
                            onChange={(event: { target: { value: string } }) =>
                              updateModel(
                                setModel,
                                "exchangeRate",
                                Number.parseFloat(event.target.value || "0")
                              )
                            }
                            error={!!errors.exchangeRate}
                            helperText={errors.exchangeRate}
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col col-md-12">
                          <InputText
                            label="Receiver Name"
                            value={model?.receiverName ?? ""}
                            onChange={(value) =>
                              updateModel(setModel, "receiverName", value)
                            }
                            disabled={formType === FormTypes.Details}
                            error={!!errors.receiverName}
                            helperText={errors.receiverName}
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col col-md-12">
                          <InputDateTimePicker
                            label="Entry Date"
                            type="datetime"
                            value={model?.entryDate ?? null}
                            onChange={(value) => {
                              updateModel(setModel, "entryDate", value);
                            }}
                            disabled={false}
                            slotProps={{
                              textField: {
                                error: !!errors.entryDate,
                                helperText: errors.entryDate,
                              },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col col-md-6">
                      <div className="row mb-2">
                        <div className="col col-md-12">
                          <InputAutoComplete
                            size={"small"}
                            error={!!errors.branchId}
                            helperText={errors.branchId}
                            options={branches?.map(
                              (item: { name: string; id: string }) => ({
                                ...item,
                                label: item.name,
                                value: item.id,
                              })
                            )}
                            label={"Branch"}
                            value={model?.branchId}
                            disabled={formType === FormTypes.Details}
                            onChange={(value: any) =>
                              updateModel(setModel, "branchId", value)
                            }
                            multiple={false}
                            name={"Branches"}
                            handleBlur={null}
                            defaultSelect={true}
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col col-md-12">
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label="Financial Collector"
                            variant="outlined"
                            fullWidth
                            size="small"
                            disabled={formType === FormTypes.Details}
                            value={""}
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
                            onChange={(event: { target: { value: string } }) =>
                              updateModel(
                                setModel,
                                "currencyId",
                                event.target.value
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
                            disabled={formType == FormTypes.Details}
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

                  {!isLoading &&
                    model.financialTransactions &&
                    model.financialTransactions
                      .sort((a, b) => a.orderNumber - b.orderNumber)
                      .map((e, idx) => (
                        <div className="card card-body mb-2" key={e.id}>
                          <div className="row mb-2">
                            <div className="col col-md-6">
                              <div className="row mb-2">
                                {!e.isPaymentTransaction && (
                                  <div className="col col-md-5">
                                    <InputAutoComplete
                                      size={"small"}
                                      options={chartOfAccounts.map(
                                        (item: {
                                          id: string;
                                          code: string;
                                        }) => ({
                                          label: item.code,
                                          value: item.id,
                                        })
                                      )}
                                      label={"Debt Account"}
                                      value={e.debitAccountId}
                                      disabled={formType === FormTypes.Details}
                                      onChange={(value: string | undefined) => {
                                        console.log("value", value);
                                        updateModel(
                                          setModel,
                                          "financialTransactions",
                                          { debitAccountId: value },
                                          idx
                                        );
                                      }}
                                      defaultSelect={false}
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
                                )}
                                <div
                                  className={`col ${
                                    e.isPaymentTransaction
                                      ? "col-md-12"
                                      : "col-md-7"
                                  }`}
                                >
                                  <InputAutoComplete
                                    size={"small"}
                                    options={(!e.isPaymentTransaction
                                      ? chartOfAccounts
                                      : getChartOfAccountsDropDown(
                                          e.paymentType
                                        )
                                    ).map(
                                      (item: {
                                        id: string;
                                        name: string;
                                        nameSecondLanguage: string;
                                      }) => ({
                                        label: `${item.name} || ${item.nameSecondLanguage}`,
                                        value: item.id,
                                      })
                                    )}
                                    label={"Debt Account"}
                                    value={e.debitAccountId}
                                    disabled={formType === FormTypes.Details}
                                    onChange={(value: string | undefined) => {
                                      console.log("value", value);
                                      updateModel(
                                        setModel,
                                        "financialTransactions",
                                        { debitAccountId: value },
                                        idx
                                      );
                                    }}
                                    defaultSelect={e.isPaymentTransaction}
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
                              </div>
                            </div>
                            <div className="col col-md-6">
                              <div className="row mb-2">
                                {e.isPaymentTransaction && (
                                  <div className="col col-md-5">
                                    <InputAutoComplete
                                      size={"small"}
                                      options={chartOfAccounts.map(
                                        (item: {
                                          id: string;
                                          code: string;
                                        }) => ({
                                          label: item.code,
                                          value: item.id,
                                        })
                                      )}
                                      label={"Credit Account"}
                                      value={e.creditAccountId}
                                      disabled={formType === FormTypes.Details}
                                      onChange={(value: string | undefined) => {
                                        console.log("value", value);
                                        updateModel(
                                          setModel,
                                          "financialTransactions",
                                          { creditAccountId: value },
                                          idx
                                        );
                                      }}
                                      defaultSelect={false}
                                      multiple={false}
                                      name={"CreditAccount"}
                                      handleBlur={null}
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
                                    />
                                  </div>
                                )}
                                <div
                                  className={`col ${
                                    !e.isPaymentTransaction
                                      ? "col-md-12"
                                      : "col-md-7"
                                  }`}
                                >
                                  <InputAutoComplete
                                    size={"small"}
                                    options={(e.isPaymentTransaction
                                      ? chartOfAccounts
                                      : getChartOfAccountsDropDown(
                                          e.paymentType
                                        )
                                    ).map(
                                      (item: {
                                        id: string;
                                        name: string;
                                        nameSecondLanguage: string;
                                      }) => ({
                                        label: `${item.name} || ${item.nameSecondLanguage}`,
                                        value: item.id,
                                      })
                                    )}
                                    label={"Credit Account"}
                                    value={e.creditAccountId}
                                    disabled={formType === FormTypes.Details}
                                    onChange={(value: string | undefined) => {
                                      console.log("value", value);
                                      updateModel(
                                        setModel,
                                        "financialTransactions",
                                        { creditAccountId: value },
                                        idx
                                      );
                                    }}
                                    defaultSelect={!e.isPaymentTransaction}
                                    multiple={false}
                                    name={"DebtAccount"}
                                    handleBlur={null}
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
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col col-md-6">
                              <div className="row mb-2">
                                <div className="col col-md-6">
                                  <InputSelect
                                    options={PaymentTypeOptions}
                                    label={"Payment Type"}
                                    defaultValue={e?.paymentType}
                                    disabled={formType !== FormTypes.Add}
                                    multiple={false}
                                    onChange={({
                                      target,
                                    }: {
                                      target: { value: PaymentType };
                                    }) => {
                                      updateModel(
                                        setModel,
                                        "financialTransactions",
                                        { paymentType: target.value },
                                        idx
                                      );
                                    }}
                                    name={"paymentType"}
                                    onBlur={undefined}
                                    error={!!errors.paymentType}
                                    // helperText={!!errors.costCenterType}
                                  />
                                </div>
                                <div className="col col-md-6">
                                  <TextField
                                    type="number"
                                    className="form-input form-control"
                                    label="Amount"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    disabled={formType === FormTypes.Details}
                                    value={e?.amount}
                                    onChange={(event: {
                                      target: { value: string };
                                    }) =>
                                      updateModel(
                                        setModel,
                                        "financialTransactions",
                                        { amount: event.target.value },
                                        idx
                                      )
                                    }
                                    error={
                                      !!errors[
                                        `financialTransactions[${idx}].amount`
                                      ]
                                    }
                                    helperText={
                                      errors[
                                        `financialTransactions[${idx}].amount`
                                      ]
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            {e.paymentType == PaymentType.Cash && (
                              <div className="col col-md-6">
                                <div className="row mb-2">
                                  <div className="col col-md-6">
                                    <InputAutoComplete
                                      size={"small"}
                                      error={
                                        !!errors[
                                          `financialTransactions[${idx}].collectionBookId`
                                        ]
                                      }
                                      helperText={
                                        errors[
                                          `financialTransactions[${idx}].collectionBookId`
                                        ]
                                      }
                                      options={collectionBooks?.map(
                                        (item: {
                                          name: string;
                                          id: string;
                                          nameSecondLanguage: string;
                                        }) => ({
                                          label: `${item.name} || ${item.nameSecondLanguage}`,
                                          value: item.id,
                                        })
                                      )}
                                      label={"Collection Book"}
                                      disabled={formType === FormTypes.Details}
                                      onChange={(value: string | undefined) => {
                                        console.log("value:", value);
                                        updateModel(
                                          setModel,
                                          "financialTransactions",
                                          { collectionBookId: value },
                                          idx
                                        );
                                      }}
                                      defaultSelect={false}
                                      value={e.collectionBookId}
                                      multiple={false}
                                      name={"CollectionBookId"}
                                      handleBlur={null}
                                    />
                                  </div>
                                  <div className="col col-md-6">
                                    <InputText
                                      type="text"
                                      className="form-input form-control"
                                      label="Agent Name"
                                      variant="outlined"
                                      fullWidth
                                      size="small"
                                      disabled={formType === FormTypes.Details}
                                      value={e.cashAgentName}
                                      onChange={ (value: string 
                                      ) =>
                                        updateModel(
                                          setModel,
                                          "financialTransactions",
                                          { cashAgentName: value },
                                          idx
                                        )
                                      }
                                      error={
                                        !!errors[
                                          `financialTransactions[${idx}].cashAgentName`
                                        ]
                                      }
                                      helperText={
                                        errors[
                                          `financialTransactions[${idx}].cashAgentName`
                                        ]
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                            {e.paymentType == PaymentType.Cheque && (
                              <div className="col col-md-6">
                                <div className="row mb-2">
                                  <div className="col col-md-6">
                                    <InputAutoComplete
                                      size={"small"}
                                      error={
                                        !!errors[
                                          `financialTransactions[${idx}].chequeBankId`
                                        ]
                                      }
                                      helperText={
                                        errors[
                                          `financialTransactions[${idx}].chequeBankId`
                                        ]
                                      }
                                      options={chartOfAccounts
                                        ?.filter(
                                          (e) =>
                                            e.subLeadgerType ==
                                            SubLeadgerType.Bank
                                        )
                                        .map(
                                          (item: {
                                            name: string;
                                            id: string;
                                            nameSecondLanguage: string;
                                          }) => ({
                                            label: `${item.name} || ${item.nameSecondLanguage}`,
                                            value: item.id,
                                          })
                                        )}
                                      label={"Bank"}
                                      disabled={formType === FormTypes.Details}
                                      onChange={(value: string | undefined) => {
                                        console.log("value:", value);
                                        updateModel(
                                          setModel,
                                          "financialTransactions",
                                          { chequeBankId: value },
                                          idx
                                        );
                                      }}
                                      defaultSelect={false}
                                      value={e.chequeBankId}
                                      multiple={false}
                                      name={"CreditAccount"}
                                      handleBlur={null}
                                    />
                                  </div>
                                  <div className="col col-md-6">
                                    <InputText
                                      type="text"
                                      className="form-input form-control"
                                      label="Cheque Number"
                                      variant="outlined"
                                      fullWidth
                                      size="small"
                                      disabled={formType === FormTypes.Details}
                                      value={e.chequeNumber}
                                      onChange={(value: string) =>
                                        updateModel(
                                          setModel,
                                          "financialTransactions",
                                          { chequeNumber: value },
                                          idx
                                        )
                                      }
                                      error={
                                        !!errors[
                                          `financialTransactions[${idx}].chequeNumber`
                                        ]
                                      }
                                      helperText={
                                        errors[
                                          `financialTransactions[${idx}].chequeNumber`
                                        ]
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                            {e.paymentType == PaymentType.Promissory && (
                              <div className="col col-md-6">
                                <div className="row mb-2">
                                  <div className="col col-md-6">
                                    <InputText
                                      type="text"
                                      className="form-input form-control"
                                      label="Name"
                                      variant="outlined"
                                      fullWidth
                                      size="small"
                                      disabled={formType === FormTypes.Details}
                                      value={e.promissoryName}
                                      onChange={(value: string ) =>
                                        updateModel(
                                          setModel,
                                          "financialTransactions",
                                          {
                                            promissoryName: value,
                                          },
                                          idx
                                        )
                                      }
                                      error={
                                        !!errors[
                                          `financialTransactions[${idx}].promissoryName`
                                        ]
                                      }
                                      helperText={
                                        errors[
                                          `financialTransactions[${idx}].promissoryName`
                                        ]
                                      }
                                    />
                                  </div>
                                  <div className="col col-md-6">
                                    <InputText
                                      type="text"
                                      className="form-input form-control"
                                      label="Number"
                                      variant="outlined"
                                      fullWidth
                                      size="small"
                                      disabled={formType === FormTypes.Details}
                                      value={e.promissoryNumber}
                                      onChange={(value: string 
                                      ) =>
                                        updateModel(
                                          setModel,
                                          "financialTransactions",
                                          {
                                            promissoryNumber:
                                              value,
                                          },
                                          idx
                                        )
                                      }
                                      error={
                                        !!errors[
                                          `financialTransactions[${idx}].promissoryNumber`
                                        ]
                                      }
                                      helperText={
                                        errors[
                                          `financialTransactions[${idx}].promissoryNumber`
                                        ]
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                            {(e.paymentType == PaymentType.WireTransfer ||
                              e.paymentType == PaymentType.Atm) && (
                              <div className="col col-md-6">
                                <InputText
                                  type="text"
                                  className="form-input form-control"
                                  label="Reference Number"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={formType === FormTypes.Details}
                                  value={e.wireTransferReferenceNumber}
                                  onChange={(value: string) =>
                                    updateModel(
                                      setModel,
                                      "financialTransactions",
                                      {
                                        wireTransferReferenceNumber:
                                          value,
                                      },
                                      idx
                                    )
                                  }
                                  error={
                                    !!errors[
                                      `financialTransactions[${idx}].wireTransferReferenceNumber`
                                    ]
                                  }
                                  helperText={
                                    errors[
                                      `financialTransactions[${idx}].wireTransferReferenceNumber`
                                    ]
                                  }
                                />
                              </div>
                            )}
                            {e.paymentType == PaymentType.CreditCard && (
                              <div className="col col-md-6">
                                <InputText
                                  type="text"
                                  className="form-input form-control"
                                  label="Last 4 digits"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={formType === FormTypes.Details}
                                  value={e.creditCardLastDigits}
                                  onChange={(value: string) =>
                                    updateModel(
                                      setModel,
                                      "financialTransactions",
                                      {
                                        creditCardLastDigits:
                                          value,
                                      },
                                      idx
                                    )
                                  }
                                  error={
                                    !!errors[
                                      `financialTransactions[${idx}].creditCardLastDigits`
                                    ]
                                  }
                                  helperText={
                                    errors[
                                      `financialTransactions[${idx}].creditCardLastDigits`
                                    ]
                                  }
                                />
                              </div>
                            )}
                          </div>
                          {e.paymentType == PaymentType.Cash && (
                            <div className="row">
                              <div className="col col-md-3">
                                <TextField
                                  type="text"
                                  className="form-input form-control"
                                  label="Number"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={formType === FormTypes.Details}
                                  value={e.cashPhoneNumber}
                                  onChange={(event: {
                                    target: { value: string };
                                  }) =>
                                    updateModel(
                                      setModel,
                                      "financialTransactions",
                                      {
                                        cashPhoneNumber: event.target.value,
                                      },
                                      idx
                                    )
                                  }
                                  error={
                                    !!errors[
                                      `financialTransactions[${idx}].cashPhoneNumber`
                                    ]
                                  }
                                  helperText={
                                    errors[
                                      `financialTransactions[${idx}].cashPhoneNumber`
                                    ]
                                  }
                                />
                              </div>
                            </div>
                          )}
                          {e.paymentType == PaymentType.Cheque && (
                            <div className="row">
                              <div className="col col-md-6">
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DemoContainer
                                    components={[
                                      "DateTimePicker",
                                      "DateTimePicker",
                                    ]}
                                  >
                                    <DateTimePicker
                                      label="Cheque Issue Date"
                                      viewRenderers={{
                                        hours: renderTimeViewClock,
                                        minutes: renderTimeViewClock,
                                        seconds: renderTimeViewClock,
                                      }}
                                      value={
                                        e?.chequeIssueDate
                                          ? dayjs(e.chequeIssueDate)
                                          : null
                                      }
                                      onChange={(value) => {
                                        updateModel(
                                          setModel,
                                          "financialTransactions",
                                          {
                                            chequeIssueDate: value?.toDate(),
                                          },
                                          idx
                                        );
                                      }}
                                      slotProps={{
                                        textField: {
                                          error:
                                            !!errors[
                                              `financialTransactions[${idx}].chequeIssueDate`
                                            ],
                                          helperText:
                                            errors[
                                              `financialTransactions[${idx}].chequeIssueDate`
                                            ],
                                        },
                                      }}
                                    />
                                  </DemoContainer>
                                </LocalizationProvider>
                              </div>
                              <div className="col col-md-6">
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DemoContainer
                                    components={[
                                      "DateTimePicker",
                                      "DateTimePicker",
                                    ]}
                                  >
                                    <DateTimePicker
                                      label="Cheque Collection Date"
                                      viewRenderers={{
                                        hours: renderTimeViewClock,
                                        minutes: renderTimeViewClock,
                                        seconds: renderTimeViewClock,
                                      }}
                                      value={
                                        e?.chequeCollectionDate
                                          ? dayjs(e.chequeCollectionDate)
                                          : null
                                      }
                                      onChange={(value) => {
                                        updateModel(
                                          setModel,
                                          "financialTransactions",
                                          {
                                            chequeCollectionDate:
                                              value?.toDate(),
                                          },
                                          idx
                                        );
                                      }}
                                      slotProps={{
                                        textField: {
                                          error:
                                            !!errors[
                                              `financialTransactions[${idx}].chequeCollectionDate`
                                            ],
                                          helperText:
                                            errors[
                                              `financialTransactions[${idx}].chequeCollectionDate`
                                            ],
                                        },
                                      }}
                                    />
                                  </DemoContainer>
                                </LocalizationProvider>
                              </div>
                            </div>
                          )}
                          {e.paymentType == PaymentType.Promissory && (
                            <div className="row">
                              <div className="col col-md-6">
                                <TextField
                                  type="text"
                                  className="form-input form-control"
                                  label="Identification Number"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={formType === FormTypes.Details}
                                  value={e.promissoryIdentityCard}
                                  onChange={(event: {
                                    target: { value: string };
                                  }) =>
                                    updateModel(
                                      setModel,
                                      "financialTransactions",
                                      {
                                        promissoryIdentityCard:
                                          event.target.value,
                                      },
                                      idx
                                    )
                                  }
                                  error={
                                    !!errors[
                                      `financialTransactions[${idx}].promissoryIdentityCard`
                                    ]
                                  }
                                  helperText={
                                    errors[
                                      `financialTransactions[${idx}].promissoryIdentityCard`
                                    ]
                                  }
                                />
                              </div>
                              <div className="col col-md-6">
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DemoContainer
                                    components={[
                                      "DateTimePicker",
                                      "DateTimePicker",
                                    ]}
                                  >
                                    <DateTimePicker
                                      label="Promissory Collection Date"
                                      viewRenderers={{
                                        hours: renderTimeViewClock,
                                        minutes: renderTimeViewClock,
                                        seconds: renderTimeViewClock,
                                      }}
                                      value={
                                        e?.promissoryCollectionDate
                                          ? dayjs(e.promissoryCollectionDate)
                                          : null
                                      }
                                      onChange={(value) => {
                                        updateModel(
                                          setModel,
                                          "financialTransactions",
                                          {
                                            promissoryCollectionDate:
                                              value?.toDate(),
                                          },
                                          idx
                                        );
                                      }}
                                      slotProps={{
                                        textField: {
                                          error:
                                            !!errors[
                                              `financialTransactions[${idx}].promissoryCollectionDate`
                                            ],
                                          helperText:
                                            errors[
                                              `financialTransactions[${idx}].promissoryCollectionDate`
                                            ],
                                        },
                                      }}
                                    />
                                  </DemoContainer>
                                </LocalizationProvider>
                              </div>
                            </div>
                          )}
                          {model.financialTransactions.length > 1 && (
                            <div>
                              <IconButton
                                onClick={() => removetransaction(e.id)}
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

export default ReceiptVouchersForm;