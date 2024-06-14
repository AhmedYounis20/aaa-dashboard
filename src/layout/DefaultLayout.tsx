import { useState } from 'react';
import { AppContent, Sidebar, AppHeader } from "../Components/index";

const DefaultLayout = () => {

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col w-full">
        <AppHeader />
        <AppContent isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}

export default DefaultLayout
