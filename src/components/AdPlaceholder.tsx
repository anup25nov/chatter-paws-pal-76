
import { Sparkles } from 'lucide-react';

const AdPlaceholder = () => {
  return (
    <div className="w-full h-auto py-4 px-6 border border-dashed border-primary/30 rounded-lg flex items-center justify-center bg-muted/20 text-muted-foreground text-sm my-8 hover:border-primary/50 transition-colors">
      <div className="flex flex-col md:flex-row items-center gap-2 py-2">
        <Sparkles className="h-4 w-4 text-primary opacity-70" />
        <p className="text-center">Your sponsorship could appear here – <span className="text-primary/80 font-medium">Become a sponsor</span></p>
      </div>
    </div>
  );
};

export default AdPlaceholder;
