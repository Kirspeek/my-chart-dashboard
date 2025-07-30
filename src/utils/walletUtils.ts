import * as creditCardType from "credit-card-type";
import { BankApiResponse, BankInfo } from "../../interfaces/wallet";
import {
  API_ENDPOINTS,
  API_HEADERS,
  BANK_CONSTANTS,
  HTTP_STATUS,
} from "../../apis";

const bankDataCache = new Map<string, BankInfo>();
const rateLimitCache = new Map<string, number>();

export const WalletUtils = {
  async fetchBankData(cardNumber: string): Promise<BankInfo | null> {
    const digits = cardNumber.replace(/\D/g, "");
    if (digits.length < BANK_CONSTANTS.MIN_BIN_LENGTH) return null;

    const bin = digits.slice(0, BANK_CONSTANTS.MIN_BIN_LENGTH);

    if (bankDataCache.has(bin)) {
      return bankDataCache.get(bin)!;
    }

    const now = Date.now();
    const lastRequest = rateLimitCache.get(bin);
    if (lastRequest && now - lastRequest < 1000) {
      return null;
    }

    rateLimitCache.set(bin, now);

    try {
      const res = await fetch(API_ENDPOINTS.BANK.BIN_CHECK(bin), {
        headers: API_HEADERS.BANK_BIN,
      });

      if (res.status === HTTP_STATUS.OK) {
        const data: BankApiResponse = await res.json();

        const bankName =
          data.bank_name || data.bank?.name || data.issuer?.name || "";

        const scheme = data.scheme || data.card?.scheme || "";

        if (bankName || scheme) {
          const result = {
            bank: bankName,
            scheme: scheme,
          };
          bankDataCache.set(bin, result);
          return result;
        }
      }
    } catch {
      // Continue to fallback
    }

    try {
      const cardTypes = creditCardType.default(digits);
      const detectedType = cardTypes[0];

      if (detectedType) {
        const result = {
          bank: "",
          scheme: detectedType.type || "",
        };
        bankDataCache.set(bin, result);
        return result;
      }
    } catch {
      return null;
    }

    return null;
  },

  generateDynamicBankDesign(
    bankName: string,
    scheme: string,
    cardNumber: string
  ) {
    const cardTypes = creditCardType.default(cardNumber);
    const detectedType = cardTypes[0];

    const hash = bankName.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    const hue = Math.abs(hash) % 360;
    const saturation = 60 + (Math.abs(hash) % 20);
    const lightness = 30 + (Math.abs(hash) % 20);

    const primaryColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const secondaryColor = `hsl(${hue}, ${saturation}%, ${lightness - 10}%)`;

    const bankWords = bankName.toLowerCase().split(" ");
    const domain = bankWords.join("").replace(/[^a-z0-9]/g, "");
    const logoText = bankName.split(" ")[0].slice(0, 3).toUpperCase();

    return {
      background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
      logo: logoText,
      logoColor: "#fff",
      textColor: "#fff",
      chipColor: "#d4af37",
      logoUrl: API_ENDPOINTS.ASSETS.BANK_LOGO(domain, BANK_CONSTANTS.LOGO_SIZE),
      cardType: detectedType?.type || scheme,
    };
  },

  getBankDesign(bankName: string, scheme: string, cardNumber: string) {
    const cardTypes = creditCardType.default(cardNumber);
    const detectedType = cardTypes[0];
    const bankLower = bankName.toLowerCase();

    if (bankLower.includes("chase") || bankLower.includes("jpmorgan")) {
      return {
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        logo: "Chase",
        logoColor: "#fff",
        textColor: "#fff",
        chipColor: "#d4af37",
        logoUrl: API_ENDPOINTS.ASSETS.ICON("jpmorgan"),
        cardType: detectedType?.type || scheme,
      };
    }

    if (bankLower.includes("citi") || bankLower.includes("citibank")) {
      return {
        background: "linear-gradient(135deg, #000428 0%, #004e92 100%)",
        logo: "Citi",
        logoColor: "#fff",
        textColor: "#fff",
        chipColor: "#d4af37",
        logoUrl: API_ENDPOINTS.ASSETS.ICON("citibank"),
        cardType: detectedType?.type || scheme,
      };
    }

    if (bankLower.includes("wells") || bankLower.includes("wells fargo")) {
      return {
        background: "linear-gradient(135deg, #d31027 0%, #ea384d 100%)",
        logo: "Wells Fargo",
        logoColor: "#fff",
        textColor: "#fff",
        chipColor: "#d4af37",
        logoUrl: API_ENDPOINTS.ASSETS.ICON("wellsfargo"),
        cardType: detectedType?.type || scheme,
      };
    }

    if (
      bankLower.includes("bank of america") ||
      bankLower.includes("boa") ||
      bankLower.includes("bofa")
    ) {
      return {
        background: "linear-gradient(135deg, #012169 0%, #1e3a8a 100%)",
        logo: "Bank of America",
        logoColor: "#fff",
        textColor: "#fff",
        chipColor: "#d4af37",
        logoUrl: API_ENDPOINTS.ASSETS.ICON("bankofamerica"),
        cardType: detectedType?.type || scheme,
      };
    }

    if (bankLower.includes("capital one") || bankLower.includes("capitalone")) {
      return {
        background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
        logo: "Capital One",
        logoColor: "#fff",
        textColor: "#fff",
        chipColor: "#d4af37",
        logoUrl: API_ENDPOINTS.ASSETS.ICON("capitalone"),
        cardType: detectedType?.type || scheme,
      };
    }

    if (bankLower.includes("revolut") || bankLower.includes("revolut ltd")) {
      return {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        logo: "Revolut",
        logoColor: "#fff",
        textColor: "#fff",
        chipColor: "#d4af37",
        logoUrl: API_ENDPOINTS.ASSETS.ICON("revolut"),
        cardType: detectedType?.type || scheme,
      };
    }

    if (bankLower.includes("wise") || bankLower.includes("transferwise")) {
      return {
        background: "linear-gradient(135deg, #00b9ff 0%, #0099cc 100%)",
        logo: "Wise",
        logoColor: "#fff",
        textColor: "#fff",
        chipColor: "#d4af37",
        logoUrl: API_ENDPOINTS.ASSETS.ICON("wise"),
        cardType: detectedType?.type || scheme,
      };
    }

    if (bankLower.includes("monzo")) {
      return {
        background: "linear-gradient(135deg, #ff0066 0%, #ff1a75 100%)",
        logo: "Monzo",
        logoColor: "#fff",
        textColor: "#fff",
        chipColor: "#d4af37",
        logoUrl: API_ENDPOINTS.ASSETS.ICON("monzo"),
        cardType: detectedType?.type || scheme,
      };
    }

    if (bankLower.includes("n26")) {
      return {
        background: "linear-gradient(135deg, #000000 0%, #333333 100%)",
        logo: "N26",
        logoColor: "#fff",
        textColor: "#fff",
        chipColor: "#d4af37",
        logoUrl: API_ENDPOINTS.ASSETS.ICON("n26"),
        cardType: detectedType?.type || scheme,
      };
    }

    if (bankLower.includes("teller") || bankLower.includes("teller a.s.")) {
      return {
        background: "linear-gradient(135deg, #9FE870 0%, #8ED760 100%)",
        logo: "Wise",
        logoColor: "#163300",
        textColor: "#163300",
        chipColor: "#d4af37",
        logoUrl: API_ENDPOINTS.ASSETS.ICON("wise"),
        cardType: detectedType?.type || scheme,
      };
    }

    if (
      bankLower.includes("jsc universal bank") ||
      bankLower.includes("universal bank")
    ) {
      return {
        background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
        logo: "Universal",
        logoColor: "#fff",
        textColor: "#fff",
        chipColor: "#d4af37",
        logoUrl: API_ENDPOINTS.ASSETS.ICON("bank"),
        cardType: detectedType?.type || scheme,
      };
    }

    if (bankName && bankName.trim() !== "") {
      return this.generateDynamicBankDesign(bankName, scheme, cardNumber);
    }

    if (detectedType?.type === "visa" && !bankName) {
      return {
        background: "linear-gradient(135deg, #1a1f71 0%, #2a5298 100%)",
        logo: "VISA",
        logoColor: "#fff",
        textColor: "#fff",
        chipColor: "#d4af37",
        logoUrl: API_ENDPOINTS.ASSETS.ICON("visa"),
        cardType: "visa",
      };
    }

    if (detectedType?.type === "mastercard" && !bankName) {
      return {
        background: "linear-gradient(135deg, #eb001b 0%, #f7931e 100%)",
        logo: "Mastercard",
        logoColor: "#fff",
        textColor: "#fff",
        chipColor: "#d4af37",
        logoUrl: API_ENDPOINTS.ASSETS.ICON("mastercard"),
        cardType: "mastercard",
      };
    }

    if (detectedType?.type === "american-express" && !bankName) {
      return {
        background: "linear-gradient(135deg, #2e77bb 0%, #1e3a8a 100%)",
        logo: "American Express",
        logoColor: "#fff",
        textColor: "#fff",
        chipColor: "#d4af37",
        logoUrl: API_ENDPOINTS.ASSETS.ICON("americanexpress"),
        cardType: "american-express",
      };
    }

    return {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      logo: "BANK",
      logoColor: "#fff",
      textColor: "#fff",
      chipColor: "#d4af37",
      logoUrl: null,
      cardType: detectedType?.type || scheme,
    };
  },
};
