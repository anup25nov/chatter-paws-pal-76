
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import JsonInput from '@/components/JsonInput';
import ActionButtons from '@/components/ActionButtons';
import OutputDisplay from '@/components/OutputDisplay';
import ErrorDisplay from '@/components/ErrorDisplay';
import AdPlaceholder from '@/components/AdPlaceholder';
import Footer from '@/components/Footer';
import { prettyPrintJson, validateJson, minifyJson, JsonError, JsonResult } from '@/utils/jsonUtils';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [error, setError] = useState<JsonError | undefined>(undefined);
  const [isJsonValid, setIsJsonValid] = useState(false);

  useEffect(() => {
    // Check JSON validity whenever input changes
    if (inputJson.trim()) {
      const result = validateJson(inputJson);
      setIsJsonValid(result.success);
    } else {
      setIsJsonValid(false);
      setError(undefined);
    }
  }, [inputJson]);

  const handlePrettyPrint = () => {
    const result = prettyPrintJson(inputJson);
    handleJsonResult(result);
  };

  const handleValidate = () => {
    const result = validateJson(inputJson);
    if (result.success) {
      setError(undefined);
      setOutputJson('JSON is valid! 👍');
    } else {
      setError(result.error);
      setOutputJson('');
    }
  };

  const handleMinify = () => {
    const result = minifyJson(inputJson);
    handleJsonResult(result);
  };

  const handleJsonResult = (result: JsonResult) => {
    if (result.success) {
      setOutputJson(result.result || '');
      setError(undefined);
    } else {
      setOutputJson('');
      setError(result.error);
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
          
          <ErrorDisplay error={error} />
          
          <section>
            <OutputDisplay json={outputJson} />
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
