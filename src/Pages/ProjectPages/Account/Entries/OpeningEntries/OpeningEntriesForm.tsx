/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import BaseForm from "../../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import { IconButton, TextareaAutosize, TextField } from "@mui/material";
import { toastify } from "../../../../../Helper/toastify";
import yup from "yup";
import { AccountNature } from "../../../../../interfaces/ProjectInterfaces/Account/ChartOfAccount/AccountNature";
import InputFile from "../../../../../Components/Inputs/InputFile";
import AttachmentModel from "../../../../../interfaces/BaseModels/AttachmentModel";
import InputAutoComplete from "../../../../../Components/Inputs/InputAutoCompelete";
import { Add, Delete } from "@mui/icons-material";
import { EntrySchema } from "../../../../../interfaces/ProjectInterfaces/Account/Entries/entry-validation";
import { useGetCurrenciesQuery } from "../../../../../Apis/Account/CurrenciesApi";
import CurrencyModel from "../../../../../interfaces/ProjectInterfaces/Account/Currencies/CurrencyModel";
import BranchModel from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Branches/BranchModel";
import { useGetBranchesQuery } from "../../../../../Apis/Account/BranchesApi";
import updateModel from "../../../../../Helper/updateModelHelper";
import { NodeType } from "../../../../../interfaces/Components/NodeType";
import { ChartOfAccountModel } from "../../../../../interfaces/ProjectInterfaces";
import { httpGet } from "../../../../../Apis/Axios/axiosMethods";
import EntryNumber from "../../../../../interfaces/ProjectInterfaces/Account/Entries/EntryNumber";
import { v4 as uuid } from "uuid";
import { PaymentType } from "../../../../../interfaces/ProjectInterfaces/Account/Entries/PaymentType";
import { SubLeadgerType } from "../../../../../interfaces/ProjectInterfaces/Account/ChartOfAccount/SubLeadgerType";
import FinancialTransactionModel from "../../../../../interfaces/ProjectInterfaces/Account/Entries/FinancialTransaction";
import EntryModel from "../../../../../interfaces/ProjectInterfaces/Account/Entries/Entry";
import { getChartOfAccounts } from "../../../../../Apis/Account/ChartOfAccountsApi";
import InputDateTimePicker from "../../../../../Components/Inputs/InputDateTime";
import {
  createOpeningEntry,
  deleteOpeningEntry,
  getOpeningEntryById,
  updateOpeningEntry,
} from "../../../../../Apis/Account/OpeningEntriesApi";
import InputNumber from "../../../../../Components/Inputs/InputNumber";
const OpeningEntriesForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  afterAction: () => void;
}> = ({ formType, id, handleCloseForm, afterAction }) => {
  const url = "openingEntries";
  // const entryResult = useGetEntryByIdQuery(id, {
  //   skip: formType == FormTypes.Add,
  // });
  const currenciesApiResult = useGetCurrenciesQuery({
    skip: formType == FormTypes.Delete,
  });

  const branchesApiResult = useGetBranchesQuery({
    skip: formType == FormTypes.Delete,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  // const [updateEntry] = useUpdateEntryMutation();
  // const [createEntry] = useCreateEntryMutation();
  // const [deleteEntry] = useDeleteEntryMutation();
  const [isLoading, setIsLoading] = useState<boolean>(
    formType != FormTypes.Add
  );
  const [currencies, setCurrencies] = useState<CurrencyModel[]>([]);
  const [branches, setBranches] = useState<BranchModel[]>([]);
  const [transactionNumber, setTransactionNumber] = useState<number>(1);
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccountModel[]>(
    []
  );

  const createFinancialTransaction: (
    accountnature: AccountNature
  ) => FinancialTransactionModel = (accountnature: AccountNature) => {
    const transaction: FinancialTransactionModel = {
      id: uuid(),
      chartOfAccountId: "",
      accountNature: accountnature,
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
      paymentType: PaymentType.None,
      isPaymentTransaction: true,
      atmTransferReferenceNumber: null,
      cashAgentName: null,
      cashPhoneNumber: null,
      collectionBookId: null,
    };
    if (transactionNumber == 1) setTransactionNumber((prev) => prev + 1);
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
    financialTransactions:
      formType == FormTypes.Add
        ? [
            createFinancialTransaction(AccountNature.Debit),
            createFinancialTransaction(AccountNature.Credit),
          ]
        : [],
    attachments: [],
    financialPeriodNumber: "",
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
  }, [model.entryDate,formType]);

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

  const changeExchangeRate = (currencyId: string) => {
    const currency = currencies.find((e) => e.id == currencyId);
    console.log(currency);
    setModel((prev) =>
      prev
        ? { ...prev, exchangeRate: currency ? currency.exchangeRate : 0 }
        : prev
    );
  };

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

  const onAddFinancialTrancastion = (accountNature: AccountNature) => {
    setModel((prevModel) => ({
      ...prevModel,
      financialTransactions: [
        ...prevModel.financialTransactions,
        createFinancialTransaction(accountNature),
      ],
    }));
    setTransactionNumber((prev) => {
      console.log(prev);
      return prev + 1;
    });
  };
  useEffect(() => {
    if (formType !== FormTypes.Add ) {
      const fetchData = async () => {
        const result = await getOpeningEntryById(id);
        if (result) {
          setModel(result.result);
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [formType,id]);

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
    const response = await deleteOpeningEntry(id);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      afterAction();
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
    const response = await updateOpeningEntry(model.id,model);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      afterAction();
      return true;
    } else if (response) {
      if (response.errorMessages?.length == 0) {
        toastify(response.successMessage, "error");
      }
      else {
        response.errorMessages?.map((val:  string) =>
          toastify(val, "error")
        );
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
    // if ((await validate()) === false) return false;
    SortFinancialTransactions();
    console.log("send");
    const response= await createOpeningEntry(model);
    console.log(response);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      afterAction();
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
  const getTransactionIndexById: (id: string) => number = (id: string) =>
    model.financialTransactions.findIndex((item) => item.id == id);
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
                            value={model?.documentNumber}
                            onChange={(event: { target: { value: string } }) =>
                              updateModel(
                                setModel,
                                "documentNumber",
                                event.target.value
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
                            onChange={(value: any) => {
                              updateModel(setModel, "currencyId", value);
                              changeExchangeRate(value);
                            }}
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
                          <InputNumber
                            className="form-input form-control"
                            label="Exchange Rate (required)"
                            variant="outlined"
                            fullWidth
                            size="small"
                            disabled={formType === FormTypes.Details}
                            value={model?.exchangeRate}
                            onChange={( value: number) =>
                              updateModel(
                                setModel,
                                "exchangeRate",
                                value
                              )
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
                            value={model?.receiverName}
                            onChange={(event: { target: { value: string } }) =>
                              updateModel(
                                setModel,
                                "receiverName",
                                event.target.value
                              )
                            }
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
                            disabled={formType === FormTypes.Details}
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

                  <div className="row">
                    <div className="col col-md-6">
                      {!isLoading &&
                        model.financialTransactions &&
                        model.financialTransactions
                          .filter((e) => e.accountNature == AccountNature.Debit)
                          .sort((a, b) => a.orderNumber - b.orderNumber)
                          .map((e) => (
                            <div className="card card-body mb-2" key={e.id}>
                              <div className="row mb-2">
                                <div className={`col ${"col-md-6"}`}>
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
                                    label={"Debit Account"}
                                    value={e.chartOfAccountId}
                                    disabled={formType === FormTypes.Details}
                                    onChange={(value: string | undefined) => {
                                      console.log("value", value);
                                      updateModel(
                                        setModel,
                                        "financialTransactions",
                                        { chartOfAccountId: value },
                                        getTransactionIndexById(e.id)
                                      );
                                    }}
                                    defaultSelect={!e.isPaymentTransaction}
                                    multiple={false}
                                    name={"DebtAccount"}
                                    handleBlur={null}
                                    error={
                                      !!errors[
                                        `financialTransactions[${getTransactionIndexById(
                                          e.id
                                        )}].chartOfAccountId`
                                      ]
                                    }
                                    helperText={
                                      errors[
                                        `financialTransactions[${getTransactionIndexById(
                                          e.id
                                        )}].chartOfAccountId`
                                      ]
                                    }
                                  />
                                </div>
                                <div className="col col-md-4">
                                  <InputNumber
                                    className="form-input form-control"
                                    label="Amount"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    disabled={formType === FormTypes.Details}
                                    value={e?.amount}
                                    onChange={(value: number) =>
                                      updateModel(
                                        setModel,
                                        "financialTransactions",
                                        { amount: value },
                                        getTransactionIndexById(e.id)
                                      )
                                    }
                                    error={
                                      !!errors[
                                        `financialTransactions[${getTransactionIndexById(
                                          e.id
                                        )}].amount`
                                      ]
                                    }
                                    helperText={
                                      errors[
                                        `financialTransactions[${getTransactionIndexById(
                                          e.id
                                        )}].amount`
                                      ]
                                    }
                                  />
                                </div>
                                <div className="col col-md-2">
                                  {model.financialTransactions.filter(
                                    (e) =>
                                      e.accountNature == AccountNature.Debit
                                  ).length > 1 &&
                                    formType !== FormTypes.Details && (
                                      <div>
                                        <IconButton
                                          onClick={() =>
                                            removetransaction(e.id)
                                          }
                                        >
                                          <Delete />
                                        </IconButton>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          ))}
                      <div>
                        {formType !== FormTypes.Details && (
                          <IconButton
                            onClick={() =>
                              onAddFinancialTrancastion(AccountNature.Debit)
                            }
                          >
                            <Add />
                          </IconButton>
                        )}
                      </div>
                    </div>
                    <div className="col col-md-6">
                      {!isLoading &&
                        model.financialTransactions &&
                        model.financialTransactions
                          .filter(
                            (e) => e.accountNature == AccountNature.Credit
                          )
                          .sort((a, b) => a.orderNumber - b.orderNumber)
                          .map((e) => (
                            <div className="card card-body mb-2" key={e.id}>
                              <div className="row mb-2">
                                <div className={`col ${"col-md-6"}`}>
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
                                    value={e.chartOfAccountId}
                                    disabled={formType === FormTypes.Details}
                                    onChange={(value: string | undefined) => {
                                      console.log("value", value);
                                      updateModel(
                                        setModel,
                                        "financialTransactions",
                                        { chartOfAccountId: value },
                                        getTransactionIndexById(e.id)
                                      );
                                    }}
                                    defaultSelect={!e.isPaymentTransaction}
                                    multiple={false}
                                    name={"DebtAccount"}
                                    handleBlur={null}
                                    error={
                                      !!errors[
                                        `financialTransactions[${getTransactionIndexById(
                                          e.id
                                        )}].chartOfAccountId`
                                      ]
                                    }
                                    helperText={
                                      errors[
                                        `financialTransactions[${getTransactionIndexById(
                                          e.id
                                        )}].chartOfAccountId`
                                      ]
                                    }
                                  />
                                </div>
                                <div className="col col-md-4">
                                  <InputNumber
                                    className="form-input form-control"
                                    label="Amount"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    disabled={formType === FormTypes.Details}
                                    value={e?.amount}
                                    onChange={(value: number) =>
                                      updateModel(
                                        setModel,
                                        "financialTransactions",
                                        { amount: value },
                                        getTransactionIndexById(e.id)
                                      )
                                    }
                                    error={
                                      !!errors[
                                        `financialTransactions[${getTransactionIndexById(
                                          e.id
                                        )}].amount`
                                      ]
                                    }
                                    helperText={
                                      errors[
                                        `financialTransactions[${getTransactionIndexById(
                                          e.id
                                        )}].amount`
                                      ]
                                    }
                                  />
                                </div>
                                <div className="col col-md-2">
                                  {model.financialTransactions.filter(
                                    (e) =>
                                      e.accountNature == AccountNature.Credit
                                  ).length > 1 &&
                                    formType !== FormTypes.Details && (
                                      <div>
                                        <IconButton
                                          onClick={() =>
                                            removetransaction(e.id)
                                          }
                                        >
                                          <Delete />
                                        </IconButton>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          ))}
                      <div>
                        {formType !== FormTypes.Details && (
                          <IconButton
                            onClick={() =>
                              onAddFinancialTrancastion(AccountNature.Credit)
                            }
                          >
                            <Add />
                          </IconButton>
                        )}
                      </div>
                    </div>
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

export default OpeningEntriesForm;
