// routes config
import { Outlet } from "react-router-dom";

import './AppContent.css'


const AppContent: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  return (
    <div
      className={`p-4 overflow-auto h-full transition-all duration-300  ${
        isCollapsed ? "ml-16" : "ml-64"
      } mt-16 bg-gray-100`}
    >
      <Outlet />
    </div>
  );
}
export default AppContent