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

const store = configureStore({
  reducer: {
    userAuthStore: userAuthReducer,
    [authApi.reducerPath]: authApi.reducer,
    [AccountGuidesApi.reducerPath]: AccountGuidesApi.reducer,
    [ChartOfAccountsApi.reducerPath]: ChartOfAccountsApi.reducer,
    [BanksApi.reducerPath]: BanksApi.reducer,
    [CustomersApi.reducerPath]: CustomersApi.reducer,
    [SuppliersApi.reducerPath]: SuppliersApi.reducer,
    [CashInBoxesApi.reducerPath]: CashInBoxesApi.reducer,
    [GlSettingsApi.reducerPath]: GlSettingsApi.reducer,
    [CurrenciesApi.reducerPath]: CurrenciesApi.reducer,
    [FinancialPeriodsApi.reducerPath]: FinancialPeriodsApi.reducer,
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
      .concat(ChartOfAccountsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
