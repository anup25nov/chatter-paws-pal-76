
import { Award } from 'lucide-react';

const SidebarAd = () => {
  return (
    <div className="w-full rounded-lg border border-dashed border-primary/30 hover:border-primary/70 transition-colors bg-gradient-to-r from-transparent to-primary/5 p-4 my-6">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="bg-primary/10 rounded-full p-2">
          <Award className="h-5 w-5 text-primary" />
        </div>
        <h4 className="font-medium text-sm">DevxTools Pro Suite</h4>
        <p className="text-xs text-muted-foreground">
          Get access to our full suite of developer tools.
          JSON, CSV, XML, YAML and more in one subscription.
        </p>
        <button className="mt-2 text-xs bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-md transition-colors w-full">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default SidebarAd;
