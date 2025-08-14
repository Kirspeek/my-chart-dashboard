import { useTooltip } from "../context/TooltipContext";
import { ReactNode } from "react";

interface UseGlobalTooltipOptions {
  title?: string;
  subtitle?: string;
  color?: string;
}

export function useGlobalTooltip(options: UseGlobalTooltipOptions = {}) {
  const { showTooltip, hideTooltip } = useTooltip();

  const showGlobalTooltip = (content: ReactNode, x: number, y: number) => {
    showTooltip({
      content,
      x,
      y,
      title: options.title,
      subtitle: options.subtitle,
      color: options.color,
    });
  };

  const createTooltipHandlers = (content: ReactNode, color?: string) => {
    return {
      onMouseEnter: (event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        showGlobalTooltip(content, rect.left + rect.width / 2, rect.top - 10);
      },
      onMouseLeave: () => {
        hideTooltip();
      },
    };
  };

  return {
    showTooltip: showGlobalTooltip,
    hideTooltip,
    createTooltipHandlers,
  };
}
