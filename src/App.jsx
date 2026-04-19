// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import SwipePage from "./pages/SwipePage";
import MatchesPage from "./pages/MatchesPage";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user === undefined) return <div className="loading-screen"><div className="spinner" /></div>;
  return user ? <Navigate to="/swipe" replace /> : children;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={<PublicRoute><LoginPage /></PublicRoute>}
      />
      <Route
        path="/setup"
        element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>}
      />
      <Route
        path="/swipe"
        element={<ProtectedRoute><SwipePage /></ProtectedRoute>}
      />
      <Route
        path="/matches"
        element={<ProtectedRoute><MatchesPage /></ProtectedRoute>}
      />
      <Route
        path="/profile"
        element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>}
      />
    </Routes>
  </>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
