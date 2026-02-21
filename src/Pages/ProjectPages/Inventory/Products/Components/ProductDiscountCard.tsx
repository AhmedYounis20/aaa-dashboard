import { Box, Paper, Typography, useTheme } from "@mui/material";
import React from "react";
import InputNumber from "../../../../../Components/Inputs/InputNumber";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import updateModel from "../../../../../Helper/updateModelHelper";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import {
  DiscountType,
  DiscountTypeOptions,
} from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/DiscountType";
import ProductInputModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductInputModel";
import ProductSellingPriceDiscountModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductSellingPriceDiscountModel";
import ProductSellingPriceDiscountsInput from "./ProductSellingPriceDiscountsInput";

interface ProductDiscountCardProps {
  formType: FormTypes;
  model: ProductInputModel;
  setModel: React.Dispatch<React.SetStateAction<ProductInputModel>>;
  handleTranslate: (key: string) => string;
}

const ProductDiscountCard: React.FC<ProductDiscountCardProps> = ({
  formType,
  model,
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
        <Box className='col-md-3'>
          <InputNumber
            className='form-input form-control'
            label={handleTranslate("MaxDiscount")}
            variant='outlined'
            fullWidth
            disabled={formType === FormTypes.Details}
            value={model?.maxDiscount ?? null}
            inputType='percent'
            onChange={(value) =>
              setModel((prevModel) =>
                prevModel ? { ...prevModel, maxDiscount: value } : prevModel,
              )
            }
          />
        </Box>
        <Box className='col-md-3'>
          <InputNumber
            className='form-input form-control'
            label={handleTranslate("ConditionalDiscount")}
            variant='outlined'
            fullWidth
            disabled={formType === FormTypes.Details}
            value={model?.conditionalDiscount ?? null}
            inputType='percent'
            onChange={(value) =>
              setModel((prevModel) =>
                prevModel
                  ? { ...prevModel, conditionalDiscount: value }
                  : prevModel,
              )
            }
          />
        </Box>
        <Box className='col-md-3'>
          <InputNumber
            className='form-input form-control'
            label={handleTranslate("DefaultDiscount")}
            variant='outlined'
            fullWidth
            disabled={
              formType === FormTypes.Details ||
              model.isDiscountBasedOnSellingPrice
            }
            value={model?.defaultDiscount ?? null}
            inputType={
              model.defaultDiscountType == DiscountType.Percent
                ? "percent"
                : "number"
            }
            onChange={(value) =>
              setModel((prevModel) =>
                prevModel
                  ? { ...prevModel, defaultDiscount: value }
                  : prevModel,
              )
            }
          />
        </Box>
        <Box className='col-md-3'>
          <InputSelect
            options={DiscountTypeOptions.map((e) => ({
              ...e,
              label: handleTranslate(e.label),
            }))}
            label={handleTranslate("DiscountType")}
            defaultValue={model?.defaultDiscountType}
            disabled={formType === FormTypes.Details}
            multiple={false}
            onChange={({ target }: { target: { value: DiscountType } }) => {
              updateModel(setModel, "defaultDiscountType", target.value);
            }}
            name={"DiscountType"}
            onBlur={null}
            error={undefined}
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
                prev
                  ? {
                      ...prev,
                      isDiscountBasedOnSellingPrice:
                        !prev.isDiscountBasedOnSellingPrice,
                      defaultDiscount: !prev.isDiscountBasedOnSellingPrice
                        ? 0
                        : prev.defaultDiscount,
                    }
                  : prev,
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
              {handleTranslate("IsDiscountBasedOnSellingPrice")}
            </Typography>
            <Box
              sx={{
                position: "relative",
                width: "32px",
                height: "18px",
                borderRadius: "12px",
                backgroundColor: model.isDiscountBasedOnSellingPrice
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
                  left: model.isDiscountBasedOnSellingPrice ? "14px" : "1px",
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
        <Box className='col-md-12'>
          {model.isDiscountBasedOnSellingPrice && (
            <ProductSellingPriceDiscountsInput
              formType={formType}
              productSellingPriceDiscounts={model.sellingPriceDiscounts || []}
              handleUpdate={(items: ProductSellingPriceDiscountModel[]) => {
                setModel((prevModel) => ({
                  ...(prevModel ?? {}),
                  sellingPriceDiscounts: items,
                }));
              }}
              handleTranslate={(key) => handleTranslate(key)}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDiscountCard;
