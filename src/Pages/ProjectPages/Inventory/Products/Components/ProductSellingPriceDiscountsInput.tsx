import { useEffect, useState } from "react";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import DiscountIcon from "@mui/icons-material/Discount";
import SellingPriceModel from "../../../../../interfaces/ProjectInterfaces/Inventory/SellingPrices/SellingPriceModel";
import { getSellingPrices } from "../../../../../Apis/Inventory/SellingPricesApi";
import {
  DiscountType,
  DiscountTypeOptions,
} from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/DiscountType";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import InputNumber from "../../../../../Components/Inputs/InputNumber";
import ProductSellingPriceDiscountModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductSellingPriceDiscountModel";

const ProductSellingPriceDiscountsInput: React.FC<{
  formType: FormTypes;
  productSellingPriceDiscounts: ProductSellingPriceDiscountModel[];
  handleUpdate: (
    sellingPriceDiscounts: ProductSellingPriceDiscountModel[]
  ) => void;
  handleTranslate: (key: string) => string;
}> = ({
  formType,
  productSellingPriceDiscounts,
  handleUpdate,
  handleTranslate,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  useEffect(() => {
    if (formType !== FormTypes.Delete) {
      const fetchData = async () => {
        const result = await getSellingPrices();
        if (result?.result) {
          const fetchedPrices: SellingPriceModel[] = result.result;

          const missingDiscounts = fetchedPrices
            .filter(
              (e) =>
                !productSellingPriceDiscounts.some((a) => a.sellingPriceId == e.id)
            )
            .map((e) => ({
              discount: 0,
              discountType: DiscountType.Percent,
              sellingPriceId: e.id,
              name: e.name,
              nameSecondLanguage: e.nameSecondLanguage,
            }));

          const enrichedExisting = productSellingPriceDiscounts.map((item) => {
            if (!item.name || !item.nameSecondLanguage) {
              const match = fetchedPrices.find(
                (e) => e.id == item.sellingPriceId
              );
              return {
                ...item,
                name: match?.name ?? "",
                nameSecondLanguage: match?.nameSecondLanguage ?? "",
              };
            }
            return item;
          });

          const allDiscounts = [...enrichedExisting, ...missingDiscounts];
          handleUpdate(allDiscounts);
        }
      };
      fetchData();
    }
  }, [formType]);

  const handleDiscountChange = (
    sellingPriceId: string,
    field: keyof ProductSellingPriceDiscountModel,
    value: any
  ) => {
    console.log("field:",field);
    console.log("value:",value);
    const updated = productSellingPriceDiscounts.map((item) =>
      item.sellingPriceId === sellingPriceId
        ? { ...item, [field]: value }
        : item
    );
    handleUpdate(updated);
  };

  return (
    <>
      <button
        className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2 px-4 py-2 rounded shadow-sm text-white fw-semibold"
        onClick={() => setIsOpen(!isOpen)}
        disabled={formType === FormTypes.Details}
      >
        <DiscountIcon fontSize="small" />
        <span>{handleTranslate("Discounts")}</span>
      </button>

      {isOpen && (
        <div className="modal fade show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header bg-primary text-white rounded-top px-4 py-3">
                <h5 className="modal-title fw-bold">
                  {handleTranslate("Discounts")}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setIsOpen(false)}
                ></button>
              </div>

              <div className="modal-body px-4 py-3">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped align-middle text-center">
                    <thead className="table-light">
                      <tr>
                        <th>{handleTranslate("Name")}</th>
                        <th>{handleTranslate("Discount")}</th>
                        <th>{handleTranslate("DiscountType")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productSellingPriceDiscounts.map((discountItem, index) => (
                        <tr key={index}>
                          <td>
                            <div className="fw-semibold text-primary">
                              {discountItem.name}
                            </div>
                            <div className="text-muted small">
                              {discountItem.nameSecondLanguage}
                            </div>
                          </td>
                          <td>
                            <InputNumber
                              className="form-control"
                              label=""
                              variant="outlined"
                              fullWidth
                              disabled={formType == FormTypes.Details}
                              value={discountItem.discount ?? 0}
                              inputType={
                                discountItem.discountType ===
                                DiscountType.Percent
                                  ? "percent"
                                  : "number"
                              }
                              onChange={(value) =>
                                handleDiscountChange(discountItem.sellingPriceId, "discount", value)
                              }
                            />
                          </td>
                          <td>
                            <InputSelect
                              options={DiscountTypeOptions.map((e) => ({
                                ...e,
                                label: handleTranslate(e.label),
                              }))}
                              label=""
                              
                              disabled={formType == FormTypes.Details}
                              defaultValue={discountItem.discountType}
                              onChange={({target}:{target:{value:DiscountType}}) =>
                                handleDiscountChange(discountItem.sellingPriceId, "discountType", target.value)
                              }
                              name="DiscountType"
                              onBlur={null}
                              error={undefined}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="modal-footer bg-light px-4 py-3">
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={() => setIsOpen(false)}
                >
                  {handleTranslate("Close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductSellingPriceDiscountsInput;
