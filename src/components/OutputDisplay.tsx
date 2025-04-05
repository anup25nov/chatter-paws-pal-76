
import { useMemo } from 'react';
import { syntaxHighlightJson } from '@/utils/jsonUtils';
import { FileX2 } from 'lucide-react';

interface OutputDisplayProps {
  json: string;
  hasError?: boolean;
  plainText?: boolean;
  xml?: boolean;
  yaml?: boolean;
  jwt?: boolean;
  base64?: boolean;
  diff?: boolean;
}

const OutputDisplay = ({ 
  json, 
  hasError = false, 
  plainText = false, 
  xml = false,
  yaml = false,
  jwt = false,
  base64 = false,
  diff = false
}: OutputDisplayProps) => {
  const highlightedContent = useMemo(() => {
    if (plainText || xml || yaml || jwt || base64 || diff) {
      return json.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;');
    }
    return syntaxHighlightJson(json);
  }, [json, plainText, xml, yaml, jwt, base64, diff]);

  if (hasError) {
    return (
      <div className="json-output flex items-center justify-center text-muted-foreground h-48 bg-muted/30 rounded-md">
        <div className="text-center">
          <FileX2 className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p className="text-base">Please fix the errors to see the formatted output</p>
        </div>
      </div>
    );
  }

  if (!json) {
    return (
      <div className="json-output flex items-center justify-center text-muted-foreground h-48 bg-muted/30 rounded-md">
        <p className="text-base">Your formatted output will appear here</p>
      </div>
    );
  }

  let additionalClass = '';
  if (xml) {
    additionalClass = 'xml-content';
  } else if (yaml) {
    additionalClass = 'yaml-content';
  } else if (jwt) {
    additionalClass = 'jwt-content';
  } else if (base64) {
    additionalClass = 'base64-content';
  } else if (diff) {
    additionalClass = 'diff-content';
  } else if (plainText) {
    additionalClass = 'text-content';
  } else {
    additionalClass = 'json-content';
  }

  return (
    <div className="json-output overflow-auto max-h-[500px] border border-border rounded-md p-4 bg-muted/20">
      <pre 
        className={`w-full text-base ${additionalClass} whitespace-pre-wrap`}
        dangerouslySetInnerHTML={{ __html: highlightedContent }}
      />
    </div>
  );
};

export default OutputDisplay;
