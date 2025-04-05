
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
import { validateJson, JsonError } from '@/utils/jsonUtils';
import { useToast } from '@/hooks/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const JsonToCsv = () => {
  const [inputJson, setInputJson] = useState('');
  const [outputCsv, setOutputCsv] = useState('');
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

  const convertJsonToCsv = () => {
    if (!isJsonValid) {
      toast({
        title: "Invalid JSON",
        description: "Please fix the JSON errors before converting",
        variant: "destructive"
      });
      return;
    }

    try {
      const jsonObj = JSON.parse(inputJson);
      
      // Check if it's an array of objects
      if (!Array.isArray(jsonObj)) {
        toast({
          title: "Invalid Format",
          description: "CSV conversion requires an array of objects",
          variant: "destructive"
        });
        setError({
          message: "CSV conversion requires an array of objects",
          errorType: "structure"
        });
        return;
      }
      
      if (jsonObj.length === 0) {
        setOutputCsv('');
        toast({
          title: "Empty Array",
          description: "The input JSON array is empty",
          variant: "default"
        });
        return;
      }
      
      // Extract headers from all objects to ensure we get all possible columns
      const headers = new Set<string>();
      jsonObj.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => headers.add(key));
        }
      });
      
      if (headers.size === 0) {
        setError({
          message: "Could not find any properties to convert to CSV columns",
          errorType: "structure"
        });
        return;
      }
      
      const headerArray = Array.from(headers);
      
      // Create CSV header row
      let csv = headerArray.map(key => `"${key}"`).join(',') + '\n';
      
      // Add data rows
      jsonObj.forEach(item => {
        const row = headerArray.map(key => {
          const value = item[key];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',');
        csv += row + '\n';
      });
      
      setOutputCsv(csv);
      toast({
        title: "Conversion Successful",
        description: `Converted ${jsonObj.length} rows to CSV`
      });
    } catch (err: any) {
      setError({
        message: err.message || "Failed to convert JSON to CSV",
        errorType: "value"
      });
      toast({
        title: "Conversion Failed",
        description: err.message || "An error occurred during conversion",
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

  return (
    <div className="min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <div className="mx-auto">
          <section className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DevxTools JSON to CSV Converter
            </h1>
            <p className="text-muted-foreground mb-4">
              Convert your JSON arrays to CSV format with this professional developer tool
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
                    <h3 className="text-lg font-medium mb-3">CSV Output</h3>
                    <div className="mb-4">
                      <ActionButtons 
                        onPrettyPrint={convertJsonToCsv}
                        onValidate={handleValidate}
                        onMinify={() => {}} // Not used for CSV conversion
                        outputJson={outputCsv}
                        isJsonValid={isJsonValid}
                        primaryButtonText="Convert to CSV"
                      />
                    </div>
                    
                    {error && (
                      <ErrorDisplay error={error} jsonInput={inputJson} />
                    )}
                    
                    <div className="flex-grow">
                      <OutputDisplay json={outputCsv} hasError={!!error} plainText={true} />
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
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/json-minifier">JSON Minifier</Link>
                  </li>
                  <li className="hover:text-foreground transition-colors font-medium text-foreground">
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
            <h2 className="text-xl font-semibold mb-4">About JSON to CSV Converter</h2>
            <p className="mb-4">
              Our JSON to CSV converter transforms JSON arrays of objects into CSV format. This tool is 
              particularly useful when you need to analyze JSON data in spreadsheet applications or import 
              into database systems that accept CSV.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Array Handling</h3>
                <p className="text-muted-foreground">
                  Works with arrays of objects, extracting all possible headers automatically.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Validation</h3>
                <p className="text-muted-foreground">
                  Validates your JSON before conversion to ensure error-free results.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Escaping</h3>
                <p className="text-muted-foreground">
                  Properly handles text escaping and nested objects according to CSV standards.
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

export default JsonToCsv;
