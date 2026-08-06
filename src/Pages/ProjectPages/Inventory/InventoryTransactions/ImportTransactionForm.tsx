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

import { createImportTransaction, getImportTransactionNumber, getImportTransactionById } from '../../../../Apis/Inventory/ImportTransactionsApi';
import { getVariants, getVariantById } from '../../../../Apis/Inventory/VariantsApi';
import { getPackingUnits } from '../../../../Apis/Inventory/PackingUnitsApi';
import { getBranches } from '../../../../Apis/Account/BranchesApi';
import { getChartOfAccounts } from '../../../../Apis/Account/ChartOfAccountsApi';

import VariantModel from '../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantModel';
import PackingUnitModel from '../../../../interfaces/ProjectInterfaces/Inventory/PackingUnits/PackingUnitModel';
import BranchModel from '../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Branches/BranchModel';
import ChartOfAccountModel from '../../../../interfaces/ProjectInterfaces/Account/ChartOfAccount/ChartOfAccountModel';
import { NodeType } from '../../../../interfaces/Components/NodeType';

interface ImportTransactionFormModel {
  id: string;
  transactionNumber: string;
  financialPeriodNumber: string;
  financialPeriodId: string;
  documentNumber: string;
  transactionDate: Date;
  transactionPartyId: string;
  branchId: string;
  notes: string;
  items: ImportTransactionItemFormModel[];
}

interface ImportTransactionItemFormModel {
  id: string;
  variantId: string;
  packingUnitId: string;
  quantity: number;
  totalCost: number;
}

const resolveVariantId = (line: { variantId?: string }) => line.variantId ?? '';

const ImportTransactionForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  afterAction: () => void;
}> = ({ formType, id, handleCloseForm, afterAction }) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(formType !== FormTypes.Add);

  const [variants, setVariants] = useState<VariantModel[]>([]);
  const [packingUnits, setPackingUnits] = useState<PackingUnitModel[]>([]);
  const [branches, setBranches] = useState<BranchModel[]>([]);
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccountModel[]>([]);
  const [variantDetails, setVariantDetails] = useState<Record<string, VariantModel>>({});

  const createTransactionItem = (): ImportTransactionItemFormModel => ({
    id: uuid(),
    variantId: '',
    packingUnitId: '',
    quantity: 0,
    totalCost: 0,
  });

  const [model, setModel] = useState<ImportTransactionFormModel>({
    id: id,
    transactionNumber: '',
    financialPeriodNumber: '',
    financialPeriodId: '',
    documentNumber: '',
    transactionDate: new Date(),
    transactionPartyId: '',
    branchId: '',
    notes: '',
    items: [createTransactionItem()],
  });

  useEffect(() => {
    const loadData = async () => {
      if (formType !== FormTypes.Delete) {
        try {
          const [variantsRes, packingUnitsRes, branchesRes, chartOfAccountsRes] = await Promise.all([
            getVariants(),
            getPackingUnits(),
            getBranches(),
            getChartOfAccounts(),
          ]);

          if (variantsRes.isSuccess) setVariants(variantsRes.result || []);
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

  useEffect(() => {
    if (formType === FormTypes.Add && model.transactionDate) {
      getImportTransactionNumber(model.transactionDate).then((e) => {
        if (!e || !e.result) return;
        const { result } = e;
        setModel((prevModel) =>
          prevModel
            ? {
                ...prevModel,
                transactionNumber: result.transactionNumber ?? '',
                financialPeriodId: result.financialPeriodId ?? '',
                financialPeriodNumber: result.financialPeriodNumber ?? '',
                documentNumber:
                  prevModel.documentNumber == null ||
                  prevModel.documentNumber == '' ||
                  prevModel.documentNumber == `${result.financialPeriodNumber}\\${result.transactionNumber}`
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
      const fetchData = async () => {
        const res = await getImportTransactionById(id);

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
            items:
              res.result.items && res.result.items.length > 0
                ? res.result.items.map((item) => ({
                    id: item.id || uuid(),
                    variantId: resolveVariantId(item),
                    packingUnitId: item.packingUnitId,
                    quantity: item.quantity,
                    totalCost: item.totalCost,
                  }))
                : [createTransactionItem()],
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
    setModel((prev) => ({
      ...prev,
      items: [...prev.items, createTransactionItem()],
    }));
  };

  const removeItem = (lineId: string) => {
    setModel((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== lineId),
    }));
  };

  const updateItem = (lineId: string, field: keyof ImportTransactionItemFormModel, value: string | number) => {
    setModel((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === lineId ? { ...item, [field]: value } : item)),
    }));

    if (field === 'variantId' && typeof value === 'string' && value) {
      getVariantById(value).then((response) => {
        if (response.isSuccess && response.result) {
          const selectedVariant = response.result;
          setVariantDetails((prev) => ({
            ...prev,
            [value]: selectedVariant,
          }));
          setModel((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
              item.id === lineId
                ? {
                    ...item,
                    variantId: value,
                    packingUnitId: '',
                    totalCost: 0,
                  }
                : item
            ),
          }));
        }
      });
    }

    if (field === 'packingUnitId' && typeof value === 'string' && value) {
      const currentItem = model.items.find((item) => item.id === lineId);
      if (currentItem?.variantId) {
        const selectedVariant = variantDetails[currentItem.variantId];
        if (selectedVariant) {
          const packingUnit = selectedVariant.packingUnits.find((pu) => pu.packingUnitId === value);
          if (packingUnit && currentItem.quantity > 0) {
            const totalCost = packingUnit.averageCostPrice * currentItem.quantity;
            setModel((prev) => ({
              ...prev,
              items: prev.items.map((item) =>
                item.id === lineId ? { ...item, packingUnitId: value, totalCost } : item
              ),
            }));
          }
        }
      }
    }

    if (field === 'quantity' && typeof value === 'number' && value > 0) {
      const currentItem = model.items.find((item) => item.id === lineId);
      if (currentItem?.variantId && currentItem.packingUnitId) {
        const selectedVariant = variantDetails[currentItem.variantId];
        if (selectedVariant) {
          const packingUnit = selectedVariant.packingUnits.find(
            (pu) => pu.packingUnitId === currentItem.packingUnitId
          );
          if (packingUnit) {
            const totalCost = packingUnit.averageCostPrice * value;
            setModel((prev) => ({
              ...prev,
              items: prev.items.map((item) =>
                item.id === lineId ? { ...item, quantity: value, totalCost } : item
              ),
            }));
          }
        }
      }
    }
  };

  const getVariantPackingUnits = (variantId: string): PackingUnitModel[] => {
    if (!variantId) return [];

    const fetchedVariant = variantDetails[variantId];
    if (fetchedVariant?.packingUnits) {
      return packingUnits.filter((pu) =>
        fetchedVariant.packingUnits.some((variantPu) => variantPu.packingUnitId === pu.id)
      );
    }

    const selectedVariant = variants.find((variant) => variant.id === variantId);
    if (!selectedVariant?.packingUnits) return [];

    return packingUnits.filter((pu) =>
      selectedVariant.packingUnits.some((variantPu) => variantPu.packingUnitId === pu.id)
    );
  };

  const getVariantLabel = (variant: VariantModel) =>
    variant.productName ? `${variant.productName} / ${variant.code}` : `${variant.code} - ${variant.name}`;

  const validate = async () => {
    const newErrors: Record<string, string> = {};

    if (!model.transactionPartyId) {
      newErrors.transactionPartyId = 'Party is required';
    }

    if (!model.branchId) {
      newErrors.branchId = 'Branch is required';
    }

    if (model.items.length === 0) {
      newErrors.items = 'At least one variant is required';
    } else if (
      model.items.every(
        (item) => !item.variantId && !item.packingUnitId && item.quantity === 0 && item.totalCost === 0
      )
    ) {
      newErrors.items = 'At least one variant line must be filled';
    }

    model.items.forEach((item, index) => {
      if (!item.variantId) {
        newErrors[`items[${index}].variantId`] = 'Variant is required';
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
      const response = await createImportTransaction({
        transactionDate: model.transactionDate,
        documentNumber: model.documentNumber,
        transactionPartyId: model.transactionPartyId,
        branchId: model.branchId,
        notes: model.notes,
        items: model.items.map(({ variantId, packingUnitId, quantity, totalCost }) => ({
          variantId,
          packingUnitId,
          quantity,
          totalCost,
        })),
      });

      if (response.isSuccess) {
        if (response.successMessage == null || response.successMessage === '')
          toastify(response.successMessage || 'Import transaction created successfully');
        afterAction();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating import transaction:', error);
      toastify('Error creating import transaction', 'error');
      return false;
    }
  };

  const handleUpdate = async () => false;
  const handleDelete = async () => false;

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
            <div className="d-flex flex-row align-items-center justify-content-center" style={{ height: '100px' }}>
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <>
              {formType === FormTypes.Delete ? (
                <p>
                  {t('AreYouSureDelete')} import transaction with transaction number {model?.transactionNumber}
                </p>
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
                                label={t('FinancialPeriodNumber')}
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
                                label={t('TransactionNumber')}
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
                            label={t('DocumentNumber')}
                            variant="outlined"
                            size="small"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.documentNumber}
                            onChange={(value) => updateModel(setModel, 'documentNumber', value)}
                            error={!!errors.documentNumber}
                            helperText={errors.documentNumber ? t(errors.documentNumber) : undefined}
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col col-md-12">
                          <InputDateTime
                            label={t('TransactionDate')}
                            type="datetime"
                            value={model?.transactionDate}
                            onChange={(value) => updateModel(setModel, 'transactionDate', value)}
                            disabled={formType === FormTypes.Details}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col col-md-6">
                      <div className="row mb-3">
                        <div className="col col-md-12">
                          <InputAutoComplete
                            size={'small'}
                            error={!!errors.branchId}
                            helperText={errors.branchId ? t(errors.branchId) : undefined}
                            options={branches?.map((item: { name: string; id: string }) => ({
                              ...item,
                              label: item.name,
                              value: item.id,
                            }))}
                            label={t('Branch')}
                            value={model?.branchId}
                            disabled={formType === FormTypes.Details}
                            onChange={(value: string) => updateModel(setModel, 'branchId', value)}
                            multiple={false}
                            name={'Branches'}
                            handleBlur={null}
                            defaultSelect={true}
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col col-md-5">
                          <InputAutoComplete
                            size={'small'}
                            options={chartOfAccounts?.map((item: { code: string; id: string }) => ({
                              ...item,
                              label: item.code,
                              value: item.id,
                            }))}
                            label={t('Party')}
                            value={model?.transactionPartyId}
                            disabled={formType === FormTypes.Details}
                            onChange={(value: string) => updateModel(setModel, 'transactionPartyId', value)}
                            defaultSelect={false}
                            multiple={false}
                            name={'DebtAccount'}
                            handleBlur={null}
                          />
                        </div>
                        <div className="col col-md-7">
                          <InputAutoComplete
                            size={'small'}
                            error={!!errors.transactionPartyId}
                            helperText={errors.transactionPartyId ? t(errors.transactionPartyId) : undefined}
                            options={chartOfAccounts?.map((item: { name: string; id: string }) => ({
                              ...item,
                              label: item.name,
                              value: item.id,
                            }))}
                            label={t('Party')}
                            value={model?.transactionPartyId}
                            disabled={formType === FormTypes.Details}
                            onChange={(value: string) => updateModel(setModel, 'transactionPartyId', value)}
                            multiple={false}
                            name={'Party'}
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
                            aria-label={t('Notes')}
                            placeholder={t('Notes')}
                            onChange={(event: { target: { value: string } }) =>
                              updateModel(setModel, 'notes', event.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col col-md-12">
                      <h6 className="mb-2">{t('Variants')}</h6>

                      {model.items.map((item, index) => (
                        <div key={item.id} className="card card-body mb-2">
                          <div className="row">
                            <div className="col col-md-4">
                              <InputAutoComplete
                                label={t('Variant')}
                                options={variants.map((variantOption) => ({
                                  label: getVariantLabel(variantOption),
                                  value: variantOption.id,
                                }))}
                                value={item.variantId}
                                onChange={(value: string) => updateItem(item.id, 'variantId', value)}
                                disabled={formType === FormTypes.Details}
                                error={!!errors[`items[${index}].variantId`]}
                                helperText={errors[`items[${index}].variantId`]}
                              />
                            </div>
                            <div className="col col-md-2">
                              <InputAutoComplete
                                label={t('PackingUnit')}
                                options={getVariantPackingUnits(item.variantId).map((unit) => ({
                                  label: unit.name,
                                  value: unit.id,
                                }))}
                                value={item.packingUnitId}
                                onChange={(value: string) => updateItem(item.id, 'packingUnitId', value)}
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
                          <Add /> {t('AddVariant')}
                        </button>
                      </div>

                      {errors.items && <div className="text-danger small">{errors.items}</div>}
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

export default ImportTransactionForm;
