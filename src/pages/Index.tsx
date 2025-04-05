
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import JsonInput from '@/components/JsonInput';
import ActionButtons from '@/components/ActionButtons';
import OutputDisplay from '@/components/OutputDisplay';
import ErrorDisplay from '@/components/ErrorDisplay';
import AdPlaceholder from '@/components/AdPlaceholder';
import Footer from '@/components/Footer';
import { prettyPrintJson, validateJson, minifyJson, JsonError, JsonResult, checkForDuplicateKeys } from '@/utils/jsonUtils';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [error, setError] = useState<JsonError | undefined>(undefined);
  const [warningError, setWarningError] = useState<JsonError | undefined>(undefined);
  const [isJsonValid, setIsJsonValid] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check JSON validity whenever input changes
    if (inputJson.trim()) {
      // First check for duplicate keys which we'll treat as warnings
      const duplicateKeyCheck = checkForDuplicateKeys(inputJson);
      if (!duplicateKeyCheck.success) {
        setWarningError(duplicateKeyCheck.error);
      } else {
        setWarningError(undefined);
      }
      
      // Then do the standard validation
      const result = validateJson(inputJson);
      setIsJsonValid(result.success);
      
      // Silently set error on input change, but don't show toast
      if (!result.success && !duplicateKeyCheck.success) {
        setError(result.error);
        setWarningError(undefined); // Don't show warning if we have a full error
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

  const handlePrettyPrint = () => {
    // We still allow pretty printing with duplicate keys
    const result = prettyPrintJson(inputJson, true);
    handleJsonResult(result);
  };

  const handleValidate = () => {
    // First check for duplicate keys
    const duplicateKeyCheck = checkForDuplicateKeys(inputJson);
    if (!duplicateKeyCheck.success) {
      setWarningError(duplicateKeyCheck.error);
      toast({
        title: "Validation Warning",
        description: "Found duplicate keys in your JSON. This may cause problems.",
        variant: "default"
      });
    }
    
    // Then do standard validation
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
      setWarningError(undefined); // Don't show warnings with full errors
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
    // We still allow minifying with duplicate keys
    const result = minifyJson(inputJson, true);
    handleJsonResult(result);
  };

  const handleJsonResult = (result: JsonResult) => {
    if (result.success) {
      setOutputJson(result.result || '');
      
      // Check if we have duplicate keys warnings
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
        <div className="max-w-5xl mx-auto">
          <section className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your JSON's BFF 💖
            </h1>
            <p className="text-muted-foreground mb-6">
              Paste your JSON, we'll make it pretty (and tell you if it's not valid)
            </p>
            
            <JsonInput value={inputJson} onChange={setInputJson} />
          </section>
          
          <section className="mb-6">
            <ActionButtons 
              onPrettyPrint={handlePrettyPrint}
              onValidate={handleValidate}
              onMinify={handleMinify}
              outputJson={outputJson}
              isJsonValid={isJsonValid}
            />
          </section>
          
          {warningError && (
            <ErrorDisplay error={warningError} jsonInput={inputJson} warningOnly={true} />
          )}
          
          {error && (
            <ErrorDisplay error={error} jsonInput={inputJson} />
          )}
          
          <section>
            <OutputDisplay json={outputJson} hasError={!!error} />
          </section>
          
          <AdPlaceholder />
          
          <section className="mt-8 bg-card rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">About JsonBae</h2>
            <p className="mb-4">
              JsonBae is your JSON's best friend forever! We help developers quickly format, validate, 
              and manipulate JSON data with a simple, clean interface.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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

export default Index;
