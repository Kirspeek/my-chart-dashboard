export function useHeaderIconSizing(isMobile: boolean, isTablet: boolean) {
  const size = isMobile ? 22 : isTablet ? 26 : 28;
  const stroke = isMobile ? 2.2 : isTablet ? 2.35 : 2.5;
  return { size, stroke };
}
