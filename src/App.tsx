
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
import ProfileSetupPage from "./pages/ProfileSetupPage";
import ContactPage from "./pages/ContactPage";
import PremiumPage from "./pages/PremiumPage";
import PremiumFeaturesPage from "./pages/PremiumFeaturesPage";
import ReelsPage from "./pages/ReelsPage";
import SettingsPage from "./pages/SettingsPage";
import { AuthProvider, useAuthSession } from "@/hooks/useAuthSession";
import MemoryVaultPage from "./pages/features/MemoryVaultPage";
import EmotionTimelinePage from "./pages/features/EmotionTimelinePage";
import PrivateLegacyModePage from "./pages/features/PrivateLegacyModePage";
import DeepMessagingPage from "./pages/features/DeepMessagingPage";
import CollaborationPage from "./pages/features/CollaborationPage";
import OfflineMemoriesPage from "./pages/features/OfflineMemoriesPage";
import MarketplacePage from "./pages/features/MarketplacePage";
import MemorySpacesPage from "./pages/features/MemorySpacesPage";
import GlobalWallPage from "./pages/features/GlobalWallPage";
import { useState } from "react";
import CoinsPage from "./pages/CoinsPage";

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { user, isLoading } = useAuthSession();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <span className="text-xl text-white">Loading...</span>
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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <span className="text-xl text-white">Loading...</span>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/home" />;
  }

  return element;
};

const App = () => {
  // Create a new QueryClient instance for each component render
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
                <Route path="/" element={<AuthenticatedRedirect element={<LandingPage />} />} />
                <Route path="/auth" element={<AuthenticatedRedirect element={<AuthPage />} />} />
                <Route path="/profile-setup" element={<ProtectedRoute element={<ProfileSetupPage />} />} />
                <Route path="/home" element={<ProtectedRoute element={<Index />} />} />
                <Route path="/friends" element={<ProtectedRoute element={<FriendsPage />} />} />
                <Route path="/notifications" element={<ProtectedRoute element={<NotificationsPage />} />} />
                <Route path="/messages" element={<ProtectedRoute element={<MessagesPage />} />} />
                <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
                <Route path="/settings" element={<ProtectedRoute element={<SettingsPage />} />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/premium" element={<ProtectedRoute element={<PremiumPage />} />} />
                <Route path="/premium-features" element={<ProtectedRoute element={<PremiumFeaturesPage />} />} />
                <Route path="/reels" element={<ProtectedRoute element={<ReelsPage />} />} />
                <Route path="/coins" element={<ProtectedRoute element={<CoinsPage />} />} />
                
                {/* Feature pages */}
                <Route path="/memory-vault" element={<ProtectedRoute element={<MemoryVaultPage />} />} />
                <Route path="/emotion-timeline" element={<ProtectedRoute element={<EmotionTimelinePage />} />} />
                <Route path="/private-legacy" element={<ProtectedRoute element={<PrivateLegacyModePage />} />} />
                <Route path="/deep-messaging" element={<ProtectedRoute element={<DeepMessagingPage />} />} />
                <Route path="/collaboration" element={<ProtectedRoute element={<CollaborationPage />} />} />
                <Route path="/offline-memories" element={<ProtectedRoute element={<OfflineMemoriesPage />} />} />
                <Route path="/marketplace" element={<ProtectedRoute element={<MarketplacePage />} />} />
                <Route path="/memory-spaces" element={<ProtectedRoute element={<MemorySpacesPage />} />} />
                <Route path="/global-wall" element={<ProtectedRoute element={<GlobalWallPage />} />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
