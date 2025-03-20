
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import Documents from "./pages/Documents";
import Finance from "./pages/Finance";
import Maintenance from "./pages/Maintenance";
import NotFound from "./pages/NotFound";
import AddProperty from "./pages/AddProperty";
import Tenants from "./pages/Tenants";
import AddPayment from "./pages/AddPayment";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected routes for proprietaires */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/properties" element={
                <ProtectedRoute allowedRoles={['proprietaire']}>
                  <Properties />
                </ProtectedRoute>
              } />
              <Route path="/properties/new" element={
                <ProtectedRoute allowedRoles={['proprietaire']}>
                  <AddProperty />
                </ProtectedRoute>
              } />
              <Route path="/tenants" element={
                <ProtectedRoute allowedRoles={['proprietaire']}>
                  <Tenants />
                </ProtectedRoute>
              } />
              
              {/* Protected routes for both roles */}
              <Route path="/documents" element={
                <ProtectedRoute>
                  <Documents />
                </ProtectedRoute>
              } />
              <Route path="/finance" element={
                <ProtectedRoute>
                  <Finance />
                </ProtectedRoute>
              } />
              <Route path="/finance/add-payment" element={
                <ProtectedRoute>
                  <AddPayment />
                </ProtectedRoute>
              } />
              <Route path="/maintenance" element={
                <ProtectedRoute>
                  <Maintenance />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
