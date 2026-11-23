import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Box, Grid, Paper, Typography } from "@mui/material";
import BaseForm from "./BaseForm";
import InputText from "../Inputs/InputText";
import InputSelect from "../Inputs/InputSelect";
import Loader from "../Loader";
import { FormTypes } from "../../interfaces/Components/FormType";
import { NodeType, NodeTypeOptions } from "../../interfaces/Components/NodeType";
import { localizedEntityName } from "../../Helper/localizedEntityName";

export interface SubLedgerBaseModel {
  id: string;
  name: string;
  nameSecondLanguage: string;
  nodeType: NodeType | number;
  code?: string;
  parentId?: string | null;
}

export interface SubLedgerFormProps<T extends SubLedgerBaseModel> {
  formType: FormTypes;
  handleCloseForm: () => void;
  model: T;
  setModel: React.Dispatch<React.SetStateAction<T>>;
  errors: Record<string, string>;
  isLoading: boolean;
  handleAdd: () => Promise<boolean>;
  handleUpdate: () => Promise<boolean>;
  handleDelete: () => Promise<boolean>;
  /** Domain-only fields rendered when nodeType === Domain (inside BasicInfo card). */
  renderDomainFields?: (ctx: {
    model: T;
    setModel: React.Dispatch<React.SetStateAction<T>>;
    errors: Record<string, string>;
    formType: FormTypes;
    t: (key: string) => string;
  }) => ReactNode;
  /** Extra fields always shown (e.g. beside NodeType). */
  renderExtraFields?: (ctx: {
    model: T;
    setModel: React.Dispatch<React.SetStateAction<T>>;
    errors: Record<string, string>;
    formType: FormTypes;
    t: (key: string) => string;
  }) => ReactNode;
  showCodeField?: boolean;
}

/**
 * Shared shell for tree sub-ledger forms (Banks, Customers, Suppliers, …):
 * BaseForm + names + NodeType + optional Domain BasicInfo card.
 */
export default function SubLedgerForm<T extends SubLedgerBaseModel>({
  formType,
  handleCloseForm,
  model,
  setModel,
  errors,
  isLoading,
  handleAdd,
  handleUpdate,
  handleDelete,
  renderDomainFields,
  renderExtraFields,
  showCodeField = true,
}: SubLedgerFormProps<T>) {
  const { t, i18n } = useTranslation();

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <BaseForm
        formType={formType}
        handleCloseForm={handleCloseForm}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        handleAdd={handleAdd}
        isModal
      >
        <Box>
          {isLoading ? (
            <Loader />
          ) : formType === FormTypes.Delete ? (
            <Typography>
              {t("AreYouSureDelete")} {localizedEntityName(model, i18n.language)}
            </Typography>
          ) : (
            <>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <InputText
                    type="text"
                    label={t("Name")}
                    variant="outlined"
                    fullWidth
                    isRequired
                    disabled={formType === FormTypes.Details}
                    value={model?.name}
                    onChange={(value) => setModel((prev) => ({ ...prev, name: value }))}
                    error={!!errors.name}
                    helperText={errors.name ? t(errors.name) : undefined}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputText
                    type="text"
                    label={t("NameSecondLanguage")}
                    variant="outlined"
                    fullWidth
                    isRequired
                    disabled={formType === FormTypes.Details}
                    value={model?.nameSecondLanguage}
                    onChange={(value) =>
                      setModel((prev) => ({
                        ...prev,
                        nameSecondLanguage: value,
                      }))
                    }
                    error={!!errors.nameSecondLanguage}
                    helperText={
                      errors.nameSecondLanguage ? t(errors.nameSecondLanguage) : undefined
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <InputSelect
                    options={NodeTypeOptions.map((e) => ({
                      ...e,
                      label: t(e.label),
                    }))}
                    label={t("NodeType")}
                    name="NodeType"
                    value={model?.nodeType}
                    disabled={formType !== FormTypes.Add}
                    multiple={false}
                    onChange={(value) => {
                      setModel((prev) => ({
                        ...prev,
                        nodeType: value as NodeType,
                      }));
                    }}
                  />
                </Grid>
                {renderExtraFields?.({
                  model,
                  setModel,
                  errors,
                  formType,
                  t,
                })}
              </Grid>
              {model?.nodeType === NodeType.Domain && (
                <Paper variant="outlined" sx={{ p: 2, mt: 2, mx: 0 }}>
                  <Typography sx={{ mb: 2 }}>{t("BasicInfo")}</Typography>
                  {showCodeField && (
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} md={6}>
                        <InputText
                          type="text"
                          label={t("Code")}
                          variant="outlined"
                          fullWidth
                          disabled
                          value={model?.code ?? ""}
                          onChange={() => undefined}
                        />
                      </Grid>
                    </Grid>
                  )}
                  {renderDomainFields?.({
                    model,
                    setModel,
                    errors,
                    formType,
                    t,
                  })}
                </Paper>
              )}
            </>
          )}
        </Box>
      </BaseForm>
    </Box>
  );
}
