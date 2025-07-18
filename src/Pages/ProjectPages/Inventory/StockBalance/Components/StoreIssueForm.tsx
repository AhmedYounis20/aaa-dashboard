// import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   TextField,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Alert,
//   InputAdornment
// } from '@mui/material';
// import {
//   Remove,
//   Add,
//   Delete,
//   Cancel,
//   Save
// } from '@mui/icons-material';
// import { StoreIssueModel, StoreIssueItemModel } from '../../../../Apis/Inventory/StockBalanceApi';
// import InputAutoComplete from '../../../../Components/Inputs/InputAutoCompelete';
// import InputDateTimePicker from '../../../../Components/Inputs/InputDateTime';
// import InputNumber from '../../../../Components/Inputs/InputNumber';
// import { toastify } from '../../../../Helper/toastify';

// interface StoreIssueFormProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (issue: StoreIssueModel) => void;
//   initialData?: StoreIssueModel;
// }

// const StoreIssueForm: React.FC<StoreIssueFormProps> = ({
//   open,
//   onClose,
//   onSubmit,
//   initialData
// }) => {
//   const { t } = useTranslation();
//   const [formData, setFormData] = useState<StoreIssueModel>({
//     id: '',
//     issueNumber: '',
//     date: new Date(),
//     departmentId: '',
//     departmentName: '',
//     warehouseId: '',
//     warehouseName: '',
//     items: [],
//     totalAmount: 0,
//     status: 'draft',
//     notes: '',
//     requestedBy: '',
//     createdAt: new Date()
//   });

//   const [departments, setDepartments] = useState<any[]>([]);
//   const [warehouses, setWarehouses] = useState<any[]>([]);
//   const [availableItems, setAvailableItems] = useState<any[]>([]);
//   const [selectedItem, setSelectedItem] = useState<any>(null);
//   const [itemQuantity, setItemQuantity] = useState<number>(1);
//   const [itemUnitCost, setItemUnitCost] = useState<number>(0);

//   useEffect(() => {
//     if (initialData) {
//       setFormData(initialData);
//     }
//   }, [initialData]);

//   useEffect(() => {
//     // Load departments, warehouses, and available items
//     // This would be replaced with actual API calls
//     setDepartments([
//       { id: '1', name: 'IT Department' },
//       { id: '2', name: 'Sales Department' },
//       { id: '3', name: 'Marketing Department' },
//       { id: '4', name: 'Operations Department' }
//     ]);
//     setWarehouses([
//       { id: '1', name: 'Main Warehouse' },
//       { id: '2', name: 'Secondary Warehouse' }
//     ]);
//     setAvailableItems([
//       { 
//         id: '1', 
//         name: 'iPhone 15 Pro', 
//         code: 'IPH15PRO', 
//         unitCost: 999.99,
//         availableStock: 150,
//         currentStock: 150
//       },
//       { 
//         id: '2', 
//         name: 'Samsung Galaxy S24', 
//         code: 'SAMS24', 
//         unitCost: 899.99,
//         availableStock: 8,
//         currentStock: 8
//       },
//       { 
//         id: '3', 
//         name: 'MacBook Pro M3', 
//         code: 'MBPM3', 
//         unitCost: 2499.99,
//         availableStock: 0,
//         currentStock: 0
//       }
//     ]);
//   }, []);

//   const handleAddItem = () => {
//     if (!selectedItem || itemQuantity <= 0) {
//       toastify('Please select an item and enter a valid quantity', 'error');
//       return;
//     }

//     if (itemQuantity > selectedItem.availableStock) {
//       toastify(`Quantity exceeds available stock (${selectedItem.availableStock})`, 'error');
//       return;
//     }

//     const newItem: StoreIssueItemModel = {
//       id: Date.now().toString(),
//       itemId: selectedItem.id,
//       itemName: selectedItem.name,
//       itemCode: selectedItem.code,
//       quantity: itemQuantity,
//       unitCost: itemUnitCost,
//       totalCost: itemQuantity * itemUnitCost,
//       location: 'Default Location'
//     };

//     setFormData(prev => ({
//       ...prev,
//       items: [...prev.items, newItem],
//       totalAmount: prev.totalAmount + newItem.totalCost
//     }));

//     // Reset form
//     setSelectedItem(null);
//     setItemQuantity(1);
//     setItemUnitCost(0);
//   };

//   const handleRemoveItem = (itemId: string) => {
//     const item = formData.items.find(i => i.id === itemId);
//     if (item) {
//       setFormData(prev => ({
//         ...prev,
//         items: prev.items.filter(i => i.id !== itemId),
//         totalAmount: prev.totalAmount - item.totalCost
//       }));
//     }
//   };

//   const handleSubmit = () => {
//     if (formData.items.length === 0) {
//       toastify('Please add at least one item', 'error');
//       return;
//     }

//     if (!formData.departmentId || !formData.warehouseId) {
//       toastify('Please select department and warehouse', 'error');
//       return;
//     }

//     onSubmit(formData);
//   };

//   const getStockStatusColor = (availableStock: number) => {
//     if (availableStock === 0) return 'error';
//     if (availableStock < 10) return 'warning';
//     return 'success';
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
//       <DialogTitle>
//         <Box display="flex" alignItems="center" gap={1}>
//           <Remove color="error" />
//           {t('CreateStoreIssue')}
//         </Box>
//       </DialogTitle>
      
//       <DialogContent>
//         <Grid container spacing={3}>
//           {/* Header Information */}
//           <Grid item xs={12}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Issue Information
//                 </Typography>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       fullWidth
//                       label={t('IssueNumber')}
//                       value={formData.issueNumber}
//                       onChange={(e) => setFormData(prev => ({ ...prev, issueNumber: e.target.value }))}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <InputDateTimePicker
//                       label={t('Date')}
//                       value={formData.date}
//                       onChange={(date) => setFormData(prev => ({ ...prev, date: date || new Date() }))}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <FormControl fullWidth>
//                       <InputLabel>{t('Department')}</InputLabel>
//                       <Select
//                         value={formData.departmentId}
//                         onChange={(e) => {
//                           const department = departments.find(d => d.id === e.target.value);
//                           setFormData(prev => ({
//                             ...prev,
//                             departmentId: e.target.value,
//                             departmentName: department?.name || ''
//                           }));
//                         }}
//                         label={t('Department')}
//                       >
//                         {departments.map((department) => (
//                           <MenuItem key={department.id} value={department.id}>
//                             {department.name}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <FormControl fullWidth>
//                       <InputLabel>{t('Warehouse')}</InputLabel>
//                       <Select
//                         value={formData.warehouseId}
//                         onChange={(e) => {
//                           const warehouse = warehouses.find(w => w.id === e.target.value);
//                           setFormData(prev => ({
//                             ...prev,
//                             warehouseId: e.target.value,
//                             warehouseName: warehouse?.name || ''
//                           }));
//                         }}
//                         label={t('Warehouse')}
//                       >
//                         {warehouses.map((warehouse) => (
//                           <MenuItem key={warehouse.id} value={warehouse.id}>
//                             {warehouse.name}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>
//           </Grid>

//           {/* Add Items Section */}
//           <Grid item xs={12}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Add Items
//                 </Typography>
//                 <Grid container spacing={2} alignItems="center">
//                   <Grid item xs={12} md={4}>
//                     <InputAutoComplete
//                       options={availableItems.map(item => ({ 
//                         label: `${item.name} (${item.code}) - Stock: ${item.availableStock}`, 
//                         value: item.id 
//                       }))}
//                       label={t('SelectItem')}
//                       value={selectedItem?.id || ''}
//                       onChange={(value) => {
//                         const item = availableItems.find(i => i.id === value);
//                         setSelectedItem(item);
//                         if (item) {
//                           setItemUnitCost(item.unitCost);
//                         }
//                       }}
//                       handleBlur={null}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={2}>
//                     <InputNumber
//                       label={t('Quantity')}
//                       value={itemQuantity}
//                       onChange={(value) => setItemQuantity(value || 0)}
//                       min={1}
//                       max={selectedItem?.availableStock || 1}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={2}>
//                     <InputNumber
//                       label={t('UnitCost')}
//                       value={itemUnitCost}
//                       onChange={(value) => setItemUnitCost(value || 0)}
//                       min={0}
//                       precision={2}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={2}>
//                     <TextField
//                       fullWidth
//                       label={t('TotalCost')}
//                       value={(itemQuantity * itemUnitCost).toFixed(2)}
//                       InputProps={{
//                         readOnly: true,
//                         startAdornment: <InputAdornment position="start">$</InputAdornment>
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={2}>
//                     <Button
//                       variant="contained"
//                       startIcon={<Add />}
//                       onClick={handleAddItem}
//                       fullWidth
//                       disabled={!selectedItem || itemQuantity <= 0 || itemQuantity > (selectedItem?.availableStock || 0)}
//                     >
//                       {t('Add')}
//                     </Button>
//                   </Grid>
//                 </Grid>
                
//                 {selectedItem && (
//                   <Alert severity={getStockStatusColor(selectedItem.availableStock)} sx={{ mt: 2 }}>
//                     Available Stock: {selectedItem.availableStock} units
//                     {selectedItem.availableStock === 0 && ' - Out of Stock'}
//                     {selectedItem.availableStock < 10 && selectedItem.availableStock > 0 && ' - Low Stock'}
//                   </Alert>
//                 )}
//               </CardContent>
//             </Card>
//           </Grid>

//           {/* Items Table */}
//           <Grid item xs={12}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Issue Items
//                 </Typography>
//                 <TableContainer component={Paper}>
//                   <Table>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>{t('Item')}</TableCell>
//                         <TableCell>{t('Code')}</TableCell>
//                         <TableCell align="right">{t('Quantity')}</TableCell>
//                         <TableCell align="right">{t('UnitCost')}</TableCell>
//                         <TableCell align="right">{t('TotalCost')}</TableCell>
//                         <TableCell>{t('Location')}</TableCell>
//                         <TableCell>{t('Actions')}</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {formData.items.map((item) => (
//                         <TableRow key={item.id}>
//                           <TableCell>{item.itemName}</TableCell>
//                           <TableCell>{item.itemCode}</TableCell>
//                           <TableCell align="right">{item.quantity}</TableCell>
//                           <TableCell align="right">${item.unitCost.toFixed(2)}</TableCell>
//                           <TableCell align="right">${item.totalCost.toFixed(2)}</TableCell>
//                           <TableCell>{item.location}</TableCell>
//                           <TableCell>
//                             <IconButton
//                               color="error"
//                               size="small"
//                               onClick={() => handleRemoveItem(item.id)}
//                             >
//                               <Delete />
//                             </IconButton>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </CardContent>
//             </Card>
//           </Grid>

//           {/* Summary */}
//           <Grid item xs={12}>
//             <Card>
//               <CardContent>
//                 <Box display="flex" justifyContent="space-between" alignItems="center">
//                   <Typography variant="h6">
//                     {t('TotalAmount')}
//                   </Typography>
//                   <Typography variant="h4" color="error" fontWeight="bold">
//                     ${formData.totalAmount.toFixed(2)}
//                   </Typography>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>

//           {/* Notes */}
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               multiline
//               rows={3}
//               label={t('Notes')}
//               value={formData.notes}
//               onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
//             />
//           </Grid>
//         </Grid>
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onClose} startIcon={<Cancel />}>
//           {t('Cancel')}
//         </Button>
//         <Button
//           variant="contained"
//           color="error"
//           onClick={handleSubmit}
//           startIcon={<Save />}
//           disabled={formData.items.length === 0}
//         >
//           {t('CreateIssue')}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default StoreIssueForm; 