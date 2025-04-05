
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import JsonFormatter from "./pages/JsonFormatter";
import JsonValidator from "./pages/JsonValidator";
import JsonMinifier from "./pages/JsonMinifier";
import JsonToCsv from "./pages/JsonToCsv";
import JsonToXml from "./pages/JsonToXml";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/json-formatter" element={<JsonFormatter />} />
          <Route path="/json-validator" element={<JsonValidator />} />
          <Route path="/json-minifier" element={<JsonMinifier />} />
          <Route path="/json-to-csv" element={<JsonToCsv />} />
          <Route path="/json-to-xml" element={<JsonToXml />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
