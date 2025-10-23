// New import - useLocation
import { Navigate, useLocation } from "react-router-dom";

// New prop - anonymous. This prop will be used to indicate routes
// that can be visited anonymously (i.e., without authorization).
// The two 'anonymous' routes in this application are /register
// and /login.
const ProtectedRoute = ({ isLoggedIn, children, anonymous = false }) => {
  // Invoke the useLocation hook and access the value of the
  // 'from' property from its state object. If there is no 'from'
  // property we default to "/".
  const location = useLocation();
  const from = location.state?.from || "/";

  if (anonymous && isLoggedIn) {
    return (
      // If user tries to visit an anonymous route AND they are logged in. Redirect them
      // to where they came from or to the root route.
      <Navigate to={from} />
    );
  }

  // If an unauthorized user tries to access a protected route, save the route they
  // tried to access in the location.state.from property by giving it the whole location
  // object at the time. Navigate them to login and invoke the location state in
  // the login handler to direct them to the saved state location after authorization.
  if (!anonymous && !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  // Otherwise, render the protected route's child component.
  return children;
};

export default ProtectedRoute;
