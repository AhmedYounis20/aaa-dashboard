import {
  Box,
  Paper,
  Radio,
  TextareaAutosize,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import InputAutoComplete from "../../../../../Components/Inputs/InputAutoCompelete";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import updateModel from "../../../../../Helper/updateModelHelper";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import { TaxModel } from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Taxes/TaxModel";
import ProductInputModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductInputModel";
import {
  ProductType,
  ProductTypeOptions,
} from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductType";
import {
  TrackedBy,
  TrackedByOptions,
} from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/TrackedBy";

interface ProductCodesAndTypeCardProps {
  formType: FormTypes;
  model: ProductInputModel;
  taxes: TaxModel[];
  setModel: React.Dispatch<React.SetStateAction<ProductInputModel>>;
  errors: Record<string, string>;
  handleTranslate: (key: string) => string;
}

const ProductCodesAndTypeCard: React.FC<ProductCodesAndTypeCardProps> = ({
  formType,
  model,
  taxes,
  setModel,
  handleTranslate,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box className='row g-4'>
        <Box className='col-md-12'>
          <Typography
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              opacity: 0.75,
              mb: 2,
              fontSize: "0.875rem",
            }}
          >
            {handleTranslate("ProductType")}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {ProductTypeOptions.map((option) => {
              const isSelected = model.productType === option.value;

              return (
                <Paper
                  key={option.value}
                  onClick={() =>
                    formType !== FormTypes.Details &&
                    updateModel(setModel, "productType", option.value)
                  }
                  elevation={isSelected ? 3 : 0}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2.5,
                    py: 1.5,
                    borderRadius: "1rem",
                    cursor:
                      formType === FormTypes.Details ? "default" : "pointer",
                    border: isSelected
                      ? "2px solid #3b82f6"
                      : `2px solid ${theme.palette.divider}`,
                    backgroundColor: isSelected
                      ? theme.palette.background.default
                      : theme.palette.background.paper,
                    minWidth: "150px",
                    maxWidth: "175px",
                    flex: "1 1 0px",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor:
                        formType !== FormTypes.Details && !isSelected
                          ? theme.palette.background.default
                          : undefined,
                    },
                    boxShadow: "none",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: isSelected
                        ? theme.palette.text.primary
                        : theme.palette.text.secondary,
                      fontSize: ".875rem",
                    }}
                  >
                    {handleTranslate(option.label)}
                  </Typography>
                  <Radio
                    checked={isSelected}
                    size='small'
                    sx={{
                      color: theme.palette.divider,
                      "&.Mui-checked": {
                        color: "#3b82f6",
                      },
                      p: 0.5,
                    }}
                  />
                </Paper>
              );
            })}
          </Box>
        </Box>

        {model.productType === ProductType.Stock && (
          <Box className='col-md-12'>
            <InputSelect
              options={TrackedByOptions.map((e) => ({
                ...e,
                label: handleTranslate(e.label),
              }))}
              label={handleTranslate("TrackedBy")}
              defaultValue={model?.trackedBy}
              disabled={formType === FormTypes.Details}
              multiple={false}
              onChange={({ target }: { target: { value: TrackedBy } }) => {
                updateModel(setModel, "trackedBy", target.value);
              }}
              name={"TrackedBy"}
              onBlur={null}
              error={undefined}
            />
          </Box>
        )}

        <Box className='col-md-6'>
          <InputAutoComplete
            options={taxes?.map((item: { name: string; id: string }) => {
              return {
                label: item.name,
                value: item.id,
              };
            })}
            label={handleTranslate("SalesTaxes")}
            value={model.salesTaxIds ?? []}
            disabled={formType === FormTypes.Details}
            onChange={(value: string[] | null) => {
              setModel((prevModel) => {
                return prevModel
                  ? {
                      ...prevModel,
                      salesTaxIds: value ?? [],
                    }
                  : prevModel;
              });
            }}
            multiple={true}
            handleBlur={null}
          />
        </Box>

        <Box className='col-md-6'>
          <InputAutoComplete
            options={taxes?.map((item: { name: string; id: string }) => {
              return {
                label: item.name,
                value: item.id,
              };
            })}
            label={handleTranslate("PurchaseTaxes")}
            value={model.purchaseTaxIds ?? []}
            disabled={formType === FormTypes.Details}
            onChange={(value: string[] | null) => {
              setModel((prevModel) => {
                return prevModel
                  ? {
                      ...prevModel,
                      purchaseTaxIds: value ?? [],
                    }
                  : prevModel;
              });
            }}
            multiple={true}
            handleBlur={null}
          />
        </Box>

        <Box className='col-md-12'>
          <Box
            component={TextareaAutosize}
            minRows={3}
            maxRows={6}
            value={model?.notes ?? ""}
            onChange={(e) =>
              setModel((prev) =>
                prev ? { ...prev, notes: e.target.value } : prev,
              )
            }
            disabled={formType === FormTypes.Details}
            placeholder={handleTranslate("Notes")}
            sx={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              resize: "vertical",
              fontFamily: "inherit",
              fontSize: "inherit",
              "&:focus": {
                outline: "none",
                border: `1px solid ${theme.palette.primary.main}`,
              },
            }}
          />
        </Box>

        <Box className='col-md-6'>
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1,
              borderRadius: "0.5rem",
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              boxShadow: "none",
              cursor: formType === FormTypes.Details ? "default" : "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor:
                  formType !== FormTypes.Details
                    ? theme.palette.action.hover
                    : undefined,
              },
            }}
            onClick={() =>
              formType !== FormTypes.Details &&
              setModel((prev) =>
                prev ? { ...prev, isSales: !prev.isSales } : prev,
              )
            }
          >
            <Typography
              sx={{
                fontWeight: 500,
                color: theme.palette.text.primary,
                fontSize: "0.875rem",
              }}
            >
              {handleTranslate("Sales")}
            </Typography>
            <Box
              sx={{
                position: "relative",
                width: "32px",
                height: "18px",
                borderRadius: "12px",
                backgroundColor: model.isSales
                  ? "#3b82f6"
                  : theme.palette.action.disabled,
                transition: "background-color 0.3s ease",
                cursor: formType === FormTypes.Details ? "default" : "pointer",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "1px",
                  left: model.isSales ? "14px" : "1px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  transition: "left 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              />
            </Box>
          </Paper>
        </Box>

        <Box className='col-md-6'>
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1,
              borderRadius: "0.5rem",
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              boxShadow: "none",
              cursor: formType === FormTypes.Details ? "default" : "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor:
                  formType !== FormTypes.Details
                    ? theme.palette.action.hover
                    : undefined,
              },
            }}
            onClick={() =>
              formType !== FormTypes.Details &&
              setModel((prev) =>
                prev ? { ...prev, isPurchases: !prev.isPurchases } : prev,
              )
            }
          >
            <Typography
              sx={{
                fontWeight: 500,
                color: theme.palette.text.primary,
                fontSize: "0.875rem",
              }}
            >
              {handleTranslate("Purchases")}
            </Typography>
            <Box
              sx={{
                position: "relative",
                width: "32px",
                height: "18px",
                borderRadius: "12px",
                backgroundColor: model.isPurchases
                  ? "#3b82f6"
                  : theme.palette.action.disabled,
                transition: "background-color 0.3s ease",
                cursor: formType === FormTypes.Details ? "default" : "pointer",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "1px",
                  left: model.isPurchases ? "14px" : "1px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  transition: "left 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductCodesAndTypeCard;
