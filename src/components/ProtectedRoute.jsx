import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isLoggedin, children }) => {
  if (!isLoggedin) {
    return (
      // If user isn't logged in, return a Navigate component that sends the user to /login
      <Navigate to="/login" replace />
    );
  }
  // Otherwise, render the protected route's child component.
  return children;
};

export default ProtectedRoute;
