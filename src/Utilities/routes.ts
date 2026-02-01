import { 
  Palette,
  Straighten,
  AccountBalanceOutlined,
  AccountTreeOutlined,
  AssessmentOutlined,
  AttachMoneyOutlined,
  BookOutlined,
  BookmarkBorderOutlined,
  CategoryOutlined,
  CurrencyExchangeOutlined,
  DashboardOutlined,
  FactoryOutlined,
  InventoryOutlined,
  LibraryBooksOutlined,
  LocalAtmOutlined,
  LocalShippingOutlined,
  MonetizationOnOutlined,
  MoneyOutlined,
  PeopleOutlined,
  ReceiptOutlined,
  SettingsOutlined,
  StoreOutlined,
  TableChartOutlined,
  WarehouseOutlined,
  CalendarTodayOutlined,
  TuneOutlined,
} from "@mui/icons-material";
import React, { ReactElement } from "react";
import ChartOfAccountsRoot from "../Pages/ProjectPages/Account/ChartOfAccounts/ChartOfAccountsRoot";
import BanksRoot from "../Pages/ProjectPages/Account/SubLeadgers/Banks/BanksRoot";
import TaxesRoot from "../Pages/ProjectPages/Account/SubLeadgers/Taxes/TaxesRoot";
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
import InventoryTransferRoot from '../Pages/ProjectPages/Inventory/InventoryTransfers/InventoryTransferRoot';
import attributesRoot from '../Pages/ProjectPages/Inventory/Attributes/AttributesRoot';

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
    title: "Dashboard",
    icon: React.createElement(DashboardOutlined),
    path: "/",
  },
  {
    title: "GeneralLedgers",
    icon: React.createElement(AccountTreeOutlined),
    submenu: [
      {
        title: "ChartOfAccounts",
        icon: React.createElement(TableChartOutlined),
        path: "/chartOfAccounts",
        page: ChartOfAccountsRoot,
      },
    ],
  },
  {
    title: "SubLedgers",
    icon: React.createElement(AssessmentOutlined),
    submenu: [
      {
        title: "Banks",
        icon: React.createElement(AccountBalanceOutlined),
        path: "/subleadgers/banks",
        page: BanksRoot,
      },
      {
        title: "Taxes",
        icon: React.createElement(ReceiptOutlined),
        path: "/subleadgers/taxes",
        page: TaxesRoot,
      },
      {
        title: "CashInBoxes",
        icon: React.createElement(LocalAtmOutlined),
        path: "/subleadgers/cashInBoxes",
        page: CashInBoxesRoot,
      },
      {
        title: "Customers",
        icon: React.createElement(PeopleOutlined),
        path: "/subleadgers/customers",
        page: CustomersRoot
      },
      {
        title: "Suppliers",
        icon: React.createElement(LocalShippingOutlined),
        path: "/subleadgers/suppliers",
        page: SuppliersRoot
      },
      {
        title: "FixedAssets",
        icon: React.createElement(WarehouseOutlined),
        path: "/subleadgers/fixedAssets",
        page: FixedAssetsRoot
      },
      {
        title: "Branches",
        icon: React.createElement(StoreOutlined),
        path: "/subleadgers/Branches",
        page: BranchesRoot
      },
    ],
  },
  {
    title: "Settings",
    icon: React.createElement(SettingsOutlined),
    submenu: [
      {
        title: "Glsettings",
        icon: React.createElement(BookmarkBorderOutlined),
        path: "/glSettings",
        page: GlSettingsRoot
      },
      {
        title: "AccountGuides",
        icon: React.createElement(BookOutlined),
        path: "/accountguides",
        page: AccountGuidesRoot
      },
      {
        title: "CollectionBooks",
        icon: React.createElement(LibraryBooksOutlined),
        path: "/collectionBooks",
        page: CollectionBooksRoot
      },
      {
        title: "CostCenter",
        icon: React.createElement(CategoryOutlined),
        path: "/costCenter",
        page: CostCenterRoot
      },
      {
        title: "FinancialPeriods",
        icon: React.createElement(CalendarTodayOutlined),
        path: "/financialPeriods",
        page: FinancialPeriodsRoot
      },
      {
        title: "Currencies",
        icon: React.createElement(CurrencyExchangeOutlined),
        path: "/currencies",
        page: CurrenciesRoot
      },
      {
        title: "SellingPrices",
        icon: React.createElement(AttachMoneyOutlined),
        path: "/sellingPrices",
        page: SellingPricesRoot
      },
      {
        title: "PackingUnits",
        icon: React.createElement(InventoryOutlined),
        path: "/packingUnits",
        page: PackingUnitsRoot
      },
      {
        title: "ManufacturerCompanies",
        icon: React.createElement(FactoryOutlined),
        path: "/manufacturerCompanies",
        page: ManufacturerCompaniesRoot
      },
    ],
  },
  {
    title: "Entries",
    icon: React.createElement(ReceiptOutlined),
    submenu: [
      {
        title: "CombinedEntries",
        icon: React.createElement(ReceiptOutlined),
        path: "/compinedentries",
        page: CompinedEntriesRoot
      },
      {
        title: "PaymentVouchers",
        icon: React.createElement(MoneyOutlined),
        path: "/paymentVouchers",
        page: PaymentVouchersRoot
      },
      {
        title: "ReceiptVouchers",
        icon: React.createElement(MonetizationOnOutlined),
        path: "/receiptVouchers",
        page: ReceiptVouchersRoot
      },
      {
        title: "JournalEntries",
        icon: React.createElement(BookOutlined),
        path: "/journalEntries",
        page: JournalEntriesRoot
      },
      {
        title: "OpeningEntries",
        icon: React.createElement(AccountBalanceOutlined),
        path: "/openingEntries",
        page: OpeningEntriesRoot
      },
    ],
  },
  {
    title: "Inventory",
    icon: React.createElement(InventoryOutlined),
    submenu: [
      {
        title: "Items",
        icon: React.createElement(CategoryOutlined),
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
      {
        title: "InventoryTransfers",
        icon: React.createElement(LocalShippingOutlined),
        path: "/inventory/transfers",
        page: InventoryTransferRoot
      },
      {
        title: "InventoryTransactions",
        icon: React.createElement(LocalShippingOutlined),
        path: "/inventory-transactions",
        page: InventoryTransactionsPage
      },
      {
        title: "Attributes",
        icon: React.createElement(TuneOutlined),
        path: "/Attributes",
        page: attributesRoot
      }
    ],
  },
];

export default sidebarItemsData;