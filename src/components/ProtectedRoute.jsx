import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (user === undefined) {
    return <div className="loading-screen"><div className="spinner" /></div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;