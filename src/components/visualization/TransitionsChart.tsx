import { ResponsiveSankey } from '@nivo/sankey';
import type { TransformedResult } from '@/types/results';
import { ResponsiveContainer } from 'recharts';
import { useScreenSize } from '@/hooks/useScreenSize';


interface TransitionsChartProps {
  data: TransformedResult;
}

export const TransitionsChart = ({ data }: TransitionsChartProps) => {
    const { isMobile } = useScreenSize();
    
    const getSankeyData = (topN = 10) => {
      const transitions = data.topTransitions.map(t => ({
        source: t.sourceJob,
        target: t.targetJob + " ",
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
            margin={isMobile 
              ? { top: 20, right: 20, bottom: 20, left: 20 }
              : { top: 40, right: 300, bottom: 40, left: 300 }
            }
            align="center"
            layout="horizontal"
            colors={{ scheme: 'category10' }}
            nodeOpacity={0.9}
            nodeThickness={isMobile ? 15 : 20}
            nodeInnerPadding={3}
            nodeSpacing={isMobile ? 16 : 24}
            nodeBorderWidth={0}
            linkOpacity={0.4}
            linkHoverOpacity={0.7}
            linkContract={3}
            enableLinkGradient={true}
            labelPosition="outside"
            labelOrientation="horizontal"
            labelPadding={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
            enableLabels={!isMobile} // Hide labels on mobile
          />
        </div>
      </ResponsiveContainer>
    );
  };