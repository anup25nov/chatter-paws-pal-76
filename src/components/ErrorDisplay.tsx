
import { AlertCircle } from 'lucide-react';
import { JsonError } from '@/utils/jsonUtils';

interface ErrorDisplayProps {
  error: JsonError | undefined;
}

const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  if (!error) return null;

  return (
    <div className="bg-destructive/10 border border-destructive rounded-md p-4 text-sm mb-4 animate-fade-in">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5" />
        <div>
          <p className="font-medium text-destructive">{error.message}</p>
          {(error.line || error.column) && (
            <p className="text-muted-foreground mt-1">
              {error.line && `Line: ${error.line}`}
              {error.line && error.column && `, `}
              {error.column && `Column: ${error.column}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
