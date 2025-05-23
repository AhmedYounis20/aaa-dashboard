import { Construction, CurrencyBitcoin, DashboardCustomize, Factory, Store } from "@mui/icons-material";
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
export interface ISidebarItem {
    icon?: ReactElement;
    title: string;
    submenu?: ISidebarItem[];
    path?: string;
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
      },
      {
        title: "cash in boxes",
        icon: React.createElement(MonetizationOnIcon),
        path: "/subleadgers/cashInBoxes",
      },
      {
        title: "customers",
        icon: React.createElement(FaceRetouchingNaturalIcon),
        path: "/subleadgers/customers",
      },
      {
        title: "suppliers",
        icon: React.createElement(DashboardCustomize),
        path: "/subleadgers/suppliers",
      },
      {
        title: "Fixed Assets",
        icon: React.createElement(Construction),
        path: "/subleadgers/fixedAssets",
      },
      {
        title: "Branches",
        icon: React.createElement(Store),
        path: "/subleadgers/Branches",
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
      },
      {
        title: "account guides",
        icon: React.createElement(WebhookIcon),
        path: "/accountguides",
      },
      {
        title: "Collection Books",
        icon: React.createElement(BookIcon),
        path: "/collectionBooks",
      },
      {
        title: "cost center",
        icon: React.createElement(WebhookIcon),
        path: "/costCenter",
      },
      {
        title: "financial Periods",
        icon: React.createElement(CreditScoreIcon),
        path: "/financialPeriods",
      },
      {
        title: "currencies",
        icon: React.createElement(CurrencyBitcoin),
        path: "/currencies",
      },
      {
        title: "selling Prices",
        icon: React.createElement(AttachMoneyIcon),
        path: "/sellingPrices",
      },
      {
        title: "packing Units",
        icon: React.createElement(AccountBoxIcon),
        path: "/packingUnits",
      },
      {
        title: "Manufacturer Companies",
        icon: React.createElement(Factory),
        path: "/manufacturerCompanies",
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
      },
      {
        title: "Payment Vouchers",
        icon: React.createElement(ChangeCircleIcon),
        path: "/paymentVouchers",
      },
      {
        title: "Receipt Vouchers",
        icon: React.createElement(ChangeCircleIcon),
        path: "/receiptVouchers",
      },
      {
        title: "Journal Entries",
        icon: React.createElement(ChangeCircleIcon),
        path: "/journalEntries",
      },
      {
        title: "Opening Entries",
        icon: React.createElement(ChangeCircleIcon),
        path: "/openingEntries",
      },
    ],
  },
];


export default sidebarItemsData;