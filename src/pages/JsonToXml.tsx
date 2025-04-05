
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

const JsonToXml = () => {
  const [inputJson, setInputJson] = useState('');
  const [outputXml, setOutputXml] = useState('');
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

  const convertJsonToXml = () => {
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
      const xml = jsonToXmlString(jsonObj);
      setOutputXml(xml);
      toast({
        title: "Conversion Successful",
        description: "JSON converted to XML"
      });
    } catch (err: any) {
      setError({
        message: err.message || "Failed to convert JSON to XML",
        errorType: "value"
      });
      toast({
        title: "Conversion Failed",
        description: err.message || "An error occurred during conversion",
        variant: "destructive"
      });
    }
  };

  const jsonToXmlString = (obj: any, rootName: string = 'root'): string => {
    // Handle primitives
    if (obj === null) return `<${rootName} />`;
    if (typeof obj !== 'object') return `<${rootName}>${escapeXml(String(obj))}</${rootName}>`;
    
    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map((item, index) => {
        const elementName = isNaN(parseInt(rootName)) ? getSingular(rootName) : 'item';
        return jsonToXmlString(item, elementName);
      }).join('');
    }
    
    // Handle objects
    let xml = `<${rootName}>`;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        xml += jsonToXmlString(obj[key], key);
      }
    }
    xml += `</${rootName}>`;
    
    return xml;
  };

  // Helper to escape XML special characters
  const escapeXml = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };
  
  // Simple function to get singular form of a word
  const getSingular = (word: string): string => {
    if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
    if (word.endsWith('s')) return word.slice(0, -1);
    return word;
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
              DevxTools JSON to XML Converter
            </h1>
            <p className="text-muted-foreground mb-4">
              Convert your JSON data to XML format with this professional developer tool
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
                    <h3 className="text-lg font-medium mb-3">XML Output</h3>
                    <div className="mb-4">
                      <ActionButtons 
                        onPrettyPrint={convertJsonToXml}
                        onValidate={handleValidate}
                        onMinify={() => {}} // Not used for XML conversion
                        outputJson={outputXml}
                        isJsonValid={isJsonValid}
                        primaryButtonText="Convert to XML"
                      />
                    </div>
                    
                    {error && (
                      <ErrorDisplay error={error} jsonInput={inputJson} />
                    )}
                    
                    <div className="flex-grow">
                      <OutputDisplay json={outputXml} hasError={!!error} xml={true} />
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
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/json-to-csv">JSON to CSV</Link>
                  </li>
                  <li className="hover:text-foreground transition-colors font-medium text-foreground">
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
            <h2 className="text-xl font-semibold mb-4">About JSON to XML Converter</h2>
            <p className="mb-4">
              Our JSON to XML converter transforms valid JSON objects into XML format. This tool is 
              particularly useful when you need to integrate with XML-based systems or APIs but your data 
              is in JSON format.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Conversion</h3>
                <p className="text-muted-foreground">
                  Intelligently converts nested JSON structures to hierarchical XML elements.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Validation</h3>
                <p className="text-muted-foreground">
                  Validates your JSON before conversion to ensure error-free results.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Format</h3>
                <p className="text-muted-foreground">
                  Produces well-structured XML that preserves your data hierarchy.
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

export default JsonToXml;
