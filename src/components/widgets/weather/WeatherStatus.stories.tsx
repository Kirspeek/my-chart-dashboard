/* eslint-disable storybook/no-renderer-packages */
import type { Meta, StoryObj } from "@storybook/react";
/* eslint-enable storybook/no-renderer-packages */
import WeatherStatus from "./WeatherStatus";

const meta = {
  title: "Widgets/Weather/WeatherStatus",
  component: WeatherStatus,
  parameters: { layout: "centered" },
} satisfies Meta<typeof WeatherStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cached: Story = {
  args: { isCached: true, isPreloading: false, stale: false },
};

export const Preloading: Story = {
  args: { isCached: false, isPreloading: true, stale: false },
};

export const Stale: Story = {
  args: { isCached: false, isPreloading: false, stale: true },
};

export const Idle: Story = {
  args: { isCached: false, isPreloading: false, stale: false },
};
