import { IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import InputAutoComplete from "@/Components/Inputs/InputAutoComplete";
import InputNumber from "@/Components/Inputs/InputNumber";
import { FormTypes } from "@/interfaces/Components/FormType";
import { AccountNature } from "@/interfaces/ProjectInterfaces/Account/ChartOfAccount/AccountNature";
import type { ChartOfAccountModel } from "@/interfaces/ProjectInterfaces";
import FinancialTransactionModel from "@/interfaces/ProjectInterfaces/Account/Entries/FinancialTransaction";
import type { EntryKindConfig } from "@/modules/account/entries/entryKind";
import { filterPaymentAccounts } from "@/modules/account/entries/utils/filterPaymentAccounts";

export interface SimpleLinesSectionProps {
  formType: FormTypes;
  config: EntryKindConfig;
  transactions: FinancialTransactionModel[];
  chartOfAccounts: ChartOfAccountModel[];
  errors: Record<string, string>;
  onUpdateTransaction: (index: number, patch: Partial<FinancialTransactionModel>) => void;
  onRemoveTransaction: (transactionId: string) => void;
  onAddTransaction: (accountNature: AccountNature) => void;
  getTransactionIndexById: (id: string) => number;
}

export default function SimpleLinesSection({
  formType,
  config,
  transactions,
  chartOfAccounts,
  errors,
  onUpdateTransaction,
  onRemoveTransaction,
  onAddTransaction,
  getTransactionIndexById,
}: SimpleLinesSectionProps) {
  const { t } = useTranslation();
  const disabled = formType === FormTypes.Details;

  const renderColumn = (nature: AccountNature, labelKey: string) => {
    const filtered = transactions
      .filter((e) => e.accountNature === nature)
      .sort((a, b) => a.orderNumber - b.orderNumber);

    return (
      <div className="col col-md-6">
        {filtered.map((e) => {
          const idx = getTransactionIndexById(e.id);
          const options = (
            e.isPaymentTransaction
              ? chartOfAccounts
              : filterPaymentAccounts(chartOfAccounts, e.paymentType, config)
          ).map((item) => ({
            label: `${item.name} || ${item.nameSecondLanguage}`,
            value: item.id,
          }));

          return (
            <div className="card card-body mb-2" key={e.id}>
              <div className="row mb-2">
                <div className="col col-md-6">
                  <InputAutoComplete
                    size="small"
                    options={options}
                    label={t(labelKey)}
                    value={e.chartOfAccountId}
                    disabled={disabled}
                    onChange={(value: string | undefined) =>
                      onUpdateTransaction(idx, {
                        chartOfAccountId: value ?? "",
                      })
                    }
                    defaultSelect={!e.isPaymentTransaction}
                    multiple={false}
                    name="DebtAccount"
                    handleBlur={null}
                    error={!!errors[`financialTransactions[${idx}].chartOfAccountId`]}
                    helperText={errors[`financialTransactions[${idx}].chartOfAccountId`]}
                  />
                </div>
                <div className="col col-md-4">
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
                <div className="col col-md-2">
                  {filtered.length > 1 && formType !== FormTypes.Details && (
                    <IconButton onClick={() => onRemoveTransaction(e.id)}>
                      <Delete />
                    </IconButton>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {formType !== FormTypes.Details && (
          <IconButton onClick={() => onAddTransaction(nature)}>
            <Add />
          </IconButton>
        )}
      </div>
    );
  };

  return (
    <div className="row">
      {renderColumn(AccountNature.Debit, "DebitAccount")}
      {renderColumn(AccountNature.Credit, "CreditAccount")}
    </div>
  );
}
