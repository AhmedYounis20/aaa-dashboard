import { useEffect, useState } from 'react';
import { createItem, deleteItem, getItemById, getItemNextCode, updateItem} from "../../../../Apis/Inventory/ItemsApi";
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import { toastify } from '../../../../Helper/toastify';
import ItemModel from '../../../../interfaces/ProjectInterfaces/Inventory/Items/ItemModel';
import InputSelect from '../../../../Components/Inputs/InputSelect';
import updateModel from '../../../../Helper/updateModelHelper';
import InputText from '../../../../Components/Inputs/InputText';
import { NodeType, NodeTypeOptions } from '../../../../interfaces/Components/NodeType';
import { ItemType, ItemTypeOptions } from '../../../../interfaces/ProjectInterfaces/Inventory/Items/ItemType';
import BarCodesInput from './Components/BarCodes';
import InputNumber from '../../../../Components/Inputs/InputNumber';
import { DiscountType, DiscountTypeOptions } from '../../../../interfaces/ProjectInterfaces/Inventory/Items/DiscountType';
import InputAutoComplete from '../../../../Components/Inputs/InputAutoCompelete';
import SupplierModel from '../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Suppliers/SupplierModel';
import { getSuppliers } from '../../../../Apis/Account/SuppliersApi';
import ManufacturerCompanyModel from '../../../../interfaces/ProjectInterfaces/Inventory/ManufacturerCompanies/ManufacturerCompanyModel';
import { getManufacturerCompanies } from '../../../../Apis/Inventory/ManufacturerCompaniesApi';
import { FormControlLabel, Switch } from '@mui/material';
import DiscountPircesInput from './Components/DiscountPircesInput';
import ItemSellingPriceDiscountModel from "../../../../interfaces/ProjectInterfaces/Inventory/Items/ItemSellingPriceDiscountModel";
import ItemPackingUnitsInput from './Components/ItemPackingUnitsInput';
import ItemPackingUnitModel from '../../../../interfaces/ProjectInterfaces/Inventory/Items/ItemPackingUnitModel';
import { EMPTY_UUID } from '../../../../Utilities/SD';
import { ItemSchema } from '../../../../interfaces/ProjectInterfaces/Inventory/Items/item-validation';
import yup from "yup";

const ItemsForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
  afterAction: () => void;
  handleTranslate: (key: string) => string;
}> = ({
  formType,
  id,
  parentId,
  handleCloseForm,
  afterAction,
  handleTranslate,
}) => {
  const createItemPackingUnit: (
    isDefault?: boolean,
    orderNumber?: number
  ) => ItemPackingUnitModel = (isDefault = false, orderNumber = 0) => {
    const packingUnit: ItemPackingUnitModel = {
      packingUnitId: "",
      averageCostPrice: 0,
      isDefaultPackingUnit: isDefault,
      isDefaultPurchases: true,
      isDefaultSales: true,
      lastCostPrice: 0,
      orderNumber,
      partsCount: 1,
      sellingPrices: [],
    };

    return packingUnit;
  };
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [model, setModel] = useState<ItemModel>({
    id: EMPTY_UUID,
    code: "",
    name: "",
    nameSecondLanguage: "",
    parentId: parentId,
    nodeType: NodeType.Category,
    defaultDiscountType: DiscountType.Percent,
    barCodes: [],
    suppliersIds: [],
    manufacturerCompaniesIds: [],
    sellingPriceDiscounts: [],
    conditionalDiscount: 0,
    countryOfOrigin: "",
    defaultDiscount: 0,
    egsCode: "",
    gs1Code: "",
    isDiscountBasedOnSellingPrice: false,
    itemType: ItemType.Stock,
    maxDiscount: 100,
    model: "",
    version: "",
    packingUnits: [createItemPackingUnit(true, 0)],
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);

  const [companies, setCompanies] = useState<ManufacturerCompanyModel[]>([]);

  useEffect(() => {
    if (formType != FormTypes.Delete) {
      const fetchData = async () => {
        const result = await getSuppliers();
        if (result) {
          setSuppliers(
            result.result.filter((e) => e.nodeType == NodeType.Domain)
          );
        }
        const companiesResult = await getManufacturerCompanies();
        if (companiesResult) {
          setCompanies(companiesResult.result);
        }
      };
      fetchData();
    }
  }, [formType]);

  const validate = async () => {
    try {
      await ItemSchema.validate(model, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const validationErrorsMap: Record<string, string> = {};
      (validationErrors as yup.ValidationError).inner.forEach((error: any) => {
        if (error.path) validationErrorsMap[error.path] = error.message;
      });
      console.log(validationErrorsMap);
      setErrors(validationErrorsMap);
      return false;
    }
  };

  useEffect(() => {
    if (formType != FormTypes.Add) {
      const fetchData = async () => {
        const result = await getItemById(id);
        if (result) {
          setModel({
            ...result.result,
            sellingPriceDiscounts: result.result.sellingPriceDiscounts ?? [],
            packingUnits: result.result.packingUnits ?? [
              createItemPackingUnit(true, 0),
            ],
          });
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      const fetchData = async () => {
        const result = await getItemNextCode(parentId);
        if (result.isSuccess && result.result) {
          setModel((prevModel) =>
            prevModel ? { ...prevModel, code: result.result } : prevModel
          );
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [formType, id, parentId]);

  const handleDelete = async (): Promise<boolean> => {
    const response = await deleteItem(id);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      afterAction();
      return true;
    } else if (response) {
      console.log(response);
      response.errorMessages?.map((error: string) => {
        toastify(error, "error");
        console.log(error);
      });
      return false;
    }
    return false;
  };
  const handleUpdate = async () => {
    if ((await validate()) === false) return false;
    const response = await updateItem(model.id, model);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      afterAction();
      return true;
    } else if (response && response.errorMessages) {
      toastify(response.errorMessages[0], "error");
      return false;
    }
    return false;
  };
  const handleAdd = async () => {
    console.log(model);
    if ((await validate()) === false) return false;
    const response = await createItem(model);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      console.log(response);
      afterAction();
      return true;
    } else if (response && response.errorMessages) {
      toastify(response.errorMessages[0], "error");
      return false;
    }
    return false;
  };

  return (
    <div className="container h-full">
      <BaseForm
        formType={formType}
        handleCloseForm={handleCloseForm}
        handleAdd={handleAdd}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        isModal={false}
      >
        <div>
          {isLoading ? (
            <div
              className="d-flex flex-row align-items-center justify-content-center"
              style={{ height: "100px" }}
            >
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <>
              {formType === FormTypes.Delete ? (
                <p>are you sure, you want delete {model?.nameSecondLanguage}</p>
              ) : (
                <>
                  <div className="card card-body shadow-sm mb-3 rounded-3 border border-light-subtle">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h5 className="mb-0 fw-semibold text-dark-emphasis">
                        📝 {handleTranslate("ItemBasicInfo")}
                      </h5>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <InputText
                          type="text"
                          className="form-input form-control"
                          label={handleTranslate("Name")}
                          variant="outlined"
                          fullWidth
                          isRquired
                          disabled={formType === FormTypes.Details}
                          value={model?.name}
                          onChange={(value) =>
                            setModel((prev) =>
                              prev ? { ...prev, name: value } : prev
                            )
                          }
                          error={!!errors.name}
                          helperText={handleTranslate(errors.name)}
                        />
                      </div>

                      <div className="col-md-6">
                        <InputText
                          type="text"
                          className="form-input form-control"
                          label={handleTranslate("NameSecondLanguage")}
                          variant="outlined"
                          fullWidth
                          isRquired
                          disabled={formType === FormTypes.Details}
                          value={model?.nameSecondLanguage}
                          onChange={(value) =>
                            setModel((prev) =>
                              prev
                                ? { ...prev, nameSecondLanguage: value }
                                : prev
                            )
                          }
                          error={!!errors.nameSecondLanguage}
                          helperText={handleTranslate(
                            errors.nameSecondLanguage
                          )}
                        />
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <InputText
                          type="text"
                          className="form-input form-control"
                          label={handleTranslate("Code")}
                          isRquired
                          variant="outlined"
                          fullWidth
                          disabled={formType === FormTypes.Details}
                          value={model?.code}
                          onChange={(value) =>
                            setModel((prev) =>
                              prev ? { ...prev, code: value } : prev
                            )
                          }
                          error={!!errors.code}
                          helperText={handleTranslate(errors.code)}
                        />
                      </div>

                      <div className="col-md-6">
                        <InputSelect
                          options={NodeTypeOptions.map((e) => ({
                            ...e,
                            label: handleTranslate(e.label),
                          }))}
                          label={handleTranslate("NodeType")}
                          defaultValue={model?.nodeType}
                          disabled={formType !== FormTypes.Add}
                          multiple={false}
                          onChange={({
                            target,
                          }: {
                            target: { value: NodeType };
                          }) => updateModel(setModel, "nodeType", target.value)}
                          name="NodeType"
                          onBlur={null}
                          error={undefined}
                        />
                      </div>
                    </div>
                  </div>

                  {model.nodeType == NodeType.Domain && (
                    <>
                      <div className="card card-body shadow-sm mb-3 rounded-3 border border-light-subtle">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <h5 className="mb-0 fw-semibold text-dark-emphasis">
                            🧾 {handleTranslate("ItemCodesAndType")}
                          </h5>
                        </div>

                        <div className="row g-3">
                          <div className="col-md-3">
                            <InputSelect
                              options={ItemTypeOptions.map((e) => ({
                                ...e,
                                label: handleTranslate(e.label),
                              }))}
                              label={handleTranslate("ItemType")}
                              defaultValue={model?.itemType}
                              disabled={formType === FormTypes.Details}
                              multiple={false}
                              onChange={({
                                target,
                              }: {
                                target: { value: ItemType };
                              }) =>
                                updateModel(setModel, "itemType", target.value)
                              }
                              name="ItemType"
                              onBlur={null}
                              error={undefined}
                            />
                          </div>

                          <div className="col-md-3">
                            <InputText
                              type="text"
                              className="form-input form-control"
                              label={handleTranslate("GS1Code")}
                              variant="outlined"
                              fullWidth
                              disabled={
                                formType === FormTypes.Details ||
                                (model?.egsCode !== null &&
                                  model?.egsCode !== "")
                              }
                              value={model?.gs1Code}
                              onChange={(value) =>
                                setModel((prev) =>
                                  prev ? { ...prev, gs1Code: value } : prev
                                )
                              }
                              error={!!errors.gs1Code}
                              helperText={errors.gs1Code}
                            />
                          </div>

                          <div className="col-md-3">
                            <InputText
                              type="text"
                              className="form-input form-control"
                              label={handleTranslate("EGSCode")}
                              variant="outlined"
                              fullWidth
                              disabled={
                                formType === FormTypes.Details ||
                                (model?.gs1Code !== null &&
                                  model?.gs1Code !== "")
                              }
                              value={model?.egsCode}
                              onChange={(value) =>
                                setModel((prev) =>
                                  prev ? { ...prev, egsCode: value } : prev
                                )
                              }
                              error={!!errors.egsCode}
                              helperText={errors.egsCode}
                            />
                          </div>

                          <div className="col-md-3">
                            <BarCodesInput
                              barCodes={model.barCodes}
                              formType={formType}
                              handleTranslate={(key) => handleTranslate(key)}
                              handleUpdate={(barCodes: string[]) =>
                                setModel((prev) =>
                                  prev ? { ...prev, barCodes } : prev
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="card card-body shadow-sm mb-3 rounded-3 border border-light-subtle">
                        <div className="row">
                          <div className="col col-md-6">
                            <div className="card card-body">
                              <h5 className="mb-4">{handleTranslate("ItemDetails")}</h5>
                              <div className="row mb-3">
                                <div className="col col-md-6">
                                  <InputText
                                    type="text"
                                    className="form-input form-control"
                                    label={handleTranslate("Model")}
                                    variant="outlined"
                                    fullWidth
                                    disabled={formType === FormTypes.Details}
                                    value={model?.model}
                                    onChange={(value) =>
                                      setModel((prevModel) =>
                                        prevModel
                                          ? {
                                              ...prevModel,
                                              model: value,
                                            }
                                          : prevModel
                                      )
                                    }
                                  />
                                </div>
                                <div className="col col-md-6">
                                  <InputText
                                    type="text"
                                    className="form-input form-control"
                                    label={handleTranslate("Version")}
                                    variant="outlined"
                                    fullWidth
                                    disabled={formType === FormTypes.Details}
                                    value={model?.version}
                                    onChange={(value) =>
                                      setModel((prevModel) =>
                                        prevModel
                                          ? {
                                              ...prevModel,
                                              version: value,
                                            }
                                          : prevModel
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div className="row mb-3">
                                <div className="col col-md-6">
                                  <InputText
                                    type="text"
                                    className="form-input form-control"
                                    label={handleTranslate("CountryOfOrigin")}
                                    variant="outlined"
                                    fullWidth
                                    disabled={formType === FormTypes.Details}
                                    value={model?.countryOfOrigin}
                                    onChange={(value) =>
                                      setModel((prevModel) =>
                                        prevModel
                                          ? {
                                              ...prevModel,
                                              countryOfOrigin: value,
                                            }
                                          : prevModel
                                      )
                                    }
                                  />
                                </div>
                                <div className="col col-md-6">
                                  <InputAutoComplete
                                    options={suppliers?.map(
                                      (item: { name: string; id: string }) => {
                                        return {
                                          label: item.name,
                                          value: item.id,
                                        };
                                      }
                                    )}
                                    label={handleTranslate("Suppliers")}
                                    value={model.suppliersIds}
                                    disabled={formType === FormTypes.Details}
                                    onChange={(value: string[] | null) => {
                                      setModel((prevModel) => {
                                        console.log("prevModel:", prevModel);
                                        console.log("value:", value);
                                        return prevModel
                                          ? {
                                              ...prevModel,
                                              suppliersIds: value ?? [],
                                            }
                                          : prevModel;
                                      });
                                    }}
                                    multiple={true}
                                    handleBlur={null}
                                    // error={!!errors.chartOfAccounts}
                                    // helperText={errors.chartOfAccounts}
                                  />
                                </div>
                              </div>
                              <div className="row mb-3">
                                <div className="col col-md-6">
                                  <InputAutoComplete
                                    options={companies?.map(
                                      (item: { name: string; id: string }) => {
                                        return {
                                          label: item.name,
                                          value: item.id,
                                        };
                                      }
                                    )}
                                    label={handleTranslate(
                                      "ManufacturerCompanies"
                                    )}
                                    value={model.manufacturerCompaniesIds}
                                    disabled={formType === FormTypes.Details}
                                    onChange={(value: string[] | null) => {
                                      setModel((prevModel) => {
                                        console.log("prevModel:", prevModel);
                                        console.log("value:", value);
                                        return prevModel
                                          ? {
                                              ...prevModel,
                                              suppliersIds: value ?? [],
                                            }
                                          : prevModel;
                                      });
                                    }}
                                    multiple={true}
                                    handleBlur={null}
                                    // error={!!errors.chartOfAccounts}
                                    // helperText={errors.chartOfAccounts}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col col-md-6">
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
                                    value={model?.maxDiscount ?? null} // make sure value is number or null
                                    inputType="percent" // treat as percent, shows % sign inside
                                    precision={2} // two decimals precision
                                    onChange={(value) =>
                                      setModel((prevModel) =>
                                        prevModel
                                          ? {
                                              ...prevModel,
                                              maxDiscount: value,
                                            }
                                          : prevModel
                                      )
                                    }
                                  />
                                </div>
                                <div className="col col-md-6">
                                  <InputNumber
                                    className="form-input form-control"
                                    label={handleTranslate(
                                      "ConditionalDiscount"
                                    )}
                                    variant="outlined"
                                    fullWidth
                                    disabled={formType === FormTypes.Details}
                                    value={model?.conditionalDiscount ?? null} // make sure value is number or null
                                    inputType="percent" // treat as percent, shows % sign inside
                                    precision={2} // two decimals precision
                                    onChange={(value) =>
                                      setModel((prevModel) =>
                                        prevModel
                                          ? {
                                              ...prevModel,
                                              conditionalDiscount: value,
                                            }
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
                                    value={model?.defaultDiscount ?? null} // make sure value is number or null
                                    inputType={
                                      model.defaultDiscountType ==
                                      DiscountType.Percent
                                        ? "percent"
                                        : "number"
                                    } // treat as percent, shows % sign inside
                                    onChange={(value) =>
                                      setModel((prevModel) =>
                                        prevModel
                                          ? {
                                              ...prevModel,
                                              defaultDiscount: value,
                                            }
                                          : prevModel
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
                                      updateModel(
                                        setModel,
                                        "defaultDiscountType",
                                        target.value
                                      );
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
                                        checked={
                                          model?.isDiscountBasedOnSellingPrice
                                        }
                                        onChange={({
                                          target,
                                        }: {
                                          target: { checked: boolean };
                                        }) =>
                                          setModel((prevModel) =>
                                            prevModel
                                              ? {
                                                  ...prevModel,
                                                  isDiscountBasedOnSellingPrice:
                                                    target.checked,
                                                  defaultDiscount:
                                                    target.checked
                                                      ? 0
                                                      : prevModel.defaultDiscount,
                                                }
                                              : prevModel
                                          )
                                        }
                                      />
                                    }
                                    label={handleTranslate(
                                      "IsDiscountBasedOnSellingPrice"
                                    )}
                                  />
                                </div>
                                <div className="col col-md-6">
                                  {model.isDiscountBasedOnSellingPrice && (
                                    <DiscountPircesInput
                                      formType={formType}
                                      itemSellingPriceDiscounts={
                                        model.sellingPriceDiscounts
                                      }
                                      handleUpdate={(
                                        items: ItemSellingPriceDiscountModel[]
                                      ) => {
                                        setModel((prevModel) => ({
                                          ...(prevModel ?? {}),
                                          sellingPriceDiscounts: items,
                                        }));
                                      }}
                                      handleTranslate={(key)=>handleTranslate(key)}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card card-body shadow-sm mb-3 rounded-3 border border-light-subtle">
                        <ItemPackingUnitsInput
                          itemPackingUnits={model.packingUnits}
                          handleTranslate={(key)=>handleTranslate(key)}
                          formType={formType}
                          handleUpdate={(items) =>
                            setModel((prev) =>
                              prev ? { ...prev, packingUnits: items } : prev
                            )
                          }
                          errors={errors}
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </BaseForm>
    </div>
  );
};

export default ItemsForm;
