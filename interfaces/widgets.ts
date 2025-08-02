import { Dispatch, SetStateAction } from "react";
import { CommonComponentProps } from "./common";
import { UserData } from "./dashboard";
import { CardData } from "./wallet";

// Clock Widget Interfaces
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

export interface ClockWidgetProps {
  selectedZone: string;
  setSelectedZone: Dispatch<SetStateAction<string>>;
}

// Timer Widget Interfaces
export interface TimerState {
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  dragging: boolean;
  previewDuration: number | null;
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

// Weather Widget Interfaces
export interface WeatherState {
  selectedDay: number;
  dateString: string;
  isCloudy: boolean;
}

export interface WeatherActions {
  setSelectedDay: (day: number) => void;
}

export interface WeatherWidgetProps {
  city?: string;
}

// Map Widget Interfaces
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

export interface MapWidgetProps {
  onMarkerChange?: (pos: { lat: number; lon: number }) => void;
  userLocation?: [number, number];
}

// Calendar Widget Interfaces
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  description?: string;
}

export interface CalendarState {
  currentDate: Date;
  selectedDate: Date | null;
  viewMode: "month" | "week" | "day";
  events: CalendarEvent[];
  showEventForm: boolean;
}

export interface CalendarActions {
  setSelectedDate: (date: Date) => void;
  setViewMode: (mode: "month" | "week" | "day") => void;
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

export interface CalendarWidgetProps {
  onDateSelect?: (date: Date) => void;
  initialDate?: Date;
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

export interface MetricCardProps extends CommonComponentProps {
  metric: {
    title: string;
    value: string | number;
    change: number;
    changeType: "increase" | "decrease";
    icon: string;
  };
  index?: number;
}

// Metric Widget Interfaces
export interface MetricWidgetProps {
  metric: MetricData;
  index?: number;
}

export interface MetricData {
  title: string;
  value: string | number;
  change: number;
  icon: string;
}

// Chart Widget Interfaces
export interface ChartDataPoint {
  month?: string;
  name?: string;
  sales: number;
  revenue: number;
  profit?: number;
}

export interface LineChartWidgetProps {
  data: ChartDataPoint[];
  title: string;
}

export interface BarChartWidgetProps {
  data: ChartDataPoint[];
  title: string;
}

export interface ChartState {
  data: ChartDataPoint[];
  title: string;
}

export interface ChartActions {
  formatValue: (value: number) => string;
  formatTooltip: (value: number, name: string) => [string, string];
}

// Recent Users Widget Interfaces
export interface RecentUsersWidgetProps {
  data: UserData[];
  title: string;
}

// Device Usage Widget Interfaces
export interface DeviceUsageWidgetProps {
  data: DeviceUsageData[];
  title: string;
}

export interface DeviceUsageData {
  name: string;
  value: number;
  color: string;
}

// Radar Chart Widget Interfaces
export interface RadarChartData {
  subject: string;
  value: number;
  fullMark: number;
}

export interface RadarChartWidgetProps {
  data: RadarChartData[];
  title: string;
}

// Area Chart Widget Interfaces
export interface AreaChartData {
  name: string;
  value: number;
  fill: string;
}

export interface AreaChartWidgetProps {
  data: AreaChartData[];
  title: string;
}

// Scatter Chart Widget Interfaces
export interface ScatterChartData {
  x: number;
  y: number;
  z: number;
  category: string;
}

export interface ScatterChartWidgetProps {
  data: ScatterChartData[];
  title: string;
}

export interface ChordChartData {
  from: string;
  to: string;
  size: number;
}

export interface ChordChartWidgetProps {
  data: ChordChartData[];
  title: string;
  subtitle?: string;
}

export interface SankeyChartData {
  from: string;
  to: string;
  size: number;
}

export interface SankeyChartWidgetProps {
  data: SankeyChartData[];
  title: string;
  subtitle?: string;
}

export interface BubbleChartData {
  x: number;
  y: number;
  size: number;
  category: string;
  label?: string;
}

export interface BubbleChartWidgetProps {
  data: BubbleChartData[];
  title: string;
  subtitle?: string;
}

// Timeline Widget Interfaces
export interface TimelineItem {
  year: string;
  color: "yellow" | "red" | "blue" | "teal" | "purple";
  title: string;
  desc: string;
  progress?: number;
}

export interface TimelineRingsWidgetProps {
  data: TimelineItem[];
  title: string;
  subtitle?: string;
}

// Wheel Widget Interfaces
export interface ExpenseData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface SpendingChartProps {
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

export interface BottomSegmentInfoProps {
  segment: ExpenseData | null;
}

export interface SpendingProgressProps {
  selectedIndex: number;
  totalCards: number;
}

export type TimePeriod = "Monthly" | "Annual";
