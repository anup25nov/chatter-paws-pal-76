
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import JsonInput from '@/components/JsonInput';
import ActionButtons from '@/components/ActionButtons';
import OutputDisplay from '@/components/OutputDisplay';
import ErrorDisplay from '@/components/ErrorDisplay';
import HeaderAd from '@/components/ads/HeaderAd';
import SidebarAd from '@/components/ads/SidebarAd';
import Footer from '@/components/Footer';
import { prettyPrintJson, validateJson, minifyJson, JsonError, JsonResult, checkForDuplicateKeys } from '@/utils/jsonUtils';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const Index = () => {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [error, setError] = useState<JsonError | undefined>(undefined);
  const [warningError, setWarningError] = useState<JsonError | undefined>(undefined);
  const [isJsonValid, setIsJsonValid] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (inputJson.trim()) {
      const duplicateKeyCheck = checkForDuplicateKeys(inputJson);
      if (!duplicateKeyCheck.success) {
        setWarningError(duplicateKeyCheck.error);
      } else {
        setWarningError(undefined);
      }
      
      const result = validateJson(inputJson);
      setIsJsonValid(result.success);
      
      if (!result.success && !duplicateKeyCheck.success) {
        setError(result.error);
        setWarningError(undefined);
      } else if (!result.success) {
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

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/jwt-decoder':
        return 'DevxTools JWT Decoder';
      case '/base64':
        return 'DevxTools Base64';
      case '/json-to-xml':
        return 'DevxTools JSON to XML';
      case '/json-diff':
        return 'DevxTools JSON Diff Viewer';
      case '/yaml-json':
        return 'DevxTools YAML ⇄ JSON';
      case '/json-query':
        return 'DevxTools JSON Query';
      default:
        return 'DevxTools JSON Formatter';
    }
  };

  const handlePrettyPrint = () => {
    const result = prettyPrintJson(inputJson, true);
    handleJsonResult(result);
  };

  const handleValidate = () => {
    const duplicateKeyCheck = checkForDuplicateKeys(inputJson);
    if (!duplicateKeyCheck.success) {
      setWarningError(duplicateKeyCheck.error);
      toast({
        title: "Validation Warning",
        description: "Found duplicate keys in your JSON. This may cause problems.",
        variant: "default"
      });
    }
    
    const result = validateJson(inputJson, true);
    if (result.success) {
      setError(undefined);
      setOutputJson('JSON is valid! 👍');
      toast({
        title: "Validation Successful",
        description: duplicateKeyCheck.success 
          ? "Your JSON is valid and well-formed" 
          : "Your JSON is syntactically valid, but contains duplicate keys",
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

  const handleJsonResult = (result: JsonResult) => {
    if (result.success) {
      setOutputJson(result.result || '');
      
      const duplicateKeyCheck = checkForDuplicateKeys(inputJson);
      if (!duplicateKeyCheck.success) {
        setWarningError(duplicateKeyCheck.error);
        toast({
          title: "Operation Completed with Warnings",
          description: "Found duplicate keys. Some data may be overwritten.",
          variant: "default"
        });
      } else {
        setWarningError(undefined);
      }
      
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
      <Toaster />
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <div className="mx-auto">
          <section className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {getPageTitle()}
            </h1>
            <p className="text-muted-foreground mb-4 text-lg">
              Professional developer tools to work with JSON and related formats
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
                    <h3 className="text-lg font-medium mb-3">Input</h3>
                    <JsonInput value={inputJson} onChange={setInputJson} />
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="p-4 h-full flex flex-col">
                    <h3 className="text-lg font-medium mb-3">Result</h3>
                    <div className="mb-4">
                      <ActionButtons 
                        onPrettyPrint={handlePrettyPrint}
                        onValidate={handleValidate}
                        onMinify={handleMinify}
                        outputJson={outputJson}
                        isJsonValid={isJsonValid}
                      />
                    </div>
                    
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
                  <li className={`hover:text-foreground transition-colors ${location.pathname === '/json-formatter' || location.pathname === '/' ? 'font-medium text-foreground' : ''}`}>
                    <Link to="/json-formatter">JSON Formatter</Link>
                  </li>
                  <li className={`hover:text-foreground transition-colors ${location.pathname === '/jwt-decoder' ? 'font-medium text-foreground' : ''}`}>
                    <Link to="/jwt-decoder">JWT Decoder</Link>
                  </li>
                  <li className={`hover:text-foreground transition-colors ${location.pathname === '/base64' ? 'font-medium text-foreground' : ''}`}>
                    <Link to="/base64">Base64</Link>
                  </li>
                  <li className={`hover:text-foreground transition-colors ${location.pathname === '/json-to-xml' ? 'font-medium text-foreground' : ''}`}>
                    <Link to="/json-to-xml">JSON to XML</Link>
                  </li>
                  <li className={`hover:text-foreground transition-colors ${location.pathname === '/json-diff' ? 'font-medium text-foreground' : ''}`}>
                    <Link to="/json-diff">JSON Diff Viewer</Link>
                  </li>
                  <li className={`hover:text-foreground transition-colors ${location.pathname === '/yaml-json' ? 'font-medium text-foreground' : ''}`}>
                    <Link to="/yaml-json">YAML ⇄ JSON</Link>
                  </li>
                  <li className={`hover:text-foreground transition-colors ${location.pathname === '/json-query' ? 'font-medium text-foreground' : ''}`}>
                    <Link to="/json-query">JSON Query</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <section className="mt-8 bg-card rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">About DevxTools</h2>
            <p className="mb-4 text-base">
              DevxTools provides professional-grade utilities for developers. Our tools help you 
              quickly work with JSON, JWT tokens, Base64, YAML, and more with a clean interface.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Format & Validate</h3>
                <p className="text-muted-foreground">
                  Make your data beautiful with proper formatting and validation.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Convert</h3>
                <p className="text-muted-foreground">
                  Transform between JSON, XML, YAML, and other formats easily.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Analyze</h3>
                <p className="text-muted-foreground">
                  Compare differences and query your data with powerful tools.
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

export default Index;
