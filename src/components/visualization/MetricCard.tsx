import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AnimatedNumber = ({
  value,
  isPercentage = false
}: {
  value: number | null;
  isPercentage?: boolean;
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const duration = 200; // Animation duration in milliseconds
  const steps = 20; // Number of steps in the animation

  useEffect(() => {
    if (value === null || displayValue === null) {
      setDisplayValue(value);
      return;
    }

    const difference = value - displayValue;
    const increment = difference / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep === steps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(prev => {
          if (prev === null) return value;
          return prev + increment;
        });
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  if (displayValue === null) return <span>...</span>;

  return (
    <span className="transition-all duration-75">
      {isPercentage
        ? `${displayValue.toFixed(2).replace('.', ',')}%`
        : displayValue.toLocaleString('nl-NL', {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
          })}
    </span>
  );
};

export const MetricCard = ({
  title,
  description,
  value,
  isPercentage = false,
  className = '' // Add className prop
}: {
  title: string;
  description: string;
  value: number | null;
  isPercentage?: boolean;
  className?: string;
}) => (
  <Card className={`flex flex-col ${className}`}> {/* Add flex-col and pass through className */}
    <CardHeader className="flex-grow">
      <CardTitle className="text-xl">{title}</CardTitle>
      <CardDescription className="text-sm text-gray-500">{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-shrink-0">
      <p className="text-3xl font-bold" style={{ color: 'rgb(0,153,168)' }}>
        <AnimatedNumber value={value} isPercentage={isPercentage} />
      </p>
    </CardContent>
  </Card>
);

export default MetricCard;