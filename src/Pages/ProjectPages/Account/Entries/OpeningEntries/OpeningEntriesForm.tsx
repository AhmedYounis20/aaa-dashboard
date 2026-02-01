/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseForm from "../../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import { IconButton, TextareaAutosize, TextField } from "@mui/material";
import { AccountNature } from "../../../../../interfaces/ProjectInterfaces/Account/ChartOfAccount/AccountNature";
import InputFile from "../../../../../Components/Inputs/InputFile";
import AttachmentModel from "../../../../../interfaces/BaseModels/AttachmentModel";
import InputAutoComplete from "../../../../../Components/Inputs/InputAutoCompelete";
import { Add, Delete } from "@mui/icons-material";
import { EntrySchema } from "../../../../../interfaces/ProjectInterfaces/Account/Entries/entry-validation";
import CurrencyModel from "../../../../../interfaces/ProjectInterfaces/Account/Currencies/CurrencyModel";
import BranchModel from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Branches/BranchModel";
import { getBranches } from "../../../../../Apis/Account/BranchesApi";
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
const { t } = useTranslation();
  const url = "openingEntries";
  // const entryResult = useGetEntryByIdQuery(id, {
  //   skip: formType == FormTypes.Add,
  // });
  // const currenciesApiResult = useGetCurrenciesQuery({
  //   pageNumber: 1,
  //   pageSize: 100,
  // });

  const [errors, setErrors] = useState<Record<string, string>>({});
  // const [updateEntry] = useUpdateEntryMutation();
  // const [createEntry] = useCreateEntryMutation();
  // const [deleteEntry] = useDeleteEntryMutation();
  const [isLoading, setIsLoading] = useState<boolean>(
    formType != FormTypes.Add
  );
  const [branches, setBranches] = useState<BranchModel[]>([]);
  const [transactionNumber, setTransactionNumber] = useState<number>(1);
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccountModel[]>(
    []
  );
  const [currencies] = useState<CurrencyModel[]>([]);

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
    if (formType === FormTypes.Add) {
      httpGet<EntryNumber>(`${url}/getEntryNumber`, {
        datetime: model.entryDate,
      }).then((e) => {
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
    const fetchBranches = async () => {
      if (formType !== FormTypes.Delete) {
        try {
          const branchesResponse = await getBranches();
          if (branchesResponse?.result) {
            setBranches(
              branchesResponse.result.filter(
                (e: BranchModel) => e.nodeType == NodeType.Domain
              )
            );
          }
        } catch (error) {
          console.error('Error fetching branches:', error);
        }
      }
    };

    fetchBranches();
  }, [formType]);

  useEffect(() => {
    if (formType !== FormTypes.Add) {
      const fetchData = async () => {
        setIsLoading(true);
        const result = await getOpeningEntryById(id);
        if (result && result.result) {
          setModel({ ...result.result });
          setTransactionNumber(
            result.result.financialTransactions.findLast(
              (e: any) => e.orderNumber != null
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
    const response = await createOpeningEntry(model);
    if (response && response.isSuccess) {
      afterAction();
      return true;
    } 
    return false;
  };
  const handleUpdate = async () => {
    if ((await validate()) === false) return false;
    const response = await updateOpeningEntry(model.id, model);
    if (response && response.isSuccess) {
      afterAction();
      return true;
    }
    return false;
  };
  const handleDelete = async (): Promise<boolean> => {
    const response = await deleteOpeningEntry(id);
    if (response && response.isSuccess) {
      afterAction();
      return true;
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
                              <TextField
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
                              <TextField
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
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label={t("DocumentNumber")}
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
                            options={chartOfAccounts?.map(
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
                            onChange={( value: number) =>
                              updateModel(
                                setModel,
                                "exchangeRate",
                                value
                              )
                            }
                            error={!!errors.exchangeRate}
                            helperText={errors.exchangeRate ? t(errors.exchangeRate) : undefined}
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col col-md-12">
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label={t("ReceiverName")}
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
                          <TextField
                            type="text"
                            className="form-input form-control"
                            label={t("FinancialCollector")}
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
                                    label={t("DebitAccount")}
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
                                      ] ? t(errors[
                                        `financialTransactions[${getTransactionIndexById(
                                          e.id
                                        )}].amount`
                                      ]) : undefined
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
                                    label={t("CreditAccount")}
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
                                      ] ? t(errors[
                                        `financialTransactions[${getTransactionIndexById(
                                          e.id
                                        )}].amount`
                                      ]) : undefined
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
