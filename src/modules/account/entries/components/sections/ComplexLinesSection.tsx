import { IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { useTranslation } from "react-i18next";
import InputAutoComplete from "@/Components/Inputs/InputAutoComplete";
import InputNumber from "@/Components/Inputs/InputNumber";
import InputSelect from "@/Components/Inputs/InputSelect";
import { FormTypes } from "@/interfaces/Components/FormType";
import type { ChartOfAccountModel } from "@/interfaces/ProjectInterfaces";
import type { CollectionBookModel } from "@/interfaces/ProjectInterfaces";
import type BankModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Banks/BankModel";
import ComplexFinancialTransactionModel from "@/interfaces/ProjectInterfaces/Account/Entries/ComplexFinancialTransaction";
import {
  PaymentType,
  PaymentTypeOptions,
} from "@/interfaces/ProjectInterfaces/Account/Entries/PaymentType";
import type { EntryKindConfig } from "@/modules/account/entries/entryKind";
import { filterPaymentAccounts } from "@/modules/account/entries/utils/filterPaymentAccounts";
import PaymentDetailsSection from "./PaymentDetailsSection";

export interface ComplexLinesSectionProps {
  formType: FormTypes;
  config: EntryKindConfig;
  transactions: ComplexFinancialTransactionModel[];
  chartOfAccounts: ChartOfAccountModel[];
  collectionBooks: CollectionBookModel[];
  banks: BankModel[];
  errors: Record<string, string>;
  onUpdateTransaction: (index: number, patch: Partial<ComplexFinancialTransactionModel>) => void;
  onRemoveTransaction: (transactionId: string) => void;
  onAddTransaction: () => void;
}

function accountLabel(item: { name: string; nameSecondLanguage: string; id: string }) {
  return {
    label: `${item.name} || ${item.nameSecondLanguage}`,
    value: item.id,
  };
}

export default function ComplexLinesSection({
  formType,
  config,
  transactions,
  chartOfAccounts,
  collectionBooks,
  banks,
  errors,
  onUpdateTransaction,
  onRemoveTransaction,
  onAddTransaction,
}: ComplexLinesSectionProps) {
  const { t } = useTranslation();
  const disabled = formType === FormTypes.Details;

  const paymentSideOptions = (paymentType: PaymentType) =>
    filterPaymentAccounts(chartOfAccounts, paymentType, config).map(accountLabel);

  const fullAccountOptions = chartOfAccounts.map(accountLabel);
  const codeAccountOptions = chartOfAccounts.map((item) => ({
    label: item.code,
    value: item.id,
  }));

  return (
    <>
      {transactions
        .slice()
        .sort((a, b) => a.orderNumber - b.orderNumber)
        .map((e) => {
          const idx = transactions.findIndex((t) => t.id === e.id);
          const isPayment = e.isPaymentTransaction;

          return (
            <div className="card card-body mb-2" key={e.id}>
              <div className="row mb-2">
                {/* Debit column */}
                <div className={`col ${config.allowPaymentToggle ? "col-md-5" : "col-md-6"}`}>
                  <div className="row mb-2">
                    {config.allowPaymentToggle
                      ? !isPayment && (
                          <div className="col col-md-5">
                            <InputAutoComplete
                              size="small"
                              options={codeAccountOptions}
                              label={t("DebtAccount")}
                              value={e.debitAccountId}
                              disabled={disabled}
                              onChange={(value: string | undefined) =>
                                onUpdateTransaction(idx, {
                                  debitAccountId: value ?? "",
                                })
                              }
                              defaultSelect={false}
                              multiple={false}
                              name="DebtAccount"
                              handleBlur={null}
                              error={!!errors[`financialTransactions[${idx}].debitAccountId`]}
                              helperText={
                                errors[`financialTransactions[${idx}].debitAccountId`]
                                  ? t(errors[`financialTransactions[${idx}].debitAccountId`])
                                  : undefined
                              }
                            />
                          </div>
                        )
                      : isPayment && (
                          <div className="col col-md-5">
                            <InputAutoComplete
                              size="small"
                              options={codeAccountOptions}
                              label={t("DebtAccount")}
                              value={e.debitAccountId}
                              disabled={disabled}
                              onChange={(value: string | undefined) =>
                                onUpdateTransaction(idx, {
                                  debitAccountId: value ?? "",
                                })
                              }
                              defaultSelect={false}
                              multiple={false}
                              name="DebtAccount"
                              handleBlur={null}
                              error={!!errors[`financialTransactions[${idx}].debitAccountId`]}
                              helperText={errors[`financialTransactions[${idx}].debitAccountId`]}
                            />
                          </div>
                        )}
                    <div
                      className={`col ${
                        (config.allowPaymentToggle ? isPayment : !isPayment)
                          ? "col-md-12"
                          : "col-md-7"
                      }`}
                    >
                      <InputAutoComplete
                        size="small"
                        options={
                          (config.allowPaymentToggle ? !isPayment : isPayment)
                            ? fullAccountOptions
                            : paymentSideOptions(e.paymentType)
                        }
                        label={t("DebtAccount")}
                        value={e.debitAccountId}
                        disabled={disabled}
                        onChange={(value: string | null | undefined) =>
                          onUpdateTransaction(idx, {
                            debitAccountId: value ?? "",
                          })
                        }
                        defaultSelect={config.allowPaymentToggle ? isPayment : !isPayment}
                        multiple={false}
                        name="DebtAccount"
                        handleBlur={null}
                        error={!!errors[`financialTransactions[${idx}].debitAccountId`]}
                        helperText={
                          errors[`financialTransactions[${idx}].debitAccountId`]
                            ? t(errors[`financialTransactions[${idx}].debitAccountId`])
                            : errors[`financialTransactions[${idx}].debitAccountId`]
                        }
                      />
                    </div>
                  </div>
                </div>

                {config.allowPaymentToggle && (
                  <div className="col col-md-2">
                    <div
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <IconButton
                        disabled={disabled}
                        onClick={() => {
                          onUpdateTransaction(idx, {
                            isPaymentTransaction: !isPayment,
                            creditAccountId: isPayment ? "" : e.debitAccountId,
                            debitAccountId: !isPayment ? "" : e.creditAccountId,
                          });
                        }}
                      >
                        <SyncAltIcon />
                      </IconButton>
                    </div>
                  </div>
                )}

                {/* Credit column */}
                <div className={`col ${config.allowPaymentToggle ? "col-md-5" : "col-md-6"}`}>
                  <div className="row mb-2">
                    {config.allowPaymentToggle
                      ? isPayment && (
                          <div className="col col-md-5">
                            <InputAutoComplete
                              size="small"
                              options={codeAccountOptions}
                              label={t("CreditAccount")}
                              value={e.creditAccountId}
                              disabled={disabled}
                              onChange={(value: string | null) =>
                                onUpdateTransaction(idx, {
                                  creditAccountId: value ?? "",
                                })
                              }
                              defaultSelect={false}
                              multiple={false}
                              name="CreditAccount"
                              handleBlur={null}
                              error={!!errors[`financialTransactions[${idx}].creditAccountId`]}
                              helperText={
                                errors[`financialTransactions[${idx}].creditAccountId`]
                                  ? t(errors[`financialTransactions[${idx}].creditAccountId`])
                                  : undefined
                              }
                            />
                          </div>
                        )
                      : !isPayment && (
                          <div className="col col-md-5">
                            <InputAutoComplete
                              size="small"
                              options={codeAccountOptions}
                              label={t("CreditAccount")}
                              value={e.creditAccountId}
                              disabled={disabled}
                              onChange={(value: string | undefined) =>
                                onUpdateTransaction(idx, {
                                  creditAccountId: value ?? "",
                                })
                              }
                              defaultSelect={false}
                              multiple={false}
                              name="CreditAccount"
                              handleBlur={null}
                              error={!!errors[`financialTransactions[${idx}].creditAccountId`]}
                              helperText={errors[`financialTransactions[${idx}].creditAccountId`]}
                            />
                          </div>
                        )}
                    <div
                      className={`col ${
                        (config.allowPaymentToggle ? !isPayment : isPayment)
                          ? "col-md-12"
                          : "col-md-7"
                      }`}
                    >
                      <InputAutoComplete
                        size="small"
                        options={
                          (config.allowPaymentToggle ? isPayment : !isPayment)
                            ? fullAccountOptions
                            : paymentSideOptions(e.paymentType)
                        }
                        label={t("CreditAccount")}
                        value={e.creditAccountId}
                        disabled={disabled}
                        onChange={(value: string | undefined) =>
                          onUpdateTransaction(idx, {
                            creditAccountId: value ?? "",
                          })
                        }
                        defaultSelect={config.allowPaymentToggle ? !isPayment : isPayment}
                        multiple={false}
                        name="CreditAccount"
                        handleBlur={null}
                        error={!!errors[`financialTransactions[${idx}].creditAccountId`]}
                        helperText={
                          errors[`financialTransactions[${idx}].creditAccountId`]
                            ? t(errors[`financialTransactions[${idx}].creditAccountId`])
                            : errors[`financialTransactions[${idx}].creditAccountId`]
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {config.hasPaymentDetails && (
                <div className="row">
                  <div className="col col-md-6">
                    <div className="row mb-2">
                      <div className="col col-md-6">
                        <InputSelect
                          options={PaymentTypeOptions.map((opt) => ({
                            ...opt,
                            label: t(opt.label),
                          }))}
                          label={t("PaymentType")}
                          defaultValue={e?.paymentType}
                          disabled={formType !== FormTypes.Add}
                          multiple={false}
                          onChange={({ target }: { target: { value: PaymentType } }) => {
                            onUpdateTransaction(idx, {
                              paymentType: target.value,
                            });
                          }}
                          name="paymentType"
                          onBlur={undefined}
                          error={!!errors.paymentType}
                        />
                      </div>
                      <div className="col col-md-6">
                        <InputNumber
                          className="form-input form-control"
                          label={t("Amount")}
                          variant="outlined"
                          fullWidth
                          size="small"
                          disabled={disabled}
                          value={e?.amount}
                          onChange={(value) => onUpdateTransaction(idx, { amount: value })}
                          error={!!errors[`financialTransactions[${idx}].amount`]}
                          helperText={errors[`financialTransactions[${idx}].amount`]}
                        />
                      </div>
                    </div>
                  </div>
                  <PaymentDetailsSection
                    formType={formType}
                    transaction={e}
                    index={idx}
                    errors={errors}
                    collectionBooks={collectionBooks}
                    chartOfAccounts={chartOfAccounts}
                    banks={banks}
                    chequeBankSource={config.chequeBankSource}
                    onFieldChange={(patch) => onUpdateTransaction(idx, patch)}
                  />
                </div>
              )}

              {transactions.length > 1 && formType !== FormTypes.Details && (
                <div>
                  <IconButton onClick={() => onRemoveTransaction(e.id)}>
                    <Delete />
                  </IconButton>
                </div>
              )}
            </div>
          );
        })}

      {formType !== FormTypes.Details && (
        <div>
          <IconButton onClick={onAddTransaction}>
            <Add />
          </IconButton>
        </div>
      )}
    </>
  );
}
