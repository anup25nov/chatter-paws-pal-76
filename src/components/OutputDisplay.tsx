
import { useMemo } from 'react';
import { syntaxHighlightJson } from '@/utils/jsonUtils';
import { FileX2 } from 'lucide-react';

interface OutputDisplayProps {
  json: string;
  hasError?: boolean;
}

const OutputDisplay = ({ json, hasError = false }: OutputDisplayProps) => {
  const highlightedJson = useMemo(() => {
    return syntaxHighlightJson(json);
  }, [json]);

  if (hasError) {
    return (
      <div className="json-output flex items-center justify-center text-muted-foreground h-48 bg-muted/30 rounded-md">
        <div className="text-center">
          <FileX2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Please fix the JSON errors to see the formatted output</p>
        </div>
      </div>
    );
  }

  if (!json) {
    return (
      <div className="json-output flex items-center justify-center text-muted-foreground h-48 bg-muted/30 rounded-md">
        <p className="text-sm">Your formatted JSON will appear here</p>
      </div>
    );
  }

  return (
    <div className="json-output overflow-auto max-h-[500px] border border-border rounded-md p-4 bg-muted/20">
      <pre 
        className="w-full text-sm json-content"
        dangerouslySetInnerHTML={{ __html: highlightedJson }}
      />
    </div>
  );
};

export default OutputDisplay;
