export interface ColorsTheme {
  primary: string;
  secondary: string;
  muted: string;
  cardBackground: string;
  borderSecondary: string;

  primaryText: string;
  secondaryText: string;
  mutedText: string;
  weatherTextSecondary: string;

  accent: {
    red: string;
    yellow: string;
    teal: string;
    blue: string;
    green?: string;
  };

  widgets: {
    clock: {
      accentColor: string;
      hoverBackground: string;
      activeBackground: string;
      inactiveBorder: string;
      inactiveText: string;
      selectedText: string;
      selectedBackground: string;
    };
    weather: {
      loadingText: string;
      errorText: string;
      statusColors: {
        cached: string;
        preloading: string;
        stale: string;
        fallback: string;
      };
    };
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
    };
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
    };
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
    };
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
    };
    wheel: {
      background: {
        gradient: string;
        border: string;
        shadow: string;
      };
      button: {
        text: string;
      };
    };
    walletCard: {
      button: {
        text: string;
      };
      waves: {
        background: string;
      };
    };
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
    };
    metric: {
      trend: {
        negative: string;
      };
      icon: {
        text: string;
      };
    };
    lineChart: {
      grid: string;
      axis: string;
      tooltip: {
        background: string;
        border: string;
      };
      chart: {
        dotStroke: string;
      };
      lines: {
        sales: string;
        revenue: string;
        profit: string;
      };
    };
    barChart: {
      grid: string;
      axis: string;
      tooltip: {
        background: string;
        border: string;
      };
      chart: {
        dotStroke: string;
      };
      bars: {
        sales: string;
        revenue: string;
      };
    };
    deviceUsage: {
      colors: {
        primary: string;
        secondary: string;
        fill: string;
      };
      opacity: {
        primary: string[];
        secondary: string[];
      };
      shadow: string;
    };
    recentUsers: {
      background: {
        pattern: string;
      };
      table: {
        headerText: string;
        rowHover: string;
        accentDot: string;
        roleIcon: string;
        statusIcon: string;
        clockIcon: string;
      };
      text: {
        primary: string;
        secondary: string;
        hover: string;
      };
    };
    sankeyChart: {
      background: {
        pattern: string;
        tooltip: string;
      };
      button: {
        text: string;
        background: string;
        border: string;
        hoverBackground: string;
      };
      header: {
        icon: {
          primary: string;
          secondary: string;
        };
        background: {
          primary: string;
          secondary: string;
        };
      };
      stats: {
        trend: {
          positive: string;
          negative: string;
        };
        background: {
          primary: string;
          secondary: string;
          tertiary: string;
          quaternary: string;
          quinary: string;
          senary: string;
        };
        text: string;
      };
    };
    chordChart: {
      background: {
        pattern: string;
        tooltip: string;
      };
    };
    bubbleChart: {
      categoryColors: {
        bigTech: string;
        aiCloud: string;
        fintech: string;
        emergingTech: string;
        healthcare: string;
        energy: string;
        default: string;
      };
      button: {
        background: string;
        border: string;
        selectedBackground: string;
        selectedBorder: string;
        text: string;
      };
    };
    timelineRings: {
      fallback: string;
      purple: string;
      gradient: {
        stop1: string;
        stop2: string;
        stop3: string;
      };
      background: string;
      fill: string;
    };
    pieChart: {
      colors: string[];
      fill: string;
      tooltip: {
        background: string;
        border: string;
      };
    };
    header: {
      icon: string;
    };
    rainAnimation: {
      background: string;
      cloudGradient: {
        start: string;
        end: string;
      };
      dropGradient: {
        start: string;
        end: string;
      };
    };
    sunAnimation: {
      gradient: {
        start: string;
        end: string;
      };
    };
    hotWeatherBackground: {
      background: string;
      cloudColors: {
        primary: string;
        secondary: string;
        tertiary: string;
      };
      thermometer: {
        fill: string;
        stroke: string;
        mercury: string;
        glow: string;
      };
      sunGradient: {
        start: string;
        end: string;
      };
    };
    cloudAnimation: {
      primary: string;
      secondary: string;
    };
    hotAnimation: {
      thermometer: {
        fill: string;
        stroke: string;
        mercury: string;
        glow: string;
      };
      sunGradient: {
        start: string;
        end: string;
      };
    };
    lightning: {
      background: string;
      defaultHue: number;
    };
    spendingProgress: {
      active: string;
      inactive: string;
    };
    bottomSegmentInfo: {
      darkText: string;
      lightText: string;
      borderOpacity: {
        light: string;
        dark: string;
      };
      shadow: {
        light: string;
        dark: string;
      };
    };
  };
}

export const lightColorsTheme: ColorsTheme = {
  primary: "#f2f0ef",
  secondary: "#888",
  muted: "#b0b0a8",
  cardBackground: "rgba(35, 35, 35, 0.07)",
  borderSecondary: "#e0e0e0",

  primaryText: "var(--primary-text)",
  secondaryText: "var(--secondary-text)",
  mutedText: "var(--muted-text)",
  weatherTextSecondary: "var(--weather-text-secondary)",

  accent: {
    red: "#ea4300",
    yellow: "#ffdd6d",
    teal: "#425b59",
    blue: "#7bc2e8",
  },

  widgets: {
    clock: {
      accentColor: "#ea4300", 
      hoverBackground: "#ea430010", 
      activeBackground: "#ea43001a", 
      inactiveBorder: "var(--muted-text)",
      inactiveText: "var(--muted-text)",
      selectedText: "#fff",
      selectedBackground: "#ea4300",
    },
    weather: {
      loadingText: "var(--color-gray)",
      errorText: "#ea4300", 
      statusColors: {
        cached: "var(--color-gray)",
        preloading: "#eab308", 
        stale: "#f87171", 
        fallback: "#b0b0a8", 
      },
    },
    timer: {
      circleColors: {
        background: "#ccc",
        progress: "#ff9a9a",
        knob: "#fff",
        knobBorder: "#ff9a9a",
      },
      modeColors: {
        focus: "#ea4300", 
        break: "#7bc2e8", 
        rest: "#425b59", 
        quick: "#ffdd6d", 
      },
      buttonColors: {
        activeBackground: "var(--button-bg)",
        inactiveBackground: "var(--button-bg)",
        activeBorder: "var(--button-border)",
        inactiveBorder: "var(--button-border)",
        activeText: "var(--secondary-text)",
        inactiveText: "var(--secondary-text)",
      },
    },
    map: {
      markerColors: {
        stroke: "#222",
        fill: "#fff",
      },
      searchColors: {
        background: "rgba(255, 255, 255, 0.5)",
        text: "#222",
        shadow: "rgba(124, 58, 237, 0.04)",
        placeholder: "#666",
      },
    },
    calendar: {
      accentColor: "#425b59", 
      todayBackground: "rgba(35, 35, 35, 0.15)",
      textColors: {
        primary: "#1f2937", 
        secondary: "#4b5563", 
        muted: "#6b7280", 
        label: "#374151", 
      },
      backgroundColors: {
        event: "#f9fafb", 
        input: "rgba(255, 255, 255, 0.3)",
      },
      borderColors: {
        input: "#e5e7eb", 
        focus: "var(--accent-color)",
      },
    },
    wallet: {
      buttonColors: {
        background: "rgba(35, 35, 35, 0.07)",
        backgroundHover: "rgba(35, 35, 35, 0.12)",
        backgroundActive: "rgba(35, 35, 35, 0.18)",
        text: "#fff",
        shadow:
          "0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        shadowHover:
          "0 6px 12px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
        shadowActive:
          "inset 0 4px 8px rgba(0, 0, 0, 0.3), inset 0 -1px 2px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1)",
      },
      cardColors: {
        defaultText: "#222",
        defaultBackgrounds: [
          "#F4E4A6", 
          "#F4C2C2", 
          "#B8D4E3", 
          "#B8D4B8", 
          "#D4B8F4", 
          "#F4D4B8", 
          "#B8E3F4", 
          "#F4B8D4", 
        ],
      },
    },
    wheel: {
      background: {
        gradient: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        border: "rgba(255, 255, 255, 0.2)",
        shadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      button: {
        text: "#ffffff",
      },
    },
    walletCard: {
      button: {
        text: "#ffffff",
      },
      waves: {
        background:
          "repeating-radial-gradient(center center, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1) 2px, transparent 2px, transparent 100%)",
      },
    },
    contributionGraph: {
      valueRanges: {
        noActivity: "#ebedf0",
        veryLow: "#FFE9EF",
        low: "#FFC9D7",
        mediumLow: "#FFBCCD",
        medium: "#FF9CB5",
        high: "#FC809F",
      },
      header: {
        background: "linear-gradient(135deg, #FFE9EF 0%, #FFC9D7 100%)",
        border: "#FC809F",
        shadow: "0 2px 8px rgba(252, 128, 159, 0.15)",
        text: "#FC809F",
        buttonBackground: "#FC809F",
        buttonText: "white",
        buttonBorder: "#FC809F",
      },
    },
    metric: {
      trend: {
        negative: "#ef4444",
      },
      icon: {
        text: "#ffffff",
      },
    },
    lineChart: {
      grid: "#e5e7eb",
      axis: "#6b7280",
      tooltip: {
        background: "rgba(255, 255, 255, 0.95)",
        border: "rgba(0, 0, 0, 0.1)",
      },
      chart: {
        dotStroke: "#ffffff",
      },
      lines: {
        sales: "#3b82f6",
        revenue: "#10b981",
        profit: "#f59e0b",
      },
    },
    barChart: {
      grid: "#e5e7eb",
      axis: "#6b7280",
      tooltip: {
        background: "rgba(255, 255, 255, 0.95)",
        border: "rgba(0, 0, 0, 0.1)",
      },
      chart: {
        dotStroke: "#ffffff",
      },
      bars: {
        sales: "#3b82f6",
        revenue: "#10b981",
      },
    },
    deviceUsage: {
      colors: {
        primary: "rgba(234, 122, 0, 1)",
        secondary: "rgba(234, 122, 0, 0.5)",
        fill: "#8884d8",
      },
      opacity: {
        primary: [
          "rgba(234, 122, 0, 0.6)",
          "rgba(234, 122, 0, 0.5)",
          "rgba(234, 122, 0, 0.4)",
          "rgba(234, 122, 0, 0.35)",
          "rgba(234, 122, 0, 0.3)",
          "rgba(234, 122, 0, 0.25)",
          "rgba(234, 122, 0, 0.2)",
          "rgba(234, 122, 0, 0.15)",
        ],
        secondary: [
          "rgba(234, 122, 0, 0.15)",
          "rgba(234, 122, 0, 0.12)",
          "rgba(234, 122, 0, 0.1)",
          "rgba(234, 122, 0, 0.08)",
          "rgba(234, 122, 0, 0.06)",
          "rgba(234, 122, 0, 0.04)",
          "rgba(234, 122, 0, 0.02)",
          "rgba(234, 122, 0, 0.01)",
        ],
      },
      shadow: "rgba(35, 35, 35, 0.18)",
    },
    recentUsers: {
      background: {
        pattern: "var(--accent-color)",
      },
      table: {
        headerText: "var(--secondary-text)",
        rowHover: "var(--button-hover-bg)",
        accentDot: "var(--accent-color)",
        roleIcon: "var(--accent-color)",
        statusIcon: "var(--accent-color)",
        clockIcon: "var(--accent-color)",
      },
      text: {
        primary: "var(--secondary-text)",
        secondary: "var(--secondary-text)",
        hover: "var(--accent-color)",
      },
    },
    sankeyChart: {
      background: {
        pattern: "url(#backgroundPattern)",
        tooltip: "#fff",
      },
      button: {
        text: "#ffffff",
        background: "#818CF8",
        border: "#818CF8",
        hoverBackground: "#6366F1",
      },
      header: {
        icon: {
          primary: "#ffffff",
          secondary: "#000000",
        },
        background: {
          primary: "#374151",
          secondary: "#4B5563",
        },
      },
      stats: {
        trend: {
          positive: "#34D399",
          negative: "#EF4444",
        },
        background: {
          primary: "#E0E7FF",
          secondary: "#F0FDF4",
          tertiary: "#FEF3C7",
          quaternary: "#FEE2E2",
          quinary: "#F3E8FF",
          senary: "#ECFDF5",
        },
        text: "#fff",
      },
    },
    chordChart: {
      background: {
        pattern: "url(#backgroundPattern)",
        tooltip: "#fff",
      },
    },
    bubbleChart: {
      categoryColors: {
        bigTech: "#FF6B9D",
        aiCloud: "#4ECDC4",
        fintech: "#45B7D1",
        emergingTech: "#96CEB4",
        healthcare: "#FFA726",
        energy: "#AB47BC",
        default: "#FF6B9D",
      },
      button: {
        background: "#4ECDC4",
        border: "#4ECDC4",
        selectedBackground: "#f3f4f6",
        selectedBorder: "#e5e7eb",
        text: "#f8f9fa",
      },
    },
    timelineRings: {
      fallback: "#666666",
      purple: "#b39ddb",
      gradient: {
        stop1: "#ffffff",
        stop2: "#eaeaea",
        stop3: "#d0d0d0",
      },
      background: "#fff",
      fill: "#fff",
    },
    pieChart: {
      colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
      fill: "#8884d8",
      tooltip: {
        background: "#ffffff",
        border: "#e5e7eb",
      },
    },
    header: {
      icon: "#b0b0a8",
    },
    rainAnimation: {
      background: "linear-gradient(to bottom, #3a7ca5 0%, #274472 100%)",
      cloudGradient: {
        start: "#fff",
        end: "#dbe6ef",
      },
      dropGradient: {
        start: "rgba(13,52,58,1)",
        end: "rgba(255,255,255,0.6)",
      },
    },
    sunAnimation: {
      gradient: {
        start: "#FFF59D",
        end: "#FFD54F",
      },
    },
    hotWeatherBackground: {
      background: "linear-gradient(165deg, #ff512f 0%, #ffb347 100%)",
      cloudColors: {
        primary: "#ffb347",
        secondary: "#ff7043",
        tertiary: "#ffd580",
      },
      thermometer: {
        fill: "#fff",
        stroke: "#444",
        mercury: "#ea4300",
        glow: "#ff5722",
      },
      sunGradient: {
        start: "#FFF59D",
        end: "#FFD54F",
      },
    },
    cloudAnimation: {
      primary: "#fff",
      secondary: "#e0e0e0",
    },
    hotAnimation: {
      thermometer: {
        fill: "#fff",
        stroke: "#444",
        mercury: "#ea4300",
        glow: "#ff5722",
      },
      sunGradient: {
        start: "#FFF59D",
        end: "#FFD54F",
      },
    },
    lightning: {
      background: "rgba(0.07, 0.07, 0.09, 1.0)",
      defaultHue: 50,
    },
    spendingProgress: {
      active: "#222222",
      inactive: "rgba(35, 35, 35, 0.2)",
    },
    bottomSegmentInfo: {
      darkText: "#222222",
      lightText: "#ffffff",
      borderOpacity: {
        light: "0.08",
        dark: "0.15",
      },
      shadow: {
        light:
          "0 8px 14px rgba(0,0,0,0.06), 0 2px 5px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.2)",
        dark: "0 8px 14px rgba(0,0,0,0.12), 0 2px 5px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.15)",
      },
    },
  },
};

export const darkColorsTheme: ColorsTheme = {
  primary: "#ffffff",
  secondary: "#a0a0a0",
  muted: "#808080",
  cardBackground: "rgba(255, 255, 255, 0.05)",
  borderSecondary: "#333333",

  primaryText: "var(--primary-text)",
  secondaryText: "var(--secondary-text)",
  mutedText: "var(--muted-text)",
  weatherTextSecondary: "var(--weather-text-secondary)",

  accent: {
    red: "#ff6b4a",
    yellow: "#ffdd6d",
    teal: "#5a7a78",
    green: "#10b981",
    blue: "#7bc2e8",
  },

  widgets: {
    clock: {
      accentColor: "#ff6b4a", 
      hoverBackground: "#ff6b4a10", 
      activeBackground: "#ff6b4a1a", 
      inactiveBorder: "var(--muted-text)",
      inactiveText: "var(--muted-text)",
      selectedText: "#fff",
      selectedBackground: "#ff6b4a",
    },
    weather: {
      loadingText: "var(--color-gray)",
      errorText: "#ff6b4a", 
      statusColors: {
        cached: "var(--color-gray)",
        preloading: "#eab308", 
        stale: "#f87171", 
        fallback: "#b0b0a8", 
      },
    },
    timer: {
      circleColors: {
        background: "#666",
        progress: "#ff9a9a",
        knob: "#fff",
        knobBorder: "#ff9a9a",
      },
      modeColors: {
        focus: "#ff6b4a",
        break: "#7bc2e8",
        rest: "#5a7a78",
        quick: "#ffdd6d",
      },
      buttonColors: {
        activeBackground: "var(--button-bg)",
        inactiveBackground: "var(--button-bg)",
        activeBorder: "var(--button-border)",
        inactiveBorder: "var(--button-border)",
        activeText: "var(--secondary-text)",
        inactiveText: "var(--secondary-text)",
      },
    },
    map: {
      markerColors: {
        stroke: "#fff",
        fill: "#222",
      },
      searchColors: {
        background: "rgba(0, 0, 0, 0.5)",
        text: "#fff",
        shadow: "rgba(124, 58, 237, 0.04)",
        placeholder: "#ccc",
      },
    },
    calendar: {
      accentColor: "#5a7a78",
      todayBackground: "rgba(255, 255, 255, 0.15)",
      textColors: {
        primary: "#f9fafb",
        secondary: "#d1d5db",
        muted: "#9ca3af",
        label: "#e5e7eb",
      },
      backgroundColors: {
        event: "#374151",
        input: "rgba(0, 0, 0, 0.3)",
      },
      borderColors: {
        input: "#4b5563",
        focus: "var(--accent-color)",
      },
    },
    wallet: {
      buttonColors: {
        background: "rgba(255, 255, 255, 0.07)",
        backgroundHover: "rgba(255, 255, 255, 0.12)",
        backgroundActive: "rgba(255, 255, 255, 0.18)",
        text: "#fff",
        shadow:
          "0 4px 8px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        shadowHover:
          "0 6px 12px rgba(0, 0, 0, 0.25), 0 3px 6px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
        shadowActive:
          "inset 0 4px 8px rgba(0, 0, 0, 0.4), inset 0 -1px 2px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.2)",
      },
      cardColors: {
        defaultText: "#e5e7eb",
        defaultBackgrounds: [
          "#4a4a2a",
          "#4a2a2a",
          "#2a3a4a",
          "#2a4a2a",
          "#3a2a4a",
          "#4a3a2a",
          "#2a4a4a",
          "#4a2a3a",
        ],
      },
    },
    wheel: {
      background: {
        gradient: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        border: "rgba(255, 255, 255, 0.1)",
        shadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
      },
      button: {
        text: "#ffffff",
      },
    },
    walletCard: {
      button: {
        text: "#ffffff",
      },
      waves: {
        background:
          "repeating-radial-gradient(center center, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05) 2px, transparent 2px, transparent 100%)",
      },
    },
    contributionGraph: {
      valueRanges: {
        noActivity: "#2a2a2a",
        veryLow: "#FFE9EF",
        low: "#FFC9D7",
        mediumLow: "#FFBCCD",
        medium: "#FF9CB5",
        high: "#FC809F",
      },
      header: {
        background: "linear-gradient(135deg, #FFE9EF 0%, #FFC9D7 100%)",
        border: "#FC809F",
        shadow: "0 2px 8px rgba(252, 128, 159, 0.25)",
        text: "#FC809F",
        buttonBackground: "#FC809F",
        buttonText: "white",
        buttonBorder: "#FC809F",
      },
    },
    metric: {
      trend: {
        negative: "#ef4444",
      },
      icon: {
        text: "#ffffff",
      },
    },
    lineChart: {
      grid: "#374151",
      axis: "#9ca3af",
      tooltip: {
        background: "rgba(30, 30, 30, 0.95)",
        border: "rgba(255, 255, 255, 0.1)",
      },
      chart: {
        dotStroke: "#ffffff",
      },
      lines: {
        sales: "#3b82f6",
        revenue: "#10b981",
        profit: "#f59e0b",
      },
    },
    barChart: {
      grid: "#374151",
      axis: "#9ca3af",
      tooltip: {
        background: "rgba(30, 30, 30, 0.95)",
        border: "rgba(255, 255, 255, 0.1)",
      },
      chart: {
        dotStroke: "#ffffff",
      },
      bars: {
        sales: "#3b82f6",
        revenue: "#10b981",
      },
    },
    deviceUsage: {
      colors: {
        primary: "rgba(234, 122, 0, 1)",
        secondary: "rgba(234, 122, 0, 0.5)",
        fill: "#8884d8",
      },
      opacity: {
        primary: [
          "rgba(234, 122, 0, 0.6)",
          "rgba(234, 122, 0, 0.5)",
          "rgba(234, 122, 0, 0.4)",
          "rgba(234, 122, 0, 0.35)",
          "rgba(234, 122, 0, 0.3)",
          "rgba(234, 122, 0, 0.25)",
          "rgba(234, 122, 0, 0.2)",
          "rgba(234, 122, 0, 0.15)",
        ],
        secondary: [
          "rgba(234, 122, 0, 0.15)",
          "rgba(234, 122, 0, 0.12)",
          "rgba(234, 122, 0, 0.1)",
          "rgba(234, 122, 0, 0.08)",
          "rgba(234, 122, 0, 0.06)",
          "rgba(234, 122, 0, 0.04)",
          "rgba(234, 122, 0, 0.02)",
          "rgba(234, 122, 0, 0.01)",
        ],
      },
      shadow: "rgba(0, 0, 0, 0.3)",
    },
    recentUsers: {
      background: {
        pattern: "var(--accent-color)",
      },
      table: {
        headerText: "var(--secondary-text)",
        rowHover: "var(--button-hover-bg)",
        accentDot: "var(--accent-color)",
        roleIcon: "var(--accent-color)",
        statusIcon: "var(--accent-color)",
        clockIcon: "var(--accent-color)",
      },
      text: {
        primary: "var(--secondary-text)",
        secondary: "var(--secondary-text)",
        hover: "var(--accent-color)",
      },
    },
    sankeyChart: {
      background: {
        pattern: "url(#backgroundPattern)",
        tooltip: "#fff",
      },
      button: {
        text: "#ffffff",
        background: "#818CF8",
        border: "#818CF8",
        hoverBackground: "#6366F1",
      },
      header: {
        icon: {
          primary: "#ffffff",
          secondary: "#000000",
        },
        background: {
          primary: "#374151",
          secondary: "#4B5563",
        },
      },
      stats: {
        trend: {
          positive: "#34D399",
          negative: "#EF4444",
        },
        background: {
          primary: "#E0E7FF",
          secondary: "#F0FDF4",
          tertiary: "#FEF3C7",
          quaternary: "#FEE2E2",
          quinary: "#F3E8FF",
          senary: "#ECFDF5",
        },
        text: "#fff",
      },
    },
    chordChart: {
      background: {
        pattern: "url(#backgroundPattern)",
        tooltip: "#fff",
      },
    },
    bubbleChart: {
      categoryColors: {
        bigTech: "#FF6B9D",
        aiCloud: "#4ECDC4",
        fintech: "#45B7D1",
        emergingTech: "#96CEB4",
        healthcare: "#FFA726",
        energy: "#AB47BC",
        default: "#FF6B9D",
      },
      button: {
        background: "#4ECDC4",
        border: "#4ECDC4",
        selectedBackground: "#f3f4f6",
        selectedBorder: "#e5e7eb",
        text: "#f8f9fa",
      },
    },
    timelineRings: {
      fallback: "#666666",
      purple: "#b39ddb",
      gradient: {
        stop1: "#ffffff",
        stop2: "#eaeaea",
        stop3: "#d0d0d0",
      },
      background: "#fff",
      fill: "#fff",
    },
    pieChart: {
      colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
      fill: "#8884d8",
      tooltip: {
        background: "#ffffff",
        border: "#e5e7eb",
      },
    },
    header: {
      icon: "#b0b0a8",
    },
    rainAnimation: {
      background: "linear-gradient(to bottom, #2a4a6a 0%, #1a3a5a 100%)",
      cloudGradient: {
        start: "#fff",
        end: "#dbe6ef",
      },
      dropGradient: {
        start: "rgba(13,52,58,1)",
        end: "rgba(255,255,255,0.6)",
      },
    },
    sunAnimation: {
      gradient: {
        start: "#FFF59D",
        end: "#FFD54F",
      },
    },
    hotWeatherBackground: {
      background: "linear-gradient(165deg, #ff512f 0%, #ffb347 100%)",
      cloudColors: {
        primary: "#ffb347",
        secondary: "#ff7043",
        tertiary: "#ffd580",
      },
      thermometer: {
        fill: "#fff",
        stroke: "#444",
        mercury: "#444",
        glow: "#ff5722",
      },
      sunGradient: {
        start: "#FFF59D",
        end: "#FFD54F",
      },
    },
    cloudAnimation: {
      primary: "#fff",
      secondary: "#e0e0e0",
    },
    hotAnimation: {
      thermometer: {
        fill: "#fff",
        stroke: "#444",
        mercury: "#ea4300",
        glow: "#ff5722",
      },
      sunGradient: {
        start: "#FFF59D",
        end: "#FFD54F",
      },
    },
    lightning: {
      background: "rgba(0.07, 0.07, 0.09, 1.0)",
      defaultHue: 50,
    },
    spendingProgress: {
      active: "#222222",
      inactive: "rgba(35, 35, 35, 0.2)",
    },
    bottomSegmentInfo: {
      darkText: "#222222",
      lightText: "#ffffff",
      borderOpacity: {
        light: "0.08",
        dark: "0.15",
      },
      shadow: {
        light:
          "0 8px 14px rgba(0,0,0,0.06), 0 2px 5px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.2)",
        dark: "0 8px 14px rgba(0,0,0,0.12), 0 2px 5px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.15)",
      },
    },
  },
};

export function getColorsTheme(isDark: boolean): ColorsTheme {
  return isDark ? darkColorsTheme : lightColorsTheme;
}
