
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
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

const Base64Tool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const { toast } = useToast();

  const encode = () => {
    try {
      const encoded = btoa(input);
      setOutput(encoded);
      toast({
        title: "Encoded Successfully",
        description: "Text encoded to Base64"
      });
    } catch (error) {
      toast({
        title: "Encoding Failed",
        description: "Could not encode the input text. Make sure it contains valid characters.",
        variant: "destructive"
      });
    }
  };

  const decode = () => {
    try {
      const decoded = atob(input);
      setOutput(decoded);
      toast({
        title: "Decoded Successfully",
        description: "Base64 decoded to text"
      });
    } catch (error) {
      toast({
        title: "Decoding Failed",
        description: "Could not decode the input. Make sure it's valid Base64.",
        variant: "destructive"
      });
    }
  };

  const toggleMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
  };

  const handleAction = () => {
    if (mode === 'encode') {
      encode();
    } else {
      decode();
    }
  };

  const validateInput = () => {
    if (mode === 'decode') {
      try {
        atob(input);
        toast({
          title: "Valid Base64",
          description: "The input is valid Base64"
        });
      } catch (error) {
        toast({
          title: "Invalid Base64",
          description: "The input is not valid Base64",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Valid Input",
        description: "Any text can be encoded to Base64"
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
              DevxTools Base64
            </h1>
            <p className="text-muted-foreground mb-4 text-lg">
              {mode === 'encode' ? 'Encode text to Base64' : 'Decode Base64 to text'}
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
                  <ArrowUpDown className="h-4 w-4" />
                  {mode === 'encode' ? 'Switch to Decode' : 'Switch to Encode'}
                </Button>
              </div>
              
              <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[500px] rounded-lg border"
              >
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="p-4 h-full">
                    <h3 className="text-lg font-medium mb-3">
                      {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
                    </h3>
                    <JsonInput 
                      value={input} 
                      onChange={setInput} 
                      placeholder={mode === 'encode' ? "Enter text to encode..." : "Enter Base64 to decode..."}
                    />
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="p-4 h-full flex flex-col">
                    <h3 className="text-lg font-medium mb-3">
                      {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
                    </h3>
                    <div className="mb-4">
                      <ActionButtons 
                        onPrettyPrint={handleAction}
                        onValidate={validateInput}
                        outputJson={output}
                        isJsonValid={true}
                        primaryButtonText={mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <OutputDisplay json={output} plainText={true} base64={true} />
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
                  <li className="hover:text-foreground transition-colors font-medium text-foreground">
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
            <h2 className="text-xl font-semibold mb-4">About Base64</h2>
            <p className="mb-4 text-base">
              Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format.
              It's commonly used when there is a need to encode binary data, especially when that data needs to be stored and transferred over media that are designed to deal with text.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Encode</h3>
                <p className="text-muted-foreground">
                  Convert plain text to Base64 for safer transmission.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Decode</h3>
                <p className="text-muted-foreground">
                  Convert Base64 back to its original text form.
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Use Cases</h3>
                <p className="text-muted-foreground">
                  Data URLs, email attachments, API authentication tokens.
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

export default Base64Tool;
