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
        path: "/chart-of-accounts",
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
        path: "/sub-ledgers/banks",
      },
      {
        title: "Taxes",
        icon: React.createElement(ReceiptOutlined),
        path: "/sub-ledgers/taxes",
      },
      {
        title: "CashInBoxes",
        icon: React.createElement(LocalAtmOutlined),
        path: "/sub-ledgers/cash-in-boxes",
      },
      {
        title: "Customers",
        icon: React.createElement(PeopleOutlined),
        path: "/sub-ledgers/customers",
      },
      {
        title: "Suppliers",
        icon: React.createElement(LocalShippingOutlined),
        path: "/sub-ledgers/suppliers",
      },
      {
        title: "FixedAssets",
        icon: React.createElement(WarehouseOutlined),
        path: "/sub-ledgers/fixed-assets",
      },
      {
        title: "Branches",
        icon: React.createElement(StoreOutlined),
        path: "/sub-ledgers/branches",
      },
    ],
  },
  {
    title: "Settings",
    icon: React.createElement(SettingsOutlined),
    submenu: [
      {
        title: "GlSettings",
        icon: React.createElement(BookmarkBorderOutlined),
        path: "/gl-settings",
      },
      {
        title: "AccountGuides",
        icon: React.createElement(BookOutlined),
        path: "/account-guides",
      },
      {
        title: "CollectionBooks",
        icon: React.createElement(LibraryBooksOutlined),
        path: "/collection-books",
      },
      {
        title: "CostCenter",
        icon: React.createElement(CategoryOutlined),
        path: "/cost-centers",
      },
      {
        title: "FinancialPeriods",
        icon: React.createElement(CalendarTodayOutlined),
        path: "/financial-periods",
      },
      {
        title: "Currencies",
        icon: React.createElement(CurrencyExchangeOutlined),
        path: "/currencies",
      },
      {
        title: "SellingPrices",
        icon: React.createElement(AttachMoneyOutlined),
        path: "/selling-prices",
      },
      {
        title: "PackingUnits",
        icon: React.createElement(InventoryOutlined),
        path: "/packing-units",
      },
      {
        title: "ManufacturerCompanies",
        icon: React.createElement(FactoryOutlined),
        path: "/manufacturer-companies",
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
        path: "/combined-entries",
      },
      {
        title: "PaymentVouchers",
        icon: React.createElement(MoneyOutlined),
        path: "/payment-vouchers",
      },
      {
        title: "ReceiptVouchers",
        icon: React.createElement(MonetizationOnOutlined),
        path: "/receipt-vouchers",
      },
      {
        title: "JournalEntries",
        icon: React.createElement(BookOutlined),
        path: "/journal-entries",
      },
      {
        title: "OpeningEntries",
        icon: React.createElement(AccountBalanceOutlined),
        path: "/opening-entries",
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
        path: "/attributes",
      },
    ],
  },
];

export default sidebarItemsData;
