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
import { getItems } from '../../../../Apis/Inventory/ItemsApi';
import { getPackingUnits } from '../../../../Apis/Inventory/PackingUnitsApi';
import { getBranches } from '../../../../Apis/Account/BranchesApi';
import { getChartOfAccounts } from '../../../../Apis/Account/ChartOfAccountsApi';
import ItemModel from '../../../../interfaces/ProjectInterfaces/Inventory/Items/ItemModel';
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
  const [items, setItems] = useState<ItemModel[]>([]);
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
        itemsRes,
        packingUnitsRes,
        branchesRes,
        partiesRes
      ] = await Promise.all([
        getStockBalances(),
        getImportTransactions(),
        getExportTransactions(),
        getItems(),
        getPackingUnits(),
        getBranches(),
        getChartOfAccounts()
      ]);

      console.log('API Responses:', {
        stockBalances: stockBalancesRes,
        importTransactions: importTransactionsRes,
        exportTransactions: exportTransactionsRes,
        items: itemsRes,
        packingUnits: packingUnitsRes,
        branches: branchesRes,
        parties: partiesRes
      });

      if (stockBalancesRes.isSuccess) setStockBalances(stockBalancesRes.result || []);
      if (importTransactionsRes.isSuccess) setImportTransactions(importTransactionsRes.result || []);
      if (exportTransactionsRes.isSuccess) setExportTransactions(exportTransactionsRes.result || []);
      if (itemsRes.isSuccess) setItems(itemsRes.result || []);
      if (packingUnitsRes.isSuccess) setPackingUnits(packingUnitsRes.result || []);
      if (branchesRes.isSuccess) setBranches(branchesRes.result || []);
      if (partiesRes.isSuccess) setParties(partiesRes.result || []);

      console.log('Data loaded:', {
        stockBalances: stockBalancesRes.result?.length || 0,
        importTransactions: importTransactionsRes.result?.length || 0,
        exportTransactions: exportTransactionsRes.result?.length || 0,
        items: itemsRes.result?.length || 0,
        packingUnits: packingUnitsRes.result?.length || 0,
        branches: branchesRes.result?.length || 0,
        parties: partiesRes.result?.length || 0
      });
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
              items={items}
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
              items={items}
              packingUnits={packingUnits}
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
  items: ItemModel[];
  packingUnits: PackingUnitModel[];
  branches: BranchModel[];
}> = ({ stockBalances, items, packingUnits, branches }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');

  const filteredBalances = stockBalances.filter(balance => {
    const item = items.find(i => i.id === balance.itemId);

    
    const matchesSearch = !searchTerm || 
      item?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBranch = !selectedBranch || balance.branchId === selectedBranch;
    
    return matchesSearch && matchesBranch;
  });

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('Search Items')}
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
              <TableCell>{t('Item')}</TableCell>
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
              const item = items.find(i => i.id === balance.itemId);
              const branch = branches.find(b => b.id === balance.branchId);
              const packingUnit = packingUnits.find(p => p.id === balance.packingUnitId);
              
              const getStatus = () => {
                if (balance.currentBalance <= balance.minimumBalance) return 'low';
                if (balance.currentBalance >= balance.maximumBalance) return 'overstock';
                return 'normal';
              };

              return (
                <TableRow key={balance.id}>
                  <TableCell>{item?.name}</TableCell>
                  <TableCell>{item?.code}</TableCell>
                  <TableCell>{branch?.name}</TableCell>
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
                      icon={getStatusIcon(transaction.status)}
                      label={t(transaction.status)}
                      color={getStatusColor(transaction.status) as any}
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
                    <strong>{t('Items')}:</strong> {transaction.items.length}
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
  items: ItemModel[];
  packingUnits: PackingUnitModel[];
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
                      icon={getStatusIcon(transaction.status)}
                      label={t(transaction.status)}
                      color={getStatusColor(transaction.status) as any}
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
                    <strong>{t('Items')}:</strong> {transaction.items.length}
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



// Export Transaction Dialog Component
// const ExportTransactionDialog: React.FC<{
//   open: boolean;
//   onClose: () => void;
//   onSubmit: () => void;
//   form: CreateExportTransactionRequest;
//   setForm: (form: CreateExportTransactionRequest) => void;
//   items: ItemModel[];
//   packingUnits: PackingUnitModel[];
//   branches: BranchModel[];
//   customers: CustomerModel[];
// }> = ({ open, onClose, onSubmit, form, setForm, items, packingUnits, branches, customers }) => {
//   const { t } = useTranslation();
  
//   console.log('ExportTransactionDialog props:', {
//     open,
//     itemsCount: items.length,
//     packingUnitsCount: packingUnits.length,
//     branchesCount: branches.length,
//     customersCount: customers.length
//   });
//   const [itemsList, setItemsList] = useState<Array<{
//     itemId: string;
//     packingUnitId: string;
//     quantity: number;
//     totalCost: number;
//   }>>([]);

//   // Reset form when dialog opens
//   useEffect(() => {
//     if (open) {
//       setForm({
//         transactionDate: new Date(),
//         documentNumber: '',
//         transactionPartyId: '',
//         branchId: '',
//         notes: '',
//         items: []
//       });
//       setItemsList([]);
//     }
//   }, [open, setForm]);

//   const addItem = () => {
//     setItemsList([...itemsList, {
//       itemId: '',
//       packingUnitId: '',
//       quantity: 0,
//       totalCost: 0
//     }]);
//   };

//   const removeItem = (index: number) => {
//     setItemsList(itemsList.filter((_, i) => i !== index));
//   };

//   const updateItem = (index: number, field: string, value: any) => {
//     const newItems = [...itemsList];
//     newItems[index] = { ...newItems[index], [field]: value };
//     setItemsList(newItems);
//   };

//   const handleSubmit = () => {
//     if (!form.transactionPartyId || !form.branchId || itemsList.length === 0) {
//       alert(t('Please fill all required fields'));
//       return;
//     }
    
//     setForm({
//       ...form,
//       items: itemsList
//     });
//     onSubmit();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>{t('Create Store Issue')}</DialogTitle>
//       <DialogContent>
//         <Grid container spacing={2} sx={{ mt: 1 }}>
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               label={t('Transaction Date')}
//               type="date"
//               value={form.transactionDate.toISOString().split('T')[0]}
//               onChange={(e) => setForm({
//                 ...form,
//                 transactionDate: new Date(e.target.value)
//               })}
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <TextField
//               fullWidth
//               label={t('Document Number')}
//               value={form.documentNumber}
//               onChange={(e) => setForm({
//                 ...form,
//                 documentNumber: e.target.value
//               })}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <FormControl fullWidth>
//               <InputLabel>{t('Party')}</InputLabel>
//               <Select
//                 value={form.transactionPartyId}
//                 onChange={(e) => setForm({
//                   ...form,
//                   transactionPartyId: e.target.value
//                 })}
//               >
//                 {customers.map(customer => (
//                   <MenuItem key={customer.id} value={customer.id}>
//                     {customer.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <FormControl fullWidth>
//               <InputLabel>{t('Branch')}</InputLabel>
//               <Select
//                 value={form.branchId}
//                 onChange={(e) => setForm({
//                   ...form,
//                   branchId: e.target.value
//                 })}
//                 disabled={branches.length === 0}
//               >
//                 {branches.length === 0 ? (
//                   <MenuItem disabled>{t('Loading branches...')}</MenuItem>
//                 ) : (
//                   branches.map(branch => (
//                     <MenuItem key={branch.id} value={branch.id}>
//                       {branch.name}
//                     </MenuItem>
//                   ))
//                 )}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               multiline
//               rows={3}
//               label={t('Notes')}
//               value={form.notes}
//               onChange={(e) => setForm({
//                 ...form,
//                 notes: e.target.value
//               })}
//             />
//           </Grid>
          
//           <Grid item xs={12}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//               <Typography variant="h6">{t('Items')}</Typography>
//               <Button onClick={addItem} startIcon={<AddIcon />}>
//                 {t('Add Item')}
//               </Button>
//             </Box>
            
//             {itemsList.map((item, index) => (
//               <Card key={index} sx={{ mb: 2, p: 2 }}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} md={3}>
//                     <FormControl fullWidth>
//                       <InputLabel>{t('Item')}</InputLabel>
//                       <Select
//                         value={item.itemId}
//                         onChange={(e) => updateItem(index, 'itemId', e.target.value)}
//                       >
//                         {items.map(itemOption => (
//                           <MenuItem key={itemOption.id} value={itemOption.id}>
//                             {itemOption.name}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                   <Grid item xs={12} md={3}>
//                     <FormControl fullWidth>
//                       <InputLabel>{t('Packing Unit')}</InputLabel>
//                       <Select
//                         value={item.packingUnitId}
//                         onChange={(e) => updateItem(index, 'packingUnitId', e.target.value)}
//                       >
//                         {packingUnits.map(unit => (
//                           <MenuItem key={unit.id} value={unit.id}>
//                             {unit.name}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                   <Grid item xs={12} md={2}>
//                     <TextField
//                       fullWidth
//                       label={t('Quantity')}
//                       type="number"
//                       value={item.quantity}
//                       onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={2}>
//                     <TextField
//                       fullWidth
//                       label={t('Total Cost')}
//                       type="number"
//                       value={item.totalCost}
//                       onChange={(e) => updateItem(index, 'totalCost', parseFloat(e.target.value) || 0)}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={2}>
//                     <IconButton onClick={() => removeItem(index)} color="error">
//                       <DeleteIcon />
//                     </IconButton>
//                   </Grid>
//                 </Grid>
//               </Card>
//             ))}
//           </Grid>
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>{t('Cancel')}</Button>
//         <Button onClick={handleSubmit} variant="contained">
//           {t('Create')}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// View Transaction Dialog Component
// const ViewTransactionDialog: React.FC<{
//   open: boolean;
//   onClose: () => void;
//   transaction: any;
//   items: ItemModel[];
//   packingUnits: PackingUnitModel[];
//   branches: BranchModel[];
//   suppliers: SupplierModel[];
//   customers: CustomerModel[];
// }> = ({ open, onClose, transaction, items, packingUnits, branches, suppliers, customers }) => {
//   const { t } = useTranslation();

//   if (!transaction) return null;

//   const branch = branches.find(b => b.id === transaction.branchId);
//   const party = suppliers.find(s => s.id === transaction.transactionPartyId) || 
//                 customers.find(c => c.id === transaction.transactionPartyId);

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>
//         {transaction.documentNumber || 'Transaction Details'}
//       </DialogTitle>
//       <DialogContent>
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={6}>
//             <Typography variant="body2" color="text.secondary">
//               {t('Date')}
//             </Typography>
//             <Typography variant="body1">
//               {new Date(transaction.transactionDate).toLocaleDateString()}
//             </Typography>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Typography variant="body2" color="text.secondary">
//               {t('Status')}
//             </Typography>
//             <Chip
//               icon={getStatusIcon(transaction.status)}
//               label={t(transaction.status)}
//               color={getStatusColor(transaction.status) as any}
//               size="small"
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Typography variant="body2" color="text.secondary">
//               {t('Party')}
//             </Typography>
//             <Typography variant="body1">
//               {party?.name}
//             </Typography>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Typography variant="body2" color="text.secondary">
//               {t('Branch')}
//             </Typography>
//             <Typography variant="body1">
//               {branch?.name}
//             </Typography>
//           </Grid>
//           {transaction.notes && (
//             <Grid item xs={12}>
//               <Typography variant="body2" color="text.secondary">
//                 {t('Notes')}
//               </Typography>
//               <Typography variant="body1">
//                 {transaction.notes}
//               </Typography>
//             </Grid>
//           )}
          
//           <Grid item xs={12}>
//             <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
//               {t('Items')}
//             </Typography>
//             <TableContainer component={Paper}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>{t('Item')}</TableCell>
//                     <TableCell>{t('Packing Unit')}</TableCell>
//                     <TableCell align="right">{t('Quantity')}</TableCell>
//                     <TableCell align="right">{t('Unit Cost')}</TableCell>
//                     <TableCell align="right">{t('Total Cost')}</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {transaction.items.map((item: any, index: number) => {
//                     const itemData = items.find(i => i.id === item.itemId);
//                     const packingUnit = packingUnits.find(p => p.id === item.packingUnitId);
                    
//                     return (
//                       <TableRow key={index}>
//                         <TableCell>{itemData?.name}</TableCell>
//                         <TableCell>{packingUnit?.name}</TableCell>
//                         <TableCell align="right">{item.quantity}</TableCell>
//                         <TableCell align="right">${item.unitCost}</TableCell>
//                         <TableCell align="right">${item.totalCost}</TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Grid>
          
//           <Grid item xs={12}>
//             <Typography variant="h6" color="primary" align="right">
//               {t('Total')}: ${transaction.totalAmount?.toFixed(2)}
//             </Typography>
//           </Grid>
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>{t('Close')}</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

export default InventoryTransactionsPage; 