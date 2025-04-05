
import { useState, ChangeEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
}

const JsonInput = ({ value, onChange }: JsonInputProps) => {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JSON file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onChange(content);
      toast({
        title: "File uploaded",
        description: `${file.name} has been loaded`
      });
    };
    reader.readAsText(file);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          Paste JSON or drag and drop a file
        </label>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClickUpload}
          className="text-xs flex items-center gap-1"
        >
          <Upload className="h-3 w-3" />
          Upload
        </Button>
      </div>
      
      <div 
        className={`relative ${dragActive ? 'ring-2 ring-primary' : ''}`}
        onDragEnter={handleDrag}
      >
        <textarea
          className="json-input dark:bg-card/50"
          value={value}
          onChange={handleTextChange}
          placeholder='Paste your JSON here or drop a file...'
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        />
        
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".json,application/json" 
          onChange={handleFileInput}
          className="hidden"
        />
        
        {dragActive && (
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg border-2 border-dashed border-primary z-10"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <p className="text-lg font-medium">Drop your JSON file here</p>
              <p className="text-sm text-muted-foreground">Only .json files are supported</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonInput;
