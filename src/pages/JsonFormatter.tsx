
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import JsonInput from '@/components/JsonInput';
import OutputDisplay from '@/components/OutputDisplay';
import ActionButtons from '@/components/ActionButtons';
import ErrorDisplay from '@/components/ErrorDisplay';
import HeaderAd from '@/components/ads/HeaderAd';
import SidebarAd from '@/components/ads/SidebarAd';
import Footer from '@/components/Footer';
import { prettyPrintJson, validateJson, minifyJson, JsonError } from '@/utils/jsonUtils';
import { useToast } from '@/hooks/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { BadgeDollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const JsonFormatter = () => {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [error, setError] = useState<JsonError | undefined>(undefined);
  const [warningError, setWarningError] = useState<JsonError | undefined>(undefined);
  const [isJsonValid, setIsJsonValid] = useState(false);
  const { toast } = useToast();

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
      setWarningError(undefined);
    }
  }, [inputJson]);

  const handlePrettyPrint = () => {
    const result = prettyPrintJson(inputJson, true);
    handleJsonResult(result);
  };

  const handleValidate = () => {
    const result = validateJson(inputJson, true);
    if (result.success) {
      setError(undefined);
      setOutputJson('JSON is valid! 👍');
      toast({
        title: "Validation Successful",
        description: "Your JSON is valid and well-formed"
      });
    } else {
      setWarningError(undefined);
      setError(result.error);
      setOutputJson('');
      toast({
        title: "Validation Failed",
        description: result.error?.message || "Invalid JSON",
        variant: "destructive"
      });
    }
  };

  const handleMinify = () => {
    const result = minifyJson(inputJson, true);
    handleJsonResult(result);
  };

  const handleJsonResult = (result: any) => {
    if (result.success) {
      setOutputJson(result.result || '');
      setError(undefined);
    } else {
      setOutputJson('');
      setWarningError(undefined);
      setError(result.error);
      toast({
        title: "Action Failed",
        description: result.error?.message || "An error occurred",
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
              DevxTools JSON Formatter
            </h1>
            <p className="text-muted-foreground mb-4 text-lg">
              Format, validate, and minify your JSON with a professional developer tool
            </p>
            
            <HeaderAd />
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-9">
              <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[500px] rounded-lg border"
              >
                <ResizablePanel defaultSize={40} minSize={30}>
                  <div className="p-4 h-full">
                    <h3 className="text-lg font-medium mb-3">Input JSON</h3>
                    <JsonInput value={inputJson} onChange={setInputJson} />
                  </div>
                </ResizablePanel>
                
                <ResizableHandle>
                  <div className="flex items-center justify-center h-full">
                    <div className="py-6 px-2">
                      <ActionButtons 
                        onPrettyPrint={handlePrettyPrint}
                        onValidate={handleValidate}
                        onMinify={handleMinify}
                        outputJson={outputJson}
                        isJsonValid={isJsonValid}
                      />
                    </div>
                  </div>
                </ResizableHandle>
                
                <ResizablePanel defaultSize={40} minSize={30}>
                  <div className="p-4 h-full flex flex-col">
                    <h3 className="text-lg font-medium mb-3">Result</h3>
                    
                    {warningError && (
                      <ErrorDisplay error={warningError} jsonInput={inputJson} warningOnly={true} />
                    )}
                    
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
                <h3 className="text-base font-medium mb-3">Developer Tools</h3>
                <ul className="text-base space-y-3 text-muted-foreground">
                  <li className="hover:text-foreground transition-colors font-medium text-foreground">
                    <Link to="/json-formatter">JSON Formatter</Link>
                  </li>
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/jwt-decoder">JWT Decoder</Link>
                  </li>
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/base64">Base64</Link>
                  </li>
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/json-to-xml">JSON to XML</Link>
                  </li>
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/json-diff">JSON Diff Viewer</Link>
                  </li>
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/yaml-json">YAML ⇄ JSON</Link>
                  </li>
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/json-query">JSON Query</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Additional Ad above About section */}
          <div className="mt-8 mb-6">
            <Card className="w-full overflow-hidden border-dashed border-primary/30 hover:border-primary/70 transition-all duration-300 bg-muted/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BadgeDollarSign className="h-5 w-5 text-primary" />
                    <span className="font-medium text-sm text-primary">Premium DevxTools Pro Suite</span>
                  </div>
                  <button className="text-xs bg-primary/90 hover:bg-primary text-white px-3 py-1 rounded-full transition-colors">
                    Get Pro Access
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Unlock advanced features: JSON Schema validation, API access, diff viewer, team sharing, and more.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <section className="mt-4 bg-card rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">About JSON Formatter</h2>
            <p className="mb-4 text-base">
              DevxTools provides professional-grade utilities for developers. Our JSON formatter helps you 
              quickly beautify, validate, and optimize your JSON data with a clean interface.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Format</h3>
                <p className="text-muted-foreground">
                  Make your JSON beautiful with proper indentation and formatting.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Validate</h3>
                <p className="text-muted-foreground">
                  Check if your JSON is valid and get helpful error messages.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Minify</h3>
                <p className="text-muted-foreground">
                  Remove all whitespace to make your JSON as small as possible.
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

export default JsonFormatter;
