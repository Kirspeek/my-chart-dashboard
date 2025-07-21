import { useRef, useEffect, useState, useCallback } from "react";
import type { TimerState, TimerActions } from "../../interfaces/widgets";

export function useTimerLogic(): TimerState & TimerActions {
  const [duration, setDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [previewDuration, setPreviewDuration] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Timer constants
  const minSeconds = 10;
  const maxSeconds = 60 * 60;

  // When duration changes (by drag), reset timer
  useEffect(() => {
    setTimeLeft(duration);
    setIsRunning(false);
    setIsPaused(false);
  }, [duration]);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(1, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Convert mouse/touch position to timer value
  const getSecondsFromPointer = (clientX: number, clientY: number) => {
    if (!svgRef.current) return timeLeft;
    const rect = svgRef.current.getBoundingClientRect();
    const center = 45; // svgSize / 2
    const x = clientX - rect.left - center;
    const y = clientY - rect.top - center;
    let theta = Math.atan2(y, x) + Math.PI / 2;
    if (theta < 0) theta += 2 * Math.PI;
    const percent = theta / (2 * Math.PI);
    let seconds = Math.round(percent * maxSeconds);
    if (seconds < minSeconds) seconds = minSeconds;
    if (seconds > maxSeconds) seconds = maxSeconds;
    return seconds;
  };

  // Drag handlers
  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDragging(true);
    if (isRunning) {
      setIsRunning(false);
      setIsPaused(false);
    }
    document.body.style.userSelect = "none";
  };

  const onPointerMove = (e: MouseEvent | TouchEvent) => {
    if (!dragging) return;
    let clientX: number, clientY: number;
    if ("touches" in e && e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e && "clientY" in e) {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    } else {
      return;
    }
    const seconds = getSecondsFromPointer(clientX, clientY);
    setPreviewDuration(seconds);
  };

  const onPointerUp = () => {
    if (previewDuration) {
      setDuration(previewDuration);
      setTimeLeft(previewDuration);
    }
    setPreviewDuration(null);
    setDragging(false);
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onPointerMove);
      window.addEventListener("touchmove", onPointerMove);
      window.addEventListener("mouseup", onPointerUp);
      window.addEventListener("touchend", onPointerUp);
      return () => {
        window.removeEventListener("mousemove", onPointerMove);
        window.removeEventListener("touchmove", onPointerMove);
        window.removeEventListener("mouseup", onPointerUp);
        window.removeEventListener("touchend", onPointerUp);
      };
    }
  }, [dragging, previewDuration, onPointerMove, onPointerUp]);

  // Sound on timer end
  const playEndSound = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.value = 0.1;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.25);
      o.onended = () => ctx.close();
    } catch {}
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsPaused(false);
            playEndSound();
            if (typeof window !== "undefined" && "Notification" in window) {
              new Notification("Timer Complete!", {
                body: "Your timer has finished!",
                icon: "/favicon.ico",
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused, timeLeft, playEndSound]);

  // Start/Pause timer
  const toggleTimer = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
    } else if (isPaused) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  }, [isRunning, isPaused]);

  // Reset timer
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(duration);
  }, [duration]);

  return {
    duration,
    timeLeft,
    isRunning,
    isPaused,
    dragging,
    previewDuration,
    toggleTimer,
    resetTimer,
    setDuration,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    formatTime,
    getSecondsFromPointer,
  };
}
