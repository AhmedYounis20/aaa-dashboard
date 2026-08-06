import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import {
  InventoryTransferModel,
  InventoryTransferType,
  InventoryTransferTypeOptions,
} from '../../../../interfaces/ProjectInterfaces/Inventory/InventoryTransferModel';
import InputText from '../../../../Components/Inputs/InputText';
import InputAutoComplete from '../../../../Components/Inputs/InputAutoCompelete';
import InputSelect from '../../../../Components/Inputs/InputSelect';
import * as yup from 'yup';
import { getBranches } from '../../../../Apis/Account/BranchesApi';
import BranchModel from '../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Branches/BranchModel';
import VariantModel from '../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantModel';
import VariantPackingUnitModel from '../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantPackingUnitModel';
import SelectVariantsModal from './SelectVariantsModal';
import ThemedTooltip from '../../../../Components/UI/ThemedTooltip';
import InputNumber from '../../../../Components/Inputs/InputNumber';
import { getCurrentBalance } from '../../../../Apis/Inventory/StockBalanceApi';

const lineSchema = yup.object().shape({
  variantId: yup.string().required('Variant is required'),
  packingUnitId: yup.string().required('Packing unit is required'),
  quantity: yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
});

const transferSchema = yup.object().shape({
  sourceBranchId: yup.string().required('Source branch is required'),
  destinationBranchId: yup.string().required('Destination branch is required'),
  items: yup.array().of(lineSchema).min(1, 'At least one variant is required'),
});

const InventoryTransferForm: React.FC<{
  formType: FormTypes;
  model?: InventoryTransferModel;
  handleCloseForm: () => void;
  afterAction: () => void;
  onSubmit: (data: InventoryTransferModel) => Promise<boolean>;
}> = ({ formType, model, handleCloseForm, afterAction, onSubmit }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<InventoryTransferModel>(
    model || {
      sourceBranchId: '',
      destinationBranchId: '',
      transferType: InventoryTransferType.Direct,
      notes: '',
      items: [],
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [branches, setBranches] = useState<BranchModel[]>([]);
  const [showSelectVariants, setShowSelectVariants] = useState(false);
  const [lineBalances, setLineBalances] = useState<Record<number, number>>({});

  useEffect(() => {
    getBranches().then((res) => {
      if (res.isSuccess) setBranches(res.result || []);
    });
  }, []);

  useEffect(() => {
    if (!form.sourceBranchId) {
      setLineBalances({});
      return;
    }

    const fetchBalances = async () => {
      const balances: Record<number, number> = {};
      await Promise.all(
        form.items.map(async (item, idx) => {
          if (!item.variantId || !item.packingUnitId) return;
          const res = await getCurrentBalance(item.variantId, item.packingUnitId, form.sourceBranchId);
          balances[idx] = res.isSuccess && res.result ? res.result.currentBalance : 0;
        })
      );
      setLineBalances(balances);
    };

    fetchBalances();
  }, [form.sourceBranchId, form.items]);

  const handleRemoveItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const validate = async () => {
    try {
      await transferSchema.validate(form, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const validationErrorsMap: Record<string, string> = {};
      (validationErrors as yup.ValidationError).inner.forEach((error: yup.ValidationError) => {
        if (error.path) validationErrorsMap[error.path] = error.message;
      });
      setErrors(validationErrorsMap);
      return false;
    }
  };

  const handleSubmit = async () => {
    if ((await validate()) === false) return false;
    const result = await onSubmit(form);
    if (result) afterAction();
    return result;
  };

  const transferTypeOptions = InventoryTransferTypeOptions;

  const handleAddSelectedVariants = (selectedVariants: VariantModel[]) => {
    const newVariants = selectedVariants.filter((sel) => !form.items.some((i) => i.variantId === sel.id));
    const updatedItems = [...form.items];
    for (const variant of newVariants) {
      const packingUnits = variant.packingUnits || [];
      const defaultPU =
        packingUnits.find((pu) => pu.isDefaultPurchases) || packingUnits[0];
      updatedItems.push({
        variantId: variant.id,
        packingUnitId: defaultPU?.packingUnitId || '',
        quantity: 1,
        variant,
        packingUnit: defaultPU,
      });
    }
    setForm((prev) => ({ ...prev, items: updatedItems }));
  };

  const handlePackingUnitChange = (idx: number, packingUnitId: string) => {
    const line = form.items[idx];
    const packingUnits: VariantPackingUnitModel[] = line.variant?.packingUnits || [];
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((it, i) =>
        i === idx
          ? {
              ...it,
              packingUnitId,
              packingUnit: packingUnits.find((pu) => pu.packingUnitId === packingUnitId),
            }
          : it
      ),
    }));
  };

  const handleQuantityChange = (idx: number, quantity: number) => {
    const balance = lineBalances[idx] ?? 0;
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((it, i) => (i === idx ? { ...it, quantity } : it)),
    }));
    if (quantity > balance)
      setErrors((prev) => ({ ...prev, [`items[${idx}].quantity`]: t('Quantity exceeds available balance') }));
    else setErrors((prev) => ({ ...prev, [`items[${idx}].quantity`]: '' }));
  };

  return (
    <div className="container h-full">
      <BaseForm
        formType={formType}
        handleCloseForm={handleCloseForm}
        isModal
        handleAdd={handleSubmit}
        handleUpdate={handleSubmit}
        handleDelete={undefined}
      >
        <div>
          <h5 className="mb-3">{t('Transfer Details')}</h5>
          <div className="row mb-3">
            <div className="col-md-4">
              <InputSelect
                label={t('Transfer Type')}
                options={transferTypeOptions}
                defaultValue={form.transferType}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                  setForm((prev) => ({ ...prev, transferType: e.target.value as InventoryTransferType }))
                }
                name="transferType"
                error={!!errors.transferType}
                onBlur={() => {}}
              />
            </div>
            <div className="col-md-4">
              <InputAutoComplete
                label={t('Source Branch')}
                options={branches.map((b) => ({ value: b.id, label: b.name }))}
                value={form.sourceBranchId || ''}
                onChange={(value: string) => setForm((prev) => ({ ...prev, sourceBranchId: value }))}
                name="sourceBranchId"
                error={!!errors.sourceBranchId}
                helperText={errors.sourceBranchId ? t(errors.sourceBranchId) : undefined}
              />
            </div>
            <div className="col-md-4">
              <InputAutoComplete
                label={t('Destination Branch')}
                options={branches.map((b) => ({ value: b.id, label: b.name }))}
                value={form.destinationBranchId || ''}
                onChange={(value: string) => setForm((prev) => ({ ...prev, destinationBranchId: value }))}
                name="destinationBranchId"
                error={!!errors.destinationBranchId}
                helperText={errors.destinationBranchId ? t(errors.destinationBranchId) : undefined}
              />
            </div>
          </div>
          <div className="mb-3">
            <InputText
              type="text"
              className="form-input form-control"
              label={t('Notes')}
              value={form.notes || ''}
              onChange={(value) => setForm((prev) => ({ ...prev, notes: value }))}
              fullWidth
            />
          </div>
          <div className="card mb-3">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>{t('Variants')}</span>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowSelectVariants(true)}>
                {t('SelectVariants')}
              </button>
            </div>
            <div className="card-body">
              <div className="row fw-bold mb-2 border-bottom pb-2">
                <div className="col-md-3">{t('Variant')}</div>
                <div className="col-md-2">{t('Product')}</div>
                <div className="col-md-2">{t('Code')}</div>
                <div className="col-md-2">{t('Packing Unit')}</div>
                <div className="col-md-1">{t('Quantity')}</div>
                <div className="col-md-1">{t('Available Stock')}</div>
                <div className="col-md-1"></div>
              </div>
              {form.items.map((line, idx) => {
                const packingUnits = line.variant?.packingUnits || [];
                const balance = lineBalances[idx] ?? 0;
                const packingUnit = packingUnits.find((pu) => pu.packingUnitId === line.packingUnitId);
                const isLowStock = balance === 0 || balance < (line.quantity || 1);
                const packingUnitLabel = packingUnit?.name || packingUnit?.packingUnitId || '';
                const availableStockStr = `${balance} ${packingUnitLabel}`.trim();

                return (
                  <div
                    key={idx}
                    className={`row mb-2 align-items-end border-bottom pb-2 ${isLowStock ? 'bg-warning bg-opacity-10' : ''}`}
                  >
                    <div className="col-md-3 d-flex align-items-center gap-2">
                      <span>{line.variant?.name || ''}</span>
                      {line.variant?.model && (
                        <ThemedTooltip title={t('Model') + ': ' + line.variant.model}>
                          <i className="bi bi-info-circle text-secondary" style={{ fontSize: 16 }}></i>
                        </ThemedTooltip>
                      )}
                    </div>
                    <div className="col-md-2">{line.variant?.productName || ''}</div>
                    <div className="col-md-2">{line.variant?.code || ''}</div>
                    <div className="col-md-2">
                      <InputSelect
                        label={t('Packing Unit')}
                        options={packingUnits.map((pu) => ({
                          value: pu.packingUnitId,
                          label: pu.name || pu.packingUnitId,
                        }))}
                        defaultValue={line.packingUnitId}
                        onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                          handlePackingUnitChange(idx, e.target.value as string)
                        }
                        name={`items[${idx}].packingUnitId`}
                        error={!!errors[`items[${idx}].packingUnitId`]}
                        onBlur={() => {}}
                      />
                    </div>
                    <div className="col-md-1">
                      <InputNumber
                        className="form-input form-control"
                        label={t('Quantity')}
                        value={line.quantity}
                        onChange={(value) => handleQuantityChange(idx, value)}
                        isRquired
                        error={!!errors[`items[${idx}].quantity`]}
                        helperText={
                          errors[`items[${idx}].quantity`] ? t(errors[`items[${idx}].quantity`]) : undefined
                        }
                      />
                    </div>
                    <div className="col-md-1 d-flex align-items-center">
                      <span className={isLowStock ? 'text-danger fw-bold' : ''}>{availableStockStr}</span>
                      {isLowStock && (
                        <ThemedTooltip title={t('Stock is low or unavailable')}>
                          <i className="bi bi-exclamation-triangle-fill text-danger ms-2" style={{ fontSize: 16 }}></i>
                        </ThemedTooltip>
                      )}
                    </div>
                    <div className="col-md-1 d-flex align-items-center">
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveItem(idx)}>
                        {t('Remove')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </BaseForm>
      <SelectVariantsModal
        open={showSelectVariants}
        onClose={() => setShowSelectVariants(false)}
        onConfirm={handleAddSelectedVariants}
        sourceBranchId={form.sourceBranchId}
        alreadySelectedIds={form.items.map((i) => i.variantId)}
      />
    </div>
  );
};

export default InventoryTransferForm;
