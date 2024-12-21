import { configureStore } from "@reduxjs/toolkit";
import { authApi} from "../../Apis";
import { userAuthReducer } from "./userAuthSlice";
import AccountGuidesApi from "../../Apis/AccountGuidesApi";
import ChartOfAccountsApi from "../../Apis/ChartOfAccountsApi";
import BanksApi from "../../Apis/BanksApi";
import CustomersApi from "../../Apis/CustomersApi";
import SuppliersApi from "../../Apis/SuppliersApi";
import CashInBoxesApi from "../../Apis/CashInBoxesApi";
import GlSettingsApi from "../../Apis/GlSettingsApi";
import CurrenciesApi from "../../Apis/CurrenciesApi";
import FinancialPeriodsApi from "../../Apis/FinancialPeriodsApi";
import globalTheme from './global'
import FixedAssetsApi from "../../Apis/FixedAssetsApi";
import BranchesApi from "../../Apis/BranchesApi";
import CostCenterApi from "../../Apis/CostCenterApi";
import EntriesApi from "../../Apis/EntriesApi";

const store = configureStore({
  reducer: {
    userAuthStore: userAuthReducer,
    global: globalTheme,
    [authApi.reducerPath]: authApi.reducer,
    [AccountGuidesApi.reducerPath]: AccountGuidesApi.reducer,
    [ChartOfAccountsApi.reducerPath]: ChartOfAccountsApi.reducer,
    [BanksApi.reducerPath]: BanksApi.reducer,
    [CustomersApi.reducerPath]: CustomersApi.reducer,
    [SuppliersApi.reducerPath]: SuppliersApi.reducer,
    [CashInBoxesApi.reducerPath]: CashInBoxesApi.reducer,
    [FixedAssetsApi.reducerPath]: FixedAssetsApi.reducer,
    [GlSettingsApi.reducerPath]: GlSettingsApi.reducer,
    [CurrenciesApi.reducerPath]: CurrenciesApi.reducer,
    [FinancialPeriodsApi.reducerPath]: FinancialPeriodsApi.reducer,
    [BranchesApi.reducerPath]: BranchesApi.reducer,
    [CostCenterApi.reducerPath]: CostCenterApi.reducer,
    [EntriesApi.reducerPath]: EntriesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(AccountGuidesApi.middleware)
      .concat(BanksApi.middleware)
      .concat(CashInBoxesApi.middleware)
      .concat(CustomersApi.middleware)
      .concat(SuppliersApi.middleware)
      .concat(FinancialPeriodsApi.middleware)
      .concat(CurrenciesApi.middleware)
      .concat(GlSettingsApi.middleware)
      .concat(FixedAssetsApi.middleware)
      .concat(ChartOfAccountsApi.middleware)
      .concat(BranchesApi.middleware)
      .concat(CostCenterApi.middleware)
      .concat(EntriesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatcher = typeof store.dispatch;

export default store;
