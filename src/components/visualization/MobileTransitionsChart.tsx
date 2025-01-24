import { ResponsiveSankey } from '@nivo/sankey';
import type { TransformedResult } from '@/types/results';
import { ResponsiveContainer } from 'recharts';

interface TransitionsChartProps {
  data: TransformedResult;
}

const CustomTooltip = ({ link }: { link: any }) => (
    <div className="bg-white border border-gray-200 rounded p-2 shadow-lg">
      <span className="text-sm font-medium text-gray-900">
        <strong>{link.value}</strong> transities
      </span>
    </div>
  );

export const MobileTransitionsChart = ({ data }: TransitionsChartProps) => {
  const getSankeyData = (topN = 10) => {
    const transitions = data.topTransitions.map(t => ({
      source: t.sourceJob,
      // Shorten job titles over 20 characters for mobile
      target: t.targetJob.length > 20 
        ? t.targetJob.substring(0, 20) + "..." + " "
        : t.targetJob + " ",
      value: t.amount
    }));

    if (!transitions.length) {
      return { nodes: [{ id: "No Transitions" }], links: [] };
    }

    const topTransitions = transitions
      .sort((a, b) => b.value - a.value)
      .slice(0, topN);

    const uniqueJobs = new Set([
      ...topTransitions.map(t => t.source),
      ...topTransitions.map(t => t.target)
    ]);

    return {
      nodes: Array.from(uniqueJobs).map(id => ({ id })),
      links: topTransitions
    };
  };


  return (
    <ResponsiveContainer width="100%" height="100%">
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveSankey
          data={getSankeyData(10)} // Reduced to 8 transitions for mobile
          margin={{ top: 20, right: 0, bottom: 20, left: 0 }} // Reduced margins
          align="center"
          layout="horizontal"
          colors={{ scheme: 'category10' }}
          nodeOpacity={0.9}
          nodeThickness={15} // Reduced thickness
          nodeInnerPadding={2} // Reduced padding
          nodeSpacing={12} // Reduced spacing
          nodeBorderWidth={0}
          linkOpacity={0.4}
          linkHoverOpacity={0.7}
          linkContract={2} // Reduced contract
          enableLinkGradient={true}
          labelPosition="inside"
          labelOrientation="horizontal"
          labelPadding={6} // Reduced padding
          labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
          linkTooltip={CustomTooltip}
          theme={{
            labels: {
              text: {
                fontSize: 8, // Smaller font size
                fontWeight: 'normal'
              }
            },
            tooltip: {
              container: {
                fontSize: '10px' // Smaller tooltip text
              }
            }
          }}
        />
      </div>
    </ResponsiveContainer>
  );
};