import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtecteedRoute/ProtectedRoute";
import HomePage from "./pages/HomePage";
import HelpPage from "./pages/HelpPage";
import PatentSearchPage from "./pages/PatentSearchPage";
import SummaryPage from "./pages/SummaryPage";
import FavoritesPage from "./pages/FavoritesPage";
import PresetManagementPage from "./pages/PresetManagementPage";
import SignupPage from "./pages/SignupPage";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patent-search"
            element={
              <ProtectedRoute>
                <PatentSearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/summary"
            element={
              <ProtectedRoute>
                <SummaryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/preset-management"
            element={
              <ProtectedRoute>
                <PresetManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <HelpPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
