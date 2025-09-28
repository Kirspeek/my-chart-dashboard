import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from ".";

const meta = {
  title: "UI/Sidebar",
  component: Sidebar,
  args: { isOpen: true },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Closed: Story = { args: { isOpen: false } };
export const CustomItems: Story = {
  args: {
    items: [
      { name: "Home", href: "/" },
      { name: "Docs", href: "/docs" },
      { name: "About", href: "/about" },
    ],
    activeHref: "/docs",
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
