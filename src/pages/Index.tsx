
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
import { BadgeDollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

/**
 * Index Component
 * 
 * Main landing page that serves as the entry point and JSON formatter tool.
 * Detects current route and displays appropriate title.
 */
const Index = () => {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [error, setError] = useState<JsonError | undefined>(undefined);
  const [warningError, setWarningError] = useState<JsonError | undefined>(undefined);
  const [isJsonValid, setIsJsonValid] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  // Validate JSON whenever input changes
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

  /**
   * Returns the appropriate page title based on current route
   */
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

  /**
   * Handle Pretty Print action
   * Formats JSON with proper indentation
   */
  const handlePrettyPrint = () => {
    const result = prettyPrintJson(inputJson, true);
    handleJsonResult(result);
  };

  /**
   * Handle Validate action
   * Checks if JSON is valid and shows appropriate toast
   */
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

  /**
   * Handle Minify action
   * Removes all whitespace from JSON
   */
  const handleMinify = () => {
    const result = minifyJson(inputJson, true);
    handleJsonResult(result);
  };

  /**
   * Process JSON operation results
   * Updates UI based on operation success/failure
   */
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

  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col dark">
      <Toaster />
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <motion.div 
          className="mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.section className="mb-8" variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-purple-400 bg-clip-text text-transparent">
              {getPageTitle()}
            </h1>
            <p className="text-muted-foreground mb-6 text-lg max-w-3xl mx-auto">
              Professional developer tools to work with JSON and related formats
            </p>
            
            <HeaderAd />
          </motion.section>
          
          <motion.div className="grid grid-cols-1 md:grid-cols-12 gap-6" variants={itemVariants}>
            <div className="md:col-span-9">
              <ResizablePanelGroup
                direction="vertical"
                className="min-h-[500px] rounded-lg border shadow-lg"
              >
                {/* Result panel (moved to top) */}
                <ResizablePanel defaultSize={43} minSize={30}>
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
                
                <ResizableHandle>
                  <div className="flex flex-col items-center justify-center w-full">
                    <div className="py-4">
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
                
                {/* Input panel (moved to bottom) */}
                <ResizablePanel defaultSize={43} minSize={30}>
                  <div className="p-4 h-full">
                    <h3 className="text-lg font-medium mb-3">Input</h3>
                    <JsonInput value={inputJson} onChange={setInputJson} />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
            
            <div className="md:col-span-3">
              <SidebarAd />
              
              <motion.div 
                className="bg-card rounded-lg p-4 border border-border mb-6 card-hover"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <h3 className="text-base font-medium mb-3">Developer Tools</h3>
                <ul className="text-base space-y-3 text-muted-foreground">
                  <li className={`hover:text-foreground transition-colors ${location.pathname === '/json-formatter' || location.pathname === '/' ? 'font-medium text-foreground' : ''}`}>
                    <Link to="/json-formatter" className="hover-lift block py-1">JSON Formatter</Link>
                  </li>
                  <li className={`hover:text-foreground transition-colors ${location.pathname === '/jwt-decoder' ? 'font-medium text-foreground' : ''}`}>
                    <Link to="/jwt-decoder" className="hover-lift block py-1">JWT Decoder</Link>
                  </li>
                  <li className={`hover:text-foreground transition-colors ${location.pathname === '/base64' ? 'font-medium text-foreground' : ''}`}>
                    <Link to="/base64" className="hover-lift block py-1">Base64</Link>
                  </li>
                  <li className={`hover:text-foreground transition-colors ${location.pathname === '/json-to-xml' ? 'font-medium text-foreground' : ''}`}>
                    <Link to="/json-to-xml" className="hover-lift block py-1">JSON to XML</Link>
                  </li>
                  <li className={`hover:text-foreground transition-colors ${location.pathname === '/json-diff' ? 'font-medium text-foreground' : ''}`}>
                    <Link to="/json-diff" className="hover-lift block py-1">JSON Diff Viewer</Link>
                  </li>
                  <li className={`hover:text-foreground transition-colors ${location.pathname === '/yaml-json' ? 'font-medium text-foreground' : ''}`}>
                    <Link to="/yaml-json" className="hover-lift block py-1">YAML ⇄ JSON</Link>
                  </li>
                  <li className={`hover:text-foreground transition-colors ${location.pathname === '/json-query' ? 'font-medium text-foreground' : ''}`}>
                    <Link to="/json-query" className="hover-lift block py-1">JSON Query</Link>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Additional Ad above About section */}
          <motion.div 
            className="mt-8 mb-6" 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Card className="w-full overflow-hidden border-dashed border-primary/30 hover:border-primary/70 transition-all duration-300 bg-muted/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BadgeDollarSign className="h-5 w-5 text-primary animate-pulse-slow" />
                    <span className="font-medium text-sm text-primary">Premium DevxTools Pro Suite</span>
                  </div>
                  <motion.button 
                    className="text-xs bg-primary/90 hover:bg-primary text-white px-3 py-1 rounded-full transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Pro Access
                  </motion.button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Unlock advanced features: JSON Schema validation, API access, diff viewer, team sharing, and more.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.section 
            className="mt-4 bg-card rounded-lg p-6 border border-border shadow-sm"
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">About DevxTools</h2>
            <p className="mb-4 text-base">
              DevxTools provides professional-grade utilities for developers. Our tools help you 
              quickly work with JSON, JWT tokens, Base64, YAML, and more with a clean interface.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
              <motion.div 
                className="bg-muted/30 p-4 rounded-md hover:bg-muted/50 transition-colors"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <h3 className="font-medium mb-2">Format & Validate</h3>
                <p className="text-muted-foreground">
                  Make your data beautiful with proper formatting and validation.
                </p>
              </motion.div>
              <motion.div 
                className="bg-muted/30 p-4 rounded-md hover:bg-muted/50 transition-colors"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <h3 className="font-medium mb-2">Convert</h3>
                <p className="text-muted-foreground">
                  Transform between JSON, XML, YAML, and other formats easily.
                </p>
              </motion.div>
              <motion.div 
                className="bg-muted/30 p-4 rounded-md hover:bg-muted/50 transition-colors"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <h3 className="font-medium mb-2">Analyze</h3>
                <p className="text-muted-foreground">
                  Compare differences and query your data with powerful tools.
                </p>
              </motion.div>
            </div>
          </motion.section>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
