import React from "react";
import { FormControlLabel, Switch } from "@mui/material";
import InputNumber from "../../../../../Components/Inputs/InputNumber";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import VariantSellingPriceDiscountsInput from "./VariantSellingPriceDiscountsInput";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import {
  DiscountType,
  DiscountTypeOptions,
} from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/DiscountType";
import VariantSellingPriceDiscountModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantSellingPriceDiscountModel";
import updateModel from "../../../../../Helper/updateModelHelper";
import VariantInputModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantInputModel";

interface VariantDiscountCardProps {
  formType: FormTypes;
  model: VariantInputModel;
  setModel: React.Dispatch<React.SetStateAction<VariantInputModel>>;
  handleTranslate: (key: string) => string;
}

const VariantDiscountCard: React.FC<VariantDiscountCardProps> = ({
  formType,
  model,
  setModel,
  handleTranslate,
}) => {
  return (
    <div className="card card-body">
      <h5 className="mb-4">{handleTranslate("DiscountDetails")}</h5>
      <div className="row mb-3">
        <div className="col col-md-6">
          <InputNumber
            className="form-input form-control"
            label={handleTranslate("MaxDiscount")}
            variant="outlined"
            fullWidth
            disabled={formType === FormTypes.Details}
            value={model?.maxDiscount ?? null}
            inputType="percent"
            onChange={(value) =>
              setModel((prevModel) =>
                prevModel ? { ...prevModel, maxDiscount: value } : prevModel
              )
            }
          />
        </div>
        <div className="col col-md-6">
          <InputNumber
            className="form-input form-control"
            label={handleTranslate("ConditionalDiscount")}
            variant="outlined"
            fullWidth
            disabled={formType === FormTypes.Details}
            value={model?.conditionalDiscount ?? null}
            inputType="percent"
            onChange={(value) =>
              setModel((prevModel) =>
                prevModel
                  ? { ...prevModel, conditionalDiscount: value }
                  : prevModel
              )
            }
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col col-md-6">
          <InputNumber
            className="form-input form-control"
            label={handleTranslate("DefaultDiscount")}
            variant="outlined"
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
                prevModel ? { ...prevModel, defaultDiscount: value } : prevModel
              )
            }
          />
        </div>
        <div className="col col-md-6">
          <InputSelect
            options={DiscountTypeOptions.map((e) => ({
              ...e,
              label: handleTranslate(e.label),
            }))}
            label={handleTranslate("DiscountType")}
            defaultValue={model?.defaultDiscountType}
            disabled={formType === FormTypes.Details}
            multiple={false}
            onChange={({
              target,
            }: {
              target: { value: DiscountType };
            }) => {
              updateModel(setModel, "defaultDiscountType", target.value);
            }}
            name={"DiscountType"}
            onBlur={null}
            error={undefined}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col col-md-6">
          <FormControlLabel
            control={
              <Switch
                checked={model?.isDiscountBasedOnSellingPrice}
                onChange={({
                  target,
                }: {
                  target: { checked: boolean };
                }) =>
                  setModel((prevModel) =>
                    prevModel
                      ? {
                          ...prevModel,
                          isDiscountBasedOnSellingPrice: target.checked,
                          defaultDiscount: target.checked
                            ? 0
                            : prevModel.defaultDiscount,
                        }
                      : prevModel
                  )
                }
              />
            }
            label={handleTranslate("IsDiscountBasedOnSellingPrice")}
            disabled={formType === FormTypes.Details}
          />
        </div>
        <div className="col col-md-6">
          {model.isDiscountBasedOnSellingPrice && (
            <VariantSellingPriceDiscountsInput
              formType={formType}
              variantSellingPriceDiscounts={model.sellingPriceDiscounts || []}
              handleUpdate={(
                items: VariantSellingPriceDiscountModel[]
              ) => {
                setModel((prevModel) => ({
                  ...(prevModel ?? {}),
                  sellingPriceDiscounts: items,
                }));
              }}
              handleTranslate={(key) => handleTranslate(key)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantDiscountCard;

