import { useState, useEffect } from 'react';
import { Monitor } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useWindowSize, MOBILE_BREAKPOINT } from '@/hooks/useWindowSize';

const ScreenAlert = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const windowWidth = useWindowSize();

  useEffect(() => {
    // Start fade out after 3 seconds
    const fadeTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    // Remove from DOM after animation completes
    const removeTimeout = setTimeout(() => {
      setShouldRender(false);
    }, 3700); // 3000ms delay + 700ms animation

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(removeTimeout);
    };
  }, []);

  // Don't render anything during SSR or on desktop
  if (!windowWidth || windowWidth >= MOBILE_BREAKPOINT || !shouldRender) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9999] p-2">
      <Alert 
        className={`
          mx-auto max-w-lg bg-white/95 backdrop-blur-sm border-cyan-600 p-3
          ${isVisible ? 'animate-in fade-in slide-in-from-bottom' : 'animate-out fade-out slide-out-to-bottom'}
          duration-700
        `}
        onClick={() => setIsVisible(false)}
      >
        <div className="flex gap-2 items-start">
          <Monitor className="h-4 w-4 text-cyan-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <AlertTitle className="text-cyan-600 text-sm font-medium">
              Schermgrootte melding
            </AlertTitle>
            <AlertDescription className="text-xs text-gray-600">
              Deze website komt het beste tot zijn recht op een groter scherm (laptop, tablet of desktop).
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  );
};

export default ScreenAlert;