import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth";
import * as api from "../utils/api";
import { setToken, getToken } from "../utils/token";
import "./styles/App.css";

function App() {
  // State to manage authorization
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State to update MyProfile component.
  const [userData, setUserData] = useState({
    username: "",
    email: "",
  });

  // useNavigate is a function that allows you to redirerct users at a certain time.
  // Navigate is a component that redirects users under certain circumstances like
  // below in the jsx to catch all non existent routes or unauthorized users.
  const navigate = useNavigate();

  // App handles navigation and routing and controls global state like isLoggedIn
  // so it makes sense to handle registration here. We just need to pass the data
  // from the Register component up to here. The object destructuring happening
  // as an argument to handleRegistration is of an object we get from Register.
  const handleRegistration = ({
    username,
    email,
    password,
    confirmPassword,
  }) => {
    if (password === confirmPassword) {
      auth
        .register(username, password, email)
        .then(() => {
          navigate("/login");
        })
        .catch(console.error);
    }
  };

  // Invoke the hook. It's necessary to invoke the hook in both components.
  const location = useLocation();

  // handleLogin takes one parameter: an object with two properties.
  const handleLogin = ({ username, password }) => {
    // If the username or the password is empty, return without sending a request.
    if (!username || !password) {
      return;
    }

    // We pass the username and password as positional arguments. The  authorize
    // function is set up to rename 'usename' to 'identifier' before sneding a
    // request to the server, because that is what is the API is expecting.
    auth
      .authorize(username, password)
      .then((data) => {
        if (data.jwt) {
          // Save the token to localStorage.
          setToken(data.jwt);
          setUserData(data.user); // save user's data to state
          setIsLoggedIn(true); // log the user in
          // Instead of always directing them to /ducks check if there is saved
          // state and send them there or default to /ducks.
          const redirectPath = location.state?.from?.pathname || "/ducks";
          navigate(redirectPath);
        }
      })
      .catch(console.error);
  };

  // Use an EMPTY dependency array to run once upon page load.
  useEffect(() => {
    // Upon inital page load, check localStorage for a token.
    const jwt = getToken();

    if (!jwt) {
      return;
    }

    api
      .getUserInfo(jwt)
      .then(({ username, email }) => {
        // If the response is successful, log the user in, save their
        // data to state, and navigate them to /ducks.
        setIsLoggedIn(true);
        setUserData({ username, email });
      })
      .catch(console.error);
  }, []);

  return (
    <Routes>
      {/* Wrap Ducks and MyProfile in ProtectedRoute and pass isLoggedIn a prop. */}
      <Route
        path="/ducks"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Ducks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-profile"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <MyProfile userData={userData} />
          </ProtectedRoute>
        }
      />

      {/* Pass the handler to the Login component. */}
      <Route
        path="/login"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} anonymous>
            <div className="loginContainer">
              <Login handleLogin={handleLogin} />
            </div>
          </ProtectedRoute>
        }
      />

      {/* In order to exchange data between Register and App we need to pass it the handleRegistration function as a prop. */}
      <Route
        path="/register"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} anonymous>
            <div className="registerContainer">
              <Register handleRegistration={handleRegistration} />
            </div>
          </ProtectedRoute>
        }
      />

      {/* Catch all route for non existing endpoints */}
      {/* Wildcard catch all symbol '*' */}
      {/* Using a ternary operator to render a Navigate component that redirects
          the user to the appropritate route depending on the user's authorization. 
          Use the replace prop to avoid sending users in a redirection loop when
          they click the back button in the browser.  */}
      <Route
        path="*"
        element={
          isLoggedIn ? (
            <Navigate to="/ducks" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
