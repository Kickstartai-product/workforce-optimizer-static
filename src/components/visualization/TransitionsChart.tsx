import { ResponsiveSankey } from '@nivo/sankey';
import type { TransformedResult } from '@/types/results';
import { ResponsiveContainer } from 'recharts';

interface TransitionsChartProps {
  data: TransformedResult;
}

const CustomTooltip = ({ link }: { link: any }) => (
  <div className="bg-white border border-gray-200 rounded p-2 shadow-lg">
    <span className="text-m font-medium text-gray-900">
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

export const TransitionsChart = ({ data }: TransitionsChartProps) => {
  const getSankeyData = (topN = 10) => {
    // Create nodes and links with ID-safe transformations
    const nodes: Array<{ id: string, name?: string }> = [];
    const links: Array<{ source: string, target: string, value: number }> = [];

    // Process top transitions
    const transitions = data.topTransitions.map(t => ({
      source: formatJobName(t.sourceJob),
      target: formatJobName(t.targetJob) + " ", // Keep the space at the end of target
      value: t.amount
    }));

    if (!transitions.length) {
      return { nodes: [{ id: "No Transitions" }], links: [] };
    }

    const topTransitions = transitions
      .sort((a, b) => b.value - a.value)
      .slice(0, topN);

    // Function to add a node and ensure unique IDs
    const addNode = (name: string) => {
      // Create an ID-safe version by replacing spaces with hyphens
      const id = name.replace(/ /g, "-");
      
      // Only add if node doesn't exist
      if (!nodes.some(node => node.id === id)) {
        nodes.push({ 
          id, 
          name  // Preserve original name for display
        });
      }
      return id;
    };

    // Process links
    topTransitions.forEach(transition => {
      const sourceId = addNode(transition.source);
      const targetId = addNode(transition.target);

      // Add link
      links.push({
        source: sourceId,
        target: targetId,
        value: transition.value
      });
    });

    return { nodes, links };
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveSankey
          data={getSankeyData(10)}
          margin={{ top: 40, right: 300, bottom: 40, left: 300 }}
          align="center"
          layout="horizontal"
          colors={[
            'rgb(71,159,220)',   // More vibrant blue
            'rgb(214,139,103)',  // Brighter terracotta
            'rgb(133,164,114)',  // More vivid sage green
            'rgb(192,118,162)',  // More pronounced mauve
            'rgb(98,142,162)',   // More saturated blue-gray
            'rgb(167,143,107)',  // Warmer bronze
            'rgb(124,151,137)',  // Slightly brighter slate green
            'rgb(178,126,139)',  // More lively dusty rose
            'rgb(104,130,150)',  // Slightly more saturated steel blue
            'rgb(142,137,109)'   // More defined olive khaki
          ]}
          nodeOpacity={0.9}
          nodeThickness={20}
          nodeInnerPadding={3}
          nodeSpacing={18}
          nodeBorderWidth={0}
          linkOpacity={0.4}
          linkHoverOpacity={0.7}
          linkContract={3}
          enableLinkGradient={true}
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={12}
          label={node => node.name || node.id}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
          linkTooltip={CustomTooltip}
        />
      </div>
    </ResponsiveContainer>
  );
};