import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NewJobOrder from "./pages/NewJobOrder";
import JobOrderDetails from "./pages/JobOrderDetails";
import CustomerDetails from "./pages/CustomerDetails";
import ProductionDetails from "./pages/ProductionDetails";
import GuestDashboard from "./pages/GuestDashboard";
import SuperadminDashboard from "./pages/SuperadminDashboard";
import { PayrollManagement } from "./pages/PayrollManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/guest" 
              element={
                <ProtectedRoute allowedRoles={['guest']}>
                  <GuestDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/superadmin" 
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <SuperadminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/new-job-order" 
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'clerk', 'supervisor']}>
                  <NewJobOrder />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/job-order/:id" 
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'clerk', 'supervisor', 'cutter', 'delivery']}>
                  <JobOrderDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/:id" 
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'clerk', 'supervisor']}>
                  <CustomerDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/production" 
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'supervisor', 'cutter']}>
                  <ProductionDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payroll" 
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'clerk']}>
                  <PayrollManagement />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
