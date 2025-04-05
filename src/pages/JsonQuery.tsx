
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import JsonInput from '@/components/JsonInput';
import OutputDisplay from '@/components/OutputDisplay';
import ActionButtons from '@/components/ActionButtons';
import HeaderAd from '@/components/ads/HeaderAd';
import SidebarAd from '@/components/ads/SidebarAd';
import Footer from '@/components/Footer';
import { validateJson, JsonError, JsonResult } from '@/utils/jsonUtils';
import { useToast } from '@/hooks/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Search, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const JsonQuery = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [queryInput, setQueryInput] = useState('');
  const [queryResult, setQueryResult] = useState('');
  const [error, setError] = useState<JsonError | undefined>(undefined);
  const [isJsonValid, setIsJsonValid] = useState(false);
  const { toast } = useToast();

  const validateJsonInput = (json: string) => {
    if (!json.trim()) {
      setIsJsonValid(false);
      setError(undefined);
      return;
    }
    
    const result = validateJson(json);
    setIsJsonValid(result.success);
    setError(result.success ? undefined : result.error);
  };

  const handleJsonInputChange = (value: string) => {
    setJsonInput(value);
    validateJsonInput(value);
  };

  const executeQuery = () => {
    if (!isJsonValid) {
      toast({
        title: "Invalid JSON",
        description: "Please fix JSON errors before querying",
        variant: "destructive"
      });
      return;
    }
    
    if (!queryInput.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a query expression",
        variant: "destructive"
      });
      return;
    }

    try {
      const jsonObj = JSON.parse(jsonInput);
      let result: any;
      
      // Handle different query types
      if (queryInput.startsWith('$')) {
        // JSONPath-like query (simplified implementation)
        result = evaluateJsonPath(jsonObj, queryInput);
      } else if (queryInput.includes('.') || queryInput.includes('[')) {
        // JavaScript notation
        try {
          // Create a safe evaluation function
          const evalInContext = (obj: any, expr: string) => {
            try {
              return Function('obj', `"use strict"; try { return obj${expr.startsWith('.') ? expr : '.' + expr}; } catch(e) { return null; }`)
                (obj);
            } catch (e) {
              return null;
            }
          };
          
          result = evalInContext(jsonObj, queryInput);
        } catch (e) {
          throw new Error("Invalid query expression");
        }
      } else {
        // Direct property access
        result = jsonObj[queryInput];
      }
      
      if (result === undefined) {
        setQueryResult('No matching results found');
      } else {
        setQueryResult(typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result));
      }
      
      toast({
        title: "Query Executed",
        description: "Results displayed below"
      });
      
    } catch (error: any) {
      toast({
        title: "Query Error",
        description: error.message || "Failed to execute query",
        variant: "destructive"
      });
      setQueryResult('');
    }
  };

  // Simple JSONPath-like evaluator (very limited implementation)
  const evaluateJsonPath = (obj: any, path: string) => {
    // Handle basic JSONPath expressions
    if (path === '$') return obj;
    
    if (path.startsWith('$.')) {
      const segments = path.substring(2).split('.');
      let current = obj;
      
      for (const segment of segments) {
        if (segment.includes('[') && segment.includes(']')) {
          // Array access like $.items[0]
          const name = segment.substring(0, segment.indexOf('['));
          const indexStr = segment.substring(segment.indexOf('[') + 1, segment.indexOf(']'));
          const index = parseInt(indexStr);
          
          current = current[name];
          if (Array.isArray(current)) {
            current = current[index];
          } else {
            return undefined;
          }
        } else {
          current = current[segment];
        }
        
        if (current === undefined) return undefined;
      }
      
      return current;
    }
    
    return undefined;
  };

  const validateJson = () => {
    validateJsonInput(jsonInput);
    
    if (isJsonValid) {
      toast({
        title: "Valid JSON",
        description: "Your JSON is valid and well-formed"
      });
    } else if (error) {
      toast({
        title: "Invalid JSON",
        description: error.message || "Please fix JSON errors",
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
              DevxTools JSON Query
            </h1>
            <p className="text-muted-foreground mb-4 text-lg">
              Query and extract data from JSON using path expressions
            </p>
            
            <HeaderAd />
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-9">
              <div className="bg-card rounded-lg border border-border p-4 mb-4">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-medium">Query Expression</h3>
                  <div className="ml-2 text-muted-foreground text-sm flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    Use JavaScript notation like "users[0].name" or JSONPath like "$.users[0].name"
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Input 
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    placeholder="Enter query expression..."
                    className="flex-1 text-base"
                  />
                  <Button 
                    onClick={executeQuery}
                    disabled={!isJsonValid || !queryInput.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Execute Query
                  </Button>
                </div>
              </div>
              
              <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[500px] rounded-lg border"
              >
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="p-4 h-full">
                    <h3 className="text-lg font-medium mb-3">JSON Data</h3>
                    <JsonInput 
                      value={jsonInput} 
                      onChange={handleJsonInputChange} 
                      error={error?.message}
                    />
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="p-4 h-full flex flex-col">
                    <h3 className="text-lg font-medium mb-3">Query Results</h3>
                    <div className="mb-4">
                      <ActionButtons 
                        onPrettyPrint={executeQuery}
                        onValidate={validateJson}
                        outputJson={queryResult}
                        isJsonValid={isJsonValid}
                        primaryButtonText="Run Query"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <OutputDisplay json={queryResult || "Query results will appear here"} hasError={false} />
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
                  <li className="hover:text-foreground transition-colors">
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
                  <li className="hover:text-foreground transition-colors font-medium text-foreground">
                    <Link to="/json-query">JSON Query</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <section className="mt-8 bg-card rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">About JSON Query</h2>
            <p className="mb-4 text-base">
              JSON Query allows you to extract specific data from JSON objects using query expressions.
              This is useful for navigating large JSON structures and finding exactly what you need.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Extract</h3>
                <p className="text-muted-foreground">
                  Pull specific values from complex JSON structures.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Navigate</h3>
                <p className="text-muted-foreground">
                  Use dot notation or JSONPath to traverse nested properties.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Analyze</h3>
                <p className="text-muted-foreground">
                  Explore and understand complex JSON data structures.
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

export default JsonQuery;
