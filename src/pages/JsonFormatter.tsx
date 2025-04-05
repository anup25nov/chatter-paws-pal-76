
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
import { motion } from 'framer-motion';

/**
 * JsonFormatter Component
 * 
 * Main page for formatting, validating, and minifying JSON.
 * Features vertical layout with output above input.
 */
const JsonFormatter = () => {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [error, setError] = useState<JsonError | undefined>(undefined);
  const [warningError, setWarningError] = useState<JsonError | undefined>(undefined);
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
      setWarningError(undefined);
    }
  }, [inputJson]);

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
              DevxTools JSON Formatter
            </h1>
            <p className="text-muted-foreground mb-4 text-lg">
              Format, validate, and minify your JSON with a professional developer tool
            </p>
            
            <HeaderAd />
          </motion.section>
          
          <motion.div className="grid grid-cols-1 md:grid-cols-12 gap-6" variants={itemVariants}>
            <div className="md:col-span-9">
              <ResizablePanelGroup
                direction="vertical"
                className="min-h-[500px] rounded-lg border shadow-md"
              >
                {/* Result panel (moved to top) */}
                <ResizablePanel defaultSize={50} minSize={30}>
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
              
              <motion.div 
                className="bg-card rounded-lg p-4 border border-border mb-6 card-hover"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <h3 className="text-base font-medium mb-3">Developer Tools</h3>
                <ul className="text-base space-y-3 text-muted-foreground">
                  <li className="hover:text-foreground transition-colors font-medium text-foreground">
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
                  <li className="hover:text-foreground transition-colors">
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
            <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">About JSON Formatter</h2>
            <p className="mb-4 text-base">
              DevxTools provides professional-grade utilities for developers. Our JSON formatter helps you 
              quickly beautify, validate, and optimize your JSON data with a clean interface.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
              <motion.div 
                className="bg-muted/30 p-4 rounded-md hover:bg-muted/50 transition-colors"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <h3 className="font-medium mb-2">Format</h3>
                <p className="text-muted-foreground">
                  Make your JSON beautiful with proper indentation and formatting.
                </p>
              </motion.div>
              <motion.div 
                className="bg-muted/30 p-4 rounded-md hover:bg-muted/50 transition-colors"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <h3 className="font-medium mb-2">Validate</h3>
                <p className="text-muted-foreground">
                  Check if your JSON is valid and get helpful error messages.
                </p>
              </motion.div>
              <motion.div 
                className="bg-muted/30 p-4 rounded-md hover:bg-muted/50 transition-colors"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <h3 className="font-medium mb-2">Minify</h3>
                <p className="text-muted-foreground">
                  Remove all whitespace to make your JSON as small as possible.
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

export default JsonFormatter;
