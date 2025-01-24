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

const formatJobName = (job: string) => {
  return job
    .replace(/\n\-/g, "") // Remove newline-hyphen combinations
    .replace(/\\\-\n/g, "") // Remove escaped-hyphen-newline combinations
    .replace(/\n/g, " "); // Replace remaining newlines with spaces
};

export const MobileTransitionsChart = ({ data }: TransitionsChartProps) => {
  const getSankeyData = (topN = 10) => {
    const transitions = data.topTransitions.map(t => ({
      source: formatJobName(t.sourceJob),
      // Format and then shorten job titles over 20 characters for mobile
      target: (() => {
        const formattedJob = formatJobName(t.targetJob);
        return formattedJob.length > 20 
          ? formattedJob.substring(0, 20) + "..." + " "
          : formattedJob + " ";
      })(),
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
          data={getSankeyData(10)}
          margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
          align="center"
          layout="horizontal"
          colors={{ scheme: 'category10' }}
          nodeOpacity={0.9}
          nodeThickness={15}
          nodeInnerPadding={2}
          nodeSpacing={12}
          nodeBorderWidth={0}
          linkOpacity={0.4}
          linkHoverOpacity={0.7}
          linkContract={2}
          enableLinkGradient={true}
          labelPosition="inside"
          labelOrientation="horizontal"
          labelPadding={6}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
          linkTooltip={CustomTooltip}
          theme={{
            labels: {
              text: {
                fontSize: 8,
                fontWeight: 'normal'
              }
            },
            tooltip: {
              container: {
                fontSize: '10px'
              }
            }
          }}
        />
      </div>
    </ResponsiveContainer>
  );
};