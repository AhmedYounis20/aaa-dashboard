/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextareaAutosize, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import InputAutoComplete from "@/Components/Inputs/InputAutoComplete";
import InputDateTimePicker from "@/Components/Inputs/InputDateTime";
import InputNumber from "@/Components/Inputs/InputNumber";
import InputText from "@/Components/Inputs/InputText";
import { branchDisplayName, pickDefaultBranchId } from "@/Helper/branchOptions";
import { FormTypes } from "@/interfaces/Components/FormType";
import type CurrencyModel from "@/interfaces/ProjectInterfaces/Account/Currencies/CurrencyModel";
import type BranchModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Branches/BranchModel";
import type AttachmentModel from "@/interfaces/BaseModels/AttachmentModel";
import EntryAttachmentsSection from "./EntryAttachmentsSection";

export interface EntryHeaderFields {
  financialPeriodNumber: string;
  entryNumber: string;
  documentNumber: string;
  currencyId: string;
  exchangeRate: number;
  receiverName: string;
  entryDate: Date;
  branchId: string;
  notes: string;
  attachments: AttachmentModel[];
}

export interface EntryHeaderSectionProps {
  formType: FormTypes;
  model: EntryHeaderFields;
  errors: Record<string, string>;
  currencies: CurrencyModel[];
  branches: BranchModel[];
  onFieldChange: (field: string, value: any) => void;
  onExchangeRateFromCurrency: (currencyId: string) => void;
  onAttachmentsChange: (attachments: AttachmentModel[]) => void;
}

export default function EntryHeaderSection({
  formType,
  model,
  errors,
  currencies,
  branches,
  onFieldChange,
  onExchangeRateFromCurrency,
  onAttachmentsChange,
}: EntryHeaderSectionProps) {
  const { t, i18n } = useTranslation();
  const disabled = formType === FormTypes.Details;

  return (
    <div className="row mb-2">
      <div className="col col-md-6">
        <div className="row mb-2">
          <div className="col col-md-12">
            <div className="row">
              <div className="col col-md-6">
                <InputText
                  label={t("FinancialPeriodNumber")}
                  disabled
                  value={model?.financialPeriodNumber}
                  error={!!errors.financialPeriodNumber}
                  helperText={
                    errors.financialPeriodNumber ? t(errors.financialPeriodNumber) : undefined
                  }
                />
              </div>
              <div className="col col-md-6">
                <InputText
                  label={t("EntryNumber")}
                  disabled
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
              label={t("DocumentNumber")}
              disabled={disabled}
              value={model?.documentNumber}
              onChange={(value) => onFieldChange("documentNumber", value)}
              error={!!errors.documentNumber}
              helperText={errors.documentNumber ? t(errors.documentNumber) : undefined}
            />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col col-md-8">
            <InputAutoComplete
              size="small"
              error={!!errors.currencyId}
              helperText={errors.currencyId ? t(errors.currencyId) : undefined}
              options={currencies?.map((item) => ({
                ...item,
                label: item.name,
                value: item.id,
              }))}
              label={t("Currency")}
              value={model?.currencyId}
              disabled={disabled}
              onChange={(value: any) => {
                onFieldChange("currencyId", value);
                onExchangeRateFromCurrency(value);
              }}
              multiple={false}
              name="Currencies"
              handleBlur={null}
              defaultSelect={true}
              defaultSelectCondition={(value: CurrencyModel) => value.isDefault == true}
            />
          </div>
          <div className="col col-md-4">
            <InputNumber
              className="form-input form-control"
              label={t("ExchangeRate")}
              variant="outlined"
              fullWidth
              size="small"
              disabled={disabled}
              value={model?.exchangeRate}
              onChange={(value) => onFieldChange("exchangeRate", value)}
              error={!!errors.exchangeRate}
              helperText={errors.exchangeRate ? t(errors.exchangeRate) : undefined}
            />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col col-md-12">
            <InputText
              label={t("ReceiverName")}
              disabled={disabled}
              value={model?.receiverName}
              onChange={(value) => onFieldChange("receiverName", value)}
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
              onChange={(value) => onFieldChange("entryDate", value)}
              disabled={disabled}
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
              size="small"
              error={!!errors.branchId}
              helperText={errors.branchId ? t(errors.branchId) : undefined}
              options={branches?.map((item) => ({
                ...item,
                label: branchDisplayName(item, i18n.language),
                value: item.id,
              }))}
              label={t("Branch")}
              value={model?.branchId}
              disabled={disabled}
              onChange={(value: any) => onFieldChange("branchId", value)}
              multiple={false}
              name="Branches"
              handleBlur={null}
              defaultSelect={true}
              defaultSelectCondition={(option) => option.value === pickDefaultBranchId(branches)}
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
              disabled={disabled}
              value=""
            />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col col-md-12">
            <TextareaAutosize
              className="form-input form-control"
              disabled={disabled}
              value={model?.notes}
              aria-label={t("Notes")}
              placeholder={t("Notes")}
              onChange={(event) => onFieldChange("notes", event.target.value)}
            />
          </div>
        </div>
        <EntryAttachmentsSection
          formType={formType}
          attachments={model.attachments}
          onChange={onAttachmentsChange}
        />
      </div>
    </div>
  );
}
