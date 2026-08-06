import { Suspense, type LazyExoticComponent, type ComponentType } from "react";
import { Route } from "react-router-dom";
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

export function AppRoutes() {
  return (
    <>
      {lazyRoute(LazyPages.ChartOfAccountsRoot, "/chartOfAccounts")}
      {lazyRoute(LazyPages.BanksRoot, "/subleadgers/banks")}
      {lazyRoute(LazyPages.TaxesRoot, "/subleadgers/taxes")}
      {lazyRoute(LazyPages.CashInBoxesRoot, "/subleadgers/cashInBoxes")}
      {lazyRoute(LazyPages.CustomersRoot, "/subleadgers/customers")}
      {lazyRoute(LazyPages.SuppliersRoot, "/subleadgers/suppliers")}
      {lazyRoute(LazyPages.FixedAssetsRoot, "/subleadgers/fixedAssets")}
      {lazyRoute(LazyPages.BranchesRoot, "/subleadgers/Branches")}
      {lazyRoute(LazyPages.GlSettingsRoot, "/glSettings")}
      {lazyRoute(LazyPages.AccountGuidesRoot, "/accountguides")}
      {lazyRoute(LazyPages.CollectionBooksRoot, "/collectionBooks")}
      {lazyRoute(LazyPages.CostCenterRoot, "/costCenter")}
      {lazyRoute(LazyPages.FinancialPeriodsRoot, "/financialPeriods")}
      {lazyRoute(LazyPages.CurrenciesRoot, "/currencies")}
      {lazyRoute(LazyPages.SellingPricesRoot, "/sellingPrices")}
      {lazyRoute(LazyPages.PackingUnitsRoot, "/packingUnits")}
      {lazyRoute(LazyPages.ManufacturerCompaniesRoot, "/manufacturerCompanies")}
      {lazyRoute(LazyPages.CompinedEntriesRoot, "/compinedentries")}
      {lazyRoute(LazyPages.PaymentVouchersRoot, "/paymentVouchers")}
      {lazyRoute(LazyPages.ReceiptVouchersRoot, "/receiptVouchers")}
      {lazyRoute(LazyPages.JournalEntriesRoot, "/journalEntries")}
      {lazyRoute(LazyPages.OpeningEntriesRoot, "/openingEntries")}
      {lazyRoute(LazyPages.ProductsRoot, "/products")}
      {lazyRoute(LazyPages.VariantsRoot, "/variants")}
      {lazyRoute(LazyPages.InventoryTransferRoot, "/inventory/transfers")}
      {lazyRoute(LazyPages.InventoryTransactionsPage, "/inventory-transactions")}
      {lazyRoute(LazyPages.AttributesRoot, "/Attributes")}
    </>
  );
}
