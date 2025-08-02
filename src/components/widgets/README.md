# Widget Components - Reorganized Structure

This directory contains all widget components that have been reorganized for better maintainability and readability.

## Structure Overview

### Timer Widget (`timer/`)

- **TimerWidget.tsx** - Main timer component (clean, focused on layout)
- **TimerCircle.tsx** - SVG circle component for the timer display
- **TimerControls.tsx** - Control buttons component
- **index.ts** - Exports for the timer module

### Clock Widget (`clock/`)

- **ClockWidget.tsx** - Main clock component (clean, focused on layout)
- **ClockDisplay.tsx** - Main time display component
- **WorldClocks.tsx** - World timezone display component
- **index.ts** - Exports for the clock module

### Weather Widget (`../weather/`)

- **WeatherWidget.tsx** - Main weather component (clean, focused on layout)
- **WeatherAnimations.tsx** - Weather-specific animations component
- **WeatherStatus.tsx** - Weather cache status component
- **WeatherBackground.tsx** - Weather background component
- **WeatherText.tsx** - Weather text display component
- **ForecastDay.tsx** - Individual forecast day component

### Other Widgets

- **MapComponent.tsx** - Map widget component
- **MusicWidget.tsx** - Music widget component

## Interfaces and Hooks Organization

### Interfaces (`interfaces/widgets.ts`)

All widget-related interfaces are now centralized in the interfaces folder:

- `TimeZone`, `ClockState`, `ClockActions` - Clock widget interfaces
- `TimerState`, `TimerActions` - Timer widget interfaces
- `WeatherState`, `WeatherActions` - Weather widget interfaces
- `ClockWidgetProps`, `WeatherWidgetProps` - Component props interfaces
- `ForecastDay`, `ForecastDayProps` - Weather forecast interfaces
- `WeatherBackgroundProps`, `WeatherTextProps` - Weather component interfaces
- `MetricCardProps` - Metric card interface

### Hooks (`src/hooks/`)

All widget-related hooks are now centralized in the hooks folder:

- `useTimerLogic()` - Timer state and logic management
- `useClockLogic(selectedZone)` - Clock state and timezone logic
- `useWeatherLogic(city)` - Weather state and forecast logic
- `timeZones` - Timezone data exported from clock logic

## Benefits of Reorganization

1. **Separation of Concerns**: Logic, UI components, and state management are now separated
2. **Centralized Interfaces**: All widget interfaces are in one place for easy maintenance
3. **Centralized Hooks**: All widget logic is in the hooks folder for reusability
4. **Reusability**: Individual components and hooks can be reused in other contexts
5. **Maintainability**: Smaller, focused files are easier to understand and modify
6. **Testability**: Logic can be tested independently from UI components
7. **Readability**: Each file has a single, clear responsibility

## Usage

```tsx
// Import the main widgets
import TimerWidget from "@/components/widgets/timer/TimerWidget";
import ClockWidget from "@/components/widgets/clock/ClockWidget";
import WeatherWidget from "@/components/weather/WeatherWidget";

// Import hooks from centralized location
import { useTimerLogic } from "@/hooks/useTimerLogic";
import { useClockLogic, timeZones } from "@/hooks";
import { useWeatherLogic } from "@/hooks/useWeatherLogic";

// Import interfaces from centralized location
import type {
  TimerState,
  ClockState,
  WeatherState,
} from "@/interfaces/widgets";

// Or import individual components if needed
import TimerCircle from "@/components/widgets/timer/TimerCircle";
import ClockDisplay from "@/components/widgets/clock/ClockDisplay";
```

## File Size Reduction

- **TimerWidget**: 418 lines → 60 lines (main component)
- **ClockWidget**: 227 lines → 81 lines (main component)
- **WeatherWidget**: 200 lines → 85 lines (main component)

The logic has been extracted into custom hooks and smaller, focused components, making the codebase much more maintainable.

## File Organization Summary

```
src/
├── hooks/                    # Centralized hooks
│   ├── useTimerLogic.ts     # Timer logic
│   ├── useClockLogic.ts     # Clock logic
│   ├── useWeatherLogic.ts   # Weather logic
│   └── index.ts
├── components/widgets/       # UI components only
│   ├── timer/
│   ├── clock/
│   └── weather/
└── interfaces/              # Centralized interfaces
    └── widgets.ts           # All widget interfaces
```
