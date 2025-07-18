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
//   InputAdornment
// } from '@mui/material';
// import {
//   Delete,
//   Cancel,
//   Save,
//   Receipt
// } from '@mui/icons-material';
// import { WarehouseReceiptModel, WarehouseReceiptItemModel } from '../../../../Apis/Inventory/StockBalanceApi';
// import InputAutoComplete from '../../../../Components/Inputs/InputAutoCompelete';
// import InputDateTimePicker from '../../../../Components/Inputs/InputDateTime';
// import InputNumber from '../../../../Components/Inputs/InputNumber';
// import { toastify } from '../../../../Helper/toastify';

// interface WarehouseReceiptFormProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (receipt: WarehouseReceiptModel) => void;
//   initialData?: WarehouseReceiptModel;
// }

// const WarehouseReceiptForm: React.FC<WarehouseReceiptFormProps> = ({
//   open,
//   onClose,
//   onSubmit,
//   initialData
// }) => {
//   const { t } = useTranslation();
//   const [formData, setFormData] = useState<WarehouseReceiptModel>({
//     id: '',
//     receiptNumber: '',
//     date: new Date(),
//     supplierId: '',
//     supplierName: '',
//     warehouseId: '',
//     warehouseName: '',
//     items: [],
//     totalAmount: 0,
//     status: 'draft',
//     notes: '',
//     createdBy: '',
//     createdAt: new Date()
//   });

//   const [suppliers, setSuppliers] = useState<any[]>([]);
//   const [warehouses, setWarehouses] = useState<any[]>([]);
//   const [items, setItems] = useState<any[]>([]);
//   const [selectedItem, setSelectedItem] = useState<any>(null);
//   const [itemQuantity, setItemQuantity] = useState<number>(1);
//   const [itemUnitCost, setItemUnitCost] = useState<number>(0);

//   useEffect(() => {
//     if (initialData) {
//       setFormData(initialData);
//     }
//   }, [initialData]);

//   useEffect(() => {
//     // Load suppliers, warehouses, and items
//     // This would be replaced with actual API calls
//     setSuppliers([
//       { id: '1', name: 'Apple Inc.' },
//       { id: '2', name: 'Samsung Electronics' },
//       { id: '3', name: 'Microsoft Corporation' }
//     ]);
//     setWarehouses([
//       { id: '1', name: 'Main Warehouse' },
//       { id: '2', name: 'Secondary Warehouse' }
//     ]);
//     setItems([
//       { id: '1', name: 'iPhone 15 Pro', code: 'IPH15PRO', unitCost: 999.99 },
//       { id: '2', name: 'Samsung Galaxy S24', code: 'SAMS24', unitCost: 899.99 },
//       { id: '3', name: 'MacBook Pro M3', code: 'MBPM3', unitCost: 2499.99 }
//     ]);
//   }, []);

//   const handleAddItem = () => {
//     if (!selectedItem || itemQuantity <= 0) {
//       toastify('Please select an item and enter a valid quantity', 'error');
//       return;
//     }

//     const newItem: WarehouseReceiptItemModel = {
//       id: Date.now().toString(),
//       itemId: selectedItem.id,
//       itemName: selectedItem.name,
//       itemCode: selectedItem.code,
//       quantity: itemQuantity,
//       unitCost: itemUnitCost,
//       totalCost: itemQuantity * itemUnitCost,
//       batchNumber: `BATCH${Date.now()}`,
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

//     if (!formData.supplierId || !formData.warehouseId) {
//       toastify('Please select supplier and warehouse', 'error');
//       return;
//     }

//     onSubmit(formData);
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
//       <DialogTitle>
//         <Box display="flex" alignItems="center" gap={1}>
//           <Receipt color="primary" />
//           {t('CreateWarehouseReceipt')}
//         </Box>
//       </DialogTitle>
      
//       <DialogContent>
//         <Grid container spacing={3}>
//           {/* Header Information */}
//           <Grid item xs={12}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Receipt Information
//                 </Typography>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       fullWidth
//                       label={t('ReceiptNumber')}
//                       value={formData.receiptNumber}
//                       onChange={(e) => setFormData(prev => ({ ...prev, receiptNumber: e.target.value }))}
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
//                       <InputLabel>{t('Supplier')}</InputLabel>
//                       <Select
//                         value={formData.supplierId}
//                         onChange={(e) => {
//                           const supplier = suppliers.find(s => s.id === e.target.value);
//                           setFormData(prev => ({
//                             ...prev,
//                             supplierId: e.target.value,
//                             supplierName: supplier?.name || ''
//                           }));
//                         }}
//                         label={t('Supplier')}
//                       >
//                         {suppliers.map((supplier) => (
//                           <MenuItem key={supplier.id} value={supplier.id}>
//                             {supplier.name}
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
//                       options={items.map(item => ({ label: `${item.name} (${item.code})`, value: item.id }))}
//                       label={t('SelectItem')}
//                       value={selectedItem?.id || ''}
//                       onChange={(value) => {
//                         const item = items.find(i => i.id === value);
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
//                     >
//                       {t('Add')}
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>
//           </Grid>

//           {/* Items Table */}
//           <Grid item xs={12}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Receipt Items
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
//                         <TableCell>{t('BatchNumber')}</TableCell>
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
//                           <TableCell>{item.batchNumber}</TableCell>
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
//                   <Typography variant="h4" color="primary" fontWeight="bold">
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
//           onClick={handleSubmit}
//           startIcon={<Save />}
//           disabled={formData.items.length === 0}
//         >
//           {t('CreateReceipt')}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default WarehouseReceiptForm; 