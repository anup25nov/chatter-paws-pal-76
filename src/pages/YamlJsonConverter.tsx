
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import JsonInput from '@/components/JsonInput';
import OutputDisplay from '@/components/OutputDisplay';
import ActionButtons from '@/components/ActionButtons';
import HeaderAd from '@/components/ads/HeaderAd';
import SidebarAd from '@/components/ads/SidebarAd';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { validateJson } from '@/utils/jsonUtils';
import { useToast } from '@/hooks/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ArrowLeftRight } from 'lucide-react';

const YamlJsonConverter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'json2yaml' | 'yaml2json'>('json2yaml');
  const [isInputValid, setIsInputValid] = useState(false);
  const { toast } = useToast();

  // Simple YAML validation - this is very basic
  const validateYaml = (yaml: string): boolean => {
    // Basic validation: check for common YAML syntax issues
    try {
      // Check for indentation consistency
      const lines = yaml.split('\n');
      let prevIndent = 0;
      
      for (const line of lines) {
        if (line.trim() === '' || line.trim().startsWith('#')) continue;
        
        // Count leading spaces
        const indent = line.search(/\S/);
        if (indent === -1) continue;
        
        // Check for tabs (not allowed in YAML)
        if (line.startsWith('\t')) {
          return false;
        }
        
        // Very basic structure checks
        if (line.includes(': ') && line.trim().endsWith(':')) {
          return false;
        }
      }
      
      return true;
    } catch (e) {
      return false;
    }
  };

  // This is a simple mock implementation since we can't include external libraries
  // In a real app, you'd use js-yaml or a similar library
  const jsonToYaml = (jsonStr: string): string => {
    try {
      const obj = JSON.parse(jsonStr);
      let yaml = '';
      
      const convertToYaml = (obj: any, indent = 0): string => {
        let result = '';
        const spaces = ' '.repeat(indent);
        
        if (Array.isArray(obj)) {
          if (obj.length === 0) return spaces + '[]';
          
          for (const item of obj) {
            if (typeof item === 'object' && item !== null) {
              result += spaces + '- \n' + convertToYaml(item, indent + 2);
            } else {
              result += spaces + '- ' + JSON.stringify(item) + '\n';
            }
          }
        } else if (typeof obj === 'object' && obj !== null) {
          for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null) {
              result += spaces + key + ':\n' + convertToYaml(value, indent + 2);
            } else {
              result += spaces + key + ': ' + (typeof value === 'string' ? `"${value}"` : value) + '\n';
            }
          }
        }
        
        return result;
      };
      
      yaml = convertToYaml(obj);
      return yaml;
    } catch (e) {
      throw new Error('Invalid JSON');
    }
  };

  // Simple YAML to JSON conversion
  // This is a very simplified implementation
  const yamlToJson = (yaml: string): string => {
    try {
      const obj: any = {};
      let currentObj = obj;
      let stack: any[] = [obj];
      let currentIndent = 0;
      let prevKey = '';
      
      const lines = yaml.split('\n');
      
      for (const line of lines) {
        if (line.trim() === '' || line.trim().startsWith('#')) continue;
        
        const indent = line.search(/\S/);
        if (indent === -1) continue;
        
        if (indent > currentIndent) {
          // Deeper level
          const newObj = line.includes('- ') ? [] : {};
          currentObj[prevKey] = newObj;
          stack.push(currentObj);
          currentObj = newObj;
          currentIndent = indent;
        } else if (indent < currentIndent) {
          // Moving back up
          const steps = (currentIndent - indent) / 2;
          for (let i = 0; i < steps; i++) {
            currentObj = stack.pop();
          }
          currentIndent = indent;
        }
        
        // Process the line
        if (line.includes(': ')) {
          const [key, value] = line.trim().split(': ');
          prevKey = key;
          if (value !== undefined) {
            currentObj[key] = value;
          }
        } else if (line.includes('- ')) {
          const value = line.trim().substring(2);
          if (Array.isArray(currentObj)) {
            currentObj.push(value);
          }
        }
      }
      
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      throw new Error('Invalid YAML');
    }
  };

  const convertContent = () => {
    try {
      if (mode === 'json2yaml') {
        const yamlOutput = jsonToYaml(input);
        setOutput(yamlOutput);
        toast({
          title: "Conversion Successful",
          description: "JSON converted to YAML"
        });
      } else {
        const jsonOutput = yamlToJson(input);
        setOutput(jsonOutput);
        toast({
          title: "Conversion Successful",
          description: "YAML converted to JSON"
        });
      }
    } catch (error: any) {
      toast({
        title: "Conversion Failed",
        description: error.message || "An error occurred during conversion",
        variant: "destructive"
      });
    }
  };

  const toggleMode = () => {
    if (output) {
      setInput(output);
      setOutput('');
    }
    setMode(mode === 'json2yaml' ? 'yaml2json' : 'json2yaml');
  };

  const validateInput = () => {
    if (mode === 'json2yaml') {
      const result = validateJson(input);
      setIsInputValid(result.success);
      if (result.success) {
        toast({
          title: "Valid JSON",
          description: "Your JSON is valid and well-formed"
        });
      } else {
        toast({
          title: "Invalid JSON",
          description: result.error?.message || "Please fix the JSON errors",
          variant: "destructive"
        });
      }
    } else {
      const isValid = validateYaml(input);
      setIsInputValid(isValid);
      if (isValid) {
        toast({
          title: "Valid YAML",
          description: "Your YAML appears to be valid"
        });
      } else {
        toast({
          title: "Invalid YAML",
          description: "Please check your YAML formatting",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <div className="mx-auto">
          <section className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DevxTools YAML ⇄ JSON Converter
            </h1>
            <p className="text-muted-foreground mb-4 text-lg">
              {mode === 'json2yaml' ? 'Convert JSON to YAML format' : 'Convert YAML to JSON format'}
            </p>
            
            <HeaderAd />
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-9">
              <div className="flex justify-end mb-4">
                <Button 
                  onClick={toggleMode}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  {mode === 'json2yaml' ? 'Switch to YAML → JSON' : 'Switch to JSON → YAML'}
                </Button>
              </div>
              
              <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[500px] rounded-lg border"
              >
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="p-4 h-full">
                    <h3 className="text-lg font-medium mb-3">
                      {mode === 'json2yaml' ? 'JSON Input' : 'YAML Input'}
                    </h3>
                    <JsonInput 
                      value={input} 
                      onChange={setInput} 
                      placeholder={mode === 'json2yaml' ? "Enter JSON here..." : "Enter YAML here..."}
                    />
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="p-4 h-full flex flex-col">
                    <h3 className="text-lg font-medium mb-3">
                      {mode === 'json2yaml' ? 'YAML Output' : 'JSON Output'}
                    </h3>
                    <div className="mb-4">
                      <ActionButtons 
                        onPrettyPrint={convertContent}
                        onValidate={validateInput}
                        outputJson={output}
                        isJsonValid={true}
                        primaryButtonText={mode === 'json2yaml' ? 'Convert to YAML' : 'Convert to JSON'}
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <OutputDisplay 
                        json={output} 
                        plainText={mode === 'json2yaml'} 
                        yaml={mode === 'json2yaml'}
                      />
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
                  <li className="hover:text-foreground transition-colors font-medium text-foreground">
                    <Link to="/yaml-json">YAML ⇄ JSON</Link>
                  </li>
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/json-query">JSON Query</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <section className="mt-8 bg-card rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">About YAML ⇄ JSON Converter</h2>
            <p className="mb-4 text-base">
              This tool allows you to convert between JSON and YAML formats. YAML (YAML Ain't Markup Language)
              is a human-friendly data serialization standard that is often used for configuration files.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Convert</h3>
                <p className="text-muted-foreground">
                  Transform between JSON and YAML formats with a single click.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Validate</h3>
                <p className="text-muted-foreground">
                  Ensure your input is valid before converting.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Simplify</h3>
                <p className="text-muted-foreground">
                  Work with YAML's human-readable format or JSON's structured format as needed.
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

export default YamlJsonConverter;
