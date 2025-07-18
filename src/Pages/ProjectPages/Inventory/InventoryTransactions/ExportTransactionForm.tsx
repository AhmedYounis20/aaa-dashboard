import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import { toastify } from '../../../../Helper/toastify';
import InputText from '../../../../Components/Inputs/InputText';
import InputDateTime from '../../../../Components/Inputs/InputDateTime';
import InputNumber from '../../../../Components/Inputs/InputNumber';
import InputAutoComplete from '../../../../Components/Inputs/InputAutoCompelete';
import { Add, Delete } from '@mui/icons-material';
import { IconButton, TextareaAutosize } from '@mui/material';
import updateModel from '../../../../Helper/updateModelHelper';
import { v4 as uuid } from 'uuid';

// API imports
import { createExportTransaction, getExportTransactionNumber, getExportTransactionById } from '../../../../Apis/Inventory/ExportTransactionsApi';
import { getItems, getItemById } from '../../../../Apis/Inventory/ItemsApi';
import { getPackingUnits } from '../../../../Apis/Inventory/PackingUnitsApi';
import { getBranches } from '../../../../Apis/Account/BranchesApi';
import { getChartOfAccounts } from '../../../../Apis/Account/ChartOfAccountsApi';

// Model imports
import ItemModel from '../../../../interfaces/ProjectInterfaces/Inventory/Items/ItemModel';
import PackingUnitModel from '../../../../interfaces/ProjectInterfaces/Inventory/PackingUnits/PackingUnitModel';
import BranchModel from '../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Branches/BranchModel';
import ChartOfAccountModel from '../../../../interfaces/ProjectInterfaces/Account/ChartOfAccount/ChartOfAccountModel';
import { NodeType } from '../../../../interfaces/Components/NodeType';

// Local interfaces for form state
interface ExportTransactionFormModel {
  id: string;
  transactionNumber: string;
  financialPeriodNumber: string;
  financialPeriodId: string;
  documentNumber: string;
  transactionDate: Date;
  transactionPartyId: string;
  branchId: string;
  notes: string;
  items: ExportTransactionItemFormModel[];
}

interface ExportTransactionItemFormModel {
  id: string;
  itemId: string;
  packingUnitId: string;
  quantity: number;
  totalCost: number;
}

const ExportTransactionForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  afterAction: () => void;
}> = ({ formType, id, handleCloseForm, afterAction }) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(formType !== FormTypes.Add);
  
  // Data states
  const [items, setItems] = useState<ItemModel[]>([]);
  const [packingUnits, setPackingUnits] = useState<PackingUnitModel[]>([]);
  const [branches, setBranches] = useState<BranchModel[]>([]);
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccountModel[]>([]);
  const [itemDetails, setItemDetails] = useState<Record<string, ItemModel>>({});
  
  const createTransactionItem = (): ExportTransactionItemFormModel => ({
    id: uuid(),
    itemId: '',
    packingUnitId: '',
    quantity: 0,
    totalCost: 0
  });
  
  // Model state
  const [model, setModel] = useState<ExportTransactionFormModel>({
    id: id,
    transactionNumber: '',
    financialPeriodNumber: '',
    financialPeriodId: '',
    documentNumber: '',
    transactionDate: new Date(),
    transactionPartyId: '',
    branchId: '',
    notes: '',
    items: [createTransactionItem()]
  });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      if (formType !== FormTypes.Delete) {
        try {
          const [itemsRes, packingUnitsRes, branchesRes, chartOfAccountsRes] = await Promise.all([
            getItems(),
            getPackingUnits(),
            getBranches(),
            getChartOfAccounts()
          ]);

          if (itemsRes.isSuccess) setItems(itemsRes.result || []);
          if (packingUnitsRes.isSuccess) setPackingUnits(packingUnitsRes.result || []);
          if (branchesRes.isSuccess) {
            setBranches((branchesRes.result || []).filter((b: BranchModel) => b.nodeType === NodeType.Domain));
          }
          if (chartOfAccountsRes?.isSuccess) setChartOfAccounts(chartOfAccountsRes?.result || []);
        } catch (error) {
          console.error('Error loading data:', error);
          toastify('Error loading data', 'error');
        }
      }
    };

    loadData();
  }, [formType]);

  // Get transaction number and financial period when date changes
  useEffect(() => {
    if (formType === FormTypes.Add && model.transactionDate) {
      getExportTransactionNumber(model.transactionDate).then((e) => {
        if (!e || !e.result) return;
        const { result } = e;
        setModel((prevModel) =>
          prevModel
            ? {
                ...prevModel,
                transactionNumber: result.transactionNumber ?? "",
                financialPeriodId: result.financialPeriodId ?? "",
                financialPeriodNumber: result.financialPeriodNumber ?? "",
                documentNumber:
                  prevModel.documentNumber == null ||
                  prevModel.documentNumber == "" ||
                  prevModel.documentNumber ==
                    `${result.financialPeriodNumber}\\${result.transactionNumber}`
                    ? `${result.financialPeriodNumber}\\${result.transactionNumber}`
                    : prevModel.documentNumber,
              }
            : prevModel
        );
      });
    }
  }, [model.transactionDate, formType]);

  useEffect(() => {
    if ((formType === FormTypes.Details || formType === FormTypes.Edit) && id) {
      setIsLoading(true);
      var fetchData = async () => {
        var res = await getExportTransactionById(id);

        if (res.isSuccess && res.result) {
          setModel({
            id: res.result.id,
            transactionNumber: res.result.transactionNumber ?? '',
            financialPeriodNumber: res.result.financialPeriod?.yearNumber ?? '',
            financialPeriodId: res.result.financialPeriodId ?? '',
            documentNumber: res.result.documentNumber ?? '',
            transactionDate: new Date(res.result.transactionDate),
            transactionPartyId: res.result.transactionPartyId ?? '',
            branchId: res.result.branchId ?? '',
            notes: res.result.notes ?? '',
            items: res.result.items && res.result.items.length > 0
              ? res.result.items.map(item => ({ 
                  id: item.id || uuid(),
                  itemId: item.itemId,
                  packingUnitId: item.packingUnitId,
                  quantity: item.quantity,
                  totalCost: item.totalCost
                }))
              : [createTransactionItem()]
          });
        } else {
          toastify('Failed to load transaction details', 'error');
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [formType, id]);

  const addItem = () => {
    setModel(prev => ({
      ...prev,
      items: [...prev.items, createTransactionItem()]
    }));
  };

  const removeItem = (itemId: string) => {
    setModel(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const updateItem = (itemId: string, field: string, value: any) => {
    setModel(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));

    // If item is selected, fetch its packing units
    if (field === 'itemId' && value) {
      getItemById(value).then((response) => {
        if (response.isSuccess && response.result) {
          const selectedItem = response.result;
          // Store the item details
          setItemDetails(prev => ({
            ...prev,
            [value]: selectedItem
          }));
          // Update the packing units for this specific item
          setModel(prev => ({
            ...prev,
            items: prev.items.map(item => 
              item.id === itemId ? { 
                ...item, 
                [field]: value,
                packingUnitId: '', // Reset packing unit when item changes
                totalCost: 0 // Reset total cost when item changes
              } : item
            )
          }));
        }
      });
    }

    // If packing unit is selected, calculate total cost
    if (field === 'packingUnitId' && value) {
      const currentItem = model.items.find(item => item.id === itemId);
      if (currentItem && currentItem.itemId) {
        const selectedItem = itemDetails[currentItem.itemId];
        if (selectedItem) {
          const packingUnit = selectedItem.packingUnits.find(pu => pu.packingUnitId === value);
          if (packingUnit && currentItem.quantity > 0) {
            const totalCost = packingUnit.averageCostPrice * currentItem.quantity;
            setModel(prev => ({
              ...prev,
              items: prev.items.map(item => 
                item.id === itemId ? { 
                  ...item, 
                  [field]: value,
                  totalCost: totalCost
                } : item
              )
            }));
          }
        }
      }
    }

    // If quantity is changed, recalculate total cost
    if (field === 'quantity' && value > 0) {
      const currentItem = model.items.find(item => item.id === itemId);
      if (currentItem && currentItem.itemId && currentItem.packingUnitId) {
        const selectedItem = itemDetails[currentItem.itemId];
        if (selectedItem) {
          const packingUnit = selectedItem.packingUnits.find(pu => pu.packingUnitId === currentItem.packingUnitId);
          if (packingUnit) {
            const totalCost = packingUnit.averageCostPrice * value;
            setModel(prev => ({
              ...prev,
              items: prev.items.map(item => 
                item.id === itemId ? { 
                  ...item, 
                  [field]: value,
                  totalCost: totalCost
                } : item
              )
            }));
          }
        }
      }
    }
  };

  // Get packing units for a specific item
  const getItemPackingUnits = (itemId: string): PackingUnitModel[] => {
    if (!itemId) return [];
    
    // First try to get from itemDetails (fetched items)
    const fetchedItem = itemDetails[itemId];
    if (fetchedItem && fetchedItem.packingUnits) {
      return packingUnits.filter(pu => 
        fetchedItem.packingUnits.some(itemPu => itemPu.packingUnitId === pu.id)
      );
    }
    
    // Fallback to items array
    const selectedItem = items.find(item => item.id === itemId);
    if (!selectedItem || !selectedItem.packingUnits) return [];
    
    return packingUnits.filter(pu => 
      selectedItem.packingUnits.some(itemPu => itemPu.packingUnitId === pu.id)
    );
  };

  const validate = async () => {
    const newErrors: Record<string, string> = {};

    if (!model.transactionPartyId) {
      newErrors.transactionPartyId = 'Party is required';
    }

    if (!model.branchId) {
      newErrors.branchId = 'Branch is required';
    }

    if (model.items.length === 0) {
      newErrors.items = 'At least one item is required';
    } else if (model.items.every(item => !item.itemId && !item.packingUnitId && item.quantity === 0 && item.totalCost === 0)) {
      newErrors.items = 'At least one item must be filled';
    }

    // Validate each item
    model.items.forEach((item, index) => {
      if (!item.itemId) {
        newErrors[`items[${index}].itemId`] = 'Item is required';
      }
      if (!item.packingUnitId) {
        newErrors[`items[${index}].packingUnitId`] = 'Packing unit is required';
      }
      if (item.quantity <= 0) {
        newErrors[`items[${index}].quantity`] = 'Quantity must be greater than 0';
      }
      if (item.totalCost <= 0) {
        newErrors[`items[${index}].totalCost`] = 'Total cost must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!(await validate())) return false;

    try {
      const response = await createExportTransaction({
        transactionDate: model.transactionDate,
        documentNumber: model.documentNumber,
        transactionPartyId: model.transactionPartyId,
        branchId: model.branchId,
        notes: model.notes,
        items: model.items
      });

      if (response.isSuccess) {
        toastify(response.successMessage || 'Export transaction created successfully');
        afterAction();
        return true;
      } else if (response.errorMessages) {
        response.errorMessages.forEach(error => toastify(error, 'error'));
        return false;
      }
      return false;
    } catch (error) {
      console.error('Error creating export transaction:', error);
      toastify('Error creating export transaction', 'error');
      return false;
    }
  };

  const handleUpdate = async () => {
    // TODO: Implement update functionality
    return false;
  };

  const handleDelete = async () => {
    // TODO: Implement delete functionality
    return false;
  };

  return (
    <div className="h-full">
      <BaseForm
        formType={formType}
        isModal
        handleAdd={handleAdd}
        handleDelete={handleDelete}
        handleCloseForm={handleCloseForm}
        handleUpdate={handleUpdate}
      >
        <div>
          {isLoading ? (
            <div className="d-flex flex-row align-items-center justify-content-center" style={{ height: "100px" }}>
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <>
              {formType === FormTypes.Delete ? (
                <p>{t('AreYouSureDelete')} export transaction with transaction number {model?.transactionNumber}</p>
              ) : (
                <>
                  <div className="row">
                    <div className="col col-md-6">
                      <div className="row mb-3">
                        <div className="col col-md-12">
                          <div className="row">
                            <div className="col col-md-6">
                              <InputText
                                type="text"
                                className="form-input form-control"
                                label={t("FinancialPeriodNumber")}
                                variant="outlined"
                                fullWidth
                                size="small"
                                disabled={true}
                                value={model?.financialPeriodNumber}
                                error={!!errors.financialPeriodNumber}
                                helperText={errors.financialPeriodNumber ? t(errors.financialPeriodNumber) : undefined}
                              />
                            </div>
                            <div className="col col-md-6">
                              <InputText
                                type="text"
                                size="small"
                                className="form-input form-control"
                                label={t("TransactionNumber")}
                                variant="outlined"
                                fullWidth
                                disabled={true}
                                value={model?.transactionNumber}
                                error={!!errors.transactionNumber}
                                helperText={errors.transactionNumber ? t(errors.transactionNumber) : undefined}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col col-md-12">
                          <InputText
                            type="text"
                            className="form-input form-control"
                            label={t("DocumentNumber")}
                            variant="outlined"
                            size="small"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.documentNumber}
                            onChange={(value) => updateModel(setModel, "documentNumber", value)}
                            error={!!errors.documentNumber}
                            helperText={errors.documentNumber ? t(errors.documentNumber) : undefined}
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col col-md-12">
                          <InputDateTime
                            label={t("TransactionDate")}
                            type="datetime"
                            value={model?.transactionDate}
                            onChange={(value) => updateModel(setModel, "transactionDate", value)}
                            disabled={formType === FormTypes.Details}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col col-md-6">
                      <div className="row mb-3">
                        <div className="col col-md-12">
                          <InputAutoComplete
                            size={"small"}
                            error={!!errors.branchId}
                            helperText={errors.branchId ? t(errors.branchId) : undefined}
                            options={branches?.map(
                              (item: { name: string; id: string }) => ({
                                ...item,
                                label: item.name,
                                value: item.id,
                              })
                            )}
                            label={t("Branch")}
                            value={model?.branchId}
                            disabled={formType === FormTypes.Details}
                            onChange={(value: any) =>
                              updateModel(setModel, "branchId", value)
                            }
                            multiple={false}
                            name={"Branches"}
                            handleBlur={null}
                            defaultSelect={true}
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col col-md-5">
                          <InputAutoComplete
                            size={"small"}
                            options={chartOfAccounts?.map(
                              (item: { code: string; id: string }) => ({
                                ...item,
                                label: item.code,
                                value: item.id,
                              })
                            )}
                            label={t("Party")}
                            value={model?.transactionPartyId}
                            disabled={formType === FormTypes.Details}
                            onChange={(value: any) =>
                              updateModel(setModel, "transactionPartyId", value)
                            }
                            defaultSelect={false}
                            multiple={false}
                            name={"DebtAccount"}
                            handleBlur={null}                                   
                          />
                        </div>
                        <div className="col col-md-7">
                          <InputAutoComplete
                            size={"small"}
                            error={!!errors.transactionPartyId}
                            helperText={errors.transactionPartyId ? t(errors.transactionPartyId) : undefined}
                            options={chartOfAccounts?.map(
                              (item: { name: string; id: string }) => ({
                                ...item,
                                label: item.name,
                                value: item.id,
                              })
                            )}
                            label={t("Party")}
                            value={model?.transactionPartyId}
                            disabled={formType === FormTypes.Details}
                            onChange={(value: any) =>
                              updateModel(setModel, "transactionPartyId", value)
                            }
                            multiple={false}
                            name={"Party"}
                            handleBlur={null}
                            defaultSelect={true}
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col col-md-12">
                          <TextareaAutosize
                            className="form-input form-control"
                            disabled={formType === FormTypes.Details}
                            value={model?.notes}
                            aria-label={t("Notes")}
                            placeholder={t("Notes")}
                            onChange={(event: { target: { value: string } }) =>
                              updateModel(setModel, "notes", event.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col col-md-12">
                      <h6 className="mb-2">{t('Items')}</h6>
                          
                      {model.items.map((item, index) => (
                        <div key={item.id} className="card card-body mb-2">
                          <div className="row">
                            <div className="col col-md-2">
                              <InputAutoComplete
                                label={t('Item')}
                                options={items.map(itemOption => ({
                                  label: itemOption.code,
                                  value: itemOption.id
                                }))}
                                value={item.itemId}
                                onChange={(value: any) => updateItem(item.id, 'itemId', value)}
                                disabled={formType === FormTypes.Details}
                                error={!!errors[`items[${index}].itemId`]}
                                helperText={errors[`items[${index}].itemId`]}
                              />
                            </div>
                            <div className="col col-md-3">
                              <InputAutoComplete
                                label={t('Item')}
                                options={items.map(itemOption => ({
                                  label: itemOption.name,
                                  value: itemOption.id
                                }))}
                                value={item.itemId}
                                onChange={(value: any) => updateItem(item.id, 'itemId', value)}
                                disabled={formType === FormTypes.Details}
                                error={!!errors[`items[${index}].itemId`]}
                                helperText={errors[`items[${index}].itemId`]}
                              />
                            </div>
                            <div className="col col-md-2">
                              <InputAutoComplete
                                label={t('PackingUnit')}
                                options={getItemPackingUnits(item.itemId).map(unit => ({
                                  label: unit.name,
                                  value: unit.id
                                }))}
                                value={item.packingUnitId}
                                onChange={(value: any) => updateItem(item.id, 'packingUnitId', value)}
                                disabled={formType === FormTypes.Details}
                                error={!!errors[`items[${index}].packingUnitId`]}
                                helperText={errors[`items[${index}].packingUnitId`]}
                              />
                            </div>
                            <div className="col col-md-2">
                              <InputNumber
                                label={t('Quantity')}
                                value={item.quantity}
                                onChange={(value) => updateItem(item.id, 'quantity', value)}
                                disabled={formType === FormTypes.Details}
                                error={!!errors[`items[${index}].quantity`]}
                                helperText={errors[`items[${index}].quantity`]}
                              />
                            </div>
                            <div className="col col-md-2">
                              <InputNumber
                                label={t('TotalCost')}
                                value={item.totalCost}
                                onChange={(value) => updateItem(item.id, 'totalCost', value)}
                                disabled={true}
                                error={!!errors[`items[${index}].totalCost`]}
                                helperText={errors[`items[${index}].totalCost`]}
                              />
                            </div>
                            <div className="col col-md-1 d-flex align-items-center">
                              <IconButton
                                onClick={() => removeItem(item.id)}
                                disabled={formType === FormTypes.Details}
                                color="error"
                                size="small"
                              >
                                <Delete />
                              </IconButton>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="d-flex justify-content-end align-items-center mb-2">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={addItem}
                          disabled={formType === FormTypes.Details}
                        >
                          <Add /> {t('AddItem')}
                        </button>
                      </div>
                      
                      {errors.items && (
                        <div className="text-danger small">{errors.items}</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </BaseForm>
    </div>
  );
};

export default ExportTransactionForm; 