
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import FriendsPage from "./pages/FriendsPage";
import NotificationsPage from "./pages/NotificationsPage";
import MessagesPage from "./pages/MessagesPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import InvitationCodePage from "./pages/InvitationCodePage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import { AuthProvider, useAuthSession } from "@/hooks/useAuthSession";

const queryClient = new QueryClient();

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { user, isLoading } = useAuthSession();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-xl text-primary">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return element;
};

const AuthenticatedRedirect = ({ element }: { element: JSX.Element }) => {
  const { user, isLoading } = useAuthSession();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-xl text-primary">Loading...</span>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/home" />;
  }

  return element;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AuthenticatedRedirect element={<LandingPage />} />} />
              <Route path="/auth" element={<AuthenticatedRedirect element={<AuthPage />} />} />
              <Route path="/invitation-code" element={<ProtectedRoute element={<InvitationCodePage />} />} />
              <Route path="/profile-setup" element={<ProtectedRoute element={<ProfileSetupPage />} />} />
              <Route path="/home" element={<ProtectedRoute element={<Index />} />} />
              <Route path="/friends" element={<ProtectedRoute element={<FriendsPage />} />} />
              <Route path="/notifications" element={<ProtectedRoute element={<NotificationsPage />} />} />
              <Route path="/messages" element={<ProtectedRoute element={<MessagesPage />} />} />
              <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
