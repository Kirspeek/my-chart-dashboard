import { Dispatch, SetStateAction } from "react";
import { CommonComponentProps, BaseProps, LoadingState } from "./base";
import { UserData } from "./dashboard";
import { CardData, CardSpendingData } from "./wallet";

// ============================================================================
// CLOCK WIDGET INTERFACES
// ============================================================================

export interface TimeZone {
  label: string;
  zone: string;
  utc: string;
}

export interface ClockState {
  mounted: boolean;
  tick: number;
  is24h: boolean;
  dateStr: string;
  mainTime: Date;
}

export interface ClockActions {
  setIs24h: (is24h: boolean) => void;
  pad: (n: number) => string;
  getTimeInZone: (zone: string) => Date;
  isDay: (hours: number) => boolean;
}

export interface ClockWidgetProps extends CommonComponentProps {
  selectedZone: string;
  setSelectedZone: Dispatch<SetStateAction<string>>;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

export interface ClockDisplayProps extends CommonComponentProps {
  mainTime: Date;
  is24h: boolean;
  dateStr: string;
  pad: (n: number) => string;
  setIs24h: (is24h: boolean) => void;
}

export interface WorldClocksProps extends CommonComponentProps {
  timeZones: Array<{ zone: string; label: string; utc: string }>;
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  mounted: boolean;
  pad: (n: number) => string;
  getTimeInZone: (zone: string) => Date;
  isDay: (hours: number) => boolean;
  isMobile?: boolean;
}

// ============================================================================
// TIMER WIDGET INTERFACES
// ============================================================================

export interface TimerState {
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  dragging: boolean;
  previewDuration: number | null;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export interface TimerActions {
  toggleTimer: () => void;
  resetTimer: () => void;
  setDuration: (duration: number) => void;
  onPointerDown: (e: React.MouseEvent | React.TouchEvent) => void;
  onPointerMove: (e: MouseEvent | TouchEvent) => void;
  onPointerUp: () => void;
  formatTime: (seconds: number) => string;
  getSecondsFromPointer: (clientX: number, clientY: number) => number;
}

export interface TimerWidgetProps extends CommonComponentProps {
  className?: string;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

// ============================================================================
// WEATHER WIDGET INTERFACES
// ============================================================================

export interface WeatherState {
  selectedDay: number;
  dateString: string;
  isCloudy: boolean;
}

export interface WeatherActions {
  setSelectedDay: (day: number) => void;
}

export interface WeatherWidgetProps extends CommonComponentProps {
  city?: string;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

export interface ForecastDay {
  day: string;
  icon: string;
  min: number;
  max: number;
  desc: string;
}

export interface ForecastDayProps extends CommonComponentProps {
  day: string;
  icon: string;
  min: number;
  max: number;
  selected: boolean;
  desc: string;
  onClick?: () => void;
}

export interface WeatherBackgroundProps extends CommonComponentProps {
  desc: string;
}

export interface WeatherTextProps extends CommonComponentProps {
  desc: string;
  temp: number;
  city: string;
  date: string;
  hot?: boolean;
}

export interface WeatherColors {
  mainColor: string;
  secondaryColor: string;
}

export interface WeatherBackground {
  background: string;
}

export interface WeatherButtonBackground {
  background: string;
}

export interface WeatherCacheStatusProps extends CommonComponentProps {
  cities: string[];
}

// ============================================================================
// MAP WIDGET INTERFACES
// ============================================================================

export interface MapState {
  search: string;
  searchFocused: boolean;
  loading: boolean;
  searchResult: [number, number] | null;
  internalLocation: [number, number] | null;
}

export interface MapActions {
  setSearch: (search: string) => void;
  setSearchFocused: (focused: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSearchResult: (result: [number, number] | null) => void;
  setInternalLocation: (location: [number, number] | null) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export interface MapWidgetProps extends CommonComponentProps {
  onMarkerChange?: (pos: { lat: number; lon: number }) => void;
  userLocation?: [number, number];
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

export interface MapComponentProps extends CommonComponentProps {
  center: [number, number];
  zoom: number;
}

// ============================================================================
// CALENDAR WIDGET INTERFACES
// ============================================================================

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  description?: string;
}

export interface CalendarState {
  currentDate: Date;
  selectedDate: Date | null;
  viewMode: "month" | "week" | "day" | "year";
  events: CalendarEvent[];
  showEventForm: boolean;
}

export interface CalendarActions {
  setSelectedDate: (date: Date) => void;
  setViewMode: (mode: "month" | "week" | "day" | "year") => void;
  setYear: (year: number) => void;
  goToPrevious: () => void;
  goToNext: () => void;
  goToToday: () => void;
  getDaysInMonth: (date: Date) => Date[];
  getWeekDays: () => string[];
  isToday: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
  isCurrentMonth: (date: Date) => boolean;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  deleteEvent: (eventId: string) => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
  toggleEventForm: () => void;
}

export interface CalendarWidgetProps extends CommonComponentProps {
  onDateSelect?: (date: Date) => void;
  initialDate?: Date;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

// ============================================================================
// METRIC WIDGET INTERFACES
// ============================================================================

export interface MetricData {
  title: string;
  value: string | number;
  change: number;
  icon: string;
}

export interface MetricCardProps extends CommonComponentProps {
  metric: MetricData & {
    changeType: "increase" | "decrease";
  };
  index?: number;
}

export interface MetricWidgetProps extends CommonComponentProps {
  metric: MetricData;
  index?: number;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

export interface MetricContentProps {
  title: string;
  value: string | number;
  animatedValue?: number;
  isHovered?: boolean;
}

export interface MetricIconProps {
  icon: string;
  accentColor: string;
  isHovered?: boolean;
}

export interface MetricTrendProps {
  change: number;
  accentColor: string;
  isHovered?: boolean;
}

// ============================================================================
// WHEEL WIDGET INTERFACES
// ============================================================================

export interface ExpenseData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface WheelChartProps extends CommonComponentProps {
  data: ExpenseData[];
  annualData?: ExpenseData[];
  title?: string;
  onClick?: () => void;
  showCardNumber?: boolean;
  cardNumber?: string;
}

export interface WalletCardData {
  card: CardData;
  balance: number;
  monthlySpending: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface SegmentPoint {
  outer: Point3D;
  inner: Point3D;
  outerBottom: Point3D;
  innerBottom: Point3D;
}

export interface Segment3D {
  points: SegmentPoint[];
  color: string;
  data: ExpenseData;
  startAngle: number;
  endAngle: number;
}

export interface Face3D {
  type: "bottom" | "outer-side" | "inner-side" | "top";
  points: Point3D[];
  color: string;
  opacity: number;
  zIndex: number;
}

export interface BottomSegmentInfoProps extends CommonComponentProps {
  segment: ExpenseData | null;
}

export interface SpendingProgressProps extends CommonComponentProps {
  selectedIndex: number;
  totalCards: number;
}

export type TimePeriod = "Monthly" | "Annual";

// Wheel widget local component props
export interface WheelMonthlyExpensesChartProps extends CommonComponentProps {
  card: CardSpendingData | null;
  onClick: () => void;
}

export interface WheelCategorySelectorProps {
  data: ExpenseData[];
  selected: string | null;
  onToggle: (name: string) => void;
  className?: string;
}

export interface WheelInsightsPanelProps {
  avg: number;
  maxCategory: { name: string };
}

export interface WheelCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent<Element>) => void;
  onMouseMove: (e: React.MouseEvent<Element>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onClick?: (e: React.MouseEvent<Element>) => void;
}

// =========================================================================
// WAVES WIDGET INTERFACES
// =========================================================================

export interface WavesChartProps extends CommonComponentProps {
  data?: Array<{ id: string; color: string; path: string; scaleY?: number }>;
  title?: string;
  onRefresh?: () => void;
}

export interface WavesCanvasProps extends CommonComponentProps {
  chartRef: React.RefObject<HTMLDivElement | null>;
  isLoaded: boolean;
  wavePaths: Array<{
    id: string;
    className: string;
    path: string;
    color: string;
    animationDelay: string;
    scaleY?: number;
  }>;
  onRefresh?: () => void;
}

export interface WavesHeaderButtonsProps {
  showAlerts: boolean;
  isRefreshing: boolean;
  onToggleAlerts: (e: React.MouseEvent) => void;
  onRefresh: (e: React.MouseEvent) => void;
  alertActiveColor: string;
}

export interface WavesFinancialBarChartProps extends CommonComponentProps {
  data: ExpenseData[];
  annualData?: ExpenseData[];
  title?: string;
  onClick?: () => void;
  showCardNumber?: boolean;
  cardNumber?: string;
}

export interface WavesHeaderButtonsProps {
  showAlerts: boolean;
  isRefreshing: boolean;
  onToggleAlerts: (e: React.MouseEvent) => void;
  onRefresh: (e: React.MouseEvent) => void;
  alertActiveColor: string;
}

export interface WavesExpenseData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

// ============================================================================
// DATA WIDGET INTERFACES
// ============================================================================

export interface DeviceUsageData {
  name: string;
  value: number;
  color: string;
}

export interface DeviceUsageWidgetProps extends CommonComponentProps {
  data: DeviceUsageData[];
  title: string;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

export interface DeviceUsageContainerProps {
  data: DeviceUsageData[];
}

export interface RecentUsersWidgetProps extends CommonComponentProps {
  data: UserData[];
  title: string;
}

export interface RecentUsersContainerProps {
  data: UserData[];
}

// ============================================================================
// CHART WIDGET INTERFACES
// ============================================================================

export interface WidgetBarChartData {
  name: string;
  value?: number;
  sales: number;
  revenue: number;
}

export interface BarChartWidgetProps extends CommonComponentProps {
  data: WidgetBarChartData[];
  title: string;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

export interface WidgetLineChartData {
  month: string;
  sales: number;
  revenue: number;
  profit: number;
}

export interface LineChartWidgetProps extends CommonComponentProps {
  data: WidgetLineChartData[];
  title: string;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

export interface WidgetRadarChartData {
  subject: string;
  value: number;
  fullMark: number;
  trend?: "up" | "down" | "stable";
  change?: number;
}

export interface PerformanceMetricsData {
  currentMetrics: WidgetRadarChartData[];
  historicalData: {
    hourly: Array<{
      time: string;
      cpu: number;
      memory: number;
      network: number;
      disk: number;
      response: number;
      errors: number;
      throughput: number;
      availability: number;
    }>;
    daily: Array<{
      date: string;
      avgCpu: number;
      avgMemory: number;
      avgNetwork: number;
      avgDisk: number;
      avgResponse: number;
      avgErrors: number;
      avgThroughput: number;
      avgAvailability: number;
    }>;
  };
  alerts: Array<{
    id: number;
    severity: "high" | "medium" | "low";
    metric: string;
    message: string;
    time: string;
    status: "active" | "resolved";
  }>;
  performanceScore: {
    overall: number;
    trend: "improving" | "declining" | "stable";
    breakdown: {
      infrastructure: number;
      application: number;
      network: number;
      security: number;
    };
  };
  capacityPlanning: {
    currentUtilization: {
      cpu: number;
      memory: number;
      storage: number;
      network: number;
    };
    projectedGrowth: {
      cpu: number;
      memory: number;
      storage: number;
      network: number;
    };
    recommendations: string[];
  };
}

export interface RadarChartWidgetProps extends CommonComponentProps {
  data: WidgetRadarChartData[] | PerformanceMetricsData;
  title: string;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

export interface WidgetChordChartData {
  from: string;
  to: string;
  size: number;
}

export interface ChordChartWidgetProps extends CommonComponentProps {
  data: WidgetChordChartData[];
  title: string;
  subtitle?: string;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

export interface WidgetSankeyChartData {
  from: string;
  to: string;
  size: number;
}

export interface SankeyChartWidgetProps extends CommonComponentProps {
  data: WidgetSankeyChartData[];
  title: string;
  subtitle?: string;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

export interface WidgetBubbleChartData {
  x: number;
  y: number;
  size: number;
  category: string;
  label: string;
}

export interface BubbleChartWidgetProps extends CommonComponentProps {
  data: WidgetBubbleChartData[];
  title: string;
  subtitle?: string;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

export interface TimelineRingsWidgetProps extends CommonComponentProps {
  title?: string;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

export interface WalletWidgetProps extends CommonComponentProps {
  title?: string;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

export interface WalletCardWidgetProps extends CommonComponentProps {
  title?: string;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

export interface ContributionGraphWidgetProps extends CommonComponentProps {
  title: string;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

// ============================================================================
// TIMER WIDGET LOCAL PROPS
// ============================================================================

export interface TimerMode {
  id: string;
  name: string;
  duration: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export interface TimerCircleProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  currentTimeLeft: number;
  currentDuration: number;
  dragging: boolean;
  onPointerDown: (e: React.MouseEvent | React.TouchEvent) => void;
  formatTime: (seconds: number) => string;
}

export interface AggregatedSpendingWidgetProps extends CommonComponentProps {
  title?: string;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

// ============================================================================
// COMMON WIDGET INTERFACES
// ============================================================================

export interface WidgetCardProps extends CommonComponentProps {
  variant?: "default" | "compact" | "large";
}

export interface Button3DProps extends BaseProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  customBackground?: string;
  customAccentColor?: string;
}

// ============================================================================
// WIDGET STATE INTERFACES
// ============================================================================

export interface WidgetState extends LoadingState {
  selectedCardIndex: number;
  totalCards: number;
  currentCard: CardData | null;
  currentCardData: WalletCardData | null;
  hasCards: boolean;
}

export interface WidgetActions {
  handleCardClick: () => void;
  setSelectedCardIndex: (index: number) => void;
  refreshData: () => void;
}
