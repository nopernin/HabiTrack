
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/new" element={<AddProperty />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/finance/add-payment" element={<AddPayment />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/tenants" element={<Tenants />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
