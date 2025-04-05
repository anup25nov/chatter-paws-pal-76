
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import JsonFormatter from "./pages/JsonFormatter";
import JsonToXml from "./pages/JsonToXml";
import JwtDecoder from "./pages/JwtDecoder";
import Base64Tool from "./pages/Base64Tool";
import JsonDiffViewer from "./pages/JsonDiffViewer";
import YamlJsonConverter from "./pages/YamlJsonConverter";
import JsonQuery from "./pages/JsonQuery";

// Create a new query client instance
const queryClient = new QueryClient();

/**
 * App Component
 * 
 * Root component that handles routing and global providers.
 * Enforces dark mode for the entire application.
 */
const App = () => {
  // Force dark mode throughout the app
  useEffect(() => {
    // Apply dark mode to document and set in localStorage
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="dark">
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
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
