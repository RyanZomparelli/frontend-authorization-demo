import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import "./styles/App.css";

function App() {
  // State to manage authorization
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            <MyProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/login"
        element={
          <div className="loginContainer">
            <Login />
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div className="registerContainer">
            <Register />
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
