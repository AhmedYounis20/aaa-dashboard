import { useState } from 'react';
import { AppContent, Sidebar, AppHeader } from "../Components/index";
import { auto } from '@popperjs/core';
import { withAuth } from '../Hoc';

const DefaultLayout = () => {

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className="main-div"
      style={{
        display: "flex",
        flexWrap: "nowrap",
        overflowX: "auto",
        overflowY: "hidden",
      }}
    >
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div
        className="flex flex-col w-full"
        style={{
          width: "100vw",
          overflowY: "auto",
          height:
            "calc(100vh - 32px)" /* Adjust height to account for margins or padding */,
        }}
      >
        <AppHeader />
        <AppContent isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}

export default withAuth(DefaultLayout)
