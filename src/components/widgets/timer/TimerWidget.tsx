"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import WidgetBase from "../../common/WidgetBase";
import SlideNavigation from "../../common/SlideNavigation";
import { TimerWidgetProps } from "../../../../interfaces/components";
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
import { useTheme } from "../../../hooks/useTheme";
import {
  InteractiveButton,
  IconButton,
  useMobileDetection,
} from "../../common";

interface TimerMode {
  id: string;
  name: string;
  duration: number; // in seconds
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

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
  const { accent } = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedMode, setSelectedMode] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const timerModes: TimerMode[] = [
    {
      id: "pomodoro",
      name: "Focus",
      duration: 25 * 60,
      icon: Target,
      color: accent.red,
    },
    {
      id: "short-break",
      name: "Break",
      duration: 5 * 60,
      icon: Coffee,
      color: accent.blue,
    },
    {
      id: "long-break",
      name: "Rest",
      duration: 15 * 60,
      icon: Clock,
      color: accent.teal,
    },
    {
      id: "quick",
      name: "Quick",
      duration: 2 * 60,
      icon: Zap,
      color: accent.yellow,
    },
  ];

  const currentTimer = timerModes[selectedMode];

  // Initialize timer
  useEffect(() => {
    if (!isRunning && timeLeft === 0) {
      setTimeLeft(currentTimer.duration);
    }
  }, [selectedMode, currentTimer.duration, isRunning, timeLeft]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0 && !isDragging) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            setShowNotification(true);
            // Play notification sound or show browser notification
            if (
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              new Notification("Timer Complete!", {
                body: `${currentTimer.name} session finished`,
                icon: "/favicon.ico",
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentTimer.name, isDragging]);

  // Auto-hide notification
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
    setIsComplete(false);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(currentTimer.duration);
    setIsComplete(false);
  }, [currentTimer.duration]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = (): number => {
    return ((currentTimer.duration - timeLeft) / currentTimer.duration) * 100;
  };

  // Calculate angle from mouse position
  const getAngleFromMouse = (event: React.MouseEvent | MouseEvent): number => {
    if (!svgRef.current) return 0;

    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;

    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    // Convert to clockwise from top (0 degrees) and invert for correct direction
    angle = 90 - angle;
    if (angle < 0) angle += 360;

    // Invert the angle so dragging clockwise increases time
    angle = 360 - angle;

    return angle;
  };

  // Handle drag start
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      setIsDragging(true);

      const angle = getAngleFromMouse(event);
      const progress = (angle / 360) * 100;
      const newTimeLeft = Math.round(
        (currentTimer.duration * (100 - progress)) / 100
      );

      setTimeLeft(Math.max(0, Math.min(currentTimer.duration, newTimeLeft)));
    },
    [currentTimer.duration]
  );

  // Handle drag move
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging) return;

      const angle = getAngleFromMouse(event);
      const progress = (angle / 360) * 100;
      const newTimeLeft = Math.round(
        (currentTimer.duration * (100 - progress)) / 100
      );

      setTimeLeft(Math.max(0, Math.min(currentTimer.duration, newTimeLeft)));
    },
    [isDragging, currentTimer.duration]
  );

  // Handle drag end
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add/remove global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

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
      {/* First two mode buttons: Focus, Break */}
      <div
        className={`flex gap-1 justify-center ${isMobile ? "flex-wrap" : "flex-col"}`}
      >
        {timerModes.slice(0, 2).map((mode, index) => (
          <InteractiveButton
            key={mode.id}
            onClick={() => {
              setSelectedMode(index);
              resetTimer();
            }}
            variant={selectedMode === index ? "primary" : "default"}
            size="sm"
            icon={<mode.icon className="w-3 h-3" />}
            className={`${selectedMode === index ? "scale-105" : ""}`}
          >
            <span>{mode.name}</span>
          </InteractiveButton>
        ))}
      </div>

      {/* Timer Display with Control Buttons on Sides */}
      <div className="relative flex items-center gap-2">
        {/* Left Control Button */}
        <IconButton
          icon={<RotateCcw className={isMobile ? "w-5 h-5" : "w-3 h-3"} />}
          onClick={resetTimer}
          size={isMobile ? "lg" : "md"}
          variant="default"
        />

        {/* Progress Ring - Draggable */}
        <div
          className={`relative flex items-center justify-center ${isMobile ? "w-48 h-48" : "w-32 h-32"}`}
        >
          <svg
            ref={svgRef}
            className="w-full h-full transform -rotate-90 cursor-pointer"
            viewBox="0 0 100 100"
            onMouseDown={handleMouseDown}
            style={{
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--button-border)"
              strokeWidth="3"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={currentTimer.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
              style={{
                transition: isDragging ? "none" : "stroke-dashoffset 0.3s ease",
              }}
            />
            {/* Draggable handle at the end of progress */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="transparent"
              strokeWidth="8"
              style={{ cursor: "grab" }}
            />
          </svg>

          {/* Timer Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div
              className={`font-mono font-bold mb-0.5 ${isMobile ? "text-4xl" : "text-2xl"}`}
              style={{
                color: isComplete ? currentTimer.color : "var(--primary-text)",
              }}
            >
              {formatTime(timeLeft)}
            </div>
            <div
              className="text-sm font-medium"
              style={{ color: currentTimer.color }}
            >
              {currentTimer.name}
            </div>
          </div>

          {/* Completion Indicator */}
          {isComplete && (
            <div className="absolute -top-1 -right-1">
              <CheckCircle
                className={`animate-bounce ${isMobile ? "w-8 h-8" : "w-4 h-4"}`}
                style={{ color: currentTimer.color }}
              />
            </div>
          )}
        </div>

        {/* Right Control Button */}
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className={`rounded-full transition-all duration-200 hover:scale-110 ${isMobile ? "p-4" : "p-2"}`}
          style={{
            background: isRunning
              ? accent.red + "20"
              : currentTimer.color + "20",
            border: `2px solid ${isRunning ? accent.red : currentTimer.color}`,
            color: isRunning ? accent.red : currentTimer.color,
          }}
        >
          {isRunning ? (
            <Pause className={isMobile ? "w-6 h-6" : "w-4 h-4"} />
          ) : (
            <Play className={isMobile ? "w-6 h-6" : "w-4 h-4"} />
          )}
        </button>
      </div>

      {/* Last two mode buttons: Rest, Quick */}
      <div
        className={`flex gap-1 justify-center ${isMobile ? "flex-wrap" : "flex-col"}`}
      >
        {timerModes.slice(2, 4).map((mode, index) => (
          <button
            key={mode.id}
            onClick={() => {
              setSelectedMode(index + 2);
              resetTimer();
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 ${
              selectedMode === index + 2 ? "scale-105" : ""
            }`}
            style={{
              background:
                selectedMode === index + 2
                  ? mode.color + "20"
                  : "var(--button-bg)",
              border: `1px solid ${selectedMode === index + 2 ? mode.color : "var(--button-border)"}`,
              color:
                selectedMode === index + 2
                  ? mode.color
                  : "var(--secondary-text)",
            }}
          >
            <mode.icon className="w-3 h-3" />
            <span>{mode.name}</span>
          </button>
        ))}
      </div>

      {/* Status Message */}
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

      {/* Navigation buttons */}
      {currentSlide !== undefined && setCurrentSlide && (
        <SlideNavigation
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
        />
      )}
    </WidgetBase>
  );
}
