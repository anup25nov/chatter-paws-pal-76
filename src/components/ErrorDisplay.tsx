
import { AlertCircle, Code } from 'lucide-react';
import { JsonError } from '@/utils/jsonUtils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ErrorDisplayProps {
  error: JsonError | undefined;
  jsonInput?: string;
}

const ErrorDisplay = ({ error, jsonInput }: ErrorDisplayProps) => {
  if (!error) return null;

  const errorTypeLabel = {
    syntax: 'Syntax Error',
    value: 'Value Error',
    key: 'Key Error',
    structure: 'Structure Error',
    unknown: 'Unknown Error'
  }[error.errorType || 'unknown'];

  const getErrorTip = () => {
    switch(error.errorType) {
      case 'syntax':
        return "Check for mismatched quotes, brackets or missing commas.";
      case 'value':
        return "Make sure values are valid (numbers without quotes, strings with quotes).";
      case 'key':
        if (error.message.includes('Duplicate key')) {
          return "JSON objects cannot have duplicate keys. Each key must be unique within its object.";
        }
        return "Check for duplicate or invalid object keys.";
      case 'structure':
        return "Your JSON structure is incomplete. Check for missing closing brackets or braces.";
      default:
        return "Double-check your JSON syntax against the specification.";
    }
  };

  return (
    <Alert variant="destructive" className="mb-4 animate-fade-in">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="font-medium mb-1">{errorTypeLabel}</AlertTitle>
      <AlertDescription>
        <div className="flex flex-col gap-1.5">
          <p>{error.message}</p>
          
          {(error.line || error.column) && (
            <p className="text-sm opacity-90 mt-1">
              {error.line && `Line: ${error.line}`}
              {error.line && error.column && `, `}
              {error.column && `Column: ${error.column}`}
            </p>
          )}
          
          <div className="mt-2 p-2 bg-destructive/20 rounded text-sm border border-destructive/30 font-mono">
            <Code className="h-4 w-4 inline-block mr-2 opacity-70" />
            <span className="opacity-80">{getErrorTip()}</span>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;
