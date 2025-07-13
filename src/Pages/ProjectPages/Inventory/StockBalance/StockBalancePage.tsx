// import React, { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { 
//   Inventory, 
//   FilterList, 
//   Add, 
//   Remove, 
//   Search, 
//   TrendingUp, 
//   TrendingDown, 
//   Warning,
//   CheckCircle,
//   Cancel,
//   Refresh,
//   Download,
//   Print,
//   Visibility,
//   Edit,
//   Delete,
//   Warehouse,
//   LocalShipping,
//   Assessment,
//   Timeline,
//   Notifications,
//   Settings,
//   Speed,
//   Analytics,
//   Dashboard,
//   ViewModule,
//   ViewList,
//   ViewComfy
// } from '@mui/icons-material';
// import { 
//   Card, 
//   CardContent, 
//   Typography, 
//   Button, 
//   TextField, 
//   Select, 
//   MenuItem, 
//   FormControl, 
//   InputLabel,
//   Chip,
//   Badge,
//   IconButton,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Switch,
//   FormControlLabel,
//   Grid,
//   Box,
//   Alert,
//   LinearProgress,
//   Tabs,
//   Tab,
//   Divider,
//   Avatar,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   ListItemSecondaryAction,
//   Paper,
//   Fade,
//   Zoom,
//   Slide,
//   Grow,
//   Fab,
//   SpeedDial,
//   SpeedDialAction,
//   SpeedDialIcon,
//   AppBar,
//   Toolbar,
//   Drawer,
//   ListItemButton,
//   Collapse,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   CardActionArea,
//   CardMedia,
//   CardActions,
//   Rating,
//   Skeleton,
//   Backdrop,
//   CircularProgress
// } from '@mui/material';
// import DataTable from '../../../../Components/Tables/DataTable';
// import { toastify } from '../../../../Helper/toastify';

// interface StockBalanceModel {
//   id: string;
//   itemId: string;
//   itemName: string;
//   itemCode: string;
//   itemImage?: string;
//   inventoryId: string;
//   inventoryName: string;
//   warehouseId: string;
//   warehouseName: string;
//   currentStock: number;
//   minimumStock: number;
//   maximumStock: number;
//   reservedStock: number;
//   availableStock: number;
//   unitCost: number;
//   totalValue: number;
//   lastUpdated: Date;
//   status: 'normal' | 'low' | 'out' | 'overstock';
//   category: string;
//   supplier: string;
//   location: string;
//   expiryDate?: Date;
//   batchNumber?: string;
// }

// interface InventoryModel {
//   id: string;
//   name: string;
//   code: string;
//   location: string;
//   manager: string;
//   totalItems: number;
//   totalValue: number;
// }

// interface WarehouseModel {
//   id: string;
//   name: string;
//   code: string;
//   inventoryId: string;
//   capacity: number;
//   usedCapacity: number;
//   temperature: string;
//   humidity: string;
// }

// const StockBalancePage: React.FC = () => {
//   const { t } = useTranslation();
//   const [stockBalances, setStockBalances] = useState<StockBalanceModel[]>([]);
//   const [inventories, setInventories] = useState<InventoryModel[]>([]);
//   const [warehouses, setWarehouses] = useState<WarehouseModel[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedInventory, setSelectedInventory] = useState<string>('all');
//   const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
//   const [selectedStatus, setSelectedStatus] = useState<string>('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [viewMode, setViewMode] = useState<'table' | 'cards' | 'analytics'>('table');
//   const [showLowStock, setShowLowStock] = useState(false);
//   const [showOutOfStock, setShowOutOfStock] = useState(false);
//   const [showOverstock, setShowOverstock] = useState(false);
//   const [selectedItems, setSelectedItems] = useState<string[]>([]);
//   const [warehouseReceiptDialog, setWarehouseReceiptDialog] = useState(false);
//   const [storeIssueDialog, setStoreIssueDialog] = useState(false);
//   const [analyticsDialog, setAnalyticsDialog] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [quickActionsOpen, setQuickActionsOpen] = useState(false);

//   // Mock data - replace with actual API calls
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // Mock data - replace with actual API calls
//         const mockStockBalances: StockBalanceModel[] = [
//           // Electronics & Technology
//           {
//             id: '1',
//             itemId: 'item1',
//             itemName: 'iPhone 15 Pro',
//             itemCode: 'IPH15PRO',
//             itemImage: '/api/images/iphone15pro.jpg',
//             inventoryId: 'inv1',
//             inventoryName: 'Main Electronics Warehouse',
//             warehouseId: 'wh1',
//             warehouseName: 'Warehouse A',
//             currentStock: 150,
//             minimumStock: 20,
//             maximumStock: 200,
//             reservedStock: 15,
//             availableStock: 135,
//             unitCost: 999.99,
//             totalValue: 149998.50,
//             lastUpdated: new Date(),
//             status: 'normal',
//             category: 'Electronics',
//             supplier: 'Apple Inc.',
//             location: 'Shelf A1-B2',
//             expiryDate: new Date('2025-12-31'),
//             batchNumber: 'BATCH001'
//           },
//           {
//             id: '2',
//             itemId: 'item2',
//             itemName: 'Samsung Galaxy S24',
//             itemCode: 'SAMS24',
//             itemImage: '/api/images/samsung-s24.jpg',
//             inventoryId: 'inv1',
//             inventoryName: 'Main Electronics Warehouse',
//             warehouseId: 'wh1',
//             warehouseName: 'Warehouse A',
//             currentStock: 8,
//             minimumStock: 25,
//             maximumStock: 150,
//             reservedStock: 5,
//             availableStock: 3,
//             unitCost: 899.99,
//             totalValue: 7199.92,
//             lastUpdated: new Date(),
//             status: 'low',
//             category: 'Electronics',
//             supplier: 'Samsung Electronics',
//             location: 'Shelf A3-B4',
//             expiryDate: new Date('2025-11-30'),
//             batchNumber: 'BATCH002'
//           },
//           {
//             id: '3',
//             itemId: 'item3',
//             itemName: 'MacBook Pro M3',
//             itemCode: 'MBPM3',
//             itemImage: '/api/images/macbook-pro-m3.jpg',
//             inventoryId: 'inv2',
//             inventoryName: 'Computer Parts Warehouse',
//             warehouseId: 'wh2',
//             warehouseName: 'Warehouse B',
//             currentStock: 0,
//             minimumStock: 10,
//             maximumStock: 50,
//             reservedStock: 0,
//             availableStock: 0,
//             unitCost: 2499.99,
//             totalValue: 0,
//             lastUpdated: new Date(),
//             status: 'out',
//             category: 'Computers',
//             supplier: 'Apple Inc.',
//             location: 'Shelf C1-D2',
//             expiryDate: new Date('2025-10-31'),
//             batchNumber: 'BATCH003'
//           },
//           // Food & Beverages
//           {
//             id: '4',
//             itemId: 'item4',
//             itemName: 'Organic Bananas',
//             itemCode: 'BANANA-ORG',
//             itemImage: '/api/images/bananas.jpg',
//             inventoryId: 'inv3',
//             inventoryName: 'Food & Beverage Warehouse',
//             warehouseId: 'wh3',
//             warehouseName: 'Cold Storage A',
//             currentStock: 500,
//             minimumStock: 100,
//             maximumStock: 1000,
//             reservedStock: 50,
//             availableStock: 450,
//             unitCost: 0.99,
//             totalValue: 495.00,
//             lastUpdated: new Date(),
//             status: 'normal',
//             category: 'Fresh Produce',
//             supplier: 'Fresh Farms Co.',
//             location: 'Cold Room A1',
//             expiryDate: new Date('2024-02-15'),
//             batchNumber: 'BATCH004'
//           },
//           {
//             id: '5',
//             itemId: 'item5',
//             itemName: 'Premium Coffee Beans',
//             itemCode: 'COFFEE-PREM',
//             itemImage: '/api/images/coffee-beans.jpg',
//             inventoryId: 'inv3',
//             inventoryName: 'Food & Beverage Warehouse',
//             warehouseId: 'wh3',
//             warehouseName: 'Cold Storage A',
//             currentStock: 25,
//             minimumStock: 30,
//             maximumStock: 200,
//             reservedStock: 5,
//             availableStock: 20,
//             unitCost: 15.99,
//             totalValue: 399.75,
//             lastUpdated: new Date(),
//             status: 'low',
//             category: 'Beverages',
//             supplier: 'Coffee Masters Ltd.',
//             location: 'Shelf B2',
//             expiryDate: new Date('2024-06-30'),
//             batchNumber: 'BATCH005'
//           },
//           // Clothing & Textiles
//           {
//             id: '6',
//             itemId: 'item6',
//             itemName: 'Cotton T-Shirts (M)',
//             itemCode: 'TSHIRT-COT-M',
//             itemImage: '/api/images/tshirt.jpg',
//             inventoryId: 'inv4',
//             inventoryName: 'Textile & Clothing Warehouse',
//             warehouseId: 'wh4',
//             warehouseName: 'Textile Storage',
//             currentStock: 200,
//             minimumStock: 50,
//             maximumStock: 500,
//             reservedStock: 20,
//             availableStock: 180,
//             unitCost: 12.50,
//             totalValue: 2500.00,
//             lastUpdated: new Date(),
//             status: 'normal',
//             category: 'Clothing',
//             supplier: 'Fashion Textiles Inc.',
//             location: 'Rack C3',
//             expiryDate: new Date('2026-12-31'),
//             batchNumber: 'BATCH006'
//           },
//           {
//             id: '7',
//             itemId: 'item7',
//             itemName: 'Denim Jeans (32x32)',
//             itemCode: 'JEANS-DEN-32',
//             itemImage: '/api/images/jeans.jpg',
//             inventoryId: 'inv4',
//             inventoryName: 'Textile & Clothing Warehouse',
//             warehouseId: 'wh4',
//             warehouseName: 'Textile Storage',
//             currentStock: 0,
//             minimumStock: 15,
//             maximumStock: 100,
//             reservedStock: 0,
//             availableStock: 0,
//             unitCost: 45.00,
//             totalValue: 0,
//             lastUpdated: new Date(),
//             status: 'out',
//             category: 'Clothing',
//             supplier: 'Denim World Ltd.',
//             location: 'Rack D1',
//             expiryDate: new Date('2026-12-31'),
//             batchNumber: 'BATCH007'
//           },
//           // Household & Personal Care
//           {
//             id: '8',
//             itemId: 'item8',
//             itemName: 'Luxury Soap Bars',
//             itemCode: 'SOAP-LUX-100G',
//             itemImage: '/api/images/soap.jpg',
//             inventoryId: 'inv5',
//             inventoryName: 'Household Goods Warehouse',
//             warehouseId: 'wh5',
//             warehouseName: 'Household Storage',
//             currentStock: 300,
//             minimumStock: 100,
//             maximumStock: 1000,
//             reservedStock: 25,
//             availableStock: 275,
//             unitCost: 3.99,
//             totalValue: 1197.00,
//             lastUpdated: new Date(),
//             status: 'normal',
//             category: 'Personal Care',
//             supplier: 'Luxury Care Products',
//             location: 'Shelf E2',
//             expiryDate: new Date('2025-08-31'),
//             batchNumber: 'BATCH008'
//           },
//           {
//             id: '9',
//             itemId: 'item9',
//             itemName: 'Organic Shampoo',
//             itemCode: 'SHAMPOO-ORG-500ML',
//             itemImage: '/api/images/shampoo.jpg',
//             inventoryId: 'inv5',
//             inventoryName: 'Household Goods Warehouse',
//             warehouseId: 'wh5',
//             warehouseName: 'Household Storage',
//             currentStock: 12,
//             minimumStock: 20,
//             maximumStock: 200,
//             reservedStock: 3,
//             availableStock: 9,
//             unitCost: 8.50,
//             totalValue: 102.00,
//             lastUpdated: new Date(),
//             status: 'low',
//             category: 'Personal Care',
//             supplier: 'Natural Beauty Co.',
//             location: 'Shelf E3',
//             expiryDate: new Date('2025-05-31'),
//             batchNumber: 'BATCH009'
//           },
//           // Building Materials
//           {
//             id: '10',
//             itemId: 'item10',
//             itemName: 'Premium Cement Bags',
//             itemCode: 'CEMENT-PREM-50KG',
//             itemImage: '/api/images/cement.jpg',
//             inventoryId: 'inv6',
//             inventoryName: 'Construction Materials Warehouse',
//             warehouseId: 'wh6',
//             warehouseName: 'Construction Storage',
//             currentStock: 500,
//             minimumStock: 200,
//             maximumStock: 2000,
//             reservedStock: 50,
//             availableStock: 450,
//             unitCost: 12.00,
//             totalValue: 6000.00,
//             lastUpdated: new Date(),
//             status: 'normal',
//             category: 'Building Materials',
//             supplier: 'Construction Supply Co.',
//             location: 'Outdoor Area A',
//             expiryDate: new Date('2024-12-31'),
//             batchNumber: 'BATCH010'
//           },
//           {
//             id: '11',
//             itemId: 'item11',
//             itemName: 'Steel Rebar (6mm)',
//             itemCode: 'REBAR-STEEL-6MM',
//             itemImage: '/api/images/rebar.jpg',
//             inventoryId: 'inv6',
//             inventoryName: 'Construction Materials Warehouse',
//             warehouseId: 'wh6',
//             warehouseName: 'Construction Storage',
//             currentStock: 5,
//             minimumStock: 10,
//             maximumStock: 100,
//             reservedStock: 2,
//             availableStock: 3,
//             unitCost: 25.00,
//             totalValue: 125.00,
//             lastUpdated: new Date(),
//             status: 'low',
//             category: 'Building Materials',
//             supplier: 'Steel Works Ltd.',
//             location: 'Outdoor Area B',
//             expiryDate: new Date('2026-12-31'),
//             batchNumber: 'BATCH011'
//           },
//           // Automotive Parts
//           {
//             id: '12',
//             itemId: 'item12',
//             itemName: 'Car Oil Filters',
//             itemCode: 'OIL-FILTER-UNIV',
//             itemImage: '/api/images/oil-filter.jpg',
//             inventoryId: 'inv7',
//             inventoryName: 'Automotive Parts Warehouse',
//             warehouseId: 'wh7',
//             warehouseName: 'Auto Parts Storage',
//             currentStock: 0,
//             minimumStock: 25,
//             maximumStock: 200,
//             reservedStock: 0,
//             availableStock: 0,
//             unitCost: 15.99,
//             totalValue: 0,
//             lastUpdated: new Date(),
//             status: 'out',
//             category: 'Automotive',
//             supplier: 'Auto Parts Pro',
//             location: 'Shelf F1',
//             expiryDate: new Date('2025-12-31'),
//             batchNumber: 'BATCH012'
//           }
//         ];

//         const mockInventories: InventoryModel[] = [
//           {
//             id: 'inv1',
//             name: 'Main Electronics Warehouse',
//             code: 'MEW001',
//             location: 'Downtown District',
//             manager: 'John Smith',
//             totalItems: 1250,
//             totalValue: 2500000
//           },
//           {
//             id: 'inv2',
//             name: 'Computer Parts Warehouse',
//             code: 'CPW002',
//             location: 'Industrial Zone',
//             manager: 'Sarah Johnson',
//             totalItems: 850,
//             totalValue: 1800000
//           },
//           {
//             id: 'inv3',
//             name: 'Food & Beverage Warehouse',
//             code: 'FBW003',
//             location: 'Agricultural District',
//             manager: 'Maria Garcia',
//             totalItems: 2000,
//             totalValue: 150000
//           },
//           {
//             id: 'inv4',
//             name: 'Textile & Clothing Warehouse',
//             code: 'TCW004',
//             location: 'Fashion District',
//             manager: 'Ahmed Hassan',
//             totalItems: 3000,
//             totalValue: 450000
//           },
//           {
//             id: 'inv5',
//             name: 'Household Goods Warehouse',
//             code: 'HGW005',
//             location: 'Residential Area',
//             manager: 'Lisa Chen',
//             totalItems: 1800,
//             totalValue: 320000
//           },
//           {
//             id: 'inv6',
//             name: 'Construction Materials Warehouse',
//             code: 'CMW006',
//             location: 'Industrial Zone',
//             manager: 'Robert Wilson',
//             totalItems: 1200,
//             totalValue: 850000
//           },
//           {
//             id: 'inv7',
//             name: 'Automotive Parts Warehouse',
//             code: 'APW007',
//             location: 'Auto District',
//             manager: 'David Brown',
//             totalItems: 950,
//             totalValue: 680000
//           }
//         ];

//         const mockWarehouses: WarehouseModel[] = [
//           {
//             id: 'wh1',
//             name: 'Warehouse A',
//             code: 'WA001',
//             inventoryId: 'inv1',
//             capacity: 10000,
//             usedCapacity: 7500,
//             temperature: '18-22°C',
//             humidity: '45-55%'
//           },
//           {
//             id: 'wh2',
//             name: 'Warehouse B',
//             code: 'WB002',
//             inventoryId: 'inv2',
//             capacity: 8000,
//             usedCapacity: 6000,
//             temperature: '20-25°C',
//             humidity: '40-50%'
//           },
//           {
//             id: 'wh3',
//             name: 'Cold Storage A',
//             code: 'CSA003',
//             inventoryId: 'inv3',
//             capacity: 5000,
//             usedCapacity: 3200,
//             temperature: '2-8°C',
//             humidity: '85-95%'
//           },
//           {
//             id: 'wh4',
//             name: 'Textile Storage',
//             code: 'TS004',
//             inventoryId: 'inv4',
//             capacity: 8000,
//             usedCapacity: 6500,
//             temperature: '20-25°C',
//             humidity: '50-60%'
//           },
//           {
//             id: 'wh5',
//             name: 'Household Storage',
//             code: 'HS005',
//             inventoryId: 'inv5',
//             capacity: 6000,
//             usedCapacity: 4200,
//             temperature: '18-25°C',
//             humidity: '40-50%'
//           },
//           {
//             id: 'wh6',
//             name: 'Construction Storage',
//             code: 'CS006',
//             inventoryId: 'inv6',
//             capacity: 15000,
//             usedCapacity: 12000,
//             temperature: 'Ambient',
//             humidity: '30-70%'
//           },
//           {
//             id: 'wh7',
//             name: 'Auto Parts Storage',
//             code: 'APS007',
//             inventoryId: 'inv7',
//             capacity: 7000,
//             usedCapacity: 4800,
//             temperature: '15-25°C',
//             humidity: '40-60%'
//           }
//         ];

//         setStockBalances(mockStockBalances);
//         setInventories(mockInventories);
//         setWarehouses(mockWarehouses);
//       } catch (error) {
//         console.error('Error fetching stock balance data:', error);
//         toastify('Error loading stock balance data', 'error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const filteredStockBalances = stockBalances.filter(item => {
//     const matchesInventory = selectedInventory === 'all' || item.inventoryId === selectedInventory;
//     const matchesWarehouse = selectedWarehouse === 'all' || item.warehouseId === selectedWarehouse;
//     const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
//     const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesLowStock = !showLowStock || item.status === 'low';
//     const matchesOutOfStock = !showOutOfStock || item.status === 'out';
//     const matchesOverstock = !showOverstock || item.status === 'overstock';

//     return matchesInventory && matchesWarehouse && matchesStatus && matchesSearch && 
//            matchesLowStock && matchesOutOfStock && matchesOverstock;
//   });

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'normal': return 'success';
//       case 'low': return 'warning';
//       case 'out': return 'error';
//       case 'overstock': return 'info';
//       default: return 'default';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'normal': return <CheckCircle />;
//       case 'low': return <Warning />;
//       case 'out': return <Cancel />;
//       case 'overstock': return <TrendingUp />;
//       default: return <Inventory />;
//     }
//   };

//   const handleWarehouseReceipt = () => {
//     setWarehouseReceiptDialog(true);
//   };

//   const handleStoreIssue = () => {
//     setStoreIssueDialog(true);
//   };

//   const handleAnalytics = () => {
//     setAnalyticsDialog(true);
//   };

//   const columns = [
//     {
//       field: 'itemName',
//       headerName: t('ItemName'),
//       width: 200,
//       renderCell: (params: any) => (
//         <Box display="flex" alignItems="center" gap={1}>
//           <Avatar src={params.row.itemImage} sx={{ width: 32, height: 32 }}>
//             {params.row.itemName.charAt(0)}
//           </Avatar>
//           <Box>
//             <Typography variant="body2" fontWeight="bold">
//               {params.row.itemName}
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               {params.row.itemCode}
//             </Typography>
//           </Box>
//         </Box>
//       )
//     },
//     {
//       field: 'inventoryName',
//       headerName: t('Inventory'),
//       width: 150
//     },
//     {
//       field: 'warehouseName',
//       headerName: t('Warehouse'),
//       width: 120
//     },
//     {
//       field: 'currentStock',
//       headerName: t('CurrentStock'),
//       width: 120,
//       renderCell: (params: any) => (
//         <Box textAlign="center">
//           <Typography variant="body2" fontWeight="bold">
//             {params.row.currentStock}
//           </Typography>
//           <Typography variant="caption" color="text.secondary">
//             {params.row.availableStock} available
//           </Typography>
//         </Box>
//       )
//     },
//     {
//       field: 'status',
//       headerName: t('Status'),
//       width: 120,
//       renderCell: (params: any) => (
//         <Chip
//           icon={getStatusIcon(params.row.status)}
//           label={t(params.row.status)}
//           color={getStatusColor(params.row.status) as any}
//           size="small"
//         />
//       )
//     },
//     {
//       field: 'totalValue',
//       headerName: t('TotalValue'),
//       width: 120,
//       renderCell: (params: any) => (
//         <Typography variant="body2" fontWeight="bold">
//           ${params.row.totalValue.toLocaleString()}
//         </Typography>
//       )
//     },
//     {
//       field: 'lastUpdated',
//       headerName: t('LastUpdated'),
//       width: 120,
//       renderCell: (params: any) => (
//         <Typography variant="caption">
//           {new Date(params.row.lastUpdated).toLocaleDateString()}
//         </Typography>
//       )
//     },
//     {
//       field: 'actions',
//       headerName: t('Actions'),
//       width: 150,
//       renderCell: (params: any) => (
//         <Box display="flex" gap={0.5}>
//           <Tooltip title={t('ViewDetails')}>
//             <IconButton size="small" color="primary">
//               <Visibility />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title={t('Edit')}>
//             <IconButton size="small" color="secondary">
//               <Edit />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title={t('Delete')}>
//             <IconButton size="small" color="error">
//               <Delete />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       )
//     }
//   ];

//   const renderEnhancedCardView = () => (
//     <Grid container spacing={3}>
//       {filteredStockBalances.map((item, index) => (
//         <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
//           <Grow in={true} timeout={index * 100}>
//             <Card 
//               sx={{ 
//                 height: '100%',
//                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                 '&:hover': {
//                   transform: 'translateY(-8px) scale(1.02)',
//                   boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
//                   '& .MuiCardMedia-root': {
//                     transform: 'scale(1.1)'
//                   }
//                 },
//                 position: 'relative',
//                 overflow: 'hidden'
//               }}
//             >
//               <CardActionArea>
//                 <Box sx={{ position: 'relative' }}>
//                   <CardMedia
//                     component="img"
//                     height="140"
//                     image={item.itemImage || '/api/images/placeholder.jpg'}
//                     alt={item.itemName}
//                     sx={{
//                       transition: 'transform 0.3s ease',
//                       background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
//                     }}
//                   />
//                   <Box
//                     sx={{
//                       position: 'absolute',
//                       top: 8,
//                       right: 8,
//                       zIndex: 1
//                     }}
//                   >
//                     <Chip
//                       icon={getStatusIcon(item.status)}
//                       label={t(item.status)}
//                       color={getStatusColor(item.status) as any}
//                       size="small"
//                       sx={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.9)' }}
//                     />
//                   </Box>
//                 </Box>
                
//                 <CardContent sx={{ p: 2 }}>
//                   <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
//                     {item.itemName}
//                   </Typography>
                  
//                   <Typography variant="caption" color="text.secondary" gutterBottom>
//                     {item.itemCode} • {item.category}
//                   </Typography>

//                   <Box sx={{ my: 2 }}>
//                     <Typography variant="body2" color="text.secondary">
//                       {item.inventoryName} • {item.warehouseName}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {item.supplier} • {item.location}
//                     </Typography>
//                   </Box>

//                   <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                     <Box textAlign="center">
//                       <Typography variant="h5" color="primary" fontWeight="bold">
//                         {item.currentStock}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         Current Stock
//                       </Typography>
//                     </Box>
//                     <Box textAlign="center">
//                       <Typography variant="h5" color="success.main" fontWeight="bold">
//                         {item.availableStock}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         Available
//                       </Typography>
//                     </Box>
//                     <Box textAlign="center">
//                       <Typography variant="h5" color="warning.main" fontWeight="bold">
//                         ${item.unitCost}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         Unit Cost
//                       </Typography>
//                     </Box>
//                   </Box>

//                   <Divider sx={{ my: 1 }} />

//                   <Box display="flex" justifyContent="space-between" alignItems="center">
//                     <Typography variant="h6" fontWeight="bold" color="primary">
//                       ${item.totalValue.toLocaleString()}
//                     </Typography>
//                     <Box display="flex" gap={0.5}>
//                       <Tooltip title={t('ViewDetails')}>
//                         <IconButton size="small" color="primary">
//                           <Visibility />
//                         </IconButton>
//                       </Tooltip>
//                       <Tooltip title={t('Edit')}>
//                         <IconButton size="small" color="secondary">
//                           <Edit />
//                         </IconButton>
//                       </Tooltip>
//                     </Box>
//                   </Box>
//                 </CardContent>
//               </CardActionArea>
//             </Card>
//           </Grow>
//         </Grid>
//       ))}
//     </Grid>
//   );

//   const renderEnhancedAnalyticsView = () => (
//     <Grid container spacing={3}>
//       <Grid item xs={12} md={6}>
//         <Fade in={true} timeout={500}>
//           <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
//             <CardContent>
//               <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
//                 📊 Stock Status Overview
//               </Typography>
//               <Box display="flex" justifyContent="space-around" mt={2}>
//                 <Box textAlign="center">
//                   <Typography variant="h3" sx={{ color: 'white' }}>
//                     {stockBalances.filter(item => item.status === 'normal').length}
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
//                     Normal Stock
//                   </Typography>
//                 </Box>
//                 <Box textAlign="center">
//                   <Typography variant="h3" sx={{ color: 'white' }}>
//                     {stockBalances.filter(item => item.status === 'low').length}
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
//                     Low Stock
//                   </Typography>
//                 </Box>
//                 <Box textAlign="center">
//                   <Typography variant="h3" sx={{ color: 'white' }}>
//                     {stockBalances.filter(item => item.status === 'out').length}
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
//                     Out of Stock
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Fade>
//       </Grid>

//       <Grid item xs={12} md={6}>
//         <Fade in={true} timeout={700}>
//           <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
//             <CardContent>
//               <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
//                 💰 Total Inventory Value
//               </Typography>
//               <Typography variant="h2" color="white" fontWeight="bold">
//                 ${stockBalances.reduce((sum, item) => sum + item.totalValue, 0).toLocaleString()}
//               </Typography>
//               <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
//                 Across all warehouses
//               </Typography>
//             </CardContent>
//           </Card>
//         </Fade>
//       </Grid>

//       <Grid item xs={12}>
//         <Fade in={true} timeout={900}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 📈 Inventory Distribution
//               </Typography>
//               {inventories.map((inventory, index) => (
//                 <Box key={inventory.id} mb={2}>
//                   <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//                     <Typography variant="body1" fontWeight="bold">
//                       {inventory.name}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {stockBalances.filter(item => item.inventoryId === inventory.id).length} items
//                     </Typography>
//                   </Box>
//                   <LinearProgress 
//                     variant="determinate" 
//                     value={(stockBalances.filter(item => item.inventoryId === inventory.id).length / stockBalances.length) * 100}
//                     sx={{ 
//                       height: 8, 
//                       borderRadius: 4,
//                       backgroundColor: 'rgba(0,0,0,0.1)',
//                       '& .MuiLinearProgress-bar': {
//                         borderRadius: 4,
//                         background: `linear-gradient(90deg, #${Math.floor(Math.random()*16777215).toString(16)} 0%, #${Math.floor(Math.random()*16777215).toString(16)} 100%)`
//                       }
//                     }}
//                   />
//                 </Box>
//               ))}
//             </CardContent>
//           </Card>
//         </Fade>
//       </Grid>
//     </Grid>
//   );

//   return (
//     <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
//       {/* Enhanced Header */}
//       <Paper elevation={0} sx={{ 
//         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
//         color: 'white',
//         mb: 3
//       }}>
//         <Box sx={{ p: 4 }}>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Box>
//               <Typography variant="h3" fontWeight="bold" gutterBottom>
//                 📦 {t('StockBalanceManagement')}
//               </Typography>
//               <Typography variant="h6" sx={{ opacity: 0.9 }}>
//                 Monitor and manage inventory levels across all warehouses
//               </Typography>
//             </Box>
//             <Box display="flex" gap={2}>
//               <Button
//                 variant="contained"
//                 startIcon={<Add />}
//                 onClick={handleWarehouseReceipt}
//                 sx={{ 
//                   borderRadius: 3,
//                   background: 'rgba(255,255,255,0.2)',
//                   backdropFilter: 'blur(10px)',
//                   '&:hover': {
//                     background: 'rgba(255,255,255,0.3)'
//                   }
//                 }}
//               >
//                 {t('WarehouseReceipt')}
//               </Button>
//               <Button
//                 variant="outlined"
//                 startIcon={<Remove />}
//                 onClick={handleStoreIssue}
//                 sx={{ 
//                   borderRadius: 3,
//                   borderColor: 'rgba(255,255,255,0.5)',
//                   color: 'white',
//                   '&:hover': {
//                     borderColor: 'white',
//                     background: 'rgba(255,255,255,0.1)'
//                   }
//                 }}
//               >
//                 {t('StoreIssue')}
//               </Button>
//               <Button
//                 variant="outlined"
//                 startIcon={<Assessment />}
//                 onClick={handleAnalytics}
//                 sx={{ 
//                   borderRadius: 3,
//                   borderColor: 'rgba(255,255,255,0.5)',
//                   color: 'white',
//                   '&:hover': {
//                     borderColor: 'white',
//                     background: 'rgba(255,255,255,0.1)'
//                   }
//                 }}
//               >
//                 {t('Analytics')}
//               </Button>
//             </Box>
//           </Box>
//         </Box>
//       </Paper>

//       <Box sx={{ p: 3 }}>
//         {/* Enhanced Filters */}
//         <Card sx={{ mb: 3, borderRadius: 3 }}>
//           <CardContent>
//             <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
//               <Typography variant="h6" fontWeight="bold">
//                 🔍 Filters & Controls
//               </Typography>
//               <Button
//                 startIcon={<FilterList />}
//                 onClick={() => setShowFilters(!showFilters)}
//                 variant="outlined"
//                 size="small"
//               >
//                 {showFilters ? 'Hide' : 'Show'} Filters
//               </Button>
//             </Box>
            
//             <Collapse in={showFilters}>
//               <Grid container spacing={3} alignItems="center">
//                 <Grid item xs={12} md={3}>
//                   <TextField
//                     fullWidth
//                     placeholder={t('SearchItems')}
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     InputProps={{
//                       startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
//                     }}
//                     sx={{ borderRadius: 2 }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={2}>
//                   <FormControl fullWidth>
//                     <InputLabel>{t('Inventory')}</InputLabel>
//                     <Select
//                       value={selectedInventory}
//                       onChange={(e) => setSelectedInventory(e.target.value)}
//                       label={t('Inventory')}
//                     >
//                       <MenuItem value="all">{t('AllInventories')}</MenuItem>
//                       {inventories.map((inventory) => (
//                         <MenuItem key={inventory.id} value={inventory.id}>
//                           {inventory.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} md={2}>
//                   <FormControl fullWidth>
//                     <InputLabel>{t('Warehouse')}</InputLabel>
//                     <Select
//                       value={selectedWarehouse}
//                       onChange={(e) => setSelectedWarehouse(e.target.value)}
//                       label={t('Warehouse')}
//                     >
//                       <MenuItem value="all">{t('AllWarehouses')}</MenuItem>
//                       {warehouses.map((warehouse) => (
//                         <MenuItem key={warehouse.id} value={warehouse.id}>
//                           {warehouse.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} md={2}>
//                   <FormControl fullWidth>
//                     <InputLabel>{t('Status')}</InputLabel>
//                     <Select
//                       value={selectedStatus}
//                       onChange={(e) => setSelectedStatus(e.target.value)}
//                       label={t('Status')}
//                     >
//                       <MenuItem value="all">{t('AllStatuses')}</MenuItem>
//                       <MenuItem value="normal">{t('Normal')}</MenuItem>
//                       <MenuItem value="low">{t('LowStock')}</MenuItem>
//                       <MenuItem value="out">{t('OutOfStock')}</MenuItem>
//                       <MenuItem value="overstock">{t('Overstock')}</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} md={3}>
//                   <Box display="flex" gap={1}>
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={showLowStock}
//                           onChange={(e) => setShowLowStock(e.target.checked)}
//                           size="small"
//                         />
//                       }
//                       label={t('LowStock')}
//                     />
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={showOutOfStock}
//                           onChange={(e) => setShowOutOfStock(e.target.checked)}
//                           size="small"
//                         />
//                       }
//                       label={t('OutOfStock')}
//                     />
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Collapse>
//           </CardContent>
//         </Card>

//         {/* Enhanced View Mode Tabs */}
//         <Card sx={{ mb: 3, borderRadius: 3 }}>
//           <CardContent>
//             <Tabs 
//               value={viewMode} 
//               onChange={(e, newValue) => setViewMode(newValue)}
//               sx={{
//                 '& .MuiTab-root': {
//                   borderRadius: 2,
//                   mx: 1
//                 }
//               }}
//             >
//               <Tab value="table" label={t('Table')} icon={<ViewList />} />
//               <Tab value="cards" label={t('Cards')} icon={<ViewComfy />} />
//               <Tab value="analytics" label={t('Analytics')} icon={<Analytics />} />
//             </Tabs>
//           </CardContent>
//         </Card>

//         {/* Content */}
//         {loading ? (
//           <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//             <CircularProgress size={60} />
//           </Box>
//         ) : (
//           <>
//             {viewMode === 'table' && (
//               <Card sx={{ borderRadius: 3 }}>
//                 <CardContent>
//                   <DataTable
//                     data={filteredStockBalances}
//                     columns={columns}
//                     loading={loading}
//                     pagination
//                     search
//                     selectable
//                     onSelectionChange={setSelectedItems}
//                   />
//                 </CardContent>
//               </Card>
//             )}
//             {viewMode === 'cards' && renderEnhancedCardView()}
//             {viewMode === 'analytics' && renderEnhancedAnalyticsView()}
//           </>
//         )}

//         {/* Enhanced Alerts */}
//         {filteredStockBalances.filter(item => item.status === 'low').length > 0 && (
//           <Fade in={true}>
//             <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
//               <Typography variant="body2">
//                 ⚠️ {filteredStockBalances.filter(item => item.status === 'low').length} items are running low on stock
//               </Typography>
//             </Alert>
//           </Fade>
//         )}

//         {filteredStockBalances.filter(item => item.status === 'out').length > 0 && (
//           <Fade in={true}>
//             <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
//               <Typography variant="body2">
//                 🚨 {filteredStockBalances.filter(item => item.status === 'out').length} items are out of stock
//               </Typography>
//             </Alert>
//           </Fade>
//         )}

//         {/* Quick Actions Speed Dial */}
//         <SpeedDial
//           ariaLabel="Quick Actions"
//           sx={{ position: 'fixed', bottom: 16, right: 16 }}
//           icon={<SpeedDialIcon />}
//           open={quickActionsOpen}
//           onOpen={() => setQuickActionsOpen(true)}
//           onClose={() => setQuickActionsOpen(false)}
//         >
//           <SpeedDialAction
//             icon={<Add />}
//             tooltipTitle="Warehouse Receipt"
//             onClick={handleWarehouseReceipt}
//           />
//           <SpeedDialAction
//             icon={<Remove />}
//             tooltipTitle="Store Issue"
//             onClick={handleStoreIssue}
//           />
//           <SpeedDialAction
//             icon={<Assessment />}
//             tooltipTitle="Analytics"
//             onClick={handleAnalytics}
//           />
//         </SpeedDial>
//       </Box>

//       {/* Dialogs */}
//       <Dialog open={warehouseReceiptDialog} onClose={() => setWarehouseReceiptDialog(false)} maxWidth="md" fullWidth>
//         <DialogTitle>
//           <Box display="flex" alignItems="center" gap={1}>
//             <Add color="primary" />
//             {t('CreateWarehouseReceipt')}
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Typography>Warehouse receipt form will be implemented here</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setWarehouseReceiptDialog(false)}>{t('Cancel')}</Button>
//           <Button variant="contained">{t('Create')}</Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={storeIssueDialog} onClose={() => setStoreIssueDialog(false)} maxWidth="md" fullWidth>
//         <DialogTitle>
//           <Box display="flex" alignItems="center" gap={1}>
//             <Remove color="error" />
//             {t('CreateStoreIssue')}
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Typography>Store issue form will be implemented here</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setStoreIssueDialog(false)}>{t('Cancel')}</Button>
//           <Button variant="contained" color="error">{t('Create')}</Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={analyticsDialog} onClose={() => setAnalyticsDialog(false)} maxWidth="lg" fullWidth>
//         <DialogTitle>
//           <Box display="flex" alignItems="center" gap={1}>
//             <Assessment color="primary" />
//             {t('StockAnalytics')}
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           {renderEnhancedAnalyticsView()}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setAnalyticsDialog(false)}>{t('Close')}</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default StockBalancePage; 