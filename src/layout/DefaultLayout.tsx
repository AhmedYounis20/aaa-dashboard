import { AppContent, Sidebar, AppHeader } from "../Components/index";
import { withAuth } from '../Hoc';

const DefaultLayout = () => {

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
      <Sidebar />
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
        <AppContent isCollapsed={false} />
      </div>
    </div>
  );
}

export default withAuth(DefaultLayout) ?? null
