export type SectionKey = "dashboard" | "projects" | "about" | "experience";

export type HeaderLink = {
  label: string;
  href: string;
  target?: string;
  rel?: string;
};

export type HeaderProps = {
  title?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  showNotifications?: boolean;
  showUser?: boolean;
  contactEmail?: string;
  contactLinks?: HeaderLink[];
  rightActions?: React.ReactNode;
  renderSearchResults?: (
    value: string,
    isMobile: boolean,
    close: () => void
  ) => React.ReactNode;
  pill?: boolean;
  className?: string;
  defaultSection?: SectionKey;
  sections?: Array<{
    key: SectionKey;
    label: string;
  }>;
  onSectionChange?: (section: SectionKey) => void;
  getSectionHref?: (section: SectionKey) => string | undefined;
  loginHref?: string;
  signupHref?: string;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  showThemeToggle?: boolean;
  isDark?: boolean;
  onToggleTheme?: () => void;
};
