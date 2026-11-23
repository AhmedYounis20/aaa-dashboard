import { Suspense, type LazyExoticComponent, type ComponentType } from "react";
import { Navigate, Route } from "react-router-dom";
import RouteLoadingFallback from "./RouteLoadingFallback";
import * as LazyPages from "./lazyPages";

function lazyRoute(Component: LazyExoticComponent<ComponentType>, path: string) {
  const normalizedPath = path.replace(/^\//, "");

  return (
    <Route
      key={normalizedPath}
      path={normalizedPath}
      element={
        <Suspense fallback={<RouteLoadingFallback />}>
          <Component />
        </Suspense>
      }
    />
  );
}

function redirectRoute(from: string, to: string) {
  const normalizedFrom = from.replace(/^\//, "");
  return (
    <Route
      key={`redirect-${normalizedFrom}`}
      path={normalizedFrom}
      element={<Navigate to={to} replace />}
    />
  );
}

export function AppRoutes() {
  return (
    <>
      {lazyRoute(LazyPages.ChartOfAccountsRoot, "/chart-of-accounts")}
      {lazyRoute(LazyPages.BanksRoot, "/sub-ledgers/banks")}
      {lazyRoute(LazyPages.TaxesRoot, "/sub-ledgers/taxes")}
      {lazyRoute(LazyPages.CashInBoxesRoot, "/sub-ledgers/cash-in-boxes")}
      {lazyRoute(LazyPages.CustomersRoot, "/sub-ledgers/customers")}
      {lazyRoute(LazyPages.SuppliersRoot, "/sub-ledgers/suppliers")}
      {lazyRoute(LazyPages.FixedAssetsRoot, "/sub-ledgers/fixed-assets")}
      {lazyRoute(LazyPages.BranchesRoot, "/sub-ledgers/branches")}
      {lazyRoute(LazyPages.GlSettingsRoot, "/gl-settings")}
      {lazyRoute(LazyPages.AccountGuidesRoot, "/account-guides")}
      {lazyRoute(LazyPages.CollectionBooksRoot, "/collection-books")}
      {lazyRoute(LazyPages.CostCenterRoot, "/cost-centers")}
      {lazyRoute(LazyPages.FinancialPeriodsRoot, "/financial-periods")}
      {lazyRoute(LazyPages.CurrenciesRoot, "/currencies")}
      {lazyRoute(LazyPages.SellingPricesRoot, "/selling-prices")}
      {lazyRoute(LazyPages.PackingUnitsRoot, "/packing-units")}
      {lazyRoute(LazyPages.ManufacturerCompaniesRoot, "/manufacturer-companies")}
      {lazyRoute(LazyPages.CombinedEntriesRoot, "/combined-entries")}
      {lazyRoute(LazyPages.PaymentVouchersRoot, "/payment-vouchers")}
      {lazyRoute(LazyPages.ReceiptVouchersRoot, "/receipt-vouchers")}
      {lazyRoute(LazyPages.JournalEntriesRoot, "/journal-entries")}
      {lazyRoute(LazyPages.OpeningEntriesRoot, "/opening-entries")}
      {lazyRoute(LazyPages.ProductsRoot, "/products")}
      {lazyRoute(LazyPages.VariantsRoot, "/variants")}
      {lazyRoute(LazyPages.InventoryTransferRoot, "/inventory/transfers")}
      {lazyRoute(LazyPages.InventoryTransactionsPage, "/inventory-transactions")}
      {lazyRoute(LazyPages.AttributesRoot, "/attributes")}

      {/* Temporary redirects for pre-normalization paths */}
      {redirectRoute("/chartOfAccounts", "/chart-of-accounts")}
      {redirectRoute("/subleadgers/banks", "/sub-ledgers/banks")}
      {redirectRoute("/subleadgers/taxes", "/sub-ledgers/taxes")}
      {redirectRoute("/subleadgers/cashInBoxes", "/sub-ledgers/cash-in-boxes")}
      {redirectRoute("/subleadgers/customers", "/sub-ledgers/customers")}
      {redirectRoute("/subleadgers/suppliers", "/sub-ledgers/suppliers")}
      {redirectRoute("/subleadgers/fixedAssets", "/sub-ledgers/fixed-assets")}
      {redirectRoute("/subleadgers/Branches", "/sub-ledgers/branches")}
      {redirectRoute("/subleadgers/branches", "/sub-ledgers/branches")}
      {redirectRoute("/glSettings", "/gl-settings")}
      {redirectRoute("/accountguides", "/account-guides")}
      {redirectRoute("/collectionBooks", "/collection-books")}
      {redirectRoute("/costCenter", "/cost-centers")}
      {redirectRoute("/financialPeriods", "/financial-periods")}
      {redirectRoute("/sellingPrices", "/selling-prices")}
      {redirectRoute("/packingUnits", "/packing-units")}
      {redirectRoute("/manufacturerCompanies", "/manufacturer-companies")}
      {redirectRoute("/compinedentries", "/combined-entries")}
      {redirectRoute("/combinedentries", "/combined-entries")}
      {redirectRoute("/paymentVouchers", "/payment-vouchers")}
      {redirectRoute("/receiptVouchers", "/receipt-vouchers")}
      {redirectRoute("/journalEntries", "/journal-entries")}
      {redirectRoute("/openingEntries", "/opening-entries")}
      {redirectRoute("/Attributes", "/attributes")}
    </>
  );
}
