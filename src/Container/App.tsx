import DataTable from '../Components/DataTreeTable';
import Login from '../Pages/login/Login';
import Page404 from '../Pages/page404/Page404';
import Page500 from '../Pages/page500/Page500';
import Register from '../Pages/register/Register';
import DefaultLayout from '../layout/DefaultLayout';
import './App.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


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
        element: <DataTable />,
      },
      {
        path: "chartOfAccounts",
        element: <div>chartOfAccounts</div>,
      },
      {
        path: "GlSettings",
        element: <div>GlSettings</div>,
      },
    ],
  },
]);
function App() {

  return (
    <RouterProvider router={router} />
  );
}

export default App
