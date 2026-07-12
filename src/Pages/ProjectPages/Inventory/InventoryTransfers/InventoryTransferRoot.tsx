import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  getTransfersByStatus,
  createTransfer,
  approveTransfer,
  rejectTransfer,
  getInventoryTransfers,
} from '../../../../Apis/Inventory/InventoryTransferApi';
import {
  InventoryTransferModel,
  InventoryTransferStatus,
  InventoryTransferType,
} from '../../../../interfaces/ProjectInterfaces/Inventory/InventoryTransferModel';
import InventoryTransferForm from './InventoryTransferForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import { RootState } from '../../../../Storage/Redux/store';
import { toastify } from '../../../../Helper/toastify';

const isPendingTransfer = (transfer: InventoryTransferModel) => {
  const status = transfer.status;
  return (
    status === InventoryTransferStatus.Pending ||
    status === 'Pending' ||
    status === 0 ||
    status === '0'
  );
};

const getTransferTypeLabel = (transferType: InventoryTransferType | number) => {
  if (transferType === InventoryTransferType.Conditional || transferType === 0) return 'Conditional';
  return 'Direct';
};

const getStatusLabel = (status: InventoryTransferModel['status']) => {
  if (status === InventoryTransferStatus.Pending || status === 0 || status === '0' || status === 'Pending')
    return 'Pending';
  if (status === InventoryTransferStatus.Approved || status === 1 || status === '1' || status === 'Approved')
    return 'Approved';
  if (status === InventoryTransferStatus.Rejected || status === 2 || status === '2' || status === 'Rejected')
    return 'Rejected';
  return String(status ?? '');
};

const InventoryTransferRoot = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.userAuthStore);
  const [transfers, setTransfers] = useState<InventoryTransferModel[]>([]);
  const [status, setStatus] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedTransfer, setSelectedTransfer] = useState<InventoryTransferModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [transferTypeFilter, setTransferTypeFilter] = useState<InventoryTransferType | 'All'>('All');

  const fetchTransfers = async () => {
    setLoading(true);
    const result = status === 'All' ? await getInventoryTransfers() : await getTransfersByStatus(status);
    if (result && result.isSuccess) {
      let filtered = result.result || [];
      if (transferTypeFilter !== 'All') {
        filtered = filtered.filter((tr: InventoryTransferModel) => tr.transferType === transferTypeFilter);
      }
      setTransfers(filtered);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransfers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, transferTypeFilter]);

  const handleAdd = () => {
    setFormType(FormTypes.Add);
    setSelectedTransfer(null);
    setShowForm(true);
  };

  const handleApprove = async (id: string) => {
    setLoading(true);
    await approveTransfer(id);
    fetchTransfers();
    setLoading(false);
  };

  const handleReject = async (id: string) => {
    if (!user?.id) {
      toastify(t('User not found'), 'error');
      return;
    }
    const reason = prompt(t('Enter rejection reason') || '');
    if (reason === null) return;
    setLoading(true);
    await rejectTransfer(id, user.id, reason || undefined);
    fetchTransfers();
    setLoading(false);
  };

  const handleFormSubmit = async (data: InventoryTransferModel) => {
    setLoading(true);
    if (formType === FormTypes.Add) {
      const result = await createTransfer(data);
      if (result && result.isSuccess) {
        setShowForm(false);
        fetchTransfers();
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    }
    setLoading(false);
    return false;
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{t('Inventory Transfers')}</h2>
        <button className="btn btn-primary" onClick={handleAdd} disabled={loading}>
          {t('Add Transfer')}
        </button>
      </div>
      <div className="mb-3 d-flex align-items-center">
        <label>{t('Status')}</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="form-select w-auto d-inline-block ms-2"
          disabled={loading}
        >
          <option value="All">{t('All')}</option>
          <option value="Pending">{t('Pending')}</option>
          <option value="Approved">{t('Approved')}</option>
          <option value="Rejected">{t('Rejected')}</option>
        </select>
        <label className="ms-3">{t('Transfer Type')}</label>
        <select
          value={transferTypeFilter}
          onChange={(e) => setTransferTypeFilter(e.target.value as InventoryTransferType | 'All')}
          className="form-select w-auto d-inline-block ms-2"
          disabled={loading}
        >
          <option value="All">{t('All')}</option>
          <option value={InventoryTransferType.Conditional}>{t('Conditional')}</option>
          <option value={InventoryTransferType.Direct}>{t('Direct')}</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>{t('Source Branch')}</th>
              <th>{t('Destination Branch')}</th>
              <th>{t('Transfer Type')}</th>
              <th>{t('Status')}</th>
              <th>{t('Items')}</th>
              <th>{t('Approved At')}</th>
              <th>{t('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((tr) => (
              <tr key={tr.id}>
                <td>{tr.sourceBranchName || tr.sourceBranch?.name || tr.sourceBranchId}</td>
                <td>{tr.destinationBranchName || tr.destinationBranch?.name || tr.destinationBranchId}</td>
                <td>{t(getTransferTypeLabel(tr.transferType))}</td>
                <td>{t(getStatusLabel(tr.status))}</td>
                <td>{tr.items?.length ?? 0}</td>
                <td>{tr.approvedAt ? new Date(tr.approvedAt).toLocaleString() : '-'}</td>
                <td>
                  {tr.transferType === InventoryTransferType.Conditional && isPendingTransfer(tr) && (
                    <>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleApprove(tr.id ?? '')}
                        disabled={loading}
                      >
                        {t('Approve')}
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleReject(tr.id ?? '')}
                        disabled={loading}
                      >
                        {t('Reject')}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showForm && (
        <InventoryTransferForm
          formType={formType}
          model={selectedTransfer || undefined}
          handleCloseForm={() => setShowForm(false)}
          afterAction={fetchTransfers}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default InventoryTransferRoot;
