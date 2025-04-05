
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
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={onPrettyPrint}
        disabled={!isJsonValid}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        size="lg"
      >
        <FileCode className="mr-2 h-5 w-5" />
        {primaryButtonText}
      </Button>
      
      <Button
        onClick={onValidate}
        variant="outline"
        className="bg-card hover:bg-muted font-medium"
        size="lg"
      >
        <AlertCircle className="mr-2 h-5 w-5" />
        Validate
      </Button>
      
      {onMinify && primaryButtonText !== "Minify JSON" && (
        <Button
          onClick={onMinify}
          disabled={!isJsonValid}
          variant="outline"
          className="bg-card hover:bg-muted font-medium"
          size="lg"
        >
          <FileText className="mr-2 h-5 w-5" />
          Minify
        </Button>
      )}
      
      <Button
        onClick={copyToClipboard}
        disabled={!outputJson}
        variant={copied ? "default" : "secondary"}
        className={copied ? "bg-success hover:bg-success/90 text-success-foreground font-medium" : "font-medium"}
        size="lg"
      >
        {copied ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="mr-2 h-5 w-5" />
            Copy
          </>
        )}
      </Button>
    </div>
  );
};

export default ActionButtons;
