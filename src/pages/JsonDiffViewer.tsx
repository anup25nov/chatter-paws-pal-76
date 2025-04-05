
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import JsonInput from '@/components/JsonInput';
import OutputDisplay from '@/components/OutputDisplay';
import HeaderAd from '@/components/ads/HeaderAd';
import SidebarAd from '@/components/ads/SidebarAd';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { validateJson, JsonError } from '@/utils/jsonUtils';
import { useToast } from '@/hooks/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Diff, Search } from 'lucide-react';

const JsonDiffViewer = () => {
  const [leftJson, setLeftJson] = useState('');
  const [rightJson, setRightJson] = useState('');
  const [diffOutput, setDiffOutput] = useState('');
  const [leftError, setLeftError] = useState<JsonError | undefined>(undefined);
  const [rightError, setRightError] = useState<JsonError | undefined>(undefined);
  const [isLeftValid, setIsLeftValid] = useState(false);
  const [isRightValid, setIsRightValid] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    validateJsonInput(leftJson, 'left');
  }, [leftJson]);

  useEffect(() => {
    validateJsonInput(rightJson, 'right');
  }, [rightJson]);

  const validateJsonInput = (json: string, side: 'left' | 'right') => {
    if (!json.trim()) {
      if (side === 'left') {
        setIsLeftValid(false);
        setLeftError(undefined);
      } else {
        setIsRightValid(false);
        setRightError(undefined);
      }
      return;
    }
    
    const result = validateJson(json);
    if (side === 'left') {
      setIsLeftValid(result.success);
      setLeftError(result.success ? undefined : result.error);
    } else {
      setIsRightValid(result.success);
      setRightError(result.success ? undefined : result.error);
    }
  };

  const compareDiff = () => {
    if (!isLeftValid || !isRightValid) {
      toast({
        title: "Validation Error",
        description: "Please fix JSON errors before comparing",
        variant: "destructive"
      });
      return;
    }

    try {
      const leftObj = JSON.parse(leftJson);
      const rightObj = JSON.parse(rightJson);
      
      // Compare objects recursively
      const differences = findDifferences(leftObj, rightObj);
      
      if (differences.length === 0) {
        setDiffOutput("No differences found. The JSON objects are identical.");
        toast({
          title: "Comparison Complete",
          description: "The JSON objects are identical"
        });
      } else {
        setDiffOutput(JSON.stringify(differences, null, 2));
        toast({
          title: "Comparison Complete",
          description: `Found ${differences.length} differences`
        });
      }
    } catch (error) {
      toast({
        title: "Comparison Error",
        description: "An error occurred while comparing the JSON objects",
        variant: "destructive"
      });
    }
  };

  const findDifferences = (left: any, right: any, path = '') => {
    const differences: any[] = [];

    // Helper function to add difference
    const addDiff = (path: string, type: string, leftValue: any, rightValue: any) => {
      differences.push({
        path,
        type,
        left: leftValue,
        right: rightValue
      });
    };

    // Handle different types
    if (typeof left !== typeof right) {
      addDiff(path, 'type_mismatch', typeof left, typeof right);
      return differences;
    }

    // Handle array comparison
    if (Array.isArray(left) && Array.isArray(right)) {
      // Check length differences
      if (left.length !== right.length) {
        addDiff(path, 'array_length', left.length, right.length);
      }

      // Check contents
      const minLength = Math.min(left.length, right.length);
      for (let i = 0; i < minLength; i++) {
        const itemPath = path ? `${path}[${i}]` : `[${i}]`;
        const itemDiffs = findDifferences(left[i], right[i], itemPath);
        differences.push(...itemDiffs);
      }
      
      return differences;
    }

    // Handle object comparison
    if (typeof left === 'object' && left !== null && typeof right === 'object' && right !== null) {
      // Check for missing keys
      const leftKeys = Object.keys(left);
      const rightKeys = Object.keys(right);
      
      // Keys in left but not in right
      leftKeys.forEach(key => {
        if (!right.hasOwnProperty(key)) {
          const keyPath = path ? `${path}.${key}` : key;
          addDiff(keyPath, 'missing_in_right', left[key], undefined);
        }
      });
      
      // Keys in right but not in left
      rightKeys.forEach(key => {
        if (!left.hasOwnProperty(key)) {
          const keyPath = path ? `${path}.${key}` : key;
          addDiff(keyPath, 'missing_in_left', undefined, right[key]);
        }
      });
      
      // Compare common keys
      leftKeys.filter(key => rightKeys.includes(key)).forEach(key => {
        const keyPath = path ? `${path}.${key}` : key;
        const keyDiffs = findDifferences(left[key], right[key], keyPath);
        differences.push(...keyDiffs);
      });
      
      return differences;
    }

    // Simple value comparison
    if (left !== right) {
      addDiff(path, 'value_mismatch', left, right);
    }

    return differences;
  };

  return (
    <div className="min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <div className="mx-auto">
          <section className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DevxTools JSON Diff Viewer
            </h1>
            <p className="text-muted-foreground mb-4 text-lg">
              Compare two JSON objects and find differences
            </p>
            
            <HeaderAd />
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-9">
              <div className="mb-4 flex justify-center">
                <Button 
                  onClick={compareDiff}
                  disabled={!isLeftValid || !isRightValid}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  size="lg"
                >
                  <Diff className="mr-2 h-5 w-5" />
                  Compare JSON
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3">Left JSON</h3>
                  <JsonInput 
                    value={leftJson} 
                    onChange={setLeftJson} 
                    placeholder="Enter first JSON here..."
                    error={leftError ? leftError.message : undefined}
                  />
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3">Right JSON</h3>
                  <JsonInput 
                    value={rightJson} 
                    onChange={setRightJson} 
                    placeholder="Enter second JSON here..."
                    error={rightError ? rightError.message : undefined}
                  />
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Difference Results</h3>
                <OutputDisplay 
                  json={diffOutput || "Results will appear here after comparison"} 
                  hasError={false} 
                  diff={true}
                />
              </div>
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
                  <li className="hover:text-foreground transition-colors font-medium text-foreground">
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
          
          <section className="mt-8 bg-card rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">About JSON Diff Viewer</h2>
            <p className="mb-4 text-base">
              The JSON Diff Viewer helps you compare two JSON objects and identify all their differences.
              It's useful for spotting changes between API responses, config files, or any JSON data.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Compare</h3>
                <p className="text-muted-foreground">
                  Find differences between two JSON structures quickly.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Analyze</h3>
                <p className="text-muted-foreground">
                  See exactly what changed, was added, or removed.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Debug</h3>
                <p className="text-muted-foreground">
                  Troubleshoot inconsistencies between expected and actual JSON data.
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

export default JsonDiffViewer;
