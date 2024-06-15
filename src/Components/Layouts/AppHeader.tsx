import './AppHeader.css'
import { useDispatch } from "react-redux";
import {useNavigate } from "react-router-dom";
import {
  initialuserState,
  setLoggedInUser,
} from "../../Storage/Redux/userAuthSlice";


const AppHeader = () => {
 const dispatch = useDispatch();
 const navigate = useNavigate();
 const handleLogout = () => {
   localStorage.removeItem("token");
   dispatch(setLoggedInUser(initialuserState));
   navigate("/login");
 };
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-light d-flex">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <button className="btn ">
              <i className="bx bx-menu"></i>
            </button>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
            <div className="nav-item d-flex">
              <a
                className="nav-link text-blue-950 "
                aria-current="page"
                onClick={handleLogout}
                href="javasript:void(0)"
              >
                logout
                <i className="bx bx-log-out"></i>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default AppHeader
