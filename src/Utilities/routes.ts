import { Construction, CurrencyBitcoin, DashboardCustomize, Factory, InventoryRounded, Store } from "@mui/icons-material";
import React, { ReactElement } from "react";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DiamondIcon from '@mui/icons-material/Diamond';
import WebhookIcon from '@mui/icons-material/Webhook';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import TableChartIcon from '@mui/icons-material/TableChart';
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import BookIcon from "@mui/icons-material/Book";
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
    title: "General Leadgers",
    icon: React.createElement(AccountBoxIcon),
    submenu: [
      {
        title: "chart Of Accounts",
        icon: React.createElement(TableChartIcon),
        path: "/chartOfAccounts",
        page: ChartOfAccountsRoot,
      },
    ],
  },
  {
    title: "Sub Leadgers",
    icon: React.createElement(LeaderboardIcon),
    submenu: [
      {
        title: "banks",
        icon: React.createElement(AccountBalanceIcon),
        path: "/subleadgers/banks",
        page: BanksRoot,
      },
      {
        title: "cash in boxes",
        icon: React.createElement(MonetizationOnIcon),
        path: "/subleadgers/cashInBoxes",
        page: CashInBoxesRoot,
      },
      {
        title: "customers",
        icon: React.createElement(FaceRetouchingNaturalIcon),
        path: "/subleadgers/customers",
        page: CustomersRoot
      },
      {
        title: "suppliers",
        icon: React.createElement(DashboardCustomize),
        path: "/subleadgers/suppliers",
        page: SuppliersRoot
      },
      {
        title: "Fixed Assets",
        icon: React.createElement(Construction),
        path: "/subleadgers/fixedAssets",
        page: FixedAssetsRoot
      },
      {
        title: "Branches",
        icon: React.createElement(Store),
        path: "/subleadgers/Branches",
        page: BranchesRoot
      },
    ],
  },
  {
    title: "Settings",
    icon: React.createElement(SettingsIcon),
    submenu: [
      {
        title: "gl settings",
        icon: React.createElement(DiamondIcon),
        path: "/glSettings",
        page: GlSettingsRoot
      },
      {
        title: "account guides",
        icon: React.createElement(WebhookIcon),
        path: "/accountguides",
        page: AccountGuidesRoot
      },
      {
        title: "Collection Books",
        icon: React.createElement(BookIcon),
        path: "/collectionBooks",
        page: CollectionBooksRoot
      },
      {
        title: "cost center",
        icon: React.createElement(WebhookIcon),
        path: "/costCenter",
        page: CostCenterRoot
      },
      {
        title: "financial Periods",
        icon: React.createElement(CreditScoreIcon),
        path: "/financialPeriods",
        page: FinancialPeriodsRoot
      },
      {
        title: "currencies",
        icon: React.createElement(CurrencyBitcoin),
        path: "/currencies",
        page: CurrenciesRoot
      },
      {
        title: "selling Prices",
        icon: React.createElement(AttachMoneyIcon),
        path: "/sellingPrices",
        page: SellingPricesRoot
      },
      {
        title: "packing Units",
        icon: React.createElement(AccountBoxIcon),
        path: "/packingUnits",
        page: PackingUnitsRoot
      },
      {
        title: "Manufacturer Companies",
        icon: React.createElement(Factory),
        path: "/manufacturerCompanies",
        page: ManufacturerCompaniesRoot
      },
    ],
  },
  {
    title: "Entries",
    icon: React.createElement(LibraryBooksIcon),
    submenu: [
      {
        title: "Compined Entries",
        icon: React.createElement(ChangeCircleIcon),
        path: "/compinedentries",
        page: CompinedEntriesRoot
      },
      {
        title: "Payment Vouchers",
        icon: React.createElement(ChangeCircleIcon),
        path: "/paymentVouchers",
        page: PaymentVouchersRoot
      },
      {
        title: "Receipt Vouchers",
        icon: React.createElement(ChangeCircleIcon),
        path: "/receiptVouchers",
        page: ReceiptVouchersRoot
      },
      {
        title: "Journal Entries",
        icon: React.createElement(ChangeCircleIcon),
        path: "/journalEntries",
        page: JournalEntriesRoot
      },
      {
        title: "Opening Entries",
        icon: React.createElement(ChangeCircleIcon),
        path: "/openingEntries",
        page: OpeningEntriesRoot
      },
    ],
  },
  {
    title: "Inventory",
    icon: React.createElement(InventoryRounded),
    submenu: [
      {
        title: "Items",
        icon: React.createElement(InventoryRounded),
        path: "/items",
        page: ItemsRoot
      },
    ],
  },
];


export default sidebarItemsData;