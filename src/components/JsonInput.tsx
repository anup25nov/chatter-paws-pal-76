
import { ChangeEvent } from 'react';

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const JsonInput = ({ value, onChange, placeholder = 'Paste your JSON here...', error }: JsonInputProps) => {
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          Paste your JSON here
        </label>
      </div>
      
      <div className="relative">
        <textarea
          className={`json-input dark:bg-card/50 w-full min-h-[250px] ${error ? 'border-destructive' : ''}`}
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
