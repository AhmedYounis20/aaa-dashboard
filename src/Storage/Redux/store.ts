import { configureStore } from "@reduxjs/toolkit";
import { userAuthReducer } from "./userAuthSlice";
import BanksApi from "../../Apis/Account/BanksApi";
import CustomersApi from "../../Apis/Account/CustomersApi";
import SuppliersApi from "../../Apis/Account/SuppliersApi";
import CashInBoxesApi from "../../Apis/Account/CashInBoxesApi";
import CurrenciesApi from "../../Apis/Account/CurrenciesApi";
import FinancialPeriodsApi from "../../Apis/Account/FinancialPeriodsApi";
import globalTheme from './global'
import FixedAssetsApi from "../../Apis/Account/FixedAssetsApi";
import BranchesApi from "../../Apis/Account/BranchesApi";
import CollectionBooksApi from "../../Apis/Account/CollectionBooksApi";

const store = configureStore({
  reducer: {
    userAuthStore: userAuthReducer,
    global: globalTheme,
    [BanksApi.reducerPath]: BanksApi.reducer,
    [CustomersApi.reducerPath]: CustomersApi.reducer,
    [SuppliersApi.reducerPath]: SuppliersApi.reducer,
    [CashInBoxesApi.reducerPath]: CashInBoxesApi.reducer,
    [FixedAssetsApi.reducerPath]: FixedAssetsApi.reducer,
    [CurrenciesApi.reducerPath]: CurrenciesApi.reducer,
    [FinancialPeriodsApi.reducerPath]: FinancialPeriodsApi.reducer,
    [BranchesApi.reducerPath]: BranchesApi.reducer,
    [CollectionBooksApi.reducerPath]: CollectionBooksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(BanksApi.middleware)
      .concat(CashInBoxesApi.middleware)
      .concat(CustomersApi.middleware)
      .concat(SuppliersApi.middleware)
      .concat(FinancialPeriodsApi.middleware)
      .concat(CurrenciesApi.middleware)
      .concat(FixedAssetsApi.middleware)
      .concat(BranchesApi.middleware)
      .concat(CollectionBooksApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatcher = typeof store.dispatch;

export default store;
