import { useEffect, useState } from "react";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import InputNumber from "../../../../../Components/Inputs/InputNumber";
import VariantPackingUnitModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantPackingUnitModel";
import { getPackingUnits } from "../../../../../Apis/Inventory/PackingUnitsApi";
import InputAutoComplete from "../../../../../Components/Inputs/InputAutoCompelete";
import PackingUnitModel from "../../../../../interfaces/ProjectInterfaces/Inventory/PackingUnits/PackingUnitModel";
import { Add, Settings, Delete } from "@mui/icons-material";
import { FormControlLabel, Switch } from "@mui/material";
import { getSellingPrices } from "../../../../../Apis/Inventory/SellingPricesApi";
import SellingPriceModel from "../../../../../interfaces/ProjectInterfaces/Inventory/SellingPrices/SellingPriceModel";
import VariantPackingUnitSellingPriceModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantPackingUnitSellingPriceModel";
import InputText from "../../../../../Components/Inputs/InputText";

const VariantPackingUnitsInput: React.FC<{
  formType: FormTypes;
  variantPackingUnits: VariantPackingUnitModel[];
  handleUpdate: (variantPackingUnits: VariantPackingUnitModel[]) => void;
  handleTranslate: (key: string) => string;
  errors: Record<string, string>;
}> = ({
  formType,
  variantPackingUnits,
  handleUpdate,
  errors = {},
  handleTranslate,
}) => {
  const [packingUnits, setPackingUnits] = useState<PackingUnitModel[]>([]);
  const [sellingPrices, setSellingPrices] = useState<SellingPriceModel[]>([]);

  useEffect(() => {
    if (formType !== FormTypes.Delete) {
      const fetchData = async () => {
        const result = await getPackingUnits();
        if (result?.result) {
          setPackingUnits(result.result);
        }

        const sellingPricesResult = await getSellingPrices();
        if (sellingPricesResult?.result) {
          setSellingPrices(sellingPricesResult.result);
        }
      };
      fetchData();
    }
  }, [formType]);

  useEffect(() => {
    if (!sellingPrices.length) return;

    const updated = variantPackingUnits.map((unit) => {
      const existing = unit.sellingPrices ?? [];
      const completedPrices = sellingPrices.map((price) => {
        const match = existing.find((sp) => sp.sellingPriceId === price.id);
        return match ?? { sellingPriceId: price.id, amount: 0 };
      });
      console.log(completedPrices);
      return { ...unit, sellingPrices: completedPrices };
    });

    if (!deepEqual(updated, variantPackingUnits)) {
      handleUpdate(updated);
    }
  }, [sellingPrices, variantPackingUnits]);

  const deepEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

  const handleDiscountChange = (index: number, value: number | null) => {
    const updated = variantPackingUnits.map((item, i) =>
      i === index ? { ...item, partsCount: value ?? 0 } : item,
    );
    handleUpdate(updated);
  };

  const handleSellingPriceChange = (
    rowIndex: number,
    priceId: string,
    value: number | null,
  ) => {
    const updated = variantPackingUnits.map((unit, i) => {
      if (i !== rowIndex) return unit;
      const newPrices = unit.sellingPrices?.map((sp) =>
        sp.sellingPriceId === priceId ? { ...sp, amount: value ?? 0 } : sp,
      );
      return { ...unit, sellingPrices: newPrices };
    });

    // If this is the default packing unit, update all other units
    const changedUnit = updated[rowIndex];
    if (changedUnit.isDefaultPackingUnit) {
      const defaultPrice = value ?? 0;

      // Update all other packing units based on the default price
      const finalUpdated = updated.map((unit, i) => {
        if (i === rowIndex) return unit; // Keep the default unit as is

        // Calculate new price: default_price / parts_count
        const newPrices = unit.sellingPrices?.map((sp) => {
          if (sp.sellingPriceId === priceId) {
            return {
              ...sp,
              amount: unit.partsCount == 0 ? 0 : defaultPrice * unit.partsCount,
            };
          }
          return sp;
        });

        return { ...unit, sellingPrices: newPrices };
      });

      handleUpdate(finalUpdated);
    } else {
      handleUpdate(updated);
    }
  };

  const createInitialSellingPrices =
    (): VariantPackingUnitSellingPriceModel[] =>
      sellingPrices.map((sp) => ({ sellingPriceId: sp.id, amount: 0 }));

  const createVariantPackingUnit = (): VariantPackingUnitModel => ({
    id: "",
    variantId: "",
    packingUnitId: "",
    averageCostPrice: 0,
    isDefaultPackingUnit: false,
    isDefaultPurchases: false,
    isDefaultSales: false,
    lastCostPrice: 0,
    orderNumber: variantPackingUnits.length,
    partsCount: 0,
    sellingPrices: createInitialSellingPrices(),
    createdAt: "",
    modifiedAt: "",
  });

  const handleAddNewItemPackingUnit = () => {
    handleUpdate([...variantPackingUnits, createVariantPackingUnit()]);
  };

  const handleDeleteRow = (index: number) => {
    const updated = [...variantPackingUnits];
    const removedItem = updated.splice(index, 1)[0];

    for (let i = index; i < updated.length; i++) {
      if (updated[i].orderNumber > removedItem.orderNumber) {
        updated[i].orderNumber -= 1;
      }
    }

    handleUpdate(updated);
  };

  const handleUpdateIsDefaultSales = (index: number, value: boolean) => {
    const updated = variantPackingUnits.map((unit, i) => ({
      ...unit,
      isDefaultSales: i === index ? value : false,
    }));
    handleUpdate(updated);
  };

  const handleUpdateIsDefaultPurchase = (index: number, value: boolean) => {
    const updated = variantPackingUnits.map((unit, i) => ({
      ...unit,
      isDefaultPurchases: i === index ? value : false,
    }));
    handleUpdate(updated);
  };

  return (
    <div className="container p-1">
      <div className="table-responsive rounded-3 overflow-auto border mb-2">
        <table className="table table-bordered table-striped align-middle text-center mb-2">
          <thead className="table-light">
            <tr>
              <th style={{ minWidth: "150px" }}>
                {handleTranslate("PackingUnits")}
              </th>
              <th style={{ minWidth: "150px" }}>
                {handleTranslate("PartsCount")}
              </th>
              <th style={{ minWidth: "200px" }}>{handleTranslate("Equals")}</th>
              <th style={{ minWidth: "150px" }}>
                {handleTranslate("IsDefaultSales")}
              </th>
              <th style={{ minWidth: "150px" }}>
                {handleTranslate("IsDefaultPurchases")}
              </th>
              <th style={{ minWidth: "150px" }}>
                {handleTranslate("LastCostPrice")}
              </th>
              <th style={{ minWidth: "150px" }}>
                {handleTranslate("AverageCostPrice")}
              </th>
              {sellingPrices
                .sort((a, b) => a.id.localeCompare(b.id))
                .map((sp) => (
                  <th key={sp.id} style={{ minWidth: "150px" }}>
                    <div className="fw-semibold text-primary">{sp.name}</div>
                    <div className="text-muted small">
                      {sp.nameSecondLanguage}
                    </div>
                  </th>
                ))}
              <th>
                <Settings />
              </th>
            </tr>
          </thead>
          <tbody>
            {variantPackingUnits.map((unit, rowIndex) => (
              <tr key={rowIndex}>
                <td>
                  <InputAutoComplete
                    options={packingUnits
                      .filter(
                        (e) =>
                          e.id == unit.packingUnitId ||
                          variantPackingUnits.findIndex(
                            (a) => a.packingUnitId == e.id,
                          ) == -1,
                      )
                      .map((pu) => ({
                        label: pu.name,
                        value: pu.id,
                      }))}
                    label={handleTranslate("PackingUnits")}
                    value={unit.packingUnitId}
                    disabled={formType === FormTypes.Details}
                    onChange={(value: string) => {
                      const updated = [...variantPackingUnits];
                      updated[rowIndex].packingUnitId = value ?? "";
                      handleUpdate(updated);
                    }}
                    handleBlur={null}
                    defaultSelect
                    error={!!errors[`packingUnits[${rowIndex}].packingUnitId`]}
                    helperText={handleTranslate(
                      errors[`packingUnits[${rowIndex}].packingUnitId`],
                    )}
                  />
                </td>
                <td>
                  <InputNumber
                    className="form-control"
                    variant="outlined"
                    fullWidth
                    disabled={
                      formType === FormTypes.Details ||
                      unit.isDefaultPackingUnit
                    }
                    value={unit.partsCount ?? 0}
                    onChange={(value) => handleDiscountChange(rowIndex, value)}
                    error={!!errors[`packingUnits[${rowIndex}].partsCount`]}
                    helperText={handleTranslate(
                      errors[`packingUnits[${rowIndex}].partsCount`],
                    )}
                  />
                </td>
                <td>
                  <InputText
                    className="form-control"
                    variant="outlined"
                    fullWidth
                    value={
                      " ( " +
                      (packingUnits.find((e) => e.id == unit.packingUnitId)
                        ?.name ?? "") +
                      " ) " +
                      " = " +
                      unit.partsCount.toString() +
                      " x " +
                      (packingUnits.find(
                        (e) =>
                          e.id ==
                          variantPackingUnits.find(
                            (e) => e.isDefaultPackingUnit,
                          )?.packingUnitId,
                      )?.name ?? "")
                    }
                    disabled
                    label=""
                  />
                </td>
                <td>
                  <FormControlLabel
                    control={
                      <Switch
                        disabled={formType === FormTypes.Details}
                        checked={unit.isDefaultSales}
                        onChange={({ target }) =>
                          handleUpdateIsDefaultSales(rowIndex, target.checked)
                        }
                      />
                    }
                    label=""
                  />
                </td>
                <td>
                  <FormControlLabel
                    control={
                      <Switch
                        disabled={formType === FormTypes.Details}
                        checked={unit.isDefaultPurchases}
                        onChange={({ target }) =>
                          handleUpdateIsDefaultPurchase(
                            rowIndex,
                            target.checked,
                          )
                        }
                      />
                    }
                    label=""
                  />
                </td>
                <td>
                  <InputNumber
                    className="form-control"
                    variant="outlined"
                    fullWidth
                    disabled={formType === FormTypes.Details}
                    value={unit.lastCostPrice ?? 0}
                    onChange={(value) => {
                      const updated = [...variantPackingUnits];
                      updated[rowIndex].lastCostPrice = value ?? 0;

                      const changedUnit = updated[rowIndex];
                      if (changedUnit.isDefaultPackingUnit) {
                        const defaultPrice = value ?? 0;
                        const finalUpdated = updated.map((unit, i) => {
                          if (i === rowIndex) return unit;
                          return {
                            ...unit,
                            lastCostPrice:
                              unit.partsCount == 0
                                ? 0
                                : defaultPrice * unit.partsCount,
                          };
                        });
                        handleUpdate(finalUpdated);
                      } else {
                        handleUpdate(updated);
                      }
                    }}
                    error={!!errors[`packingUnits[${rowIndex}].lastCostPrice`]}
                    helperText={handleTranslate(
                      errors[`packingUnits[${rowIndex}].lastCostPrice`],
                    )}
                  />
                </td>
                <td>
                  <InputNumber
                    className="form-control"
                    variant="outlined"
                    fullWidth
                    disabled={formType === FormTypes.Details}
                    value={unit.averageCostPrice ?? 0}
                    onChange={(value) => {
                      const updated = [...variantPackingUnits];
                      updated[rowIndex].averageCostPrice = value ?? 0;

                      const changedUnit = updated[rowIndex];
                      if (changedUnit.isDefaultPackingUnit) {
                        const defaultPrice = value ?? 0;
                        const finalUpdated = updated.map((unit, i) => {
                          if (i === rowIndex) return unit;
                          return {
                            ...unit,
                            averageCostPrice:
                              unit.partsCount == 0
                                ? 0
                                : defaultPrice * unit.partsCount,
                          };
                        });
                        handleUpdate(finalUpdated);
                      } else {
                        handleUpdate(updated);
                      }
                    }}
                    error={
                      !!errors[`packingUnits[${rowIndex}].averageCostPrice`]
                    }
                    helperText={handleTranslate(
                      errors[`packingUnits[${rowIndex}].averageCostPrice`],
                    )}
                  />
                </td>
                {unit.sellingPrices?.map((sellingPrice, sellidx) => (
                  <td key={sellingPrice.sellingPriceId} className="min-w-250">
                    <InputNumber
                      className="form-control"
                      variant="outlined"
                      fullWidth
                      disabled={formType === FormTypes.Details}
                      value={sellingPrice.amount ?? 0}
                      onChange={(value) =>
                        handleSellingPriceChange(
                          rowIndex,
                          sellingPrice.sellingPriceId,
                          value,
                        )
                      }
                      error={
                        !!errors[
                          `packingUnits[${rowIndex}].sellingPrices[${sellidx}].amount`
                        ]
                      }
                      helperText={handleTranslate(
                        errors[
                          `packingUnits[${rowIndex}].sellingPrices[${sellidx}].amount`
                        ],
                      )}
                    />
                  </td>
                ))}
                <td>
                  {!unit.isDefaultPackingUnit && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteRow(rowIndex)}
                      disabled={formType === FormTypes.Details}
                    >
                      <Delete fontSize="small" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="btn btn-secondary mt-2"
        onClick={handleAddNewItemPackingUnit}
        disabled={formType === FormTypes.Details}
      >
        <Add fontSize="small" />
      </button>
    </div>
  );
};

export default VariantPackingUnitsInput;
