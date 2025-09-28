import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Header } from ".";
import WidgetBase from "@/components/common/WidgetBase";

const meta = {
  title: "UI/Header",
  component: Header,
  args: {
    title: "Chart Dashboard",
    contactEmail: "cherepenko.iryna@gmail.com",
    contactLinks: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/irynacherepenko/",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        label: "GitHub",
        href: "https://github.com/Kirspeek",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        label: "Telegram",
        href: "https://t.me/your_handle",
        target: "_blank",
        rel: "noopener noreferrer",
      },
    ],
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="widget-container">
        <WidgetBase className="rounded-2xl" style={{ padding: 16 }}>
          <Story />
        </WidgetBase>
      </div>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithCustomPlaceholder: Story = {
  args: { searchPlaceholder: "Search widgets..." },
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const WithoutUserAndNotifications: Story = {
  args: { showNotifications: false, showUser: false },
};

export const WithCustomSearchResults: Story = {
  args: {
    renderSearchResults: (
      value: string,
      _isMobile: boolean,
      close: () => void
    ) => (
      <div>
        <div className="text-sm opacity-70">
          Results for: {value || "(empty)"}
        </div>
        <button style={{ marginTop: 8 }} onClick={close}>
          Close
        </button>
      </div>
    ),
  },
};

export const PillWithIcons: Story = {
  args: {
    pill: true,
    loginHref: "#login",
    signupHref: "#signup",
  },
};

export const WithThemeToggle: Story = {
  render: (args) => {
    const [dark, setDark] = React.useState(false);
    React.useEffect(() => {
      document.documentElement.classList.toggle("dark", dark);
    }, [dark]);
    return (
      <Header
        {...args}
        showThemeToggle
        isDark={dark}
        onToggleTheme={() => setDark((d) => !d)}
      />
    );
  },
};
