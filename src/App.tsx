
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Index from "./pages/Index";
import { AuthProvider, useAuthSession } from "@/hooks/useAuthSession";
import { useState } from "react";

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <span className="text-xl text-white">Loading...</span>
  </div>
);

const AppRoutes = () => {
  const { user, isLoading } = useAuthSession();
  
  console.log('AppRoutes - user:', user, 'isLoading:', isLoading);
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/home" replace /> : <LandingPage />} 
        />
        <Route 
          path="/auth" 
          element={user ? <Navigate to="/home" replace /> : <AuthPage />} 
        />
        <Route 
          path="/home" 
          element={user ? <Index /> : <Navigate to="/auth" replace />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
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
            <AppRoutes />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
