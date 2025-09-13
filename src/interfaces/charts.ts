import { CommonComponentProps, ChartDataPoint } from "./base";

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

export interface CustomBubbleChartProps extends BaseChartProps {
  data: BubbleChartData[];
  title?: string;
  subtitle?: string;
  isMobile?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
}

export interface BubbleChartStats {
  total: number;
  avgSize: number;
  avgGrowth: number;
  avgMarketCap: number;
}

export interface BubbleChartControlsProps {
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  animationSpeed: number;
  setAnimationSpeed: (v: number) => void;
  isZoomedOut: boolean;
  setIsZoomedOut: (v: boolean) => void;
  isSmallScreen?: boolean;
  getCategoryHex: (category: string) => string;
  buttonColors: {
    background: string;
    selectedBackground: string;
    border: string;
    selectedBorder: string;
    text: string;
  };
}

export interface BubbleMetricsPanelProps {
  stats: BubbleChartStats;
}

export interface BubbleChartLegendProps {
  categories: string[];
  getCategoryHex: (category: string) => string;
}

export interface BubblePoint3D {
  x: number;
  y: number;
  z: number;
  size: number;
  category: string;
  label?: string;
}

export type BubbleTooltipData = BubblePoint3D;

export interface BubbleTooltipProps {
  tooltip: { x: number; y: number; data: BubbleTooltipData } | null;
  getCategoryHex: (category: string) => string;
}

export interface BubbleSceneCanvasProps {
  data: BubblePoint3D[];
  isZoomedOut: boolean;
  showParticles: boolean;
  animationSpeed: number;
  onHover: (t: { x: number; y: number; data: BubblePoint3D } | null) => void;
  getCategoryColor: (category: string) => string; // returns css color string
}

export interface BubbleSceneHandle {
  resetRotation: () => void;
}

export interface BubbleHeaderActionsProps {
  showParticles: boolean;
  onToggleParticles: () => void;
  onReset: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export interface ThreeDBubbleData extends BubbleChartData {
  z: number;
  velocity?: { x: number; y: number; z: number };
  pulsePhase?: number;
  selected?: boolean;
}

export interface ChordChartData {
  from: string;
  to: string;
  size: number;
}

export interface ChordChartProps extends BaseChartProps {
  data: ChordChartData[];
  showLabels?: boolean;
}

export interface EnhancedChordDiagramProps {
  data: ChordChartData[];
  title: string;
  subtitle?: string;
  isMobile?: boolean;
  selectedFlow?: string | null;
  setSelectedFlow?: (flow: string | null) => void;
  viewMode?: "flow" | "stats" | "trends";
  setViewMode?: (mode: "flow" | "stats" | "trends") => void;
  animationSpeed?: "slow" | "normal" | "fast";
  setAnimationSpeed?: (speed: "slow" | "normal" | "fast") => void;
  showDetails?: boolean;
  setShowDetails?: (show: boolean) => void;
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
  totalFlows?: number;
  totalMigration?: number;
}

export interface MigrationChordControlsProps {
  viewMode: "flow" | "stats" | "trends";
  setViewMode: (mode: "flow" | "stats" | "trends") => void;
  animationSpeed: "slow" | "normal" | "fast";
  setAnimationSpeed: (speed: "slow" | "normal" | "fast") => void;
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onReset: () => void;
  isMobile?: boolean;
}

export interface ChordFlowCanvasProps {
  container: SVGSVGElement | null;
  isMobile: boolean;
  animationSpeed: "slow" | "normal" | "fast";
  isPlaying: boolean;
  hoveredRibbon: number | null;
  setHoveredRibbon: (i: number | null) => void;
  setSelectedFlow?: (flow: string | null) => void;
  getFlowColor: (flowKey: string) => string;
  matrix: number[][];
  colors: {
    isDark: boolean;
    pattern: string;
  };
}

import type { WidgetChordChartData } from "./widgets";
export interface MigrationChordStatsProps {
  data: WidgetChordChartData[];
  selectedFlow?: string | null;
  setSelectedFlow?: (flow: string | null) => void;
}

export interface SankeyChartData {
  from: string;
  to: string;
  size: number;
}

export interface SankeyChartProps extends BaseChartProps {
  data: SankeyChartData[];
  showLabels?: boolean;
}

export type SankeyViewMode = "flow" | "stats" | "trends";
export type SankeyAnimationSpeed = "slow" | "normal" | "fast";

import type { WidgetSankeyChartData } from "./widgets";

export interface EnhancedSankeyDiagramProps {
  data: WidgetSankeyChartData[];
  title: string;
  subtitle?: string;
  isMobile?: boolean;
  selectedFlow: string | null;
  setSelectedFlow: (flow: string | null) => void;
  viewMode: SankeyViewMode;
  setViewMode: (mode: SankeyViewMode) => void;
  animationSpeed: SankeyAnimationSpeed;
  setAnimationSpeed: (speed: SankeyAnimationSpeed) => void;
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

export interface SankeyNode {
  id: string;
  name: string;
  value: number;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
  column: number;
}

export interface SankeyLink {
  source: string | SankeyNode;
  target: string | SankeyNode;
  value: number;
  width?: number;
  flowKey?: string;
}

export interface SankeyFlowCanvasProps {
  data: WidgetSankeyChartData[];
  isMobile: boolean;
  selectedFlow: string | null;
  setSelectedFlow: (flow: string | null) => void;
  isPlaying: boolean;
  animationFrame: number;
}

export interface CustomSankeyDiagramProps {
  data: WidgetSankeyChartData[];
  title: string;
  subtitle?: string;
  isMobile?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

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

export interface ContributionGridProps {
  weeks: ContributionData[][];
  monthPositions: { month: string; x: number }[];
  getColorForValue: (value: number) => string;
  colors: {
    primary: string;
    secondary: string;
    muted: string;
    cardBackground: string;
    borderSecondary: string;
    accent: { blue: string; yellow: string; red: string; teal: string };
  };
  isMobile?: boolean;
  onDayClick?: (day: { date: string; value: number }) => void;
  selectedDay?: { date: string; value: number } | null;
}

export interface ContributionHeaderProps {
  title: string;
  totalYearSpending: number;
  averageDailySpending: number;
  colors?: {
    primary: string;
    secondary: string;
  };
  isRealTime?: boolean;
  setIsRealTime?: (value: boolean) => void;
}

export interface ContributionLegendProps {
  valueRanges: ValueRange[];
  colors: {
    secondary: string;
  };
}

export interface MigrationFlowHeaderProps {
  title: string;
  subtitle?: string;
  isMobile?: boolean;
  totalFlows?: number;
  totalMigration?: number;
  selectedFlow?: string | null;
}

export interface MigrationFlowControlsProps {
  viewMode: SankeyViewMode;
  setViewMode: (mode: SankeyViewMode) => void;
  animationSpeed: SankeyAnimationSpeed;
  setAnimationSpeed: (speed: SankeyAnimationSpeed) => void;
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onReset: () => void;
  isMobile?: boolean;
}

export interface MigrationFlowStatsProps {
  data: Array<{ from: string; to: string; size: number }>;
  selectedFlow: string | null;
  isMobile?: boolean;
}

export interface MigrationFlowTrendsProps {
  data: Array<{ from: string; to: string; size: number }>;
  isMobile?: boolean;
  isPlaying?: boolean;
}

export interface LineChartMetricsSummary {
  sales: number;
  revenue: number;
  profit: number;
  salesGrowth: number;
  revenueGrowth: number;
  profitGrowth: number;
}

export interface LineChartAnimatedValues {
  sales: number;
  revenue: number;
  profit: number;
  growth: number;
}

export type LineChartTypeKey = "line" | "area" | "composed";

export interface LineChartTooltipProps {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number }>;
  label?: string;
}

import type { WidgetLineChartData } from "./widgets";

export interface LineChartContainerProps extends BaseChartProps {
  data: WidgetLineChartData[];
}

export interface LineChartChartViewProps {
  data: WidgetLineChartData[];
  metrics: LineChartMetricsSummary;
  animatedValues: LineChartAnimatedValues;
  currentChartType: LineChartTypeKey;
  setCurrentChartType: (key: LineChartTypeKey) => void;
  selectedMonth: string | null;
  setSelectedMonth: (month: string | null) => void;
  showInsights: boolean;
  setShowInsights: (show: boolean) => void;
}

export interface LineChartMetricsViewProps {
  data: WidgetLineChartData[];
}

export interface LineChartTrendsViewProps {
  metrics: LineChartMetricsSummary;
}

export type BarChartTypeKey = "bars" | "lines" | "area" | "composed";

export interface BarChartTooltipProps {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number }>;
  label?: string;
}

export interface BarChartMetricsSummary {
  totalRevenue: number;
  totalSales: number;
  avgRevenue: number;
  avgSales: number;
  growth: number;
}

import type { WidgetBarChartData } from "./widgets";

export interface BarChartContainerProps extends BaseChartProps {
  data: WidgetBarChartData[];
}

export interface BarChartChartViewProps {
  data: WidgetBarChartData[];
  metrics: BarChartMetricsSummary;
  animatedValues: {
    totalRevenue: number;
    totalSales: number;
    avgRevenue: number;
    growth: number;
  };
  currentChartType: BarChartTypeKey;
  setCurrentChartType: (key: BarChartTypeKey) => void;
  selectedQuarter: string | null;
  setSelectedQuarter: (q: string | null) => void;
  showInsights: boolean;
  setShowInsights: (show: boolean) => void;
}

export type PerformanceViewKey = "radar" | "timeline" | "alerts" | "capacity";
import type { WidgetRadarChartData, PerformanceMetricsData } from "./widgets";

export interface PerformanceMetricsViewProps {
  data: WidgetRadarChartData[] | PerformanceMetricsData;
  currentView: PerformanceViewKey;
  isRealTime: boolean;
}

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

export interface ChartCanvasProps extends CommonComponentProps {
  width: number;
  height: number;
  onMouseDown?: (e: React.MouseEvent<Element>) => void;
  onMouseMove?: (e: React.MouseEvent<Element>) => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  onClick?: (e: React.MouseEvent<Element>) => void;
}
