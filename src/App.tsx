import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
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
import QuizPage from "@/pages/Quiz";
import Leaderboard from "./pages/Leaderboard";
import Challenge from "./pages/Challenge";
import NewChallenge from "./pages/NewChallenge";
import AdminChallenges from "./pages/AdminChallenges";
import AdminEducation from "./pages/AdminEducation";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import VerifiedPage from "./pages/VerifiedPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminRegisterPage from "./pages/AdminRegisterPage";

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
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <LoginPage />
                </AuthRoute>
              }
            />
            <Route
              path="/register"
              element={
                <AuthRoute>
                  <RegisterPage />
                </AuthRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/register" element={<AdminRegisterPage />} />
            <Route path="/verified" element={<VerifiedPage />} />

            {/* User Dashboard */}
            <Route
              path="/dashboard/*"
              element={
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
                            <Route
                              path="/budgeting/add"
                              element={<AddBudget />}
                            />
                            <Route
                              path="/spending"
                              element={<SpendingTracker />}
                            />
                            <Route
                              path="/goals"
                              element={<GoalsWithCustomCategories />}
                            />
                            <Route path="/education" element={<Education />} />
                            <Route path="/quiz/:id" element={<QuizPage />} />
                            <Route path="/leaderboard" element={<Leaderboard />} />
                            <Route path="/challenge" element={<Challenge />} />
                            <Route
                              path="/challenge/new"
                              element={<NewChallenge />}
                            />
                            <Route path="/profile" element={<Profile />} />
                          </Routes>
                        </div>
                      </main>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />

            {/* Admin Panel */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full bg-background">
                      <AdminSidebar />
                      <main className="flex-1">
                        <Navbar />
                        <Routes>
                          <Route
                            path="/dashboard"
                            element={<AdminDashboard />}
                          />
                          <Route
                            path="/challenges"
                            element={<AdminChallenges />}
                          />
                          <Route
                            path="/education"
                            element={<AdminEducation />}
                          />
                          <Route path="/profile" element={<AdminProfile />} />
                        </Routes>
                      </main>
                    </div>
                  </SidebarProvider>
                </AdminRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
