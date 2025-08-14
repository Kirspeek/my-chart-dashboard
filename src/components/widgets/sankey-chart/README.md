# Enhanced Global Migration Flows Widget

A comprehensive, interactive Sankey diagram widget for visualizing global migration flows with enhanced functionality, beautiful design, and advanced user interactions.

## ✨ Latest Enhancements

### 🎨 Enhanced Visual Design

- **Modern Color Palette**: Updated to use vibrant, modern colors with better contrast
- **Gradient Effects**: Beautiful gradient backgrounds and flow paths
- **Enhanced Shadows**: Improved drop shadows and depth effects
- **Glass-morphism**: Modern glass-morphism effects throughout the interface
- **Smooth Animations**: Fluid transitions and hover effects

### 🌈 New Color Scheme

- **Primary Colors**:
  - Blue: `#60A5FA` (Lighter Blue accent)
  - Emerald: `#34D399` (Lighter Emerald success)
  - Amber: `#FBBF24` (Lighter Amber highlight)
  - Red: `#F87171` (Lighter Red danger)
  - Violet: `#A78BFA` (Lighter Violet accent)
  - Cyan: `#22D3EE` (Lighter Cyan info)

### 🎯 Global Tooltip System

- **Always Visible**: Tooltips appear on hover and stay visible
- **Rich Content**: Support for titles, subtitles, and custom content
- **Global Context**: Available across all widgets in the dashboard
- **Beautiful Styling**: Dark theme with blur effects and smooth animations
- **Smart Positioning**: Automatically positioned to avoid screen edges

## Features

### 🎨 Enhanced Design

- **Modern UI Components**: Custom 3D buttons, animated backgrounds, and glass-morphism effects
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Theme Integration**: Seamless integration with light/dark theme system
- **Smooth Animations**: Fluid transitions and hover effects throughout

### 📊 Interactive Visualization

- **Multi-View Modes**: Flow visualization, statistics panel, and trends analysis
- **Real-time Animation**: Configurable animation speeds with play/pause controls
- **Interactive Flows**: Click to select and highlight specific migration paths
- **Enhanced Tooltips**: Rich tooltips with detailed flow information
- **Flow Selection**: Click on flows to highlight and track specific migration patterns

### 🎛️ Advanced Controls

- **View Mode Selector**: Switch between Flow, Stats, and Trends views
- **Animation Controls**: Play/pause, speed adjustment (slow/normal/fast)
- **Detail Toggle**: Show/hide additional information
- **Reset Function**: Reset view and selections
- **Mobile Optimized**: Touch-friendly controls for mobile devices

### 📈 Comprehensive Statistics

- **Flow Analytics**: Total flows, migration volumes, top flows
- **Continent Analysis**: Net migration flows per continent
- **Trend Indicators**: Visual indicators for migration trends
- **Interactive Stats**: Click on stats to highlight related flows

## Components

### Core Components

#### `SankeyChartWidget`

Main widget component that orchestrates all functionality.

```tsx
<SankeyChartWidget
  data={migrationData}
  title="Global Migration Flows"
  subtitle="2019/2020"
  onOpenSidebar={handleOpenSidebar}
  showSidebarButton={true}
  currentSlide={currentSlide}
  setCurrentSlide={setCurrentSlide}
/>
```

#### `EnhancedSankeyDiagram`

Advanced Sankey diagram with enhanced interactions and animations.

**Features:**

- Animated flow paths with configurable speeds
- Interactive node and link selection
- Enhanced tooltips with detailed information
- Responsive design for all screen sizes
- Real-time flow highlighting
- **New**: Gradient flow paths and enhanced node styling
- **New**: Improved animations and hover effects

#### `MigrationFlowHeader`

Enhanced header component with statistics and flow information.

**Features:**

- Real-time statistics display
- Selected flow highlighting
- Trend indicators
- Animated background effects
- **New**: Gradient backgrounds and improved visual hierarchy
- **New**: Enhanced icon containers with shadows

#### `MigrationFlowControls`

Interactive control panel for widget functionality.

**Features:**

- View mode selection (Flow/Stats/Trends)
- Animation controls (Play/Pause/Speed)
- Detail toggle
- Reset functionality
- Mobile-optimized layout
- **New**: Tooltips on all control buttons
- **New**: Enhanced button styling with gradients

#### `MigrationFlowStats`

Comprehensive statistics panel with detailed analytics.

**Features:**

- Key metrics display
- Top migration flows ranking
- Continent net flow analysis
- Interactive flow selection
- Trend indicators
- **New**: Gradient backgrounds for each section
- **New**: Enhanced visual hierarchy and spacing

#### `MigrationFlowButton`

Custom 3D button component with multiple variants.

**Variants:**

- `primary`: Emerald accent color (`#34D399`)
- `secondary`: Theme-aware background
- `accent`: Amber highlight color (`#FBBF24`)
- `danger`: Red warning color (`#F87171`)

**Sizes:**

- `sm`: Small buttons for mobile
- `md`: Medium buttons for desktop
- `lg`: Large buttons for emphasis

**New Features:**

- Built-in tooltip support
- Enhanced hover effects
- Gradient backgrounds
- Improved accessibility

## Global Tooltip System

### Setup

The global tooltip system is automatically available throughout the dashboard via the `TooltipProvider` in the root layout.

### Usage

#### Basic Tooltip

```tsx
import { useGlobalTooltip } from "@/hooks";

function MyComponent() {
  const { createTooltipHandlers } = useGlobalTooltip();

  return <div {...createTooltipHandlers("This is a tooltip")}>Hover me</div>;
}
```

#### Advanced Tooltip

```tsx
import { useGlobalTooltip } from "@/hooks";

function MyComponent() {
  const { showTooltip, hideTooltip } = useGlobalTooltip({
    title: "Migration Flow",
    subtitle: "Interactive visualization",
    color: "#10B981",
  });

  const handleMouseEnter = (event) => {
    showTooltip(
      <div>Custom tooltip content</div>,
      event.clientX,
      event.clientY
    );
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={hideTooltip}>
      Interactive element
    </div>
  );
}
```

#### Button Tooltip

```tsx
<MigrationFlowButton
  onClick={handleClick}
  variant="primary"
  tooltip="This button does something amazing"
  tooltipTitle="Amazing Button"
  tooltipSubtitle="Click to see magic happen"
>
  Click Me
</MigrationFlowButton>
```

## Data Structure

The widget expects data in the following format:

```typescript
interface MigrationFlowData {
  from: string; // Source continent
  to: string; // Destination continent
  size: number; // Migration volume (millions)
  category?: string; // "major" or "minor" flow
  year?: number; // Year of data
}
```

### Example Data

```json
[
  {
    "from": "Asia",
    "to": "Europe",
    "size": 1.8,
    "category": "major",
    "year": 2019
  },
  {
    "from": "Europe",
    "to": "Asia",
    "size": 2.0,
    "category": "major",
    "year": 2019
  },
  {
    "from": "Africa",
    "to": "Europe",
    "size": 0.5,
    "category": "minor",
    "year": 2019
  }
]
```

## Usage Examples

### Basic Implementation

```tsx
import { SankeyChartWidget } from "@/components/widgets/sankey-chart";
import { enhancedMigrationData } from "@/data";

function MyDashboard() {
  return (
    <SankeyChartWidget
      data={enhancedMigrationData}
      title="Global Migration Flows"
      subtitle="2019/2020"
    />
  );
}
```

### Mobile Integration

```tsx
function MobileDashboard() {
  const [currentSlide, setCurrentSlide] = useState(13);

  return (
    <SankeyChartWidget
      data={enhancedMigrationData}
      title="Global Migration Flows"
      subtitle="2019/2020"
      onOpenSidebar={() => setSidebarOpen(true)}
      showSidebarButton={true}
      currentSlide={currentSlide}
      setCurrentSlide={setCurrentSlide}
    />
  );
}
```

### Custom Button Usage

```tsx
import { MigrationFlowButton } from "@/components/widgets/sankey-chart";
import { Play, Pause } from "lucide-react";

function CustomControls() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <MigrationFlowButton
      onClick={() => setIsPlaying(!isPlaying)}
      variant="primary"
      size="md"
      icon={isPlaying ? <Pause /> : <Play />}
      label={isPlaying ? "Pause" : "Play"}
      tooltip={isPlaying ? "Pause animation" : "Play animation"}
      tooltipTitle={isPlaying ? "Pause" : "Play"}
    >
      Animation Control
    </MigrationFlowButton>
  );
}
```

## Styling and Theming

The widget uses CSS custom properties for theming:

```css
:root {
  --widget-bg: rgba(255, 255, 255, 0.05);
  --button-bg: rgba(35, 35, 35, 0.07);
  --button-hover-bg: rgba(35, 35, 35, 0.12);
  --button-active-bg: rgba(35, 35, 35, 0.14);
  --button-border: rgba(255, 255, 255, 0.1);
}
```

### Theme Colors

The widget integrates with the theme system using these accent colors:

- **Emerald**: Primary accent color for main elements (`#34D399`)
- **Blue**: Secondary accent for highlights (`#60A5FA`)
- **Amber**: Accent color for warnings and highlights (`#FBBF24`)
- **Red**: Danger color for alerts and stops (`#F87171`)
- **Violet**: Purple accent for special elements (`#A78BFA`)
- **Cyan**: Info accent for data visualization (`#22D3EE`)

## Performance Optimizations

- **Memoized Calculations**: Statistics are calculated once and cached
- **Efficient Rendering**: D3.js optimizations for smooth animations
- **Responsive Updates**: Debounced resize handling
- **Memory Management**: Proper cleanup of event listeners and observers
- **Tooltip Optimization**: Efficient tooltip rendering and positioning

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: CSS Grid, Flexbox, CSS Custom Properties, ES2020+

## Accessibility

- **Keyboard Navigation**: Full keyboard support for all controls
- **Screen Reader Support**: Proper ARIA labels and roles
- **High Contrast**: Theme-aware contrast ratios
- **Focus Management**: Clear focus indicators and management
- **Tooltip Accessibility**: Proper tooltip announcements and positioning

## Future Enhancements

- **Time Series Data**: Support for historical migration trends
- **Filtering Options**: Filter by continent, flow size, or time period
- **Export Functionality**: Export charts as images or data
- **Advanced Analytics**: Machine learning insights and predictions
- **Real-time Data**: Live data integration capabilities
- **3D Visualization**: Enhanced 3D flow representations
- **Custom Themes**: User-defined color schemes and themes

## Contributing

When contributing to this widget:

1. Follow the existing component structure
2. Maintain theme integration
3. Ensure mobile responsiveness
4. Add proper TypeScript types
5. Include accessibility features
6. Test across different screen sizes
7. Use the global tooltip system for new interactive elements
8. Follow the new color scheme and design patterns

## License

This component is part of the Chart Dashboard project and follows the same licensing terms.
