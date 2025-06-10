import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isTokenExpired, getCurrentToken } from "../utils/Auth";
import { getRedirectPathFromCurrentRoute } from "../utils/AuthRedirection";
interface ProtectedRouteProps {
  children: ReactNode;
}



const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = getCurrentToken();
  if (!token || isTokenExpired(token)) {

    localStorage.clear();
return <Navigate to={getRedirectPathFromCurrentRoute()} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
