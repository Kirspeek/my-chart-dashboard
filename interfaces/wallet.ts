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

export interface CardItemProps {
  card: CardData;
  index: number;
  isEditing: boolean;
  bankDesign: BankDesign;
  form: CardForm;
  bankInfo: BankInfo;
  saving: boolean;
  fetchingBankData?: boolean;
  onCardClick: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputClick: (e: React.MouseEvent) => void;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export interface MainContainerProps {
  width: number;
  height: number;
  zIndex?: number;
  children?: React.ReactNode;
}

export interface PocketContainerProps {
  width: number;
  height: number;
  zIndex?: number;
}

// Bank API Response Interface
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

// Constants
export const WALLET_CONSTANTS = {
  WALLET_WIDTH: 400,
  WALLET_HEIGHT: 400,
  POCKET_HEIGHT: 200,
  CARD_HEIGHT: 202,
  CARD_OFFSET: 40,
  BORDER_RADIUS: 32,
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
