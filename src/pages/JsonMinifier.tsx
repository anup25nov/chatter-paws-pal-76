
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import JsonInput from '@/components/JsonInput';
import OutputDisplay from '@/components/OutputDisplay';
import ActionButtons from '@/components/ActionButtons';
import ErrorDisplay from '@/components/ErrorDisplay';
import HeaderAd from '@/components/ads/HeaderAd';
import SidebarAd from '@/components/ads/SidebarAd';
import Footer from '@/components/Footer';
import { validateJson, minifyJson, JsonError } from '@/utils/jsonUtils';
import { useToast } from '@/hooks/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const JsonMinifier = () => {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [error, setError] = useState<JsonError | undefined>(undefined);
  const [isJsonValid, setIsJsonValid] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (inputJson.trim()) {
      const result = validateJson(inputJson);
      setIsJsonValid(result.success);
      
      if (!result.success) {
        setError(result.error);
      } else {
        setError(undefined);
      }
    } else {
      setIsJsonValid(false);
      setError(undefined);
    }
  }, [inputJson]);

  const handleMinify = () => {
    const result = minifyJson(inputJson, true);
    
    if (result.success) {
      setOutputJson(result.result || '');
      
      // Calculate size reduction
      const originalSize = new Blob([inputJson]).size;
      const minifiedSize = new Blob([result.result || '']).size;
      const reduction = originalSize > 0 ? ((originalSize - minifiedSize) / originalSize * 100).toFixed(1) : "0";
      
      toast({
        title: "JSON Minified",
        description: `Size reduced by ${reduction}% (${originalSize} → ${minifiedSize} bytes)`
      });
      
      setError(undefined);
    } else {
      setOutputJson('');
      setError(result.error);
      toast({
        title: "Minification Failed",
        description: result.error?.message || "An error occurred",
        variant: "destructive"
      });
    }
  };

  const handleValidate = () => {
    const result = validateJson(inputJson, true);
    if (result.success) {
      setError(undefined);
      toast({
        title: "Validation Successful",
        description: "Your JSON is valid and well-formed"
      });
    } else {
      setError(result.error);
      toast({
        title: "Validation Failed",
        description: result.error?.message || "Invalid JSON",
        variant: "destructive"
      });
    }
  };

  // We'll reuse the pretty print function for the main button action
  const handlePrettyPrint = () => {
    handleMinify();
  };

  return (
    <div className="min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <div className="mx-auto">
          <section className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DevxTools JSON Minifier
            </h1>
            <p className="text-muted-foreground mb-4">
              Minify and compress your JSON to reduce file size and optimize performance
            </p>
            
            <HeaderAd />
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-9">
              <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[500px] rounded-lg border"
              >
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="p-4 h-full">
                    <h3 className="text-lg font-medium mb-3">Input JSON</h3>
                    <JsonInput value={inputJson} onChange={setInputJson} />
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="p-4 h-full flex flex-col">
                    <h3 className="text-lg font-medium mb-3">Minified Result</h3>
                    <div className="mb-4">
                      <ActionButtons 
                        onPrettyPrint={handleMinify}
                        onValidate={handleValidate}
                        onMinify={handleMinify}
                        outputJson={outputJson}
                        isJsonValid={isJsonValid}
                        primaryButtonText="Minify JSON"
                      />
                    </div>
                    
                    {error && (
                      <ErrorDisplay error={error} jsonInput={inputJson} />
                    )}
                    
                    <div className="flex-grow">
                      <OutputDisplay json={outputJson} hasError={!!error} />
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
            
            <div className="md:col-span-3">
              <SidebarAd />
              
              <div className="bg-card rounded-lg p-4 border border-border mb-6">
                <h3 className="text-sm font-medium mb-2">JSON Tools</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/json-formatter">JSON Formatter</Link>
                  </li>
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/json-validator">JSON Validator</Link>
                  </li>
                  <li className="hover:text-foreground transition-colors font-medium text-foreground">
                    <Link to="/json-minifier">JSON Minifier</Link>
                  </li>
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/json-to-csv">JSON to CSV</Link>
                  </li>
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/json-to-xml">JSON to XML</Link>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card rounded-lg p-4 border border-border">
                <h3 className="text-sm font-medium mb-2">Pro Features</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>✓ Schema Validation</li>
                  <li>✓ JSON Diff Tool</li>
                  <li>✓ JSON Query</li>
                  <li>✓ Save & Export</li>
                  <li>✓ No Ads</li>
                </ul>
              </div>
            </div>
          </div>
          
          <section className="mt-8 bg-card rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">About JSON Minifier</h2>
            <p className="mb-4">
              Our JSON minifier removes all unnecessary whitespace, including spaces, line breaks, and indentation
              from your JSON data. This tool helps reduce file size for better network performance and lower storage requirements.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Space Reduction</h3>
                <p className="text-muted-foreground">
                  Removes whitespace and formatting while preserving data integrity.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Validation</h3>
                <p className="text-muted-foreground">
                  Ensures your JSON is valid before and after minification.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Performance</h3>
                <p className="text-muted-foreground">
                  Optimized for speed when handling large JSON documents.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JsonMinifier;
