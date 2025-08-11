# WidgetTitle Component

A common, responsive title component for widgets that provides consistent styling and positioning across different screen sizes.

## Features

- **Responsive Design**: Automatically adjusts font size and positioning based on screen size
- **Multiple Variants**: Support for different positioning styles (default, centered, compact)
- **Size Options**: Four different size presets (sm, md, lg, xl)
- **Subtitle Support**: Optional subtitle with consistent styling
- **Theme Integration**: Uses the app's theme colors and fonts
- **Mobile Optimization**: Special handling for mobile devices (≤425px)

## Props

| Prop        | Type                                   | Default      | Description            |
| ----------- | -------------------------------------- | ------------ | ---------------------- |
| `title`     | `string`                               | **required** | The main title text    |
| `subtitle`  | `string`                               | `undefined`  | Optional subtitle text |
| `className` | `string`                               | `""`         | Additional CSS classes |
| `variant`   | `"default" \| "centered" \| "compact"` | `"default"`  | Positioning variant    |
| `size`      | `"sm" \| "md" \| "lg" \| "xl"`         | `"md"`       | Font size preset       |

## Variants

### Default

- Left-aligned title
- Standard margin bottom
- Best for most widget layouts

### Centered

- Center-aligned title and subtitle
- Additional top margin on mobile
- Best for full-screen mobile widgets

### Compact

- Reduced margin bottom
- Best for widgets with limited space

## Size Presets

### Mobile (≤425px)

- `sm`: `text-sm` (14px)
- `md`: `text-base` (16px)
- `lg`: `text-lg` (18px)
- `xl`: `text-xl` (20px)

### Tablet (≤768px)

- `sm`: `text-base` (16px)
- `md`: `text-lg` (18px)
- `lg`: `text-xl` (20px)
- `xl`: `text-2xl` (24px)

### Desktop (>768px)

- `sm`: `text-lg` (18px)
- `md`: `text-xl` (20px)
- `lg`: `text-2xl` (24px)
- `xl`: `text-3xl` (30px)

## Usage Examples

### Basic Usage

```tsx
import { WidgetTitle } from "@/components/common";

<WidgetTitle title="Sales Performance" />;
```

### With Subtitle

```tsx
<WidgetTitle title="Global Migration Flows" subtitle="2019/2020" />
```

### Mobile-Optimized

```tsx
<WidgetTitle title="Device Usage" variant="centered" size="md" />
```

### Compact Layout

```tsx
<WidgetTitle title="Quick Stats" variant="compact" size="sm" />
```

## Styling

The component uses:

- **Font Family**: `var(--font-mono)` (Space Mono)
- **Font Weight**: 900 (Extra Bold)
- **Letter Spacing**: 0.01em
- **Colors**: Theme-aware (uses `colors.primary`)

## Migration Guide

### Before (Custom Implementation)

```tsx
<h3
  className={`text-lg font-semibold mb-4 ${isMobile ? "text-center" : ""}`}
  style={{
    color: colors.primary,
    fontFamily: "var(--font-mono)",
    fontWeight: 900,
    letterSpacing: "0.01em",
    marginTop: isMobile ? "2rem" : undefined,
  }}
>
  {title}
</h3>
```

### After (Using WidgetTitle)

```tsx
import { WidgetTitle } from "@/components/common";

<WidgetTitle
  title={title}
  variant={isMobile ? "centered" : "default"}
  size="md"
/>;
```

## Widgets Using WidgetTitle

The following widgets have been updated to use the common WidgetTitle component:

- ✅ LineChartWidget (Sales Performance)
- ✅ BarChartWidget (Quarterly Overview)
- ✅ RadarChartWidget (Performance Metrics)
- ✅ DeviceUsageWidget (Device Usage)
- ✅ RecentUsersWidget (Recent Users)
- ✅ SankeyChartWidget (Global Migration Flows)
- ✅ ChordChartWidget (Global Migrations)
- ✅ BubbleChartWidget (Global Tech Investment)

This ensures consistent title styling and responsive behavior across all chart widgets in the dashboard.
