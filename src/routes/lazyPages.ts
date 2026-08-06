import { lazy } from "react";

export const ChartOfAccountsRoot = lazy(
  () => import("@/Pages/ProjectPages/Account/ChartOfAccounts/ChartOfAccountsRoot")
);
export const BanksRoot = lazy(
  () => import("@/Pages/ProjectPages/Account/SubLeadgers/Banks/BanksRoot")
);
export const TaxesRoot = lazy(
  () => import("@/Pages/ProjectPages/Account/SubLeadgers/Taxes/TaxesRoot")
);
export const CashInBoxesRoot = lazy(
  () => import("@/Pages/ProjectPages/Account/SubLeadgers/CashInBoxes/CashInBoxesRoot")
);
export const CustomersRoot = lazy(
  () => import("@/Pages/ProjectPages/Account/SubLeadgers/Customers/CustomersRoot")
);
export const SuppliersRoot = lazy(
  () => import("@/Pages/ProjectPages/Account/SubLeadgers/Suppliers/SuppliersRoot")
);
export const FixedAssetsRoot = lazy(
  () => import("@/Pages/ProjectPages/Account/SubLeadgers/FixedAssets/FixedAssetsRoot")
);
export const BranchesRoot = lazy(
  () => import("@/Pages/ProjectPages/Account/SubLeadgers/Branches")
);
export const GlSettingsRoot = lazy(
  () => import("@/Pages/ProjectPages/Account/Settings/GlSettings/GlSettingsRoot")
);
export const AccountGuidesRoot = lazy(
  () => import("@/Pages/ProjectPages/Account/AccountGuides/AccountGuidesRoot")
);
export const CollectionBooksRoot = lazy(
  () => import("@/Pages/ProjectPages/Account/Settings/CollectionBooks/CollectionBooksRoot")
);
export const CostCenterRoot = lazy(
  () => import("@/Pages/ProjectPages/Account/Settings/CostCenters/CostCenterRoot")
);
export const FinancialPeriodsRoot = lazy(
  () => import("@/Pages/ProjectPages/Account/Settings/FinancialPeriods/FinancialPeriodsRoot")
);
export const CurrenciesRoot = lazy(
  () => import("@/Pages/ProjectPages/Account/Settings/Currencies/CurrenciesRoot")
);
export const SellingPricesRoot = lazy(
  () => import("@/Pages/ProjectPages/Inventory/SellingPrices/SellingPricesRoot")
);
export const PackingUnitsRoot = lazy(
  () => import("@/Pages/ProjectPages/Inventory/PackingUnits/PackingUnitsRoot")
);
export const ManufacturerCompaniesRoot = lazy(
  () => import("@/Pages/ProjectPages/Inventory/ManufacturerCompanies/ManufacturerCompaniesRoot")
);
export const CompinedEntriesRoot = lazy(
  () => import("@/Pages/ProjectPages/Account/Entries/CompinedEntries/CompinedEntriesRoot")
);
export const PaymentVouchersRoot = lazy(
  () => import("@/Pages/ProjectPages/Account/Entries/PaymentVouchers/PaymentVouchersRoot")
);
export const ReceiptVouchersRoot = lazy(
  () => import("@/Pages/ProjectPages/Account/Entries/ReceiptVouchers/ReceiptVouchersRoot")
);
export const JournalEntriesRoot = lazy(
  () => import("@/Pages/ProjectPages/Account/Entries/JournalEntries/JournalEntriesRoot")
);
export const OpeningEntriesRoot = lazy(
  () => import("@/Pages/ProjectPages/Account/Entries/OpeningEntries/OpeningEntriesRoot")
);
export const ProductsRoot = lazy(
  () => import("@/Pages/ProjectPages/Inventory/Products/ProductsRoot")
);
export const VariantsRoot = lazy(
  () => import("@/Pages/ProjectPages/Inventory/Variants/VariantsRoot")
);
export const InventoryTransactionsPage = lazy(
  () => import("@/Pages/ProjectPages/Inventory/InventoryTransactions")
);
export const InventoryTransferRoot = lazy(
  () => import("@/Pages/ProjectPages/Inventory/InventoryTransfers/InventoryTransferRoot")
);
export const AttributesRoot = lazy(
  () => import("@/Pages/ProjectPages/Inventory/Attributes/AttributesRoot")
);
