
import { BadgeDollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const HeaderAd = () => {
  return (
    <Card className="w-full overflow-hidden border-dashed border-primary/30 hover:border-primary/70 transition-all duration-300 bg-muted/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BadgeDollarSign className="h-5 w-5 text-primary" />
            <span className="font-medium text-sm text-primary">Premium DevxTools</span>
          </div>
          <button className="text-xs bg-primary/90 hover:bg-primary text-white px-3 py-1 rounded-full transition-colors">
            Try Now
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Upgrade to access advanced features: API access, JSON Schema validation, and more.
        </p>
      </CardContent>
    </Card>
  );
};

export default HeaderAd;
