import {
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

export interface ISidebarItem {
  icon?: ReactElement;
  title: string;
  submenu?: ISidebarItem[];
  path?: string;
}

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
      },
      {
        title: "Taxes",
        icon: React.createElement(ReceiptOutlined),
        path: "/subleadgers/taxes",
      },
      {
        title: "CashInBoxes",
        icon: React.createElement(LocalAtmOutlined),
        path: "/subleadgers/cashInBoxes",
      },
      {
        title: "Customers",
        icon: React.createElement(PeopleOutlined),
        path: "/subleadgers/customers",
      },
      {
        title: "Suppliers",
        icon: React.createElement(LocalShippingOutlined),
        path: "/subleadgers/suppliers",
      },
      {
        title: "FixedAssets",
        icon: React.createElement(WarehouseOutlined),
        path: "/subleadgers/fixedAssets",
      },
      {
        title: "Branches",
        icon: React.createElement(StoreOutlined),
        path: "/subleadgers/Branches",
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
      },
      {
        title: "AccountGuides",
        icon: React.createElement(BookOutlined),
        path: "/accountguides",
      },
      {
        title: "CollectionBooks",
        icon: React.createElement(LibraryBooksOutlined),
        path: "/collectionBooks",
      },
      {
        title: "CostCenter",
        icon: React.createElement(CategoryOutlined),
        path: "/costCenter",
      },
      {
        title: "FinancialPeriods",
        icon: React.createElement(CalendarTodayOutlined),
        path: "/financialPeriods",
      },
      {
        title: "Currencies",
        icon: React.createElement(CurrencyExchangeOutlined),
        path: "/currencies",
      },
      {
        title: "SellingPrices",
        icon: React.createElement(AttachMoneyOutlined),
        path: "/sellingPrices",
      },
      {
        title: "PackingUnits",
        icon: React.createElement(InventoryOutlined),
        path: "/packingUnits",
      },
      {
        title: "ManufacturerCompanies",
        icon: React.createElement(FactoryOutlined),
        path: "/manufacturerCompanies",
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
      },
      {
        title: "PaymentVouchers",
        icon: React.createElement(MoneyOutlined),
        path: "/paymentVouchers",
      },
      {
        title: "ReceiptVouchers",
        icon: React.createElement(MonetizationOnOutlined),
        path: "/receiptVouchers",
      },
      {
        title: "JournalEntries",
        icon: React.createElement(BookOutlined),
        path: "/journalEntries",
      },
      {
        title: "OpeningEntries",
        icon: React.createElement(AccountBalanceOutlined),
        path: "/openingEntries",
      },
    ],
  },
  {
    title: "Inventory",
    icon: React.createElement(InventoryOutlined),
    submenu: [
      {
        title: "Products",
        icon: React.createElement(CategoryOutlined),
        path: "/products",
      },
      {
        title: "Variants",
        icon: React.createElement(InventoryOutlined),
        path: "/variants",
      },
      {
        title: "InventoryTransfers",
        icon: React.createElement(LocalShippingOutlined),
        path: "/inventory/transfers",
      },
      {
        title: "InventoryTransactions",
        icon: React.createElement(LocalShippingOutlined),
        path: "/inventory-transactions",
      },
      {
        title: "Attributes",
        icon: React.createElement(TuneOutlined),
        path: "/Attributes",
      },
    ],
  },
];

export default sidebarItemsData;
