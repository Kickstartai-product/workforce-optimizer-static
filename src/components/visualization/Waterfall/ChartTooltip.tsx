import { formatNumber } from './utils';

interface TooltipProps {
  active?: boolean;
  payload?: any[];
}

export const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload?.length || !Array.isArray(payload)) {
    return null;
  }

  try {
    const firstPayload = payload[0]?.payload;
    if (!firstPayload?.displayValue || !firstPayload?.name) {
      return null;
    }

    const value = firstPayload.displayValue;
    // Strip the footnote number from the name if present
    const name = firstPayload.name.split('|||')[0];
    const isZero = value === 0 || Math.abs(value) < Number.EPSILON;

    return (
      <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 text-xs">
        <p className="font-medium text-gray-900">{name}</p>
        <p>
          <span className={
            isZero ? "text-gray-500" :
              value > 0 ? "text-emerald-600" : "text-red-600"
          }>
            {formatNumber(value)}
          </span>
        </p>
      </div>
    );
  } catch (error) {
    console.error('Error in tooltip:', error);
    return null;
  }
};