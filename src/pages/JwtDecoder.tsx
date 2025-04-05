
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import JsonInput from '@/components/JsonInput';
import OutputDisplay from '@/components/OutputDisplay';
import ActionButtons from '@/components/ActionButtons';
import HeaderAd from '@/components/ads/HeaderAd';
import SidebarAd from '@/components/ads/SidebarAd';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const JwtDecoder = () => {
  const [inputToken, setInputToken] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);
  const { toast } = useToast();

  // Simple JWT validation - checks format only
  const validateToken = (token: string): boolean => {
    const parts = token.split('.');
    return parts.length === 3;
  };

  // Decode JWT without verification
  const decodeJwt = (token: string) => {
    try {
      if (!validateToken(token)) {
        toast({
          title: "Invalid JWT Format",
          description: "Token should have three parts separated by dots",
          variant: "destructive"
        });
        return null;
      }

      const parts = token.split('.');
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      
      // Format result
      const result = {
        header,
        payload,
        signature: parts[2]
      };
      
      return JSON.stringify(result, null, 2);
    } catch (error) {
      toast({
        title: "Decoding Failed",
        description: "Could not decode the JWT token",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleInputChange = (value: string) => {
    setInputToken(value);
    setIsTokenValid(validateToken(value.trim()));
  };

  const handleDecode = () => {
    const decodedToken = decodeJwt(inputToken.trim());
    if (decodedToken) {
      setOutputJson(decodedToken);
      toast({
        title: "JWT Decoded",
        description: "Token decoded successfully"
      });
    } else {
      setOutputJson('');
    }
  };

  const handleValidate = () => {
    if (validateToken(inputToken.trim())) {
      toast({
        title: "Valid JWT Format",
        description: "The token has the correct format (note: signature is not verified)"
      });
    } else {
      toast({
        title: "Invalid JWT Format",
        description: "Token should have three parts separated by dots",
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
              DevxTools JWT Decoder
            </h1>
            <p className="text-muted-foreground mb-4 text-lg">
              Decode and inspect JSON Web Tokens (JWT)
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
                    <h3 className="text-lg font-medium mb-3">Input JWT</h3>
                    <JsonInput value={inputToken} onChange={handleInputChange} placeholder="Paste your JWT token here..." />
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="p-4 h-full flex flex-col">
                    <h3 className="text-lg font-medium mb-3">Result</h3>
                    <div className="mb-4">
                      <ActionButtons 
                        onPrettyPrint={handleDecode}
                        onValidate={handleValidate}
                        outputJson={outputJson}
                        isJsonValid={isTokenValid}
                        primaryButtonText="Decode Token"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <OutputDisplay json={outputJson} jwt={true} />
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
                  <li className="hover:text-foreground transition-colors font-medium text-foreground">
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
                  <li className="hover:text-foreground transition-colors">
                    <Link to="/json-query">JSON Query</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <section className="mt-8 bg-card rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">About JWT Decoder</h2>
            <p className="mb-4 text-base">
              JSON Web Tokens (JWT) are an open standard for securely transmitting information between parties as a JSON object. 
              This tool helps you decode JWT tokens to inspect their header and payload contents.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Decode</h3>
                <p className="text-muted-foreground">
                  Extract and view the header and payload from any JWT token.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Validate</h3>
                <p className="text-muted-foreground">
                  Verify that your token has the correct JWT format structure.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Inspect</h3>
                <p className="text-muted-foreground">
                  Examine claims, expiration dates, and other token information.
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

export default JwtDecoder;
