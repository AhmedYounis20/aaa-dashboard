/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseForm from "../../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import { IconButton, TextareaAutosize } from "@mui/material";
import { toastify } from "../../../../../Helper/toastify";
import ComplexFinancialTransactionModel from "../../../../../interfaces/ProjectInterfaces/Account/Entries/ComplexFinancialTransaction";
import { AccountNature } from "../../../../../interfaces/ProjectInterfaces/Account/ChartOfAccount/AccountNature";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import InputFile from "../../../../../Components/Inputs/InputFile";
import AttachmentModel from "../../../../../interfaces/BaseModels/AttachmentModel";
import InputAutoComplete from "../../../../../Components/Inputs/InputAutoCompelete";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { Add, Delete } from "@mui/icons-material";
import { EntrySchema } from "../../../../../interfaces/ProjectInterfaces/Account/Entries/entry-validation";
import CurrencyModel from "../../../../../interfaces/ProjectInterfaces/Account/Currencies/CurrencyModel";
import BranchModel from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Branches/BranchModel";
import { getBranches } from "../../../../../Apis/Account/BranchesApi";
import { getBanks } from "../../../../../Apis/Account/BanksApi";
import updateModel from "../../../../../Helper/updateModelHelper";
import { NodeType } from "../../../../../interfaces/Components/NodeType";
import { getChartOfAccounts } from "../../../../../Apis/Account/ChartOfAccountsApi";
import { getCollectionBooks } from "../../../../../Apis/Account/CollectionBooksApi";
import {
  ChartOfAccountModel,
  CollectionBookModel,
} from "../../../../../interfaces/ProjectInterfaces";
import { httpGet } from "../../../../../Apis/Axios/axiosMethods";
import EntryNumber from "../../../../../interfaces/ProjectInterfaces/Account/Entries/EntryNumber";
import { v4 as uuid } from "uuid";
import {
  PaymentType,
  PaymentTypeOptions,
} from "../../../../../interfaces/ProjectInterfaces/Account/Entries/PaymentType";
import { SubLeadgerType } from "../../../../../interfaces/ProjectInterfaces/Account/ChartOfAccount/SubLeadgerType";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import ComplexEntryModel from "../../../../../interfaces/ProjectInterfaces/Account/Entries/ComplexEntry";
import InputDateTimePicker from "../../../../../Components/Inputs/InputDateTime";
import InputText from "../../../../../Components/Inputs/InputText";
import EntryCostCentersComponent from "../Components/EntryCostCentersComponent";
import { CostCenterModel } from "../../../../../interfaces/ProjectInterfaces/Account/CostCenters/costCenterModel";
import { getCostCenters } from "../../../../../Apis/Account/CostCenterApi";
import EntryCostCenter from "../../../../../interfaces/ProjectInterfaces/Account/Entries/EntryCostCenter";
import {
  createCompinedEntry,
  deleteCompinedEntry,
  getCompinedEntryById,
  updateCompinedEntry,
} from "../../../../../Apis/Account/CompinedEntriesApi";
import InputNumber from "../../../../../Components/Inputs/InputNumber";
import BankModel from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Banks/BankModel";
import { getCurrencies } from '../../../../../Apis/Account/CurrenciesApi';

const CompinedEntriesForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  afterAction: () => void;
}> = ({ formType, id, handleCloseForm, afterAction }) => {
const { t } = useTranslation();
  const url = "entries";

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
  const [costCenters, setCostCenters] = useState<CostCenterModel[]>([]);
  const [banks, setBanks] = useState<BankModel[]>([]);

  const [collectionBooks, setCollectionBooks] = useState<CollectionBookModel[]>(
    []
  );

  // Fetch branches and collection books
  useEffect(() => {
    if (formType !== FormTypes.Delete) {
      const fetchData = async () => {
        // Fetch currencies
        const currenciesResponse = await getCurrencies();
        if (currenciesResponse?.result) {
          setCurrencies(currenciesResponse.result);
        }
        try {
          const branchesResponse = await getBranches();
          if (branchesResponse?.result) {
            setBranches(
              branchesResponse.result.filter(
                (e: BranchModel) => e.nodeType == NodeType.Domain
              )
            );
          }

          const banksResponse = await getBanks();
          if (banksResponse?.result) {
            setBanks(banksResponse.result);
          }

          const collectionBooksResponse = await getCollectionBooks();
          if (collectionBooksResponse?.result) {
            setCollectionBooks(collectionBooksResponse.result);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [formType]);

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
        isPaymentTransaction: true,
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
    costCenters: [],
  });

  //#region listeners
  useEffect(() => {
    if (formType != FormTypes.Delete) {
      const fetchData = async () => {
        const result = await getChartOfAccounts();
        if (result) {
          setChartOfAccounts(result.result);
        }
        const costcenterResult = await getCostCenters();
        if (costcenterResult.isSuccess) {
          setCostCenters(costcenterResult.result);
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
  }, [model.entryDate, formType]);

  useEffect(() => {
    if (formType !== FormTypes.Add) {
      const fetchData = async () => {
        setIsLoading(true);
        const result = await getCompinedEntryById(id);
        if (result && result.result) {
          setModel({ ...result.result });
          setTransactionNumber(
            result.result.financialTransactions.findLast(
              (e: ComplexFinancialTransactionModel) => e.orderNumber != null
            )?.orderNumber ?? 1
          );
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [formType, id]);
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
    if (paymentType == PaymentType.None) return chartOfAccounts;
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

  const validate = async () => {
    try {
      await EntrySchema.validate(model, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const validationErrorsMap: Record<string, string> = {};
      (validationErrors as any).inner.forEach((error: any) => {
        if (error.path) validationErrorsMap[error.path] = error.message;
      });
      setErrors(validationErrorsMap);
      return false;
    }
  };

  const handleAdd = async () => {
    if ((await validate()) === false) return false;
    const response = await createCompinedEntry(model);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      afterAction();
      return true;
    } else if (response && response.errorMessages) {
      response.errorMessages.map((error: string) => toastify(error, 'error'));
      return false;
    }
    return false;
  };

  const handleUpdate = async () => {
    if ((await validate()) === false) return false;
    const response = await updateCompinedEntry(model.id, model);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      afterAction();
      return true;
    } else if (response && response.errorMessages) {
      response.errorMessages.map((error: string) => toastify(error, 'error'));
      return false;
    }
    return false;
  };

  const handleDelete = async (): Promise<boolean> => {
    const response = await deleteCompinedEntry(id);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      afterAction();
      return true;
    } else if (response && response.errorMessages) {
      response.errorMessages.map((error: string) => toastify(error, 'error'));
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
                  {t("AreYouSureDelete")} entry with entry number{" "}
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
                                type="text"
                                className="form-input form-control"
                                label={t("FinancialPeriodNumber")}
                                variant="outlined"
                                fullWidth
                                size="small"
                                disabled={true}
                                value={model?.financialPeriodNumber}
                                error={!!errors.financialPeriodNumber}
                                helperText={errors.financialPeriodNumber ? t(errors.financialPeriodNumber) : undefined}
                              />
                            </div>
                            <div className="col col-md-6">
                              <InputText
                                type="text"
                                size="small"
                                className="form-input form-control"
                                label={t("EntryNumber")}
                                variant="outlined"
                                fullWidth
                                disabled={true}
                                value={model?.entryNumber}
                                error={!!errors.entryNumber}
                                helperText={errors.entryNumber ? t(errors.entryNumber) : undefined}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col col-md-12">
                          <InputText
                            type="text"
                            className="form-input form-control"
                            label={t("DocumentNumber")}
                            variant="outlined"
                            size="small"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.documentNumber}
                            onChange={(value) =>
                              updateModel(setModel, "documentNumber", value)
                            }
                            error={!!errors.documentNumber}
                            helperText={errors.documentNumber ? t(errors.documentNumber) : undefined}
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col col-md-8">
                          <InputAutoComplete
                            size={"small"}
                            error={!!errors.currencyId}
                            helperText={errors.currencyId ? t(errors.currencyId) : undefined}
                            options={currencies?.map(
                              (item: { name: string; id: string }) => ({
                                ...item,
                                label: item.name,
                                value: item.id,
                              })
                            )}
                            label={t("Currency")}
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
                            label={t("ExchangeRateRequired")}
                            variant="outlined"
                            fullWidth
                            size="small"
                            disabled={formType === FormTypes.Details}
                            value={model?.exchangeRate}
                            onChange={(value : number) =>
                              updateModel(
                                setModel,
                                "exchangeRate",
                                value)
                            }
                            error={!!errors.exchangeRate}
                            helperText={errors.exchangeRate ? t(errors.exchangeRate) : undefined}
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col col-md-12">
                          <InputText
                            type="text"
                            className="form-input form-control"
                            label={t("ReceiverName")}
                            variant="outlined"
                            fullWidth
                            size="small"
                            disabled={formType === FormTypes.Details}
                            value={model?.receiverName}
                            onChange={(value) =>
                              updateModel(setModel, "receiverName", value)
                            }
                            error={!!errors.receiverName}
                            helperText={errors.receiverName ? t(errors.receiverName) : undefined}
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col col-md-12">
                          <InputDateTimePicker
                            label={t("EntryDate")}
                            type="datetime"
                            value={model?.entryDate ?? null}
                            onChange={(value) => {
                              updateModel(setModel, "entryDate", value);
                            }}
                            disabled={formType === FormTypes.Details}
                            slotProps={{
                              textField: {
                                error: !!errors.entryDate,
                                helperText: errors.entryDate ? t(errors.entryDate) : undefined,
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
                            helperText={errors.branchId ? t(errors.branchId) : undefined}
                            options={branches?.map(
                              (item: { name: string; id: string }) => ({
                                ...item,
                                label: item.name,
                                value: item.id,
                              })
                            )}
                            label={t("Branch")}
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
                          <InputText
                            type="text"
                            className="form-input form-control"
                            label={t("FinancialCollector")}
                            variant="outlined"
                            fullWidth
                            size="small"
                            disabled={formType === FormTypes.Details}
                            value={""}
                            onChange={(value) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      symbol: value,
                                    }
                                  : prevModel
                              )
                            }
                            error={!!errors.symbol}
                            helperText={errors.symbol ? t(errors.symbol) : undefined}
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col col-md-12">
                          <TextareaAutosize
                            className="form-input form-control"
                            disabled={formType === FormTypes.Details}
                            value={model?.notes}
                            aria-label={t("Notes")}
                            placeholder={t("Notes")}
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
                            <div className="col col-md-5">
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
                                      label={t("DebtAccount")}
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
                                        ] ? t(errors[
                                          `financialTransactions[${idx}].debitAccountId`
                                        ]) : undefined
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
                                    label={t("DebtAccount")}
                                    value={e.debitAccountId}
                                    disabled={formType === FormTypes.Details}
                                    onChange={(value: string | null) => {
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
                                      ] ? t(errors[
                                        `financialTransactions[${idx}].debitAccountId`
                                      ]) : undefined
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col col-md-2">
                              <div
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  display: "flex",
                                }}
                              >
                                <IconButton
                                  disabled={formType === FormTypes.Details}
                                  onClick={() => {
                                    updateModel(
                                      setModel,
                                      "financialTransactions",
                                      {
                                        isPaymentTransaction:
                                          !e.isPaymentTransaction,
                                        creditAccountId: e.isPaymentTransaction
                                          ? ""
                                          : e.debitAccountId,
                                        debitAccountId: !e.isPaymentTransaction
                                          ? ""
                                          : e.creditAccountId,
                                      },
                                      idx
                                    );
                                  }}
                                >
                                  {" "}
                                  <SyncAltIcon />
                                </IconButton>
                              </div>
                            </div>
                            <div className="col col-md-5">
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
                                      label={t("CreditAccount")}
                                      value={e.creditAccountId}
                                      disabled={formType === FormTypes.Details}
                                      onChange={(value: string | null) => {
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
                                        ] ? t(errors[
                                          `financialTransactions[${idx}].creditAccountId`
                                        ]) : undefined
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
                                    label={t("CreditAccount")}
                                    value={e.creditAccountId}
                                    disabled={formType === FormTypes.Details}
                                    onChange={(value: string | undefined) => {
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
                                      ] ? t(errors[
                                        `financialTransactions[${idx}].creditAccountId`
                                      ]) : undefined
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
                                    options={PaymentTypeOptions.map((e) => ({
                                      ...e,
                                      label: t(e.label),
                                    }))}
                                    label={t("PaymentType")}
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
                                  <InputNumber
                                    className="form-input form-control"
                                    label={t("Amount")}
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
                                      ] ? t(errors[
                                        `financialTransactions[${idx}].amount`
                                      ]) : undefined
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
                                      label={t("CollectionBook")}
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
                                      label={t("AgentName")}
                                      variant="outlined"
                                      fullWidth
                                      size="small"
                                      disabled={formType === FormTypes.Details}
                                      value={e.cashAgentName}
                                      onChange={(value) =>
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
                                        ] ? t(errors[
                                          `financialTransactions[${idx}].cashAgentName`
                                        ]) : undefined
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
                                      options={banks
                                        ?.filter(
                                          (e) => e.nodeType == NodeType.Domain
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
                                      label={t("Bank")}
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
                                      label={t("ChequeNumber")}
                                      variant="outlined"
                                      fullWidth
                                      size="small"
                                      disabled={formType === FormTypes.Details}
                                      value={e.chequeNumber}
                                      onChange={(value) =>
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
                                        ] ? t(errors[
                                          `financialTransactions[${idx}].chequeNumber`
                                        ]) : undefined
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
                                      label={t("Name")}
                                      variant="outlined"
                                      fullWidth
                                      size="small"
                                      disabled={formType === FormTypes.Details}
                                      value={e.promissoryName}
                                      onChange={(value) =>
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
                                        ] ? t(errors[
                                          `financialTransactions[${idx}].promissoryName`
                                        ]) : undefined
                                      }
                                    />
                                  </div>
                                  <div className="col col-md-6">
                                    <InputText
                                      type="text"
                                      className="form-input form-control"
                                      label={t("Number")}
                                      variant="outlined"
                                      fullWidth
                                      size="small"
                                      disabled={formType === FormTypes.Details}
                                      value={e.promissoryNumber}
                                      onChange={(value) =>
                                        updateModel(
                                          setModel,
                                          "financialTransactions",
                                          {
                                            promissoryNumber: value,
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
                                        ] ? t(errors[
                                          `financialTransactions[${idx}].promissoryNumber`
                                        ]) : undefined
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
                                  label={t("ReferenceNumber")}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={formType === FormTypes.Details}
                                  value={e.wireTransferReferenceNumber}
                                  onChange={(value) =>
                                    updateModel(
                                      setModel,
                                      "financialTransactions",
                                      {
                                        wireTransferReferenceNumber: value,
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
                                    ] ? t(errors[
                                      `financialTransactions[${idx}].wireTransferReferenceNumber`
                                    ]) : undefined
                                  }
                                />
                              </div>
                            )}
                            {e.paymentType == PaymentType.CreditCard && (
                              <div className="col col-md-6">
                                <InputText
                                  type="text"
                                  className="form-input form-control"
                                  label={t("Last4Digits")}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={formType === FormTypes.Details}
                                  value={e.creditCardLastDigits}
                                  onChange={(value) =>
                                    updateModel(
                                      setModel,
                                      "financialTransactions",
                                      {
                                        creditCardLastDigits: value,
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
                                    ] ? t(errors[
                                      `financialTransactions[${idx}].creditCardLastDigits`
                                    ]) : undefined
                                  }
                                />
                              </div>
                            )}
                          </div>
                          {e.paymentType == PaymentType.Cash && (
                            <div className="row">
                              <div className="col col-md-3">
                                <InputText
                                  type="text"
                                  className="form-input form-control"
                                  label={t("Number")}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={formType === FormTypes.Details}
                                  value={e.cashPhoneNumber}
                                  onChange={(value) =>
                                    updateModel(
                                      setModel,
                                      "financialTransactions",
                                      {
                                        cashPhoneNumber: value,
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
                                    ] ? t(errors[
                                      `financialTransactions[${idx}].cashPhoneNumber`
                                    ]) : undefined
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
                                      label={t("ChequeIssueDate")}
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
                                            ] ? t(errors[
                                              `financialTransactions[${idx}].chequeIssueDate`
                                            ]) : undefined
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
                                      label={t("ChequeCollectionDate")}
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
                                            ] ? t(errors[
                                              `financialTransactions[${idx}].chequeCollectionDate`
                                            ]) : undefined
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
                                <InputText
                                  type="text"
                                  className="form-input form-control"
                                  label={t("IdentificationNumber")}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={formType === FormTypes.Details}
                                  value={e.promissoryIdentityCard}
                                  onChange={(value) =>
                                    updateModel(
                                      setModel,
                                      "financialTransactions",
                                      {
                                        promissoryIdentityCard: value,
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
                                    ] ? t(errors[
                                      `financialTransactions[${idx}].promissoryIdentityCard`
                                    ]) : undefined
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
                                      label={t("PromissoryCollectionDate")}
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
                                            ] ? t(errors[
                                              `financialTransactions[${idx}].promissoryCollectionDate`
                                            ]) : undefined
                                        },
                                      }}
                                    />
                                  </DemoContainer>
                                </LocalizationProvider>
                              </div>
                            </div>
                          )}
                          {model.financialTransactions.length > 1 &&
                            formType !== FormTypes.Details && (
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
                  {formType !== FormTypes.Details && (
                    <div>
                      <IconButton onClick={() => onAddFinancialTrancastion()}>
                        <Add />
                      </IconButton>
                    </div>
                  )}
                  <EntryCostCentersComponent
                    costCenters={costCenters}
                    formType={formType}
                    onChange={(entryCostCenters: EntryCostCenter[]) =>
                      setModel((prevModel) =>
                        prevModel
                          ? { ...prevModel, costCenters: entryCostCenters }
                          : prevModel
                      )
                    }
                    entryCostCenters={model.costCenters}
                    errors={errors}
                  />
                </>
              )}
            </>
          )}
        </div>
      </BaseForm>
    </div>
  );
};

export default CompinedEntriesForm;
