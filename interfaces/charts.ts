import { CommonComponentProps, ChartDataPoint } from "./base";

// Base chart interfaces
export interface ChartData {
  name: string;
  value: number;
  [key: string]: unknown;
}

export interface BaseChartProps extends CommonComponentProps {
  title?: string;
  subtitle?: string;
  colors?: string[];
  height?: number;
  width?: number;
}

// Line Chart
export interface LineChartProps extends BaseChartProps {
  data: Array<{
    month: string;
    sales: number;
    revenue: number;
    profit: number;
  }>;
  showGrid?: boolean;
  showLegend?: boolean;
}

// Bar Chart
export interface BarChartData {
  name: string;
  sales: number;
  revenue: number;
}

export interface BarChartProps extends BaseChartProps {
  data: BarChartData[];
  orientation?: "horizontal" | "vertical";
  stacked?: boolean;
}

// Pie Chart
export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface PieChartProps extends BaseChartProps {
  data: PieChartData[];
  showLabels?: boolean;
  showPercentages?: boolean;
}

// Area Chart
export interface AreaChartData {
  name: string;
  value: number;
  fill: string;
}

export interface AreaChartProps extends BaseChartProps {
  data: AreaChartData[];
  fillOpacity?: number;
  showGrid?: boolean;
}

// Radar Chart
export interface RadarChartData {
  subject: string;
  value: number;
  fullMark: number;
}

export interface RadarChartProps extends BaseChartProps {
  data: RadarChartData[];
  showGrid?: boolean;
  showLabels?: boolean;
}

// Scatter Chart
export interface ScatterChartData {
  x: number;
  y: number;
  z: number;
  category: string;
}

export interface ScatterChartProps extends BaseChartProps {
  data: ScatterChartData[];
  showGrid?: boolean;
  showTrendLine?: boolean;
}

// Bubble Chart
export interface BubbleChartData {
  x: number;
  y: number;
  size: number;
  category: string;
  label?: string;
}

export interface BubbleChartProps extends BaseChartProps {
  data: BubbleChartData[];
  showGrid?: boolean;
  showLabels?: boolean;
}

// Chord Chart
export interface ChordChartData {
  from: string;
  to: string;
  size: number;
}

export interface ChordChartProps extends BaseChartProps {
  data: ChordChartData[];
  showLabels?: boolean;
}

// Sankey Chart
export interface SankeyChartData {
  from: string;
  to: string;
  size: number;
}

export interface SankeyChartProps extends BaseChartProps {
  data: SankeyChartData[];
  showLabels?: boolean;
}

// Waves Chart
export interface WaveData {
  id: string;
  color: string;
  path: string;
}

export interface WavesChartProps extends BaseChartProps {
  data: WaveData[];
  showGrid?: boolean;
  showLabels?: boolean;
}

export interface WavesChartLogicProps {
  data?: WaveData[];
  title?: string;
}

// Contribution Graph
export interface ContributionData {
  date: string;
  value: number;
}

export interface ValueRange {
  min: number;
  max: number;
  color: string;
  label: string;
}

export interface ContributionGraphProps extends BaseChartProps {
  data: ContributionData[];
  valueRanges?: ValueRange[];
  showLegend?: boolean;
}

export interface ContributionGraphLogicProps {
  title?: string;
}

// Timeline Chart
export interface TimelineItem {
  year: string;
  color: "yellow" | "red" | "blue" | "teal" | "purple";
  title: string;
  desc: string;
  progress?: number;
}

export interface TimelineChartProps extends BaseChartProps {
  data: TimelineItem[];
  orientation?: "horizontal" | "vertical";
}

// Chart state and actions
export interface ChartState {
  data: ChartDataPoint[];
  title: string;
  loading: boolean;
  error: string | null;
}

export interface ChartActions {
  formatValue: (value: number) => string;
  formatTooltip: (value: number, name: string) => [string, string];
  updateData: (data: ChartDataPoint[]) => void;
  setTitle: (title: string) => void;
}

// Chart canvas props
export interface ChartCanvasProps extends CommonComponentProps {
  width: number;
  height: number;
  onMouseDown?: (e: React.MouseEvent<Element>) => void;
  onMouseMove?: (e: React.MouseEvent<Element>) => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  onClick?: (e: React.MouseEvent<Element>) => void;
}
