import type { TimelineItem } from "@/interfaces/charts";

export interface TimelineRingItemMobileProps {
  item: TimelineItem;
  idx: number;
  color: string;
  timelineRingsColors: {
    fill: string;
    gradient: { stop1: string; stop2: string; stop3: string };
    background?: string;
  };
  animatedProgress: number;
  animatedLineProgress: number;
  hoveredIdx: number | null;
  setHoveredIdx: (idx: number | null) => void;
  secondaryColor: string;
  layout: "top" | "bottom";
}

export interface TimelineRingItemProps {
  item: TimelineItem;
  idx: number;
  isTablet: boolean;
  color: string;
  hoveredIdx: number | null;
  setHoveredIdx: (i: number | null) => void;
  selectedMilestone: number | null;
  setSelectedMilestone: (i: number | null) => void;
  animatedProgress: number;
  animatedLineProgress: number;
  timelineRingsColors: {
    fill: string;
    gradient: { stop1: string; stop2: string; stop3: string };
    background?: string;
  };
  colors: Record<string, string>;
}

export interface TimelineStatsViewProps {
  data: TimelineItem[];
  progressByIndex: number[];
}

export interface TimelineAchievementsViewProps {
  data: TimelineItem[];
  progressByIndex: number[];
}

export interface EnhancedTimelineWidgetProps {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

export type ViewMode = "timeline" | "stats" | "achievements";
export type Speed = "slow" | "normal" | "fast";

export interface TimelineControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isMobile: boolean;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  animationSpeed: Speed;
  setAnimationSpeed: (speed: Speed) => void;
  onReset: () => void;
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
}

export interface TimelineHeaderStatsProps {
  totalMilestones: number;
  completedMilestones: number;
  averageProgress: number;
}

export interface TimelineRingItemDesktopProps {
  item: TimelineItem;
  idx: number;
  color: string;
  isTablet: boolean;
  isEven: boolean;
  timelineRingsColors: {
    fill: string;
    gradient: { stop1: string; stop2: string; stop3: string };
  };
  animatedProgress: number;
  animatedLineProgress: number;
  hoveredIdx: number | null;
  setHoveredIdx: (idx: number | null) => void;
  secondaryColor: string;
}

export type RingColorKey = "yellow" | "red" | "blue" | "teal" | "purple";

// Container props for Timeline Rings
export interface TimelineRingsMobileProps {
  timelineData: TimelineItem[];
  ringColors: Record<RingColorKey, string>;
  animatedProgress: number[];
  animatedLineProgress: number[];
  hoveredIdx: number | null;
  setHoveredIdx: (idx: number | null) => void;
  timelineRingsColors: {
    fill: string;
    gradient: { stop1: string; stop2: string; stop3: string };
    background?: string;
  };
  secondaryColor: string;
}

export interface TimelineRingsDesktopProps {
  timelineData: TimelineItem[];
  ringColors: Record<RingColorKey, string>;
  animatedProgress: number[];
  animatedLineProgress: number[];
  hoveredIdx: number | null;
  setHoveredIdx: (idx: number | null) => void;
  timelineRingsColors: {
    fill: string;
    gradient: { stop1: string; stop2: string; stop3: string };
  };
  isTablet: boolean;
  secondaryColor: string;
}
