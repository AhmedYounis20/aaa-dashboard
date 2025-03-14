import Login from '../Pages/Auth/login/Login';
import Page404 from '../Pages/ErrorPages/page404/Page404';
import Register from '../Pages/Auth/register/Register';
import DefaultLayout from '../layout/DefaultLayout';
import './App.css'
import { useSelector } from 'react-redux'
import { useMemo } from 'react';
import { BrowserRouter, Routes,Route } from "react-router-dom";
import AccountGuidesRoot from '../Pages/ProjectPages/AccountGuides/AccountGuidesRoot';
import ChartOfAccountsRoot from '../Pages/ProjectPages/ChartOfAccounts/ChartOfAccountsRoot';
import BanksRoot from '../Pages/ProjectPages/SubLeadgers/Banks/BanksRoot';
import CashInBoxesRoot from '../Pages/ProjectPages/SubLeadgers/CashInBoxes/CashInBoxesRoot';
import CustomersRoot from '../Pages/ProjectPages/SubLeadgers/Customers/CustomersRoot';
import SuppliersRoot from '../Pages/ProjectPages/SubLeadgers/Suppliers/SuppliersRoot';
import CurrenciesRoot from '../Pages/ProjectPages/Settings/Currencies/CurrenciesRoot';
import FinancialPeriodsRoot from '../Pages/ProjectPages/Settings/FinancialPeriods/FinancialPeriodsRoot';
import GlSettingsRoot from '../Pages/ProjectPages/Settings/GlSettings/GlSettingsRoot';
import { createTheme } from '@mui/material/styles';
import {ThemeProvider} from '@mui/material'
import { themeSettings } from '../Utilities/theme';
import Dashboard from '../Pages/Dashboard';
import { CssBaseline } from '@mui/material';
import FixedAssetsRoot from '../Pages/ProjectPages/SubLeadgers/FixedAssets/FixedAssetsRoot';
import BranchesRoot from '../Pages/ProjectPages/SubLeadgers/Branches';
import { RootState } from '../Storage/Redux/store';
import CostCenterRoot from '../Pages/ProjectPages/CostCenter/CostCenterRoot';
import CompinedEntriesRoot from "../Pages/ProjectPages/Entries/CompinedEntries/CompinedEntriesRoot";
import PaymentVouchersRoot from "../Pages/ProjectPages/Entries/PaymentVouchers/PaymentVouchersRoot";
import ReceiptVouchersRoot from "../Pages/ProjectPages/Entries/ReceiptVouchers/ReceiptVouchersRoot";
import CollectionBooksRoot from '../Pages/ProjectPages/Settings/CollectionBooks/CollectionBooksRoot';
import JournalEntriesRoot from '../Pages/ProjectPages/Entries/JournalEntries/JournalEntriesRoot';
import OpeningEntriesRoot from '../Pages/ProjectPages/Entries/OpeningEntries/OpeningEntriesRoot';

function App() {
  const mode = useSelector((state : RootState) => state.global.mode);

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])

  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<DefaultLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/currencies" element={<CurrenciesRoot />} />
              <Route path="/glSettings" element={<GlSettingsRoot />} />
              <Route
                path="/compinedentries"
                element={<CompinedEntriesRoot />}
              />
              <Route
                path="/paymentVouchers"
                element={<PaymentVouchersRoot />}
              />
              <Route
                path="/receiptVouchers"
                element={<ReceiptVouchersRoot />}
              />
              <Route
                path="/journalEntries"
                element={<JournalEntriesRoot />}
              />
              <Route
                path="/openingEntries"
                element={<OpeningEntriesRoot />}
              />

              <Route
                path="/financialPeriods"
                element={<FinancialPeriodsRoot />}
              />
              <Route path="/accountguides" element={<AccountGuidesRoot />} />
              <Route
                path="/chartOfAccounts"
                element={<ChartOfAccountsRoot />}
              />

              <Route path="/subleadgers/banks" element={<BanksRoot />} />
              <Route
                path="/subleadgers/cashInBoxes"
                element={<CashInBoxesRoot />}
              />
              <Route
                path="/subleadgers/customers"
                element={<CustomersRoot />}
              />
              <Route
                path="/subleadgers/suppliers"
                element={<SuppliersRoot />}
              />
              <Route
                path="/subleadgers/fixedAssets"
                element={<FixedAssetsRoot />}
              />
              <Route
                path="/collectionBooks"
                element={<CollectionBooksRoot />}
              />
              <Route path="/subleadgers/branches" element={<BranchesRoot />} />
              <Route path="/costCenter" element={<CostCenterRoot />} />
            </Route>
            <Route path="*" element={<Page404 />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App
