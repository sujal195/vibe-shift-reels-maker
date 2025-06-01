
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import { AuthProvider, useAuthSession } from "@/hooks/useAuthSession";
import { useState } from "react";

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <span className="text-xl text-white">Loading...</span>
  </div>
);

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { user, isLoading } = useAuthSession();
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return element;
};

const PublicRoute = ({ element }: { element: JSX.Element }) => {
  const { user, isLoading } = useAuthSession();
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return element;
};

const App = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<PublicRoute element={<LandingPage />} />} />
                <Route path="/auth" element={<PublicRoute element={<AuthPage />} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
