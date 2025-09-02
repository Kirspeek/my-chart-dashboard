import { ReactNode, CSSProperties, HTMLAttributes } from "react";

// Base component props that can be extended
export interface BaseProps {
  className?: string;
  style?: CSSProperties;
}

export interface WithChildren {
  children?: ReactNode;
}

export interface CommonComponentProps extends BaseProps, WithChildren {}

// Generic data structures
export interface DataPoint {
  name: string;
  value: number;
  [key: string]: unknown;
}

export interface ChartDataPoint extends DataPoint {
  month?: string;
  sales?: number;
  revenue?: number;
  profit?: number;
}

// Generic widget props
export interface WidgetBaseProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

// Generic button props
export interface ButtonProps extends BaseProps {
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

// Generic form props
export interface FormProps extends BaseProps {
  onSubmit?: (data: unknown) => void;
  onReset?: () => void;
}

// Generic table props
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

export interface DataTableProps<T> extends CommonComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
}

// Generic loading states
export interface LoadingState {
  loading: boolean;
  error: string | null;
  data: unknown | null;
}

// Generic API response
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: number;
}

// Generic cache entry
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  loading: boolean;
}

// Generic pagination
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

// Generic filter props
export interface FilterProps {
  filters: Record<string, unknown>;
  onFilterChange: (filters: Record<string, unknown>) => void;
  onClearFilters: () => void;
}

// Generic search props
export interface SearchProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  placeholder?: string;
  debounceMs?: number;
}
