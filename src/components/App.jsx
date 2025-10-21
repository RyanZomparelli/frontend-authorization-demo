import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth";
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

  // handleLogin takes one parameter: an object with two properties.
  const handleLogin = ({ username, password }) => {
    // If the usename or the password is empty, return without sending a request.
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
          setUserData(data.user); // save user's data to state
          setIsLoggedIn(true); // log the user in
          navigate("/ducks"); // send them to /ducks
        }
      })
      .catch(console.err);
  };

  return (
    <Routes>
      {/* Wrap Ducks and MyProfile in ProtectedRoute and pass isLoggedIn a prop. */}
      <Route
        path="/ducks"
        element={
          <ProtectedRoute isLoggedin={isLoggedIn}>
            <Ducks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-profile"
        element={
          <ProtectedRoute isLoggedin={isLoggedIn}>
            <MyProfile userData={userData} />
          </ProtectedRoute>
        }
      />

      {/* Pass the handler to the Login component. */}
      <Route
        path="/login"
        element={
          <div className="loginContainer">
            <Login handleLogin={handleLogin} />
          </div>
        }
      />
      {/* In order to exchange data between Register and App we need to pass it the handleRegistration function as a prop. */}
      <Route
        path="/register"
        element={
          <div className="registerContainer">
            <Register handleRegistration={handleRegistration} />
          </div>
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
