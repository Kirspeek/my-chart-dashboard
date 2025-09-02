import type { CardData, CardSpendingData, WidgetState } from "./wallet";

export interface WidgetStateContextType {
  widgetState: WidgetState;
  setCurrentCard: (cardId: string) => void;
  refreshSpendingData: (cards: CardData[]) => void;
  getCurrentCardData: () => CardSpendingData | null;
  getAggregatedData: () => WidgetState["aggregatedData"];
}

export interface WidgetStateProviderProps {
  children: React.ReactNode;
}

export interface WidgetHeightContextType {
  walletHeight: number;
  targetHeight: number | string;
  updateWalletHeight: (height: number) => void;
}

export interface WidgetHeightProviderProps {
  children: React.ReactNode;
}

export interface TooltipData {
  content: React.ReactNode;
  x: number;
  y: number;
  title?: string;
  subtitle?: string;
  color?: string;
}

export interface TooltipContextType {
  showTooltip: (data: TooltipData) => void;
  hideTooltip: () => void;
  tooltip: TooltipData | null;
}

export interface TooltipProviderProps {
  children: React.ReactNode;
}

export interface SearchResult {
  type: "widget" | "content";
  title: string;
  subtitle?: string;
  content?: string;
  slideIndex?: number;
  widgetType: string;
}

export interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  clearSearch: () => void;
  showFilteredWidgets: boolean;
  setShowFilteredWidgets: (show: boolean) => void;
  filteredWidgetTypes: string[];
}
