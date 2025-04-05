
import { useMemo } from 'react';
import { syntaxHighlightJson } from '@/utils/jsonUtils';

interface OutputDisplayProps {
  json: string;
}

const OutputDisplay = ({ json }: OutputDisplayProps) => {
  const highlightedJson = useMemo(() => {
    return syntaxHighlightJson(json);
  }, [json]);

  if (!json) {
    return (
      <div className="json-output flex items-center justify-center text-muted-foreground">
        <p className="text-sm">Your formatted JSON will appear here</p>
      </div>
    );
  }

  return (
    <div className="json-output">
      <pre 
        className="w-full text-sm json-content"
        dangerouslySetInnerHTML={{ __html: highlightedJson }}
      />
    </div>
  );
};

export default OutputDisplay;
