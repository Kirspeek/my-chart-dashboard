import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../packages/**/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "@storybook/addon-themes",
  ],
  webpackFinal: async (config) => {
    // Support TS path aliases
    if (!config.resolve) config.resolve = {} as any;
    config.resolve!.alias = {
      ...(config.resolve!.alias || {}),
      "@": require("path").resolve(__dirname, "../src"),
      "@components": require("path").resolve(__dirname, "../src/components"),
      "@lib": require("path").resolve(__dirname, "../src/lib"),
      "@hooks": require("path").resolve(__dirname, "../src/hooks"),
    };
    return config;
  },
  framework: {
    name: "@storybook/nextjs",
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  staticDirs: ["../public"],
};
export default config;
