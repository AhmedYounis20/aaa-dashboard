import { Construction, DashboardCustomize, Store } from "@mui/icons-material";
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



export interface ISidebarItem {
    icon?: ReactElement;
    title: string;
    submenu?: ISidebarItem[];
    path?: string;
}

// TODO: make the icon value is string


export const sidebarItemsData: ISidebarItem[] = [
  {
    title: "currencies",
    icon: React.createElement(AttachMoneyIcon),
    path: "/currencies",
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
    title: "gl settings",
    icon: React.createElement(DiamondIcon),
    path: "/glSettings",
  },
  {
    title: "financial Periods",
    icon: React.createElement(CreditScoreIcon),
    path: "/currencfinancialPeriodsies",
  },
  {
    title: "account guides",
    icon: React.createElement(WebhookIcon),
    path: "/accountguides",
  },
  {
    title: "chart Of Accounts",
    icon: React.createElement(TableChartIcon),
    path: "/chartOfAccounts",
  },
];


export default sidebarItemsData;