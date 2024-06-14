import './AppSidebar.css'
// sidebar nav config

const Sidebar : React.FC<{ isCollapsed: boolean, toggleSidebar: () => void }> = ({ isCollapsed, toggleSidebar }) => {
  return (
    <div
      className={`bg-gray-900 text-gray-200 h-full transition-width duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } fixed top-0 left-0 z-10`}
    >
      <button className="bg-gray-800 w-full py-2 mt-16" onClick={toggleSidebar}>
        {isCollapsed ? ">" : "<"}
      </button>
      <ul className="mt-4">
        <li className="px-4 py-2 hover:bg-gray-700">
          <a href="#">Dashboard</a>
        </li>
        <li className="px-4 py-2 hover:bg-gray-700">
          <a href="#">Users</a>
        </li>
        <li className="px-4 py-2 hover:bg-gray-700">
          <a href="#">Settings</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
