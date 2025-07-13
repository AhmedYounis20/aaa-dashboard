import { 
  AccountTree, 
  AccountBalance, 
  People, 
  Business, 
  Build, 
  Storefront, 
  Settings, 
  Book, 
  CollectionsBookmark, 
  Timeline, 
  CurrencyExchange, 
  AttachMoney, 
  Inventory, 
  Factory, 
  Receipt, 
  Payment, 
  AccountBalanceWallet, 
  Description, 
  FolderOpen,
  Category,
  Palette,
  Straighten,
  LocalShipping,
  Assessment
} from "@mui/icons-material";
import React, { ReactElement } from "react";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

import ChartOfAccountsRoot from "../Pages/ProjectPages/Account/ChartOfAccounts/ChartOfAccountsRoot";
import BanksRoot from "../Pages/ProjectPages/Account/SubLeadgers/Banks/BanksRoot";
import CashInBoxesRoot from "../Pages/ProjectPages/Account/SubLeadgers/CashInBoxes/CashInBoxesRoot";
import CustomersRoot from "../Pages/ProjectPages/Account/SubLeadgers/Customers/CustomersRoot";
import SuppliersRoot from "../Pages/ProjectPages/Account/SubLeadgers/Suppliers/SuppliersRoot";
import FixedAssetsRoot from "../Pages/ProjectPages/Account/SubLeadgers/FixedAssets/FixedAssetsRoot";
import BranchesRoot from "../Pages/ProjectPages/Account/SubLeadgers/Branches";
import GlSettingsRoot from "../Pages/ProjectPages/Account/Settings/GlSettings/GlSettingsRoot";
import AccountGuidesRoot from "../Pages/ProjectPages/Account/AccountGuides/AccountGuidesRoot";
import CollectionBooksRoot from "../Pages/ProjectPages/Account/Settings/CollectionBooks/CollectionBooksRoot";
import CostCenterRoot from "../Pages/ProjectPages/Account/Settings/CostCenters/CostCenterRoot";
import FinancialPeriodsRoot from "../Pages/ProjectPages/Account/Settings/FinancialPeriods/FinancialPeriodsRoot";
import CurrenciesRoot from "../Pages/ProjectPages/Account/Settings/Currencies/CurrenciesRoot";
import SellingPricesRoot from "../Pages/ProjectPages/Inventory/SellingPrices/SellingPricesRoot";
import PackingUnitsRoot from "../Pages/ProjectPages/Inventory/PackingUnits/PackingUnitsRoot";
import ManufacturerCompaniesRoot from "../Pages/ProjectPages/Inventory/ManufacturerCompanies/ManufacturerCompaniesRoot";
import CompinedEntriesRoot from "../Pages/ProjectPages/Account/Entries/CompinedEntries/CompinedEntriesRoot";
import PaymentVouchersRoot from "../Pages/ProjectPages/Account/Entries/PaymentVouchers/PaymentVouchersRoot";
import ReceiptVouchersRoot from "../Pages/ProjectPages/Account/Entries/ReceiptVouchers/ReceiptVouchersRoot";
import JournalEntriesRoot from "../Pages/ProjectPages/Account/Entries/JournalEntries/JournalEntriesRoot";
import OpeningEntriesRoot from "../Pages/ProjectPages/Account/Entries/OpeningEntries/OpeningEntriesRoot";
import ItemsRoot from "../Pages/ProjectPages/Inventory/Items/ItemsRoot";
import ColorsRoot from "../Pages/ProjectPages/Inventory/Colors/ColorsRoot";
import SizesRoot from "../Pages/ProjectPages/Inventory/Sizes/SizesRoot";
import InventoryTransactionsPage from "../Pages/ProjectPages/Inventory/InventoryTransactions";

export interface ISidebarItem {
    icon?: ReactElement;
    title: string;
    submenu?: ISidebarItem[];
    path?: string;
    page? : React.FC | null
}

// TODO: make the icon value is string

export const sidebarItemsData: ISidebarItem[] = [
  {
    title: "GeneralLeadgers",
    icon: React.createElement(AccountTree),
    submenu: [
      {
        title: "ChartOfAccounts",
        icon: React.createElement(Assessment),
        path: "/chartOfAccounts",
        page: ChartOfAccountsRoot,
      },
    ],
  },
  {
    title: "SubLeadgers",
    icon: React.createElement(AccountBoxIcon),
    submenu: [
      {
        title: "Banks",
        icon: React.createElement(AccountBalance),
        path: "/subleadgers/banks",
        page: BanksRoot,
      },
      {
        title: "CashInBoxes",
        icon: React.createElement(AccountBalanceWallet),
        path: "/subleadgers/cashInBoxes",
        page: CashInBoxesRoot,
      },
      {
        title: "Customers",
        icon: React.createElement(People),
        path: "/subleadgers/customers",
        page: CustomersRoot
      },
      {
        title: "Suppliers",
        icon: React.createElement(Business),
        path: "/subleadgers/suppliers",
        page: SuppliersRoot
      },
      {
        title: "FixedAssets",
        icon: React.createElement(Build),
        path: "/subleadgers/fixedAssets",
        page: FixedAssetsRoot
      },
      {
        title: "Branches",
        icon: React.createElement(Storefront),
        path: "/subleadgers/Branches",
        page: BranchesRoot
      },
    ],
  },
  {
    title: "Settings",
    icon: React.createElement(Settings),
    submenu: [
      {
        title: "Glsettings",
        icon: React.createElement(Settings),
        path: "/glSettings",
        page: GlSettingsRoot
      },
      {
        title: "AccountGuides",
        icon: React.createElement(Book),
        path: "/accountguides",
        page: AccountGuidesRoot
      },
      {
        title: "CollectionBooks",
        icon: React.createElement(CollectionsBookmark),
        path: "/collectionBooks",
        page: CollectionBooksRoot
      },
      {
        title: "CostCenter",
        icon: React.createElement(Category),
        path: "/costCenter",
        page: CostCenterRoot
      },
      {
        title: "FinancialPeriods",
        icon: React.createElement(Timeline),
        path: "/financialPeriods",
        page: FinancialPeriodsRoot
      },
      {
        title: "Currencies",
        icon: React.createElement(CurrencyExchange),
        path: "/currencies",
        page: CurrenciesRoot
      },
      {
        title: "SellingPrices",
        icon: React.createElement(AttachMoney),
        path: "/sellingPrices",
        page: SellingPricesRoot
      },
      {
        title: "PackingUnits",
        icon: React.createElement(LocalShipping),
        path: "/packingUnits",
        page: PackingUnitsRoot
      },
      {
        title: "ManufacturerCompanies",
        icon: React.createElement(Factory),
        path: "/manufacturerCompanies",
        page: ManufacturerCompaniesRoot
      },
    ],
  },
  {
    title: "Entries",
    icon: React.createElement(Description),
    submenu: [
      {
        title: "CompinedEntries",
        icon: React.createElement(FolderOpen),
        path: "/compinedentries",
        page: CompinedEntriesRoot
      },
      {
        title: "PaymentVouchers",
        icon: React.createElement(Payment),
        path: "/paymentVouchers",
        page: PaymentVouchersRoot
      },
      {
        title: "ReceiptVouchers",
        icon: React.createElement(Receipt),
        path: "/receiptVouchers",
        page: ReceiptVouchersRoot
      },
      {
        title: "JournalEntries",
        icon: React.createElement(Description),
        path: "/journalEntries",
        page: JournalEntriesRoot
      },
      {
        title: "OpeningEntries",
        icon: React.createElement(FolderOpen),
        path: "/openingEntries",
        page: OpeningEntriesRoot
      },
    ],
  },
  {
    title: "Inventory",
    icon: React.createElement(Inventory),
    submenu: [
      {
        title: "Items",
        icon: React.createElement(Inventory),
        path: "/items",
        page: ItemsRoot
      },
      {
        title: "Colors",
        icon: React.createElement(Palette),
        path: "/colors",
        page: ColorsRoot
      },
      {
        title: "Sizes",
        icon: React.createElement(Straighten),
        path: "/sizes",
        page: SizesRoot
      },
      // {
      //   title: "StockBalance",
      //   icon: React.createElement(Warehouse),
      //   path: "/stock-balance",
      //   page: StockBalancePage
      // },
      {
        title: "InventoryTransactions",
        icon: React.createElement(LocalShipping),
        path: "/inventory-transactions",
        page: InventoryTransactionsPage
      },
    ],
  },
];

export default sidebarItemsData;