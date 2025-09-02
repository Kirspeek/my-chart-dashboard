"use client";

import React, { useState, useEffect, useCallback } from "react";
import WidgetBase from "../../common/WidgetBase";
import SlideNavigation from "../../common/SlideNavigation";
import { TimerWidgetProps } from "@/interfaces/components";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Coffee,
  Zap,
  Target,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import type { TimerMode } from "@/interfaces/widgets";
import { formatMmSs } from "@/utils/timerUtils";
import { IconButton, useMobileDetection } from "../../common";
import TimerModeButtons from "./TimerModeButtons";
import TimerDisplay from "./TimerDisplay";
import { TIMER_MODES } from "@/data";
import DraggableProgressRing from "./DraggableProgressRing";
import { useTimerLogic } from "@/hooks/useTimerLogic";

export default function TimerWidget({
  className = "",
  onOpenSidebar,
  showSidebarButton = false,
  currentSlide,
  setCurrentSlide,
}: TimerWidgetProps & {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
}) {
  const { colorsTheme } = useTheme();
  const timerColors = colorsTheme.widgets.timer;
  const [selectedMode, setSelectedMode] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const {
    duration,
    timeLeft,
    isRunning,
    dragging,
    svgRef,
    toggleTimer,
    resetTimer: resetLogic,
    setDuration,
    onPointerDown,
  } = useTimerLogic();

  const timerModes: TimerMode[] = TIMER_MODES.map((m) => {
    const icon =
      m.id === "pomodoro"
        ? Target
        : m.id === "short-break"
          ? Coffee
          : m.id === "long-break"
            ? Clock
            : Zap;
    const color =
      m.id === "pomodoro"
        ? timerColors.modeColors.focus
        : m.id === "short-break"
          ? timerColors.modeColors.break
          : m.id === "long-break"
            ? timerColors.modeColors.rest
            : timerColors.modeColors.quick;
    return {
      id: m.id,
      name: m.name,
      duration: m.duration,
      icon,
      color,
    };
  });

  const currentTimer = timerModes[selectedMode];
  useEffect(() => {
    setDuration(currentTimer.duration);
  }, [currentTimer.duration, setDuration]);

  useEffect(() => {
    setIsComplete(!isRunning && timeLeft === 0);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const startTimer = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      try {
        Notification.requestPermission();
      } catch {}
    }
    if (timeLeft === 0) {
      resetLogic();
    }
    toggleTimer();
  }, [toggleTimer, resetLogic, timeLeft]);

  const pauseTimer = useCallback(() => {
    toggleTimer();
  }, [toggleTimer]);

  const resetTimer = useCallback(() => {
    resetLogic();
    setIsComplete(false);
    setShowNotification(false);
  }, [resetLogic]);

  const formatTime = (seconds: number): string => formatMmSs(seconds);

  const getProgress = (): number => {
    return ((duration - timeLeft) / duration) * 100;
  };

  // show a brief toast when timer completes
  useEffect(() => {
    if (isComplete) {
      setShowNotification(true);
      const t = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(t);
    }
  }, [isComplete]);

  const isMobile = useMobileDetection();

  return (
    <WidgetBase
      style={{
        width: isMobile ? "100vw" : "100%",
        padding: isMobile ? "1rem" : "0.75rem",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        height: isMobile ? "82vh" : "100%",
        margin: isMobile ? "0 1rem 3rem 1rem" : undefined,
        boxSizing: "border-box",
        borderRadius: isMobile ? "2rem" : undefined,
        position: "relative",
        gap: isMobile ? "1.5rem" : "1rem",
      }}
      className={className}
      onOpenSidebar={onOpenSidebar}
      showSidebarButton={showSidebarButton}
    >
      <TimerModeButtons
        modes={timerModes}
        selectedMode={selectedMode}
        count={2}
        isMobile={isMobile}
        onSelect={setSelectedMode}
        onReset={resetTimer}
      />

      <div className="relative flex items-center gap-2">
        <IconButton
          icon={<RotateCcw className={isMobile ? "w-5 h-5" : "w-3 h-3"} />}
          onClick={resetTimer}
          size={isMobile ? "lg" : "md"}
          variant="default"
        />

        <DraggableProgressRing
          isMobile={isMobile}
          svgRef={svgRef}
          onMouseDown={onPointerDown}
          isDragging={dragging}
          strokeColor={currentTimer.color}
          progress={getProgress()}
        >
          <TimerDisplay
            isMobile={isMobile}
            isComplete={isComplete}
            color={currentTimer.color}
            timeText={formatTime(timeLeft)}
            name={currentTimer.name}
          />
          {isComplete && (
            <div className="absolute -top-1 -right-1">
              <CheckCircle
                className={`animate-bounce ${isMobile ? "w-8 h-8" : "w-4 h-4"}`}
                style={{ color: currentTimer.color }}
              />
            </div>
          )}
        </DraggableProgressRing>

        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className={`rounded-full transition-all duration-200 hover:scale-110 ${isMobile ? "p-4" : "p-2"}`}
          style={{
            background: isRunning
              ? currentTimer.color + "30"
              : currentTimer.color + "10",
            border: `2px solid ${currentTimer.color}`,
            color: currentTimer.color,
          }}
        >
          {isRunning ? (
            <Pause className={isMobile ? "w-6 h-6" : "w-4 h-4"} />
          ) : (
            <Play className={isMobile ? "w-6 h-6" : "w-4 h-4"} />
          )}
        </button>
      </div>

      <TimerModeButtons
        modes={timerModes}
        selectedMode={selectedMode}
        startIndex={2}
        count={2}
        isMobile={isMobile}
        onSelect={setSelectedMode}
        onReset={resetTimer}
      />

      {showNotification && (
        <div
          className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-sm font-medium animate-fade-in"
          style={{
            background: currentTimer.color + "20",
            border: `1px solid ${currentTimer.color}`,
            color: currentTimer.color,
          }}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{currentTimer.name} session completed!</span>
          </div>
        </div>
      )}

      {currentSlide !== undefined && setCurrentSlide && (
        <SlideNavigation
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
        />
      )}
    </WidgetBase>
  );
}
