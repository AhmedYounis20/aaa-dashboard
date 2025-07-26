import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import { InventoryTransferModel, InventoryTransferType, InventoryTransferTypeOptions } from '../../../../interfaces/ProjectInterfaces/Inventory/InventoryTransferModel';
import InputText from '../../../../Components/Inputs/InputText';
import InputAutoComplete from '../../../../Components/Inputs/InputAutoCompelete';
import InputSelect from '../../../../Components/Inputs/InputSelect';
import * as yup from 'yup';
import { getBranches } from '../../../../Apis/Account/BranchesApi';
import BranchModel from '../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Branches/BranchModel';
import ItemModel from '../../../../interfaces/ProjectInterfaces/Inventory/Items/ItemModel';
import SelectItemsModal from './SelectItemsModal';
import ThemedTooltip from '../../../../Components/UI/ThemedTooltip';
import InputNumber from '../../../../Components/Inputs/InputNumber';
import ItemPackingUnitModel from '../../../../interfaces/ProjectInterfaces/Inventory/Items/ItemPackingUnitModel';

const itemSchema = yup.object().shape({
  itemId: yup.string().required('Item is required'),
  packingUnitId: yup.string().required('Packing unit is required'),
  quantity: yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
});

const transferSchema = yup.object().shape({
  sourceBranchId: yup.string().required('Source branch is required'),
  destinationBranchId: yup.string().required('Destination branch is required'),
  items: yup.array().of(itemSchema).min(1, 'At least one item is required'),
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
    model || { sourceBranchId: '', destinationBranchId: '', transferType: InventoryTransferType.Direct, notes: '', items: [] }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [branches, setBranches] = useState<BranchModel[]>([]);
  const [showSelectItems, setShowSelectItems] = useState(false);

  useEffect(() => {
    getBranches().then(res => { if (res.isSuccess) setBranches(res.result); });
  }, []);


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
      (validationErrors as yup.ValidationError).inner.forEach((error: any) => {
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

  // Fetch packing units and default for each item when added
   const handleAddSelectedItems = async (selectedItems: ItemModel[]) => {
    const newItems = selectedItems.filter(sel => !form.items.some(i => i.itemId === sel.id));
    const updatedItems = [...form.items];
    for (const item of newItems) {
      // Use packingUnits from item
      const packingUnits = item.packingUnits || [];
      // Default packing unit
      const defaultPU = (packingUnits as any[]).find((pu: any) => pu.isDefaultPurchases) || packingUnits[0];
      updatedItems.push({
        itemId: item.id,
        packingUnitId: defaultPU?.packingUnitId || '',
        quantity: 1,
        notes: '',
        item,
        packingUnit: defaultPU,
      });
    }
    setForm(prev => ({ ...prev, items: updatedItems }));
  };

  const handlePackingUnitChange = (idx: number, packingUnitId: string) => {
    const item = form.items[idx];
    const packingUnits : ItemPackingUnitModel[]= item.item?.packingUnits || [];
    setForm(prev => ({
      ...prev,
      items: prev.items.map((it, i) => i === idx ? { ...it, packingUnitId, packingUnit: packingUnits.find(pu  => pu.packingUnitId === packingUnitId) } : it)
    }));
  };

  const handleQuantityChange = (idx: number, quantity: number) => {
    const item = form.items[idx];
    const balance = item.item?.stockBalances?.find(
      (sb: any) => sb.branchId === form.sourceBranchId && sb.packingUnitId === item.packingUnitId
    )?.currentBalance ?? 0;
    setForm(prev => ({
      ...prev,
      items: prev.items.map((it, i) => i === idx ? { ...it, quantity } : it)
    }));
    if (quantity > balance) 
      setErrors(prev => ({ ...prev, [`items[${idx}].quantity`]: t('Quantity exceeds available balance') }));
    else
      setErrors(prev => ({ ...prev, [`items[${idx}].quantity`]: '' }));
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
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => setForm(prev => ({ ...prev, transferType: e.target.value as InventoryTransferType }))}
                name="transferType"
                error={!!errors.transferType}
                onBlur={() => {}}
              />
            </div>
            <div className="col-md-4">
              <InputAutoComplete
                label={t('Source Branch')}
                options={branches.map(b => ({ value: b.id, label: b.name }))}
                value={form.sourceBranchId || ''}
                onChange={(value: string) => setForm(prev => ({ ...prev, sourceBranchId: value }))}
                name="sourceBranchId"
                error={!!errors.sourceBranchId}
                helperText={errors.sourceBranchId ? t(errors.sourceBranchId) : undefined}
              />
            </div>
            <div className="col-md-4">
              <InputAutoComplete
                label={t('Destination Branch')}
                options={branches.map(b => ({ value: b.id, label: b.name }))}
                value={form.destinationBranchId || ''}
                onChange={(value: string) => setForm(prev => ({ ...prev, destinationBranchId: value }))}
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
              onChange={value => setForm(prev => ({ ...prev, notes: value }))}
              fullWidth
            />
          </div>
          <div className="card mb-3">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>{t('Items')}</span>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowSelectItems(true)}>
                {t('Select Items')}
              </button>
            </div>
            <div className="card-body">
              <div className="row fw-bold mb-2 border-bottom pb-2">
                <div className="col-md-3">{t('Item')}</div>
                <div className="col-md-2">{t('Code')}</div>
                <div className="col-md-2">{t('Packing Unit')}</div>
                <div className="col-md-2">{t('Quantity')}</div>
                <div className="col-md-2">{t('Available Stock')}</div>
                <div className="col-md-1"></div>
              </div>
              {form.items.map((item, idx) => {
                const packingUnits = item.item?.packingUnits || [];
                const stockBalance = item.item?.stockBalances?.find(
                  (sb: any) => sb.branchId === form.sourceBranchId);
                const balance = stockBalance?.currentBalance ?? 0;
                const stockpackingUnit = packingUnits.find((pu: any) => pu.packingUnitId === stockBalance?.packingUnitId);
                const isLowStock = balance === 0 || balance < (item.quantity || 1);
                const packingUnitLabel = stockpackingUnit?.name || stockpackingUnit?.packingUnitId || '';
                const availableStockStr = `${balance} ${packingUnitLabel ? packingUnitLabel : ''}`.trim();
                return (
                  <div key={idx} className={`row mb-2 align-items-end border-bottom pb-2 ${isLowStock ? 'bg-warning bg-opacity-10' : ''}`}>
                    <div className="col-md-3 d-flex align-items-center gap-2">
                      <span>{item.item?.name || ''}</span>
                      {item.item?.model && (
                        <ThemedTooltip title={t('Model') + ': ' + item.item.model}>
                          <i className="bi bi-info-circle text-secondary" style={{ fontSize: 16 }}></i>
                        </ThemedTooltip>
                      )}
                    </div>
                    <div className="col-md-2">{item.item?.code || ''}</div>
                    <div className="col-md-2">
                      <InputSelect
                        label={t('Packing Unit')}
                        options={packingUnits.map((pu: any) => ({ value: pu.packingUnitId, label: pu.name || pu.packingUnitId }))}
                        defaultValue={item.packingUnitId}
                        onChange={(e: React.ChangeEvent<{ value: unknown }>) => handlePackingUnitChange(idx, e.target.value as string)}
                        name={`items[${idx}].packingUnitId`}
                        error={!!errors[`items[${idx}].packingUnitId`]}
                        onBlur={() => {}}
                      />
                    </div>
                    <div className="col-md-2">
                      <InputNumber
                        className="form-input form-control"
                        label={t('Quantity')}
                        value={item.quantity}
                        onChange={(value) => handleQuantityChange(idx, value)}
                        isRquired
                        error={!!errors[`items[${idx}].quantity`]}
                        helperText={errors[`items[${idx}].quantity`] ? t(errors[`items[${idx}].quantity`]) : undefined}
                      />
                    </div>
                    <div className="col-md-2 d-flex align-items-center">
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
      <SelectItemsModal
        open={showSelectItems}
        onClose={() => setShowSelectItems(false)}
        onConfirm={handleAddSelectedItems}
        sourceBranchId={form.sourceBranchId}
        alreadySelectedIds={form.items.map(i => i.itemId)}
      />
    </div>
  );
};

export default InventoryTransferForm; 