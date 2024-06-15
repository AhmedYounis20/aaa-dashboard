import { NavLink } from "react-router-dom";
import './AppSidebar.css'
import { Apps } from '@mui/icons-material';
// sidebar nav config

const Sidebar : React.FC = () => {

  return (
    <div className="d-flex flex-column flex-shrink-0 bg-light">
      <a
        href="/"
        className="d-flex align-items-center mb-md-0 me-md-auto p-3 py-2 pb-0 link-dark text-decoration-none"
      >
        <span className="fs-4">Accounting</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li>
          <NavLink to="/Home" className={`nav-link link-dark`}>
            <svg className="bi me-2" width="16" height="16">
              <Apps />
            </svg>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/accountGuides" className={`nav-link link-dark`}>
            <svg className="bi me-2" width="16" height="16">
              <Apps />
            </svg>
            Account Guides
          </NavLink>
        </li>
        <li>
          <NavLink to="/ChartOfAccounts" className="nav-link link-dark">
            <svg className="bi me-2" width="16" height="16">
              <Apps />
            </svg>
            ChartOfAccounts
          </NavLink>
        </li>
        <li>
          <NavLink to="/subleadgers/Banks" className="nav-link link-dark">
            <svg className="bi me-2" width="16" height="16">
              <Apps />
            </svg>
            Banks
          </NavLink>
        </li>
        <li>
          <NavLink to="/subleadgers/CashInBoxes" className="nav-link link-dark">
            <svg className="bi me-2" width="16" height="16">
              <Apps />
            </svg>
            Cash In boxes
          </NavLink>
        </li>
        <li>
          <NavLink to="/subleadgers/Customers" className="nav-link link-dark">
            <svg className="bi me-2" width="16" height="16">
              <Apps />
            </svg>
            Customers
          </NavLink>
        </li>
        <li>
          <NavLink to="/subleadgers/Suppliers" className="nav-link link-dark">
            <svg className="bi me-2" width="16" height="16">
              <Apps />
            </svg>
            Suppliers
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
