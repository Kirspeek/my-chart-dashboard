# Theme System

This folder contains the centralized theme system for the project. The goal is to eliminate hardcoded colors throughout the codebase and provide a single source of truth for all color definitions.

## Structure

- `colorsTheme.ts` - Contains all color definitions organized by theme (light/dark) and widget-specific colors
- `index.ts` - Exports all theme-related functions and types

## Usage

### In Components

```typescript
import { useTheme } from "@/hooks/useTheme";

function MyComponent() {
  const { colorsTheme } = useTheme();

  // Access widget-specific colors
  const clockColors = colorsTheme.widgets.clock;

  return (
    <div style={{ color: clockColors.accentColor }}>
      Content
    </div>
  );
}
```

### Adding New Widget Colors

1. Add the widget color interface to `ColorsTheme.widgets`:

```typescript
widgets: {
  clock: {
    // existing clock colors...
  },
      weather: {
      loadingText: string;
      errorText: string;
      statusColors: {
        cached: string;
        preloading: string;
        stale: string;
        fallback: string;
      };
    },
    timer: {
      circleColors: {
        background: string;
        progress: string;
        knob: string;
        knobBorder: string;
      };
      modeColors: {
        focus: string;
        break: string;
        rest: string;
        quick: string;
      };
      buttonColors: {
        activeBackground: string;
        inactiveBackground: string;
        activeBorder: string;
        inactiveBorder: string;
        activeText: string;
        inactiveText: string;
      };
    },
    map: {
      markerColors: {
        stroke: string;
        fill: string;
      };
      searchColors: {
        background: string;
        text: string;
        shadow: string;
        placeholder: string;
      };
    },
    calendar: {
      accentColor: string;
      todayBackground: string;
      textColors: {
        primary: string;
        secondary: string;
        muted: string;
        label: string;
      };
      backgroundColors: {
        event: string;
        input: string;
      };
      borderColors: {
        input: string;
        focus: string;
      };
    },
    wallet: {
      buttonColors: {
        background: string;
        backgroundHover: string;
        backgroundActive: string;
        text: string;
        shadow: string;
        shadowHover: string;
        shadowActive: string;
      };
      cardColors: {
        defaultText: string;
        defaultBackgrounds: string[];
      };
    },
    wheel: {
      background: {
        gradient: string;
        border: string;
        shadow: string;
      };
      button: {
        text: string;
      };
    },
    walletCard: {
      button: {
        text: string;
      };
      waves: {
        background: string;
      };
    },
    contributionGraph: {
      valueRanges: {
        noActivity: string;
        veryLow: string;
        low: string;
        mediumLow: string;
        medium: string;
        high: string;
      };
      header: {
        background: string;
        border: string;
        shadow: string;
        text: string;
        buttonBackground: string;
        buttonText: string;
        buttonBorder: string;
      };
    },
    metric: {
      trend: {
        negative: string;
      };
      icon: {
        text: string;
      };
    },
    lineChart: {
      tooltip: {
        background: string;
        border: string;
      };
      chart: {
        dotStroke: string;
      };
    },
    barChart: {
      tooltip: {
        background: string;
        border: string;
      };
      chart: {
        dotStroke: string;
      };
    },
    newWidget: {
      primaryColor: string;
      secondaryColor: string;
      // ... other colors
    },
}
```

2. Add the actual color values to both `lightColorsTheme` and `darkColorsTheme`:

```typescript
widgets: {
  clock: {
    // existing clock colors...
  },
  weather: {
    loadingText: "var(--color-gray)",
    errorText: "#ea4300", // light theme
    statusColors: {
      cached: "var(--color-gray)",
      preloading: "#eab308",
      stale: "#f87171",
      fallback: "#b0b0a8",
    },
  },
  newWidget: {
    primaryColor: "#ea4300", // light theme
    secondaryColor: "#ff6b4a", // dark theme
  },
}
```

## Migration Process

1. **Identify hardcoded colors** in a widget
2. **Add widget colors** to the theme interface and implementations
3. **Update the widget** to use `colorsTheme.widgets.widgetName`
4. **Test** both light and dark themes
5. **Remove hardcoded colors** from the widget

## Benefits

- **Consistency**: All colors are defined in one place
- **Maintainability**: Easy to update colors across the entire project
- **Theme Support**: Automatic light/dark theme switching
- **Type Safety**: TypeScript interfaces ensure color properties exist
- **Documentation**: Clear organization of colors by widget and purpose

## Current Status

- ✅ Clock Widget - Migrated to use centralized colors
- ✅ Weather Widget - Migrated to use centralized colors
- ✅ Timer Widget - Migrated to use centralized colors
- ✅ Map Widget - Migrated to use centralized colors
- ✅ Calendar Widget - Migrated to use centralized colors
- ✅ Wallet Widget - Migrated to use centralized colors
- ✅ Wheel Widget - Migrated to use centralized colors
- ✅ Wallet Card Widget - Migrated to use centralized colors
- ✅ Contribution Graph Widget - Migrated to use centralized colors
- ✅ Metric Widget - Migrated to use centralized colors
- ✅ Line Chart Widget - Migrated to use centralized colors
- ✅ Bar Chart Widget - Migrated to use centralized colors
- 🔄 Other widgets - Pending migration
