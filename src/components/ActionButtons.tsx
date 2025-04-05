
import { Button } from '@/components/ui/button';
import { Copy, Check, FileCode, AlertCircle, FileText } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ActionButtonsProps {
  onPrettyPrint: () => void;
  onValidate: () => void;
  onMinify?: () => void;
  outputJson: string;
  isJsonValid: boolean;
  primaryButtonText?: string;
  vertical?: boolean;
}

const ActionButtons = ({ 
  onPrettyPrint, 
  onValidate, 
  onMinify, 
  outputJson,
  isJsonValid,
  primaryButtonText = "Pretty Print",
  vertical = false
}: ActionButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    if (!outputJson) {
      toast({
        title: "Nothing to copy",
        description: "Generate some output first",
        variant: "destructive"
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(outputJson);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Output copied to clipboard"
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Check browser permissions",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`flex ${vertical ? 'flex-col' : 'flex-wrap'} gap-3`}>
      <Button
        onClick={onPrettyPrint}
        disabled={!isJsonValid}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        size={vertical ? "default" : "lg"}
      >
        <FileCode className={`${vertical ? 'mr-1.5 h-4 w-4' : 'mr-2 h-5 w-5'}`} />
        {primaryButtonText}
      </Button>
      
      <Button
        onClick={onValidate}
        variant="outline"
        className="bg-card hover:bg-muted font-medium"
        size={vertical ? "default" : "lg"}
      >
        <AlertCircle className={`${vertical ? 'mr-1.5 h-4 w-4' : 'mr-2 h-5 w-5'}`} />
        Validate
      </Button>
      
      {onMinify && primaryButtonText !== "Minify JSON" && (
        <Button
          onClick={onMinify}
          disabled={!isJsonValid}
          variant="outline"
          className="bg-card hover:bg-muted font-medium"
          size={vertical ? "default" : "lg"}
        >
          <FileText className={`${vertical ? 'mr-1.5 h-4 w-4' : 'mr-2 h-5 w-5'}`} />
          Minify
        </Button>
      )}
      
      <Button
        onClick={copyToClipboard}
        disabled={!outputJson}
        variant={copied ? "default" : "secondary"}
        className={copied ? "bg-success hover:bg-success/90 text-success-foreground font-medium" : "font-medium"}
        size={vertical ? "default" : "lg"}
      >
        {copied ? (
          <>
            <Check className={`${vertical ? 'mr-1.5 h-4 w-4' : 'mr-2 h-5 w-5'}`} />
            Copied!
          </>
        ) : (
          <>
            <Copy className={`${vertical ? 'mr-1.5 h-4 w-4' : 'mr-2 h-5 w-5'}`} />
            Copy
          </>
        )}
      </Button>
    </div>
  );
};

export default ActionButtons;
