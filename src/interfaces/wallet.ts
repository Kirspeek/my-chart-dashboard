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
  width: number | string;
  height: number | string;
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
  EventHandlers { }

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

export interface BaseBankInfoWithLoadingProps
  extends BaseBankInfoProps,
  BaseLoadingProps { }

export interface BaseDisplayWithBankDesignProps
  extends BaseDisplayProps,
  BaseBankDesignProps { }

export interface BaseDisplayWithBankDesignFullProps
  extends BaseDisplayProps,
  BaseBankDesignFullProps { }

export interface CardDisplayProps
  extends BaseCardDataProps,
  BaseBankDesignFullProps,
  BaseFormInputProps,
  BaseActionProps,
  BaseLoadingProps,
  BaseBankInfoProps {
  isEditing?: boolean;
}

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

export interface ActionButtonsProps
  extends BaseDisplayProps,
  BaseBankDesignProps,
  BaseActionProps,
  BaseLoadingProps {
  hasCardData: boolean;
  onToggleVisibility: () => void;
  isInfoVisible: boolean;
}

export interface CardNumberSectionProps
  extends BaseDisplayProps,
  BaseBankDesignProps,
  BaseFormInputProps {
  hasCardData: boolean;
  isInfoVisible: boolean;
  maskedDisplayNumber: string;
}

export interface BankInfoDisplayProps
  extends BaseDisplayProps,
  BaseBankInfoProps,
  BaseLoadingProps {
  currentBankName?: string;
  scheme?: string;
}

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

export interface TextLogoProps {
  text: string;
  color: string;
}

export type BankLogoProps = BankLogoBaseProps;

export interface CardSpendingData {
  cardId: string;
  cardNumber: string;
  monthlySpending: {
    total: number;
    categories: {
      food: number;
      transport: number;
      entertainment: number;
      utilities: number;
    };
  };
  dailySpending: {
    monthly: Array<{
      date: string;
      total: number;
      categories: {
        food: number;
        transport: number;
        entertainment: number;
        utilities: number;
      };
    }>;
    yearly: Array<{
      date: string;
      total: number;
      categories: {
        food: number;
        transport: number;
        entertainment: number;
        utilities: number;
      };
    }>;
  };
  isActive: boolean;
}

export interface FinancialActivityData {
  cardId: string;
  cardNumber: string;
  dailySpending: Array<{
    date: string;
    total: number;
    categories: {
      food: number;
      transport: number;
      entertainment: number;
      utilities: number;
    };
  }>;
}

export interface WidgetState {
  currentCardId: string | null;
  currentCardNumber: string;
  cards: CardSpendingData[];
  aggregatedData: {
    totalSpending: number;
    monthlySpending: number;
    dailySpending: Array<{
      date: string;
      total: number;
    }>;
  };
}
