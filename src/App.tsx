
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import JsonFormatter from "./pages/JsonFormatter";
import JsonToXml from "./pages/JsonToXml";
import JwtDecoder from "./pages/JwtDecoder";
import Base64Tool from "./pages/Base64Tool";
import JsonDiffViewer from "./pages/JsonDiffViewer";
import YamlJsonConverter from "./pages/YamlJsonConverter";
import JsonQuery from "./pages/JsonQuery";

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
          <Route path="/jwt-decoder" element={<JwtDecoder />} />
          <Route path="/base64" element={<Base64Tool />} />
          <Route path="/json-to-xml" element={<JsonToXml />} />
          <Route path="/json-diff" element={<JsonDiffViewer />} />
          <Route path="/yaml-json" element={<YamlJsonConverter />} />
          <Route path="/json-query" element={<JsonQuery />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
