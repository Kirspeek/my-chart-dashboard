export function computeFlowOpacity(params: {
  isPlaying: boolean;
  hoveredFlow: string | null;
  selectedFlow: string | null;
  currentFlowKey?: string;
  flowIndex: number;
  animationFrame: number;
}) {
  const {
    isPlaying,
    hoveredFlow,
    selectedFlow,
    currentFlowKey,
    flowIndex,
    animationFrame,
  } = params;
  if (selectedFlow && currentFlowKey)
    return currentFlowKey === selectedFlow ? 1.0 : 0.4;
  if (hoveredFlow && currentFlowKey)
    return currentFlowKey === hoveredFlow ? 1.0 : 0.4;
  if (isPlaying) {
    const phase = (animationFrame + flowIndex * 30) % 360;
    return 0.5 + 0.2 * Math.sin((phase * Math.PI) / 180);
  }
  return 0.6;
}

export function assignFlowColors(keys: string[], palette: string[]) {
  const map = new Map<string, string>();
  keys.forEach((key, index) => {
    if (!map.has(key)) {
      map.set(key, palette[index % palette.length]);
    }
  });
  return map;
}
