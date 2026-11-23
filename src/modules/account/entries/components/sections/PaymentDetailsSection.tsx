/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import InputAutoComplete from "@/Components/Inputs/InputAutoComplete";
import { FormTypes } from "@/interfaces/Components/FormType";
import { SubLedgerType } from "@/interfaces/ProjectInterfaces/Account/ChartOfAccount/SubLedgerType";
import type { ChartOfAccountModel } from "@/interfaces/ProjectInterfaces";
import type { CollectionBookModel } from "@/interfaces/ProjectInterfaces";
import type BankModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Banks/BankModel";
import ComplexFinancialTransactionModel from "@/interfaces/ProjectInterfaces/Account/Entries/ComplexFinancialTransaction";
import { PaymentType } from "@/interfaces/ProjectInterfaces/Account/Entries/PaymentType";
import type { ChequeBankSource } from "@/modules/account/entries/entryKind";

export interface PaymentDetailsSectionProps {
  formType: FormTypes;
  transaction: ComplexFinancialTransactionModel;
  index: number;
  errors: Record<string, string>;
  collectionBooks: CollectionBookModel[];
  chartOfAccounts: ChartOfAccountModel[];
  banks: BankModel[];
  chequeBankSource: ChequeBankSource;
  onFieldChange: (patch: Partial<ComplexFinancialTransactionModel>) => void;
}

function errKey(index: number, field: string) {
  return `financialTransactions[${index}].${field}`;
}

export default function PaymentDetailsSection({
  formType,
  transaction: e,
  index: idx,
  errors,
  collectionBooks,
  chartOfAccounts,
  banks,
  chequeBankSource,
  onFieldChange,
}: PaymentDetailsSectionProps) {
  const { t } = useTranslation();
  const disabled = formType === FormTypes.Details;

  const chequeBankOptions =
    chequeBankSource === "banks"
      ? banks.map((item) => ({
          label: `${item.name} || ${item.nameSecondLanguage}`,
          value: item.id,
        }))
      : chartOfAccounts
          .filter((a) => a.subLeadgerType === SubLedgerType.Bank)
          .map((item) => ({
            label: `${item.name} || ${item.nameSecondLanguage}`,
            value: item.id,
          }));

  return (
    <>
      {e.paymentType === PaymentType.Cash && (
        <div className="col col-md-6">
          <div className="row mb-2">
            <div className="col col-md-6">
              <InputAutoComplete
                size="small"
                error={!!errors[errKey(idx, "collectionBookId")]}
                helperText={errors[errKey(idx, "collectionBookId")]}
                options={collectionBooks?.map((item) => ({
                  label: `${item.name} || ${item.nameSecondLanguage}`,
                  value: item.id,
                }))}
                label={t("CollectionBook")}
                disabled={disabled}
                onChange={(value: string | undefined) => {
                  onFieldChange({ collectionBookId: value ?? null });
                }}
                defaultSelect={false}
                value={e.collectionBookId}
                multiple={false}
                name="CollectionBookId"
                handleBlur={null}
              />
            </div>
            <div className="col col-md-6">
              <TextField
                type="text"
                className="form-input form-control"
                label={t("AgentName")}
                variant="outlined"
                fullWidth
                size="small"
                disabled={disabled}
                value={e.cashAgentName ?? ""}
                onChange={(event) => onFieldChange({ cashAgentName: event.target.value })}
                error={!!errors[errKey(idx, "cashAgentName")]}
                helperText={errors[errKey(idx, "cashAgentName")]}
              />
            </div>
          </div>
        </div>
      )}

      {e.paymentType === PaymentType.Cheque && (
        <div className="col col-md-6">
          <div className="row mb-2">
            <div className="col col-md-6">
              <InputAutoComplete
                size="small"
                error={!!errors[errKey(idx, "chequeBankId")]}
                helperText={errors[errKey(idx, "chequeBankId")]}
                options={chequeBankOptions}
                label={t("Bank")}
                disabled={disabled}
                onChange={(value: string | undefined) => {
                  onFieldChange({ chequeBankId: value ?? null });
                }}
                defaultSelect={false}
                value={e.chequeBankId}
                multiple={false}
                name="CreditAccount"
                handleBlur={null}
              />
            </div>
            <div className="col col-md-6">
              <TextField
                type="text"
                className="form-input form-control"
                label={t("ChequeNumber")}
                variant="outlined"
                fullWidth
                size="small"
                disabled={disabled}
                value={e.chequeNumber ?? ""}
                onChange={(event) => onFieldChange({ chequeNumber: event.target.value })}
                error={!!errors[errKey(idx, "chequeNumber")]}
                helperText={errors[errKey(idx, "chequeNumber")]}
              />
            </div>
          </div>
        </div>
      )}

      {e.paymentType === PaymentType.Promissory && (
        <div className="col col-md-6">
          <div className="row mb-2">
            <div className="col col-md-6">
              <TextField
                type="text"
                className="form-input form-control"
                label={t("Name")}
                variant="outlined"
                fullWidth
                size="small"
                disabled={disabled}
                value={e.promissoryName ?? ""}
                onChange={(event) => onFieldChange({ promissoryName: event.target.value })}
                error={!!errors[errKey(idx, "promissoryName")]}
                helperText={errors[errKey(idx, "promissoryName")]}
              />
            </div>
            <div className="col col-md-6">
              <TextField
                type="text"
                className="form-input form-control"
                label={t("Number")}
                variant="outlined"
                fullWidth
                size="small"
                disabled={disabled}
                value={e.promissoryNumber ?? ""}
                onChange={(event) => onFieldChange({ promissoryNumber: event.target.value })}
                error={!!errors[errKey(idx, "promissoryNumber")]}
                helperText={errors[errKey(idx, "promissoryNumber")]}
              />
            </div>
          </div>
        </div>
      )}

      {(e.paymentType === PaymentType.WireTransfer || e.paymentType === PaymentType.Atm) && (
        <div className="col col-md-6">
          <TextField
            type="text"
            className="form-input form-control"
            label={t("ReferenceNumber")}
            variant="outlined"
            fullWidth
            size="small"
            disabled={disabled}
            value={e.wireTransferReferenceNumber ?? ""}
            onChange={(event) =>
              onFieldChange({
                wireTransferReferenceNumber: event.target.value,
              })
            }
            error={!!errors[errKey(idx, "wireTransferReferenceNumber")]}
            helperText={errors[errKey(idx, "wireTransferReferenceNumber")]}
          />
        </div>
      )}

      {e.paymentType === PaymentType.CreditCard && (
        <div className="col col-md-6">
          <TextField
            type="text"
            className="form-input form-control"
            label={t("Last4Digits")}
            variant="outlined"
            fullWidth
            size="small"
            disabled={disabled}
            value={e.creditCardLastDigits ?? ""}
            onChange={(event) => onFieldChange({ creditCardLastDigits: event.target.value })}
            error={!!errors[errKey(idx, "creditCardLastDigits")]}
            helperText={errors[errKey(idx, "creditCardLastDigits")]}
          />
        </div>
      )}

      {e.paymentType === PaymentType.Cash && (
        <div className="row">
          <div className="col col-md-3">
            <TextField
              type="text"
              className="form-input form-control"
              label={t("Number")}
              variant="outlined"
              fullWidth
              size="small"
              disabled={disabled}
              value={e.cashPhoneNumber ?? ""}
              onChange={(event) => onFieldChange({ cashPhoneNumber: event.target.value })}
              error={!!errors[errKey(idx, "cashPhoneNumber")]}
              helperText={errors[errKey(idx, "cashPhoneNumber")]}
            />
          </div>
        </div>
      )}

      {e.paymentType === PaymentType.Cheque && (
        <div className="row">
          <div className="col col-md-6">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ width: "100%" }}>
                <DateTimePicker
                  label={t("ChequeIssueDate")}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  value={e?.chequeIssueDate ? dayjs(e.chequeIssueDate) : null}
                  onChange={(value) => {
                    onFieldChange({
                      chequeIssueDate: (value?.toDate() as any) ?? null,
                    });
                  }}
                  slotProps={{
                    textField: {
                      error: !!errors[errKey(idx, "chequeIssueDate")],
                      helperText: errors[errKey(idx, "chequeIssueDate")],
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
          </div>
          <div className="col col-md-6">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ width: "100%" }}>
                <DateTimePicker
                  label={t("ChequeCollectionDate")}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  value={e?.chequeCollectionDate ? dayjs(e.chequeCollectionDate) : null}
                  onChange={(value) => {
                    onFieldChange({
                      chequeCollectionDate: value?.toDate() ?? null,
                    });
                  }}
                  slotProps={{
                    textField: {
                      error: !!errors[errKey(idx, "chequeCollectionDate")],
                      helperText: errors[errKey(idx, "chequeCollectionDate")],
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
          </div>
        </div>
      )}

      {e.paymentType === PaymentType.Promissory && (
        <div className="row">
          <div className="col col-md-6">
            <TextField
              type="text"
              className="form-input form-control"
              label={t("IdentificationNumber")}
              variant="outlined"
              fullWidth
              size="small"
              disabled={disabled}
              value={e.promissoryIdentityCard ?? ""}
              onChange={(event) => onFieldChange({ promissoryIdentityCard: event.target.value })}
              error={!!errors[errKey(idx, "promissoryIdentityCard")]}
              helperText={errors[errKey(idx, "promissoryIdentityCard")]}
            />
          </div>
          <div className="col col-md-6">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ width: "100%" }}>
                <DateTimePicker
                  label={t("PromissoryCollectionDate")}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  value={e?.promissoryCollectionDate ? dayjs(e.promissoryCollectionDate) : null}
                  onChange={(value) => {
                    onFieldChange({
                      promissoryCollectionDate: value?.toDate() ?? null,
                    });
                  }}
                  slotProps={{
                    textField: {
                      error: !!errors[errKey(idx, "promissoryCollectionDate")],
                      helperText: errors[errKey(idx, "promissoryCollectionDate")],
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
          </div>
        </div>
      )}
    </>
  );
}
