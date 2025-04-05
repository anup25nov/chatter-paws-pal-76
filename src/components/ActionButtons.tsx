
import { Button } from '@/components/ui/button';
import { Copy, Check, FileCode, AlertCircle, FileText } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

/**
 * ActionButtons Component
 * 
 * Provides a set of action buttons for JSON operations with animations and responsive layout.
 * Supports vertical and horizontal layouts, and includes copy-to-clipboard functionality.
 *
 * @param {Object} props - Component properties
 * @param {Function} props.onPrettyPrint - Handler for pretty print button click
 * @param {Function} props.onValidate - Handler for validation button click
 * @param {Function} [props.onMinify] - Optional handler for minify button click
 * @param {string} props.outputJson - The JSON string to copy to clipboard
 * @param {boolean} props.isJsonValid - Whether the JSON is valid (affects button states)
 * @param {string} [props.primaryButtonText="Pretty Print"] - Text for the primary action button
 * @param {boolean} [props.vertical=false] - Whether to display buttons vertically
 * @returns {JSX.Element} The rendered ActionButtons component
 */
const ActionButtons = ({ 
  onPrettyPrint, 
  onValidate, 
  onMinify, 
  outputJson,
  isJsonValid,
  primaryButtonText = "Pretty Print",
  vertical = false
}: ActionButtonsProps) => {
  // State to track if content has been copied to clipboard
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  /**
   * Copies the output JSON to clipboard
   * Shows appropriate toast notifications for success or failure
   */
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
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Check browser permissions",
        variant: "destructive"
      });
    }
  };

  // Animation variants for button interactions
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.98 }
  };

  return (
    <div className={`flex ${vertical ? 'flex-col' : 'flex-wrap'} gap-3`}>
      {/* Primary action button (Pretty Print or custom) */}
      <motion.div
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
      >
        <Button
          onClick={onPrettyPrint}
          disabled={!isJsonValid}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md"
          size={vertical ? "default" : "lg"}
        >
          <FileCode className={`${vertical ? 'mr-1.5 h-4 w-4' : 'mr-2 h-5 w-5'}`} />
          {primaryButtonText}
        </Button>
      </motion.div>
      
      {/* Validate button */}
      <motion.div
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
      >
        <Button
          onClick={onValidate}
          variant="outline"
          className="bg-card hover:bg-muted font-medium border-primary/20 shadow-md"
          size={vertical ? "default" : "lg"}
        >
          <AlertCircle className={`${vertical ? 'mr-1.5 h-4 w-4' : 'mr-2 h-5 w-5'}`} />
          Validate
        </Button>
      </motion.div>
      
      {/* Conditional Minify button */}
      {onMinify && primaryButtonText !== "Minify JSON" && (
        <motion.div
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            onClick={onMinify}
            disabled={!isJsonValid}
            variant="outline"
            className="bg-card hover:bg-muted font-medium border-primary/20 shadow-md"
            size={vertical ? "default" : "lg"}
          >
            <FileText className={`${vertical ? 'mr-1.5 h-4 w-4' : 'mr-2 h-5 w-5'}`} />
            Minify
          </Button>
        </motion.div>
      )}
      
      {/* Copy to clipboard button */}
      <motion.div
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
      >
        <Button
          onClick={copyToClipboard}
          disabled={!outputJson}
          variant={copied ? "default" : "secondary"}
          className={copied ? "bg-success hover:bg-success/90 text-success-foreground font-medium shadow-md" : "font-medium shadow-md"}
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
      </motion.div>
    </div>
  );
};

/**
 * TypeScript interface for ActionButtons props
 */
interface ActionButtonsProps {
  onPrettyPrint: () => void;
  onValidate: () => void;
  onMinify?: () => void;
  outputJson: string;
  isJsonValid: boolean;
  primaryButtonText?: string;
  vertical?: boolean;
}

export default ActionButtons;
