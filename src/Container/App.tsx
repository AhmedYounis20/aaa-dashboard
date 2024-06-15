import {DataTable} from '../Components';
import Login from '../Pages/Auth/login/Login';
import Page404 from '../Pages/ErrorPages/page404/Page404';
import Page500 from '../Pages/ErrorPages/page500/Page500';
import Register from '../Pages/Auth/register/Register';
import DefaultLayout from '../layout/DefaultLayout';
import './App.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AccountGuidesRoot from '../Pages/ProjectPages/AccountGuides/AccountGuidesRoot';
import ChartOfAccountsRoot from '../Pages/ProjectPages/ChartOfAccounts/ChartOfAccountsRoot';
import BanksRoot from '../Pages/ProjectPages/SubLeadgers/Banks/BanksRoot';
import CashInBoxesRoot from '../Pages/ProjectPages/SubLeadgers/CashInBoxes/CashInBoxesRoot';
import CustomersRoot from '../Pages/ProjectPages/SubLeadgers/Customers/CustomersRoot';
import SuppliersRoot from '../Pages/ProjectPages/SubLeadgers/Suppliers/SuppliersRoot';


const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/NotFound",
    element: <Page404 />,
  },
  {
    path: "/BadRequest",
    element: <Page500 />,
  },
  {
    path: "/*",
    element: <DefaultLayout />,
    children: [
      {
        path: "accountguides",
        element: <AccountGuidesRoot />,
      },
      {
        path: "chartOfAccounts",
        element: <ChartOfAccountsRoot />,
      },
      {
        path: "GlSettings",
        element: <div>GlSettings</div>,
      },

      {
        path: "subleadgers/banks",
        element: <BanksRoot />,
      },
      {
        path: "subleadgers/cashInBoxes",
        element: <CashInBoxesRoot />,
      },
      {
        path: "subleadgers/customers",
        element: <CustomersRoot />,
      },
      {
        path: "subleadgers/suppliers",
        element: <SuppliersRoot/>,
      },
    ],
  },
]);
function App() {

  return (
    <>
    <RouterProvider router={router} />
    </>
  );
}

export default App
