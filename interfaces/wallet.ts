// Wallet Widget Interfaces

export interface CardData {
  number: string;
  name: string;
  exp: string;
  ccv: string;
  bank?: string;
  scheme?: string;
}

export interface BankDesign {
  background: string;
  logo: string;
  logoColor: string;
  textColor: string;
  chipColor: string;
  logoUrl?: string | null;
  cardType?: string;
}

export interface BankInfo {
  bank: string;
  scheme: string;
}

export interface CardForm {
  number: string;
  name: string;
  exp: string;
  ccv: string;
  bank?: string;
  scheme?: string;
}

export interface EventHandlers {
  onClick?: () => void;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputClick?: (e: React.MouseEvent) => void;
  onSave?: (e: React.FormEvent) => void;
  onCancel?: () => void;
  onCardClick?: () => void;
}

export interface BaseContainerProps {
  width: number;
  height: number;
  zIndex?: number;
}

export interface MainContainerProps extends BaseContainerProps {
  children?: React.ReactNode;
}

export type PocketContainerProps = BaseContainerProps;

export interface BaseButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export interface AddCardButtonProps extends BaseButtonProps {
  cardCount?: number;
  maxCards?: number;
}

export type ClearWalletButtonProps = BaseButtonProps;

export interface BaseDataProps {
  bankInfo: BankInfo;
}

export interface BaseFormProps {
  form: CardForm;
  saving: boolean;
  fetchingBankData?: boolean;
}

export interface BaseCardProps {
  card: CardData;
  index: number;
  isEditing: boolean;
  bankDesign: BankDesign;
}

export interface CardItemProps
  extends BaseCardProps,
    BaseFormProps,
    BaseDataProps,
    EventHandlers {}

export interface WalletContainerProps {
  cards: CardData[];
  editing: number | null;
  form: CardForm;
  bankInfo: BankInfo;
  saving: boolean;
  fetchingBankData: boolean;
  canAddCard: boolean;
  dynamicHeight: number;
  WALLET_WIDTH: number;
  POCKET_HEIGHT: number;
  handleAdd: () => void;
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCardClick: (index: number) => void;
  getCardBankDesign: (card: CardData, index: number) => BankDesign;
  setEditing: (index: number | null) => void;
  clearWallet: () => void;
}

export interface BankApiResponse {
  bank_name?: string;
  bank?: {
    name?: string;
  };
  issuer?: {
    name?: string;
  };
  scheme?: string;
  card?: {
    scheme?: string;
  };
}

export const WALLET_CONSTANTS = {
  WALLET_WIDTH: 400,
  WALLET_HEIGHT: 400,
  POCKET_HEIGHT: 200,
  CARD_HEIGHT: 202,
  CARD_OFFSET: 40,
  BORDER_RADIUS: 32,
  TOP_PADDING: 40,
  TOTAL_HEIGHT: 440,
} as const;

export const EMPTY_CARD: CardData = {
  number: "",
  name: "",
  exp: "",
  ccv: "",
  bank: "",
  scheme: "",
};

// Color palette for different cards
export const CARD_COLORS = [
  "#F4E4A6",
  "#F4C2C2",
  "#B8D4E3",
  "#B8D4B8",
  "#D4B8F4",
  "#F4D4B8",
  "#B8E3F4",
  "#F4B8D4",
] as const;

// Consolidated base interfaces for common patterns
export interface BaseDisplayProps {
  isEditing: boolean;
  textColor?: string;
}

export interface BaseBankDesignProps {
  bankDesign: {
    textColor: string;
  };
}

export interface BaseBankDesignFullProps {
  bankDesign: {
    background: string;
    logo: string;
    logoColor: string;
    textColor: string;
    chipColor: string;
    logoUrl?: string | null;
  };
}

export interface BaseFormInputProps {
  formInputs?: {
    number: string;
    name: string;
    exp: string;
    ccv: string;
    scheme?: string;
  };
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputClick?: (e: React.MouseEvent) => void;
}

export interface BaseActionProps {
  onSave?: (e: React.FormEvent) => void;
  onCancel?: () => void;
}

export interface BaseLoadingProps {
  saving?: boolean;
  fetchingBankData?: boolean;
}

export interface BaseCardDataProps {
  cardNumber: string;
  cardHolder: string;
  expirationDate: string;
  ccv?: string;
  bankName?: string;
  scheme?: string;
}

export interface BaseBankInfoProps {
  bankInfo?: {
    bank: string;
    scheme: string;
  };
}

// Enhanced base interfaces that combine common patterns
export interface BaseBankInfoWithLoadingProps
  extends BaseBankInfoProps,
    BaseLoadingProps {}

export interface BaseDisplayWithBankDesignProps
  extends BaseDisplayProps,
    BaseBankDesignProps {}

export interface BaseDisplayWithBankDesignFullProps
  extends BaseDisplayProps,
    BaseBankDesignFullProps {}

// CardDisplay component interfaces using composition
export interface CardDisplayProps
  extends BaseCardDataProps,
    BaseBankDesignFullProps,
    BaseFormInputProps,
    BaseActionProps,
    BaseLoadingProps,
    BaseBankInfoProps {
  isEditing?: boolean;
}

// Bank logo interfaces
export interface BankLogoBaseProps {
  currentBankName?: string;
  bankDesign: {
    logo: string;
    logoColor: string;
    logoUrl?: string | null;
  };
}

export interface BankLogoExtendedProps extends BankLogoBaseProps {
  externalLogoLoaded: boolean;
  externalLogoFailed: boolean;
  setExternalLogoLoaded: (loaded: boolean) => void;
  setExternalLogoFailed: (failed: boolean) => void;
}

// Action buttons interfaces
export interface ActionButtonsProps
  extends BaseDisplayProps,
    BaseBankDesignProps,
    BaseActionProps,
    BaseLoadingProps {
  hasCardData: boolean;
  onToggleVisibility: () => void;
  isInfoVisible: boolean;
}

// Card number section interfaces
export interface CardNumberSectionProps
  extends BaseDisplayProps,
    BaseBankDesignProps,
    BaseFormInputProps {
  hasCardData: boolean;
  isInfoVisible: boolean;
  maskedDisplayNumber: string;
}

// Bank info display interfaces
export interface BankInfoDisplayProps
  extends BaseDisplayProps,
    BaseBankInfoProps,
    BaseLoadingProps {
  currentBankName?: string;
  scheme?: string;
}

// Card details section interfaces
export interface CardDetailsSectionProps
  extends BaseDisplayProps,
    BaseBankDesignProps,
    BaseFormInputProps {
  hasCardData: boolean;
  isInfoVisible: boolean;
  maskedDisplayHolder: string;
  maskedDisplayExp: string;
  displayScheme?: string;
  onExpirationDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isExpirationDateValid: boolean;
}

// Text logo interface
export interface TextLogoProps {
  text: string;
  color: string;
}

// Legacy interface names for backward compatibility
export type BankLogoProps = BankLogoBaseProps;
