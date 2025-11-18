import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthRoute } from "@/components/AuthRoute";
import { AdminRoute } from "@/components/AdminRoute";
import Index from "./pages/Index";
import Budgeting from "./pages/Budgeting";
import AddBudget from "./pages/AddBudget";
import SpendingTracker from "./pages/SpendingTracker";
import GoalsWithCustomCategories from "./pages/GoalsWithCustomCategories";
import Education from "./pages/Education";
import Challenge from "./pages/Challenge";
import NewChallenge from "./pages/NewChallenge";
import AdminChallenges from "./pages/AdminChallenges";
import AdminEducation from "./pages/AdminEducation";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import VerifiedPage from "./pages/VerifiedPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
            <Route path="/verified" element={<VerifiedPage />} />
            
            <Route path="/dashboard/*" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="min-h-screen flex w-full bg-background">
                    <AppSidebar />
                    <main className="flex-1">
                      <Navbar />
                      <div className="p-0">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/budgeting" element={<Budgeting />} />
                          <Route path="/budgeting/add" element={<AddBudget />} />
                          <Route path="/spending" element={<SpendingTracker />} />
                          <Route path="/goals" element={<GoalsWithCustomCategories />} />
                          <Route path="/education" element={<Education />} />
                          <Route path="/challenge" element={<Challenge />} />
                          <Route path="/challenge/new" element={<NewChallenge />} />
                          <Route path="/profile" element={<Profile />} />
                        </Routes>
                      </div>
                    </main>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />

            <Route path="/admin/challenges" element={
              <ProtectedRoute>
                <AdminRoute>
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full bg-background">
                      <AppSidebar />
                      <main className="flex-1">
                        <Navbar />
                        <AdminChallenges />
                      </main>
                    </div>
                  </SidebarProvider>
                </AdminRoute>
              </ProtectedRoute>
            } />

            <Route path="/admin/education" element={
              <ProtectedRoute>
                <AdminRoute>
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full bg-background">
                      <AppSidebar />
                      <main className="flex-1">
                        <Navbar />
                        <AdminEducation />
                      </main>
                    </div>
                  </SidebarProvider>
                </AdminRoute>
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
