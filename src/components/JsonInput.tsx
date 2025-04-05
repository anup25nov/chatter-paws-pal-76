
import { ChangeEvent } from 'react';
import { Textarea } from "@/components/ui/textarea";

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

/**
 * JsonInput Component
 * 
 * Provides a text area for entering JSON with error handling.
 * Styled for dark mode.
 */
const JsonInput = ({ value, onChange, placeholder = 'Paste your JSON here...', error }: JsonInputProps) => {
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          Enter or paste your JSON here
        </label>
      </div>
      
      <div className="relative">
        <Textarea
          className={`json-input w-full min-h-[250px] bg-card/50 border ${
            error ? 'border-destructive' : 'border-border'
          } resize-y font-mono text-sm focus-visible:ring-primary`}
          value={value}
          onChange={handleTextChange}
          placeholder={placeholder}
        />
        {error && <p className="text-destructive text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default JsonInput;
