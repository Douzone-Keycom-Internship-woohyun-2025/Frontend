import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "@/components/protected-route/ProtectedRoute";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Toaster } from "@/components/ui/toaster";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const SignupPage = lazy(() => import("@/pages/SignupPage"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const PatentSearchPage = lazy(() => import("@/pages/PatentSearchPage"));
const SummaryPage = lazy(() => import("@/pages/SummaryPage"));
const FavoritesPage = lazy(() => import("@/pages/FavoritesPage"));
const PresetManagementPage = lazy(() => import("@/pages/PresetManagementPage"));
const HelpPage = lazy(() => import("@/pages/HelpPage"));
const ComparisonPage = lazy(() => import("@/pages/ComparisonPage"));
const LandingPage = lazy(() => import("@/pages/LandingPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner message="페이지 로딩 중..." />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/home"
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
              path="/comparison"
              element={
                <ProtectedRoute>
                  <ComparisonPage />
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
        </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
