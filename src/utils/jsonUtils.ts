
export interface JsonError {
  message: string;
  line?: number;
  column?: number;
  errorType?: 'syntax' | 'value' | 'key' | 'structure' | 'unknown';
  originalError?: any;
}

export interface JsonResult {
  success: boolean;
  result?: string;
  error?: JsonError;
}

/**
 * Formats JSON string with proper indentation
 */
export const prettyPrintJson = (json: string, forceContinue: boolean = false): JsonResult => {
  // Check for duplicate keys first - but don't block if forceContinue is true
  const duplicateKeyCheck = checkForDuplicateKeys(json);
  if (!duplicateKeyCheck.success && !forceContinue) {
    return duplicateKeyCheck;
  }

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
export const validateJson = (json: string, ignoreDuplicateKeys: boolean = false): JsonResult => {
  if (!json.trim()) {
    return { 
      success: false, 
      error: {
        message: 'Empty input. Please enter some JSON to validate.',
        errorType: 'syntax'
      }
    };
  }
  
  // Check for duplicate keys first - but don't block if ignoreDuplicateKeys is true
  if (!ignoreDuplicateKeys) {
    const duplicateKeyCheck = checkForDuplicateKeys(json);
    if (!duplicateKeyCheck.success) {
      return duplicateKeyCheck;
    }
  }
  
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
export const minifyJson = (json: string, forceContinue: boolean = false): JsonResult => {
  // Check for duplicate keys first - but don't block if forceContinue is true
  const duplicateKeyCheck = checkForDuplicateKeys(json);
  if (!duplicateKeyCheck.success && !forceContinue) {
    return duplicateKeyCheck;
  }

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
 * Check for duplicate keys in a JSON string
 */
export const checkForDuplicateKeys = (json: string): JsonResult => {
  if (!json.trim()) {
    return { success: true };
  }
  
  try {
    // This regex pattern looks for key patterns in JSON
    const keyPattern = /"([^"]+)"\s*:/g;
    let match;
    const keys: { [key: string]: number[] } = {};
    let lineCount = 1;
    let lastNewlinePos = 0;
    
    // Count lines to give accurate line numbers in errors
    for (let i = 0; i < json.length; i++) {
      if (json[i] === '\n') {
        lineCount++;
        lastNewlinePos = i;
      }
    }
    
    // Find all keys and their positions
    while ((match = keyPattern.exec(json)) !== null) {
      const key = match[1];
      const position = match.index;
      
      // Calculate line number for this key
      let keyLine = 1;
      let lastNL = 0;
      for (let i = 0; i < position; i++) {
        if (json[i] === '\n') {
          keyLine++;
          lastNL = i;
        }
      }
      
      if (!keys[key]) {
        keys[key] = [keyLine];
      } else {
        keys[key].push(keyLine);
      }
    }
    
    // Check for duplicate keys
    for (const key in keys) {
      if (keys[key].length > 1) {
        return { 
          success: false, 
          error: {
            message: `Duplicate key "${key}" found at lines ${keys[key].join(', ')}`,
            line: keys[key][1], // Point to the second occurrence
            errorType: 'key',
          }
        };
      }
    }
    
    return { success: true };
  } catch (error) {
    // If our duplicate key detection throws an error, we'll fall back to standard parsing
    return { success: true };
  }
};

/**
 * Parses error message from JSON.parse to extract line and column info
 * and categorizes the error type
 */
const parseJsonError = (error: any): JsonError => {
  const errorMessage = error.toString();
  const position = errorMessage.match(/position\s+(\d+)/);
  
  let line = undefined;
  let column = undefined;
  let errorType: JsonError['errorType'] = 'unknown';

  if (position && position[1]) {
    const pos = parseInt(position[1], 10);
    // Calculate line and column more precisely by analyzing the input
    // This is a simple heuristic that could be improved
    line = Math.floor(pos / 20) + 1;
    column = pos % 20 + 1;
  }

  // Determine error type based on error message patterns
  if (/Unexpected token/.test(errorMessage)) {
    errorType = 'syntax';
  } else if (/Unexpected number|Unexpected string|Expecting/.test(errorMessage)) {
    errorType = 'value';
  } else if (/Duplicate key/.test(errorMessage)) {
    errorType = 'key';
  } else if (/Unexpected end of JSON|Unexpected end of input/.test(errorMessage)) {
    errorType = 'structure';
  }

  // Create a more user-friendly error message
  let userFriendlyMessage = errorMessage.replace(/^SyntaxError: /, '');
  
  // Add more context based on the error type
  if (errorType === 'syntax' && /position/.test(errorMessage)) {
    userFriendlyMessage = `Syntax error: ${userFriendlyMessage}. Check for missing quotes, commas, or brackets.`;
  } else if (errorType === 'value' && /position/.test(errorMessage)) {
    userFriendlyMessage = `Value error: ${userFriendlyMessage}. Make sure all values are properly formatted (strings in quotes, numbers without quotes).`;
  }

  return {
    message: userFriendlyMessage,
    line,
    column,
    errorType,
    originalError: error
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

/**
 * Extracts problematic line from JSON string based on error position
 */
export const extractErrorContext = (json: string, position: number): string | null => {
  if (!json || position === undefined || position < 0) {
    return null;
  }
  
  try {
    // Find the start of the line
    let lineStart = position;
    while (lineStart > 0 && json[lineStart - 1] !== '\n') {
      lineStart--;
    }
    
    // Find the end of the line
    let lineEnd = position;
    while (lineEnd < json.length && json[lineEnd] !== '\n') {
      lineEnd++;
    }
    
    return json.substring(lineStart, lineEnd);
  } catch (e) {
    return null;
  }
};
