# Widget Title Font Styling Guide

## Font Specifications

### Title Font

- **Font Family**: `var(--font-mono)` (Space Mono)
- **Font Weight**: 900 (Extra Bold)
- **Letter Spacing**: 0.01em
- **Color**: Theme-aware (uses `colors.primary`)

### Subtitle Font

- **Font Family**: `var(--font-sans)` (Inter)
- **Font Weight**: 400 (Regular)
- **Letter Spacing**: 0.01em
- **Color**: `text-gray-600` (light mode) / `text-gray-400` (dark mode)

## Responsive Font Sizes

### Title Sizes by Screen Size

| Size | Mobile (≤425px)    | Tablet (≤768px)    | Desktop (>768px)  |
| ---- | ------------------ | ------------------ | ----------------- |
| `sm` | 14px (`text-sm`)   | 16px (`text-base`) | 18px (`text-lg`)  |
| `md` | 16px (`text-base`) | 18px (`text-lg`)   | 20px (`text-xl`)  |
| `lg` | 18px (`text-lg`)   | 20px (`text-xl`)   | 24px (`text-2xl`) |
| `xl` | 20px (`text-xl`)   | 24px (`text-2xl`)  | 30px (`text-3xl`) |

### Subtitle Sizes

- **All screen sizes**: 14px (`text-sm`)

## Positioning Requirements

### Centered Titles (All Widgets)

- **Alignment**: Center-aligned
- **Mobile Top Margin**: 2rem (`mt-8`)
- **Mobile Bottom Margin**: 0.75rem (`mb-3`)
- **Desktop Bottom Margin**: 1rem (`mb-4`)

### Compact Titles

- **Alignment**: Center-aligned
- **Bottom Margin**: 0.5rem (`mb-2`)

## Widget Title Requirements

### Widgets with Subtitles

1. **ContributionGraphWidget** - "Financial Activity Overview" + "Total: $X | Avg: $Y/day"
2. **SankeyChartWidget** - "Global Migration Flows" + "2019/2020"
3. **ChordChartWidget** - "Global Migrations" + "2023"
4. **BubbleChartWidget** - "Global Tech Investment" + "Market Cap vs Growth vs Workforce Size"

### Widgets without Subtitles

1. **LineChartWidget** - "Sales Performance"
2. **BarChartWidget** - "Quarterly Overview"
3. **RadarChartWidget** - "Performance Metrics"
4. **DeviceUsageWidget** - "Device Usage"
5. **RecentUsersWidget** - "Recent Users"
6. **TimelineRingsWidget** - "Timeline of Renewable Energy Milestones"

## Implementation Notes

- All titles are now centered across all screen sizes
- All titles use the `md` size by default
- Subtitles always use the smaller font size
- Maintain consistent spacing between title and subtitle
- Ensure proper contrast in both light and dark modes
- Financial Activity Overview includes dynamic financial data in subtitle

## Updated Widgets Using WidgetTitle

The following widgets have been updated to use the common WidgetTitle component:

- ✅ **ContributionGraphWidget** (Financial Activity Overview) - with dynamic financial subtitle
- ✅ **LineChartWidget** (Sales Performance)
- ✅ **BarChartWidget** (Quarterly Overview)
- ✅ **RadarChartWidget** (Performance Metrics)
- ✅ **DeviceUsageWidget** (Device Usage)
- ✅ **RecentUsersWidget** (Recent Users)
- ✅ **SankeyChartWidget** (Global Migration Flows) - with subtitle
- ✅ **ChordChartWidget** (Global Migrations) - with subtitle
- ✅ **BubbleChartWidget** (Global Tech Investment) - with subtitle
- ✅ **TimelineRingsWidget** (Timeline of Renewable Energy Milestones)

This ensures consistent title styling and responsive behavior across all chart widgets in the dashboard.
