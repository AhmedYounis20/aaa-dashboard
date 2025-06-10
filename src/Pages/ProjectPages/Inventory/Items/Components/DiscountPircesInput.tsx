import { useEffect, useState } from "react";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import DiscountIcon from "@mui/icons-material/Discount";
import SellingPriceModel from "../../../../../interfaces/ProjectInterfaces/Inventory/SellingPrices/SellingPriceModel";
import { getSellingPrices } from "../../../../../Apis/Inventory/SellingPricesApi";
import {
  DiscountType,
  DiscountTypeOptions,
} from "../../../../../interfaces/ProjectInterfaces/Inventory/Items/DiscountType";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import InputNumber from "../../../../../Components/Inputs/InputNumber";
import ItemSellingPriceDiscountModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Items/ItemSellingPriceDiscountModel";

const DiscountPricesInput: React.FC<{
  formType: FormTypes;
  itemSellingPriceDiscounts: ItemSellingPriceDiscountModel[];
  handleUpdate: (
    sellingPriceDiscounts: ItemSellingPriceDiscountModel[]
  ) => void;
}> = ({ formType, itemSellingPriceDiscounts, handleUpdate }) => {
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
                !itemSellingPriceDiscounts.some(
                  (a) => a.sellingPriceId == e.id
                )
            )
            .map((e) => ({
              discount: 0,
              discountType: DiscountType.Percent,
              sellingPriceId: e.id,
              name: e.name,
              nameSecondLanguage: e.nameSecondLanguage,
            }));

          const enrichedExisting = itemSellingPriceDiscounts.map((item) => {
            if (!item.name || !item.nameSecondLanguage) {
              const match = fetchedPrices.find(
                (p) => p.id == item.sellingPriceId
              );
              if (match) {
                return {
                  ...item,
                  name: item.name || match.name,
                  nameSecondLanguage:
                    item.nameSecondLanguage || match.nameSecondLanguage,
                };
              }
            }
            return item;
          });

          handleUpdate([...enrichedExisting, ...missingDiscounts]);
        }
      };
      fetchData();
    }
  }, [formType]);

  const handleOpen = () => setIsOpen((prev) => !prev);

const handleDiscountChange = (index: number, value: number | null) => {
  const updated = itemSellingPriceDiscounts.map((item, i) =>
    i == index ? { ...item, discount: value ?? 0 } : item
  );
  handleUpdate(updated);
};

const handleDiscountTypeChange = (index: number, value: DiscountType) => {
  const updated = itemSellingPriceDiscounts.map((item, i) =>
    i == index ? { ...item, discountType: value } : item
  );
  handleUpdate(updated);
};

  return (
    <>
      <button
        className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2 px-4 py-2 rounded shadow-sm text-white fw-semibold"
        onClick={handleOpen}
      >
        <DiscountIcon fontSize="small" />
        <span>Manage Discounts</span>
      </button>

      {isOpen && (
        <div className="modal fade show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header bg-primary text-white rounded-top px-4 py-3">
                <h5 className="modal-title fw-bold">Manage Item Discounts</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleOpen}
                ></button>
              </div>

              <div className="modal-body px-4 py-3">
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped align-middle text-center">
                      <thead className="table-light">
                        <tr>
                          <th>Name</th>
                          <th>Discount</th>
                          <th>Discount Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemSellingPriceDiscounts.map(
                          (discountItem, index) => (
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
                                    handleDiscountChange(index, value)
                                  }
                                />
                              </td>
                              <td>
                                <InputSelect
                                  options={DiscountTypeOptions}
                                  label=""
                                  defaultValue={discountItem.discountType}
                                  disabled={formType === FormTypes.Details}
                                  multiple={false}
                                  onChange={({
                                    target,
                                  }: {
                                    target: { value: DiscountType };
                                  }) =>
                                    handleDiscountTypeChange(
                                      index,
                                      target.value
                                    )
                                  }
                                  name="DiscountType"
                                  onBlur={() => {}}
                                  error={undefined}
                                />
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
   
              </div>

              <div className="modal-footer border-top px-4 py-3">
                <button className="btn btn-secondary" onClick={handleOpen}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiscountPricesInput;
