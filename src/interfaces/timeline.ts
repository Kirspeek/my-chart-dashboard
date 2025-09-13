export interface TimelineEvent {
  id: string;
  timestamp: string;
  time: string;
  type: "performance" | "alert" | "maintenance" | "deployment";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  metrics: {
    cpu: number;
    memory: number;
    network: number;
    disk: number;
    response: number;
    errors: number;
    throughput: number;
    availability: number;
  };
  tags: string[];
  status: "active" | "resolved" | "investigating";
  duration?: number;
  impact: "low" | "medium" | "high";
}

export interface PerformanceTimelineProps {
  data: TimelineEvent[];
  isRealTime?: boolean;
}

export interface FlexiblePerformanceTimelineProps {
  data: TimelineEvent[];
  isRealTime?: boolean;
}

export type RingColorKey = "yellow" | "red" | "blue" | "teal" | "purple";

export interface TimelineRingItem {
  title: string;
  desc: string;
  year: string;
  progress?: number;
  color?: string;
}

export interface TimelineRingItemMobileProps {
  item: TimelineRingItem;
  idx: number;
  color: string;
  timelineRingsColors: {
    gradient: {
      stop1: string;
      stop2: string;
      stop3: string;
    };
    fill: string;
    background: string;
  };
  animatedProgress?: number;
  animatedLineProgress?: number;
  hoveredIdx: number | null;
  setHoveredIdx: (idx: number | null) => void;
  secondaryColor: string;
  layout: "top" | "bottom";
}

export interface TimelineRingItemDesktopProps {
  item: TimelineRingItem;
  idx: number;
  color: string;
  isTablet: boolean;
  isEven: boolean;
  timelineRingsColors: {
    gradient: {
      stop1: string;
      stop2: string;
      stop3: string;
    };
    fill: string;
    background: string;
  };
  animatedProgress?: number;
  animatedLineProgress?: number;
  hoveredIdx: number | null;
  setHoveredIdx: (idx: number | null) => void;
  secondaryColor: string;
}

export interface EnhancedTimelineWidgetProps {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

export interface TimelineRingItemProps {
  item: TimelineRingItem;
  idx: number;
  isTablet: boolean;
  color: string;
  hoveredIdx: number | null;
  setHoveredIdx: (idx: number | null) => void;
  selectedMilestone: number | null;
  setSelectedMilestone: (idx: number | null) => void;
  animatedProgress?: number;
  animatedLineProgress?: number;
}

export interface TimelineAchievementsViewProps {
  data: TimelineRingItem[];
  progressByIndex: (number | undefined)[];
}

export type ViewMode = "timeline" | "stats" | "achievements";

export type Speed = "slow" | "normal" | "fast";

export interface TimelineControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isMobile: boolean;
  animationSpeed: Speed;
  setAnimationSpeed: (speed: Speed) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onReset: () => void;
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
}

export interface TimelineHeaderStatsProps {
  totalMilestones: number;
  completedMilestones: number;
  averageProgress: number;
}

export interface TimelineRingsDesktopProps {
  timelineData: TimelineRingItem[];
  ringColors: Record<RingColorKey, string>;
  animatedProgress: (number | undefined)[];
  animatedLineProgress: (number | undefined)[];
  hoveredIdx: number | null;
  setHoveredIdx: (idx: number | null) => void;
  timelineRingsColors: {
    gradient: {
      stop1: string;
      stop2: string;
      stop3: string;
    };
    fill: string;
    background: string;
  };
  isTablet: boolean;
  secondaryColor: string;
}

export interface TimelineRingsMobileProps {
  timelineData: TimelineRingItem[];
  ringColors: Record<RingColorKey, string>;
  animatedProgress: (number | undefined)[];
  animatedLineProgress: (number | undefined)[];
  hoveredIdx: number | null;
  setHoveredIdx: (idx: number | null) => void;
  timelineRingsColors: {
    gradient: {
      stop1: string;
      stop2: string;
      stop3: string;
    };
    fill: string;
    background: string;
  };
  secondaryColor: string;
}

export interface TimelineStatsViewProps {
  data: TimelineRingItem[];
  progressByIndex: (number | undefined)[];
}
