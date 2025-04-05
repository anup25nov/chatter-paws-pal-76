
import { Button } from '@/components/ui/button';
import { Copy, Check, FileCode, AlertCircle, FileText } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface ActionButtonsProps {
  onPrettyPrint: () => void;
  onValidate: () => void;
  onMinify: () => void;
  outputJson: string;
  isJsonValid: boolean;
  primaryButtonText?: string;
}

const ActionButtons = ({ 
  onPrettyPrint, 
  onValidate, 
  onMinify, 
  outputJson,
  isJsonValid,
  primaryButtonText = "Pretty Print"
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
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={onPrettyPrint}
        disabled={!isJsonValid}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <FileCode className="mr-2 h-4 w-4" />
        {primaryButtonText}
      </Button>
      
      <Button
        onClick={onValidate}
        variant="outline"
        className="bg-card hover:bg-muted"
      >
        <AlertCircle className="mr-2 h-4 w-4" />
        Validate
      </Button>
      
      {primaryButtonText !== "Minify JSON" && (
        <Button
          onClick={onMinify}
          disabled={!isJsonValid}
          variant="outline"
          className="bg-card hover:bg-muted"
        >
          <FileText className="mr-2 h-4 w-4" />
          Minify
        </Button>
      )}
      
      <Button
        onClick={copyToClipboard}
        disabled={!outputJson}
        variant={copied ? "default" : "secondary"}
        className={copied ? "bg-success hover:bg-success/90 text-success-foreground" : ""}
      >
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </>
        )}
      </Button>
    </div>
  );
};

export default ActionButtons;
