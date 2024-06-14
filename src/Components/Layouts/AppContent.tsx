// routes config
import DataTable from '../DataTable';
import { Outlet } from "react-router-dom";

import './AppContent.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/accountguides",
    element: <DataTable />,
  },
  {
    path: "/chartOfAccounts",
    element: <div>chartOfAccounts</div>,
  },
  {
    path: "/GlSettings",
    element: <div>GlSettings</div>,
  },
]);

const AppContent: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  return (
    <div
      className={`p-4 overflow-y-auto h-full transition-all duration-300 ${
        isCollapsed ? "ml-16" : "ml-64"
      } mt-16 bg-gray-100`}
    >
      <Outlet/>
    </div>
  );
}
export default AppContent