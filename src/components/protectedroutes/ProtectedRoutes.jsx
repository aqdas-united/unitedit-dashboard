import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
function ProtectedRoute({ component: Component }) {
    const { user} = useSelector((state) => state.auth);
   const token = user?.token;
  const location = useLocation();
   return token ? (
    <Component />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
}

export default ProtectedRoute;