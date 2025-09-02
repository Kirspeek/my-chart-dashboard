import { ReactNode, CSSProperties } from "react";

export interface BaseProps {
  className?: string;
  style?: CSSProperties;
}

export interface WithChildren {
  children?: ReactNode;
}

export interface CommonComponentProps extends BaseProps, WithChildren {}

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

export interface WidgetCardProps extends CommonComponentProps {
  variant?: "default" | "compact" | "large";
}
