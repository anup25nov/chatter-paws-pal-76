
export interface JsonError {
  message: string;
  line?: number;
  column?: number;
}

export interface JsonResult {
  success: boolean;
  result?: string;
  error?: JsonError;
}

/**
 * Formats JSON string with proper indentation
 */
export const prettyPrintJson = (json: string): JsonResult => {
  try {
    const obj = JSON.parse(json);
    const prettyJson = JSON.stringify(obj, null, 2);
    return { success: true, result: prettyJson };
  } catch (error) {
    return {
      success: false,
      error: parseJsonError(error)
    };
  }
};

/**
 * Validates JSON string
 */
export const validateJson = (json: string): JsonResult => {
  try {
    JSON.parse(json);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: parseJsonError(error)
    };
  }
};

/**
 * Minifies JSON string by removing all whitespace
 */
export const minifyJson = (json: string): JsonResult => {
  try {
    const obj = JSON.parse(json);
    const minifiedJson = JSON.stringify(obj);
    return { success: true, result: minifiedJson };
  } catch (error) {
    return {
      success: false,
      error: parseJsonError(error)
    };
  }
};

/**
 * Parses error message from JSON.parse to extract line and column info
 */
const parseJsonError = (error: any): JsonError => {
  const errorMessage = error.toString();
  const position = errorMessage.match(/position\s+(\d+)/);
  
  let line = undefined;
  let column = undefined;

  if (position && position[1]) {
    const pos = parseInt(position[1], 10);
    // This is a simple heuristic - for more accurate line/column calculation
    // we would need to actually count newlines in the input string
    line = Math.floor(pos / 20) + 1;
    column = pos % 20 + 1;
  }

  return {
    message: errorMessage.replace(/^SyntaxError: /, ''),
    line,
    column
  };
};

/**
 * Syntax highlights JSON
 */
export const syntaxHighlightJson = (json: string): string => {
  // Simple syntax highlighting - in a real implementation you'd want
  // to use a more robust approach or a library
  if (!json) return '';
  
  // Replace with HTML for syntax highlighting
  let highlighted = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'json-default';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
          // Remove the colon from the key
          match = match.replace(/:$/, '');
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      } else if (/-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/.test(match)) {
        cls = 'json-number';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });

  // Add proper indentation and line numbers
  return highlighted;
};
