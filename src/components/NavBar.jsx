import { NavLink, useNavigate } from "react-router-dom";
import { removeToken } from "../utils/token";
import Logo from "./Logo";
import "./styles/NavBar.css";

// Specify setIsLoggedIn as a prop. Don't forget to pass
// setIsLoggedIn as a prop from the App component!
function NavBar({ setIsLoggedIn }) {
  // Invoke the hook!
  const navigate = useNavigate();

  // The signOut function removes the token from local
  // storage, sends them back to the login page, and
  // sets isLoggedIn to false.
  function signOut() {
    removeToken();
    setIsLoggedIn(false);
    navigate("/login");
  }

  return (
    <div className="navbar">
      <div className="navbar__logo">
        <Logo />
      </div>
      <ul className="navbar__nav">
        <li>
          <NavLink to="/ducks" className="navbar__link">
            Ducks
          </NavLink>
        </li>
        <li>
          <NavLink to="/my-profile" className="navbar__link">
            My Profile
          </NavLink>
        </li>
        <li>
          {/* Add the onClick listener. */}
          <button className="navbar__link navbar__button" onClick={signOut}>
            Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
