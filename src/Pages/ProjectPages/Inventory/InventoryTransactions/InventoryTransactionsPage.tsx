import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  Grid,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,

} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import ImportTransactionForm from './ImportTransactionForm';
import ExportTransactionForm from './ExportTransactionForm';
import { 
  getStockBalances, 
  StockBalanceModel,

} from '../../../../Apis/Inventory/StockBalanceApi';
import { 
  getImportTransactions, 
  ImportTransactionOutputDtoModel,

} from '../../../../Apis/Inventory/ImportTransactionsApi';
import { 
  getExportTransactions, 
  ExportTransactionOutputDtoModel,
} from '../../../../Apis/Inventory/ExportTransactionsApi';
import { getVariants } from '../../../../Apis/Inventory/VariantsApi';
import { getPackingUnits } from '../../../../Apis/Inventory/PackingUnitsApi';
import { getBranches } from '../../../../Apis/Account/BranchesApi';
import { getChartOfAccounts } from '../../../../Apis/Account/ChartOfAccountsApi';
import VariantModel from '../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantModel';
import PackingUnitModel from '../../../../interfaces/ProjectInterfaces/Inventory/PackingUnits/PackingUnitModel';
import BranchModel from '../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Branches/BranchModel';
import ChartOfAccountModel from '../../../../interfaces/ProjectInterfaces/Account/ChartOfAccount/ChartOfAccountModel';

// Helper functions for status icons and colors
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'draft': return <ScheduleIcon />;
    case 'pending': return <WarningIcon />;
    case 'approved': return <CheckCircleIcon />;
    case 'received':
    case 'issued': return <CheckCircleIcon />;
    case 'cancelled': return <CancelIcon />;
    default: return <ScheduleIcon />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft': return 'default';
    case 'pending': return 'warning';
    case 'approved': return 'info';
    case 'received':
    case 'issued': return 'success';
    case 'cancelled': return 'error';
    default: return 'default';
  }
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const InventoryTransactionsPage: React.FC = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [stockBalances, setStockBalances] = useState<StockBalanceModel[]>([]);
  const [importTransactions, setImportTransactions] = useState<ImportTransactionOutputDtoModel[]>([]);
  const [exportTransactions, setExportTransactions] = useState<ExportTransactionOutputDtoModel[]>([]);
  const [variants, setVariants] = useState<VariantModel[]>([]);
  const [packingUnits, setPackingUnits] = useState<PackingUnitModel[]>([]);
  const [branches, setBranches] = useState<BranchModel[]>([]);
  const [parties, setParties] = useState<ChartOfAccountModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [showImportForm, setShowImportForm] = useState(false);
  const [showExportForm, setShowExportForm] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  const [selectedFormType, setSelectedFormType] = useState<FormTypes>(FormTypes.Add);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Loading data...');
      
      const [
        stockBalancesRes,
        importTransactionsRes,
        exportTransactionsRes,
        variantsRes,
        packingUnitsRes,
        branchesRes,
        partiesRes
      ] = await Promise.all([
        getStockBalances(),
        getImportTransactions(),
        getExportTransactions(),
        getVariants(),
        getPackingUnits(),
        getBranches(),
        getChartOfAccounts()
      ]);

      if (stockBalancesRes.isSuccess) setStockBalances(stockBalancesRes.result || []);
      if (importTransactionsRes.isSuccess) setImportTransactions(importTransactionsRes.result || []);
      if (exportTransactionsRes.isSuccess) setExportTransactions(exportTransactionsRes.result || []);
      if (variantsRes.isSuccess) setVariants(variantsRes.result || []);
      if (packingUnitsRes.isSuccess) setPackingUnits(packingUnitsRes.result || []);
      if (branchesRes.isSuccess) setBranches(branchesRes.result || []);
      if (partiesRes.isSuccess) setParties(partiesRes.result || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleShowImportForm = (formType: FormTypes = FormTypes.Add, id: string = '') => {
    setSelectedFormType(formType);
    setSelectedFormId(id);
    setShowImportForm(true);
  };

  const handleShowExportForm = (formType: FormTypes = FormTypes.Add, id: string = '') => {
    setSelectedFormType(formType);
    setSelectedFormId(id);
    setShowExportForm(true);
  };

  const handleCloseImportForm = () => {
    setShowImportForm(false);
    setSelectedFormId('');
  };

  const handleCloseExportForm = () => {
    setShowExportForm(false);
    setSelectedFormId('');
  };

  const handleAfterAction = () => {
    loadData();
    handleCloseImportForm();
    handleCloseExportForm();
  };



  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('Inventory Transactions')}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label={t('Stock Balance')} />
              <Tab label={t('Warehouse Receipts')} />
              <Tab label={t('Store Issues')} />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <StockBalanceView 
              stockBalances={stockBalances}
              variants={variants}
              packingUnits={packingUnits}
              branches={branches}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <ImportTransactionsView 
              transactions={importTransactions}
              branches={branches}
              parties={parties}
              onCreateNew={() => handleShowImportForm(FormTypes.Add)}
              onView={(transaction) => handleShowImportForm(FormTypes.Details, transaction.id)}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <ExportTransactionsView 
              transactions={exportTransactions}
              branches={branches}
              parties={parties}
              onCreateNew={() => handleShowExportForm(FormTypes.Add)}
              onView={(transaction) => handleShowExportForm(FormTypes.Details, transaction.id)}
            />
          </TabPanel>
        </CardContent>
      </Card>

      {/* Import Transaction Form */}
      {showImportForm && (
        <ImportTransactionForm
          formType={selectedFormType}
          id={selectedFormId}
          handleCloseForm={handleCloseImportForm}
          afterAction={handleAfterAction}
        />
      )}

      {/* Export Transaction Form */}
      {showExportForm && (
        <ExportTransactionForm
          formType={selectedFormType}
          id={selectedFormId}
          handleCloseForm={handleCloseExportForm}
          afterAction={handleAfterAction}
        />
      )}
    </Box>
  );
};

// Stock Balance View Component
const StockBalanceView: React.FC<{
  stockBalances: StockBalanceModel[];
  variants: VariantModel[];
  packingUnits: PackingUnitModel[];
  branches: BranchModel[];
}> = ({ stockBalances, variants, packingUnits, branches }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');

  const getVariantForBalance = (balance: StockBalanceModel) => {
    if (balance.variantName || balance.variantCode) {
      return {
        name: balance.variantName ?? '',
        code: balance.variantCode ?? '',
        productName: balance.productName,
      };
    }
    const variant = variants.find((v) => v.id === balance.variantId);
    return variant
      ? { name: variant.name, code: variant.code, productName: variant.productName }
      : undefined;
  };

  const filteredBalances = stockBalances.filter((balance) => {
    const variant = getVariantForBalance(balance);
    const matchesSearch =
      !searchTerm ||
      variant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant?.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = !selectedBranch || balance.branchId === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('SearchVariants')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>{t('Branch')}</InputLabel>
            <Select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <MenuItem value="">{t('All Branches')}</MenuItem>
              {branches.map(branch => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('Variant')}</TableCell>
              <TableCell>{t('Product')}</TableCell>
              <TableCell>{t('Code')}</TableCell>
              <TableCell>{t('Branch')}</TableCell>
              <TableCell>{t('Packing Unit')}</TableCell>
              <TableCell align="right">{t('Current Balance')}</TableCell>
              <TableCell align="right">{t('Min Balance')}</TableCell>
              <TableCell align="right">{t('Max Balance')}</TableCell>
              <TableCell align="right">{t('Unit Cost')}</TableCell>
              <TableCell align="right">{t('Total Value')}</TableCell>
              <TableCell>{t('Status')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBalances.map((balance) => {
              const variant = getVariantForBalance(balance);
              const branch = branches.find(b => b.id === balance.branchId) ?? (balance.branchName ? { name: balance.branchName } : undefined);
              const packingUnit = packingUnits.find(p => p.id === balance.packingUnitId);
              
              const getStatus = () => {
                if (balance.currentBalance <= balance.minimumBalance) return 'low';
                if (balance.currentBalance >= balance.maximumBalance) return 'overstock';
                return 'normal';
              };

              return (
                <TableRow key={balance.id}>
                  <TableCell>{variant?.name}</TableCell>
                  <TableCell>{variant?.productName}</TableCell>
                  <TableCell>{variant?.code}</TableCell>
                  <TableCell>{branch?.name ?? balance.branchName}</TableCell>
                  <TableCell>{packingUnit?.name}</TableCell>
                  <TableCell align="right">{balance.currentBalance}</TableCell>
                  <TableCell align="right">{balance.minimumBalance}</TableCell>
                  <TableCell align="right">{balance.maximumBalance}</TableCell>
                  <TableCell align="right">${balance.unitCost}</TableCell>
                  <TableCell align="right">${balance.totalCost}</TableCell>
                  <TableCell>
                    <Chip
                      label={t(getStatus())}
                      color={getStatus() === 'normal' ? 'success' : getStatus() === 'low' ? 'warning' : 'error'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Import Transactions View Component
const ImportTransactionsView: React.FC<{
  transactions: ImportTransactionOutputDtoModel[];
  branches: BranchModel[];
  parties: ChartOfAccountModel[];
  onCreateNew: () => void;
  onView: (transaction: ImportTransactionOutputDtoModel) => void;
}> = ({ transactions, branches, parties, onCreateNew, onView }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{t('Warehouse Receipts')}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateNew}
        >
          {t('New Receipt')}
        </Button>
      </Box>

      <Grid container spacing={2}>
        {transactions.map((transaction) => {
          const branch = branches.find(b => b.id === transaction.branchId);
          const supplier = parties.find(s => s.id === transaction.transactionPartyId);
          
          return (
            <Grid item xs={12} md={6} lg={4} key={transaction.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" color="primary">
                      {transaction.documentNumber || 'No Number'}
                    </Typography>
                    <Chip
                      icon={getStatusIcon(transaction.status ?? 'draft')}
                      label={t(transaction.status ?? 'draft')}
                      color={getStatusColor(transaction.status ?? 'draft') as 'default' | 'warning' | 'info' | 'success' | 'error'}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>{t('Party')}:</strong> {supplier?.name}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>{t('Branch')}:</strong> {branch?.name}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>{t('LineItems')}:</strong> {transaction.items.length}
                  </Typography>
                  
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${transaction.items?.reduce((sum, item) => sum + (item.totalCost || 0), 0).toFixed(2) || '0.00'}
                  </Typography>
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => onView(transaction)}
                    >
                      {t('View')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

// Export Transactions View Component
const ExportTransactionsView: React.FC<{
  transactions: ExportTransactionOutputDtoModel[];
  branches: BranchModel[];
  parties: ChartOfAccountModel[];
  onCreateNew: () => void;
  onView: (transaction: ExportTransactionOutputDtoModel) => void;
}> = ({ transactions, branches, parties, onCreateNew, onView }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{t('Store Issues')}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateNew}
        >
          {t('New Issue')}
        </Button>
      </Box>

      <Grid container spacing={2}>
        {transactions.map((transaction) => {
          const branch = branches.find(b => b.id === transaction.branchId);
          const customer = parties.find(c => c.id === transaction.transactionPartyId);
          
          return (
            <Grid item xs={12} md={6} lg={4} key={transaction.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" color="primary">
                      {transaction.documentNumber || 'No Number'}
                    </Typography>
                    <Chip
                      icon={getStatusIcon(transaction.status ?? 'draft')}
                      label={t(transaction.status ?? 'draft')}
                      color={getStatusColor(transaction.status ?? 'draft') as 'default' | 'warning' | 'info' | 'success' | 'error'}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>{t('Party')}:</strong> {customer?.name}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>{t('Branch')}:</strong> {branch?.name}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>{t('LineItems')}:</strong> {transaction.items.length}
                  </Typography>
                  
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${transaction.items?.reduce((sum, item) => sum + (item.totalCost || 0), 0).toFixed(2) || '0.00'}
                  </Typography>
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => onView(transaction)}
                    >
                      {t('View')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};


export default InventoryTransactionsPage; 