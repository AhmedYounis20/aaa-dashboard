/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import BaseForm from "@/Components/Forms/BaseForm";
import { ErrorState } from "@/Components/feedback";
import { FormTypes } from "@/interfaces/Components/FormType";
import { AccountNature } from "@/interfaces/ProjectInterfaces/Account/ChartOfAccount/AccountNature";
import ComplexEntryModel from "@/interfaces/ProjectInterfaces/Account/Entries/ComplexEntry";
import ComplexFinancialTransactionModel from "@/interfaces/ProjectInterfaces/Account/Entries/ComplexFinancialTransaction";
import EntryModel from "@/interfaces/ProjectInterfaces/Account/Entries/Entry";
import FinancialTransactionModel from "@/interfaces/ProjectInterfaces/Account/Entries/FinancialTransaction";
import EntryCostCenter from "@/interfaces/ProjectInterfaces/Account/Entries/EntryCostCenter";
import { PaymentType } from "@/interfaces/ProjectInterfaces/Account/Entries/PaymentType";
import {
  useBanksList,
  useBranches,
  useChartOfAccounts,
  useCollectionBooks,
  useCostCenters,
  useCurrencies,
} from "@/hooks/queries";
import { filterOperationalBranches } from "@/Helper/branchOptions";
import updateModel from "@/Helper/updateModelHelper";
import { getEntryNumber } from "../api";
import { getEntryKindConfig, type EntryKind, type EntryKindConfig } from "../entryKind";
import EntryHeaderSection from "./sections/EntryHeaderSection";
import ComplexLinesSection from "./sections/ComplexLinesSection";
import SimpleLinesSection from "./sections/SimpleLinesSection";
import EntryCostCentersSection from "./sections/EntryCostCentersSection";

export interface ComplexEntryFormProps {
  entryKind: EntryKind;
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  /** Normalized callback after successful mutate (replaces afterAction / actionAfter). */
  afterAction: () => void;
}

type AnyEntryModel = ComplexEntryModel | EntryModel;

function createComplexTransaction(
  orderNumber: number,
  isPaymentTransaction: boolean
): ComplexFinancialTransactionModel {
  return {
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
    orderNumber,
    promissoryCollectionDate: null,
    promissoryIdentityCard: null,
    promissoryName: null,
    promissoryNumber: null,
    wireTransferReferenceNumber: null,
    paymentType: PaymentType.Cash,
    isPaymentTransaction,
    atmTransferReferenceNumber: null,
    cashAgentName: null,
    cashPhoneNumber: null,
    collectionBookId: null,
  };
}

function createSimpleTransaction(
  orderNumber: number,
  accountNature: AccountNature
): FinancialTransactionModel {
  return {
    id: uuid(),
    chartOfAccountId: "",
    accountNature,
    amount: 0,
    chequeBankId: null,
    chequeCollectionDate: null,
    chequeIssueDate: null,
    chequeNumber: null,
    creditCardLastDigits: null,
    notes: null,
    orderNumber,
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
}

function buildInitialModel(
  config: EntryKindConfig,
  formType: FormTypes,
  id: string
): AnyEntryModel {
  const base = {
    id,
    exchangeRate: 0,
    entryNumber: "",
    branchId: "",
    currencyId: "",
    entryDate: new Date(),
    documentNumber: "",
    financialPeriodId: "",
    notes: "",
    receiverName: "",
    attachments: [],
    financialPeriodNumber: "",
  };

  if (config.mode === "complex") {
    return {
      ...base,
      financialTransactions:
        formType === FormTypes.Add
          ? [createComplexTransaction(1, config.defaultIsPaymentTransaction)]
          : [],
      costCenters: [],
    } as ComplexEntryModel;
  }

  return {
    ...base,
    financialTransactions:
      formType === FormTypes.Add
        ? [
            createSimpleTransaction(1, AccountNature.Debit),
            createSimpleTransaction(2, AccountNature.Credit),
          ]
        : [],
  } as EntryModel;
}

export default function ComplexEntryForm({
  entryKind,
  formType,
  id,
  handleCloseForm,
  afterAction,
}: ComplexEntryFormProps) {
  const { t } = useTranslation();
  const config = getEntryKindConfig(entryKind);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(formType !== FormTypes.Add);
  const [loadError, setLoadError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [transactionNumber, setTransactionNumber] = useState(config.mode === "simple" ? 2 : 1);
  const [model, setModel] = useState<AnyEntryModel>(() => buildInitialModel(config, formType, id));

  const lookupsEnabled = formType !== FormTypes.Delete;
  const { data: currencies = [] } = useCurrencies(lookupsEnabled);
  const { data: branchesRaw = [] } = useBranches(lookupsEnabled);
  const branches = useMemo(() => filterOperationalBranches(branchesRaw), [branchesRaw]);
  const { data: chartOfAccounts = [] } = useChartOfAccounts(lookupsEnabled);
  const { data: costCenters = [] } = useCostCenters(lookupsEnabled && config.hasCostCenters);
  const { data: collectionBooks = [] } = useCollectionBooks(
    lookupsEnabled && config.hasCollectionBooks
  );
  const banksEnabled = lookupsEnabled && config.chequeBankSource === "banks";
  const { data: banks = [] } = useBanksList(banksEnabled);

  useEffect(() => {
    if (formType !== FormTypes.Add) return;

    void getEntryNumber(model.entryDate).then((e) => {
      if (!e || !e.isSuccess) return;
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
                prevModel.documentNumber == `${result.financialPeriodNumber}\\${result.entryNumber}`
                  ? `${result.financialPeriodNumber}\\${result.entryNumber}`
                  : prevModel.documentNumber,
            }
          : prevModel
      );
    });
  }, [model.entryDate, formType]);

  useEffect(() => {
    if (formType === FormTypes.Add) {
      setLoadError(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setLoadError(false);
      try {
        const result = await config.getById(id);
        if (result?.isSuccess && result.result) {
          setModel({ ...result.result });
          const lastOrder =
            result.result.financialTransactions?.findLast?.(
              (e: { orderNumber: number | null }) => e.orderNumber != null
            )?.orderNumber ?? 1;
          setTransactionNumber(lastOrder);
        } else {
          setLoadError(true);
        }
      } catch {
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchData();
  }, [formType, id, config, reloadToken]);

  const changeExchangeRate = (currencyId: string) => {
    const currency = currencies.find((e) => e.id == currencyId);
    setModel((prev) =>
      prev ? { ...prev, exchangeRate: currency ? currency.exchangeRate : 0 } : prev
    );
  };

  const removeTransaction = (transactionId: string) => {
    setModel((prevModel) => {
      if (!prevModel) return prevModel;
      return {
        ...prevModel,
        financialTransactions: prevModel.financialTransactions.filter((e) => e.id != transactionId),
      } as AnyEntryModel;
    });
    setErrors((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([key]) => !key.startsWith("financialTransactions"))
      )
    );
  };

  const onAddComplexTransaction = () => {
    const nextOrder = transactionNumber + 1;
    setModel((prevModel) => {
      const complex = prevModel as ComplexEntryModel;
      return {
        ...complex,
        financialTransactions: [
          ...complex.financialTransactions,
          createComplexTransaction(nextOrder, config.defaultIsPaymentTransaction),
        ],
      } as AnyEntryModel;
    });
    setTransactionNumber(nextOrder);
  };

  const onAddSimpleTransaction = (accountNature: AccountNature) => {
    const nextOrder = transactionNumber + 1;
    setModel((prevModel) => {
      const simple = prevModel as EntryModel;
      return {
        ...simple,
        financialTransactions: [
          ...simple.financialTransactions,
          createSimpleTransaction(nextOrder, accountNature),
        ],
      } as AnyEntryModel;
    });
    setTransactionNumber(nextOrder);
  };

  const updateTransaction = (index: number, patch: Record<string, any>) => {
    updateModel(setModel, "financialTransactions", patch, index);
  };

  const validate = async () => {
    try {
      await config.schema.validate(model, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const validationErrorsMap: Record<string, string> = {};
      (validationErrors as any).inner?.forEach((error: any) => {
        if (error.path) validationErrorsMap[error.path] = error.message;
      });
      setErrors(validationErrorsMap);
      return false;
    }
  };

  const toComplexPayload = () => {
    const complex = model as ComplexEntryModel;
    return {
      ...complex,
      costCenters: (complex.costCenters ?? []).filter(
        (c) => c.costCenterId != null && String(c.costCenterId).trim() !== ""
      ),
    };
  };

  const handleDelete = async (): Promise<boolean> => {
    if (loadError) return false;
    const response = await config.delete(id);
    if (response && response.isSuccess) {
      afterAction();
      return true;
    }
    return false;
  };

  const handleUpdate = async () => {
    if (loadError) return false;
    if ((await validate()) === false) return false;
    const payload = config.mode === "complex" ? toComplexPayload() : model;
    const response = await config.update(model.id, payload);
    if (response && response.isSuccess) {
      afterAction();
      return true;
    }
    return false;
  };

  const handleAdd = async () => {
    if ((await validate()) === false) return false;
    const payload = config.mode === "complex" ? toComplexPayload() : model;
    const response = await config.create(payload);
    if (response && response.isSuccess) {
      afterAction();
      return true;
    }
    return false;
  };

  const getTransactionIndexById = (txId: string) =>
    model.financialTransactions.findIndex((item) => item.id == txId);

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
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : loadError ? (
            <ErrorState onRetry={() => setReloadToken((n) => n + 1)} />
          ) : formType === FormTypes.Delete ? (
            <p>
              {t("AreYouSureDelete")} {t("Entry")} {model?.entryNumber}
            </p>
          ) : (
            <>
              <EntryHeaderSection
                formType={formType}
                model={model}
                errors={errors}
                currencies={currencies}
                branches={branches}
                onFieldChange={(field, value) => updateModel(setModel, field, value)}
                onExchangeRateFromCurrency={changeExchangeRate}
                onAttachmentsChange={(attachments) =>
                  setModel((prev) => (prev ? { ...prev, attachments } : prev))
                }
              />

              {!isLoading && config.mode === "complex" && (
                <ComplexLinesSection
                  formType={formType}
                  config={config}
                  transactions={(model as ComplexEntryModel).financialTransactions}
                  chartOfAccounts={chartOfAccounts}
                  collectionBooks={collectionBooks}
                  banks={banks}
                  errors={errors}
                  onUpdateTransaction={updateTransaction}
                  onRemoveTransaction={removeTransaction}
                  onAddTransaction={onAddComplexTransaction}
                />
              )}

              {!isLoading && config.mode === "simple" && (
                <SimpleLinesSection
                  formType={formType}
                  config={config}
                  transactions={(model as EntryModel).financialTransactions}
                  chartOfAccounts={chartOfAccounts}
                  errors={errors}
                  onUpdateTransaction={updateTransaction}
                  onRemoveTransaction={removeTransaction}
                  onAddTransaction={onAddSimpleTransaction}
                  getTransactionIndexById={getTransactionIndexById}
                />
              )}

              {config.hasCostCenters && (
                <EntryCostCentersSection
                  costCenters={costCenters}
                  formType={formType}
                  onChange={(entryCostCenters: EntryCostCenter[]) =>
                    setModel((prevModel) =>
                      prevModel
                        ? {
                            ...(prevModel as ComplexEntryModel),
                            costCenters: entryCostCenters,
                          }
                        : prevModel
                    )
                  }
                  errors={errors}
                  entryCostCenters={(model as ComplexEntryModel).costCenters ?? []}
                />
              )}
            </>
          )}
        </div>
      </BaseForm>
    </div>
  );
}
