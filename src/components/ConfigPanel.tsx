
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Square, Maximize, Eye, EyeOff } from 'lucide-react';
import { ShedConfig } from '../pages/Index';

interface ConfigPanelProps {
  config: ShedConfig;
  setConfig: (config: ShedConfig) => void;
}

export const ConfigPanel = ({ config, setConfig }: ConfigPanelProps) => {
  const sizeOptions = [
    { value: 'small', label: 'Small', icon: Square, dims: '3×2×2m', price: '$1,200' },
    { value: 'medium', label: 'Medium', icon: Home, dims: '4×3×3m', price: '$1,800' },
    { value: 'large', label: 'Large', icon: Maximize, dims: '5×4×3.5m', price: '$2,500' }
  ] as const;

  const windowOptions = [
    { value: 'none', label: 'No Windows', icon: EyeOff, price: '$0' },
    { value: 'single', label: 'Single Window', icon: Eye, price: '+$150' },
    { value: 'double', label: 'Double Windows', icon: Eye, price: '+$300' },
    { value: 'triple', label: 'Triple Windows', icon: Eye, price: '+$450' }
  ] as const;

  const getBasePrice = () => {
    switch (config.size) {
      case 'small': return 1200;
      case 'medium': return 1800;
      case 'large': return 2500;
    }
  };

  const getWindowPrice = () => {
    switch (config.windows) {
      case 'none': return 0;
      case 'single': return 150;
      case 'double': return 300;
      case 'triple': return 450;
    }
  };

  const totalPrice = getBasePrice() + getWindowPrice();

  return (
    <div className="absolute bottom-6 left-6 right-6 z-10">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-amber-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-amber-900 flex items-center justify-between">
              Customize Your Shed
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-amber-100 text-amber-800">
                ${totalPrice.toLocaleString()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Size</h3>
              <div className="grid grid-cols-3 gap-3">
                {sizeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.value}
                      variant={config.size === option.value ? "default" : "outline"}
                      className={`h-auto p-4 flex flex-col items-center gap-2 transition-all duration-200 ${
                        config.size === option.value 
                          ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600" 
                          : "hover:bg-amber-50 hover:border-amber-300"
                      }`}
                      onClick={() => setConfig({ ...config, size: option.value })}
                    >
                      <Icon className="h-6 w-6" />
                      <div className="text-center">
                        <div className="font-semibold">{option.label}</div>
                        <div className="text-sm opacity-80">{option.dims}</div>
                        <div className="text-sm font-medium">{option.price}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Window Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Windows</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {windowOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.value}
                      variant={config.windows === option.value ? "default" : "outline"}
                      className={`h-auto p-4 flex flex-col items-center gap-2 transition-all duration-200 ${
                        config.windows === option.value 
                          ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600" 
                          : "hover:bg-amber-50 hover:border-amber-300"
                      }`}
                      onClick={() => setConfig({ ...config, windows: option.value })}
                    >
                      <Icon className="h-5 w-5" />
                      <div className="text-center">
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs font-medium">{option.price}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3">
                Add to Cart - ${totalPrice.toLocaleString()}
              </Button>
              <Button variant="outline" className="px-6 py-3 border-amber-300 hover:bg-amber-50">
                Get Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
