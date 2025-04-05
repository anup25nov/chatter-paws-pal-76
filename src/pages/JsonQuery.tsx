
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
import { prettyPrintJson, validateJson, minifyJson, JsonError, JsonResult } from '@/utils/jsonUtils';
import { useToast } from '@/hooks/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { BadgeDollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

/**
 * JSON Query Page
 * 
 * Tool for querying JSON using JSONPath and displaying results
 */
const JsonQuery = () => {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [jsonPath, setJsonPath] = useState('$.'); // Default JSONPath query
  const [error, setError] = useState<JsonError | undefined>(undefined);
  const [isJsonValid, setIsJsonValid] = useState(false);
  const { toast } = useToast();

  // Validate JSON whenever input changes
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

  // Pretty print handler
  const handlePrettyPrint = () => {
    const result = prettyPrintJson(inputJson, true);
    handleJsonResult(result);
  };

  // Validate handler
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
      setError(result.error);
      setOutputJson('');
      toast({
        title: "Validation Failed",
        description: result.error?.message || "Invalid JSON",
        variant: "destructive"
      });
    }
  };

  // Minify handler
  const handleMinify = () => {
    const result = minifyJson(inputJson, true);
    handleJsonResult(result);
  };

  // Process JSON operation results
  const handleJsonResult = (result: JsonResult) => {
    if (result.success) {
      setOutputJson(result.result || '');
      setError(undefined);
    } else {
      setOutputJson('');
      setError(result.error);
      toast({
        title: "Action Failed",
        description: result.error?.message || "An error occurred",
        variant: "destructive"
      });
    }
  };

  /**
   * Query JSON using the JSONPath
   * This is a simple implementation and can be extended for more complex queries
   */
  const handleQuery = () => {
    if (!isJsonValid) {
      toast({
        title: "Invalid JSON",
        description: "Please provide valid JSON before querying",
        variant: "destructive"
      });
      return;
    }

    try {
      const parsedJson = JSON.parse(inputJson);
      
      // Very basic JSONPath implementation for demonstration
      // In production, you'd use a full JSONPath library
      let result = parsedJson;
      const path = jsonPath.replace('$.', '').split('.');
      
      if (jsonPath.trim() !== '$.' && jsonPath.trim() !== '$') {
        for (const part of path) {
          if (part && result) {
            // Handle array indices
            if (part.includes('[') && part.includes(']')) {
              const arrayName = part.substring(0, part.indexOf('['));
              const indexStr = part.substring(part.indexOf('[') + 1, part.indexOf(']'));
              const index = parseInt(indexStr, 10);
              
              result = result[arrayName] ? result[arrayName][index] : undefined;
            } else {
              result = result[part];
            }
            
            if (result === undefined) break;
          }
        }
      }
      
      const jsonResult: JsonResult = { 
        success: true, 
        result: JSON.stringify(result, null, 2)
      };
      
      handleJsonResult(jsonResult);
    } catch (error) {
      setOutputJson('');
      setError({
        message: "Query error: " + (error instanceof Error ? error.message : String(error)),
        errorType: 'value'
      });
      
      toast({
        title: "Query Failed",
        description: "Invalid JSONPath or error processing query",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <div className="mx-auto">
          <section className="mb-8 fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DevxTools JSON Query
            </h1>
            <p className="text-muted-foreground mb-4 text-lg">
              Query your JSON data with JSONPath expressions
            </p>
            
            <HeaderAd />
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-9">
              {/* Input area for JSONPath query */}
              <div className="mb-6 slide-in">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium w-24">JSONPath:</label>
                  <Input
                    value={jsonPath}
                    onChange={(e) => setJsonPath(e.target.value)}
                    placeholder="$.path.to.property"
                    className="flex-1"
                  />
                  <button
                    onClick={handleQuery}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded shadow-md"
                  >
                    Query
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Example: $.store.book[0].title, $.users[*].name
                </p>
              </div>
              
              {/* Main content panels - aligned to have result above and input below */}
              <ResizablePanelGroup
                direction="vertical"
                className="min-h-[500px] rounded-lg border shadow-md"
              >
                {/* Result panel (moved to top) */}
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="p-4 h-full flex flex-col">
                    <h3 className="text-lg font-medium mb-3">Result</h3>
                    
                    {error && (
                      <ErrorDisplay error={error} jsonInput={inputJson} />
                    )}
                    
                    <div className="flex-grow">
                      <OutputDisplay json={outputJson} hasError={!!error} />
                    </div>
                  </div>
                </ResizablePanel>
                
                <ResizableHandle />
                
                {/* Actions in the middle */}
                <ResizablePanel defaultSize={10} minSize={5}>
                  <div className="flex items-center justify-center h-full py-2">
                    <ActionButtons 
                      onPrettyPrint={handlePrettyPrint}
                      onValidate={handleValidate}
                      onMinify={handleMinify}
                      outputJson={outputJson}
                      isJsonValid={isJsonValid}
                    />
                  </div>
                </ResizablePanel>
                
                <ResizableHandle />
                
                {/* Input panel (moved to bottom) */}
                <ResizablePanel defaultSize={40} minSize={30}>
                  <div className="p-4 h-full">
                    <h3 className="text-lg font-medium mb-3">Input JSON</h3>
                    <JsonInput value={inputJson} onChange={setInputJson} />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
            
            <div className="md:col-span-3">
              <SidebarAd />
              
              <div className="bg-card rounded-lg p-4 border border-border mb-6 card-hover fade-in">
                <h3 className="text-base font-medium mb-3">Developer Tools</h3>
                <ul className="text-base space-y-3 text-muted-foreground">
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/json-formatter" className="hover-lift block py-1">JSON Formatter</Link>
                  </li>
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/jwt-decoder" className="hover-lift block py-1">JWT Decoder</Link>
                  </li>
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/base64" className="hover-lift block py-1">Base64</Link>
                  </li>
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/json-to-xml" className="hover-lift block py-1">JSON to XML</Link>
                  </li>
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/json-diff" className="hover-lift block py-1">JSON Diff Viewer</Link>
                  </li>
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/yaml-json" className="hover-lift block py-1">YAML ⇄ JSON</Link>
                  </li>
                  <li className="hover:text-foreground transition-colors font-medium text-foreground">
                    <Link to="/json-query" className="hover-lift block py-1">JSON Query</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 mb-6 bounce-subtle">
            <Card className="w-full overflow-hidden border-dashed border-primary/30 hover:border-primary/70 transition-all duration-300 bg-muted/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BadgeDollarSign className="h-5 w-5 text-primary animate-pulse-slow" />
                    <span className="font-medium text-sm text-primary">Premium DevxTools Pro Suite</span>
                  </div>
                  <button className="text-xs bg-primary/90 hover:bg-primary text-white px-3 py-1 rounded-full transition-colors">
                    Get Pro Access
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Unlock advanced JSONPath querying, result filtering, and more with Pro access.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JsonQuery;
