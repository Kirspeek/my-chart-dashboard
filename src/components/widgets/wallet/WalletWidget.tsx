import React, { useState, useEffect, useCallback } from "react";
import CardItem from "./CardItem";
import creditCardType from "credit-card-type";

const WALLET_WIDTH = 400;
const POCKET_WIDTH = 320;
const WALLET_HEIGHT = 400;
const POCKET_HEIGHT = 200;
const BORDER_RADIUS = 32;

const emptyCard = {
  number: "",
  name: "",
  exp: "",
  ccv: "",
  bank: "",
  scheme: "",
};

type CardData = {
  number: string;
  name: string;
  exp: string;
  ccv: string;
  bank?: string;
  scheme?: string;
};

// Dynamic bank design generator for any bank
const generateDynamicBankDesign = (
  bankName: string,
  scheme: string,
  cardNumber: string
) => {
  const cardTypes = creditCardType(cardNumber);
  const detectedType = cardTypes[0];

  // Generate a consistent color based on bank name
  const hash = bankName.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  // Generate colors from bank name hash
  const hue = Math.abs(hash) % 360;
  const saturation = 60 + (Math.abs(hash) % 20); // 60-80%
  const lightness = 30 + (Math.abs(hash) % 20); // 30-50%

  const primaryColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const secondaryColor = `hsl(${hue}, ${saturation}%, ${lightness - 10}%)`;

  // Extract bank domain for logo
  const bankWords = bankName.toLowerCase().split(" ");
  const domain = bankWords.join("").replace(/[^a-z0-9]/g, "");

  // Generate logo text (first 3 letters of first word, or first 3 letters of bank name)
  const logoText = bankName.split(" ")[0].slice(0, 3).toUpperCase();

  return {
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
    logo: logoText,
    logoColor: "#fff",
    textColor: "#fff",
    chipColor: "#d4af37",
    logoUrl: `https://logo.clearbit.com/${domain}.com?size=48&format=png`,
    cardType: detectedType?.type || scheme,
  };
};

// Modern bank design system using credit-card-type
const getBankDesign = (
  bankName: string,
  scheme: string,
  cardNumber: string
) => {
  // Use credit-card-type to detect card type from number
  const cardTypes = creditCardType(cardNumber);
  const detectedType = cardTypes[0];

  // Get bank-specific design based on bank name and detected card type
  const bankLower = bankName.toLowerCase();

  // Major US Banks with authentic designs
  if (bankLower.includes("chase") || bankLower.includes("jpmorgan")) {
    return {
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      logo: "Chase",
      logoColor: "#fff",
      textColor: "#fff",
      chipColor: "#d4af37",
      logoUrl:
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/jpmorgan.svg",
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
      logoUrl:
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/citibank.svg",
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
      logoUrl:
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/wellsfargo.svg",
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
      logoUrl:
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/bankofamerica.svg",
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
      logoUrl:
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/capitalone.svg",
      cardType: detectedType?.type || scheme,
    };
  }

  // Digital Banks
  if (bankLower.includes("revolut") || bankLower.includes("revolut ltd")) {
    return {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      logo: "Revolut",
      logoColor: "#fff",
      textColor: "#fff",
      chipColor: "#d4af37",
      logoUrl:
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/revolut.svg",
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
      logoUrl:
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/wise.svg",
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
      logoUrl:
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/monzo.svg",
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
      logoUrl:
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/n26.svg",
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
      logoUrl:
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/wise.svg",
      cardType: detectedType?.type || scheme,
    };
  }

  // Additional banks
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
      logoUrl:
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/bank.svg",
      cardType: detectedType?.type || scheme,
    };
  }

  // If bank name exists but not in predefined list, generate dynamic design
  if (bankName && bankName.trim() !== "") {
    return generateDynamicBankDesign(bankName, scheme, cardNumber);
  }

  // Card type-based designs (fallback when bank is not recognized)
  if (detectedType?.type === "visa" && !bankName) {
    return {
      background: "linear-gradient(135deg, #1a1f71 0%, #2a5298 100%)",
      logo: "VISA",
      logoColor: "#fff",
      textColor: "#fff",
      chipColor: "#d4af37",
      logoUrl:
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/visa.svg",
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
      logoUrl:
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mastercard.svg",
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
      logoUrl:
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/americanexpress.svg",
      cardType: "american-express",
    };
  }

  // Default fallback for empty cards
  return {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    logo: "BANK", // This will show "BANK" for empty cards
    logoColor: "#fff",
    textColor: "#fff",
    chipColor: "#d4af37",
    logoUrl: null,
    cardType: detectedType?.type || scheme,
  };
};

// Enhanced bank data fetching with better error handling
const fetchBankData = async (cardNumber: string) => {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 6) return null;

  try {
    const res = await fetch(
      `https://api.apilayer.com/bincheck/${digits.slice(0, 6)}`,
      {
        headers: {
          apikey: "w3zpCvSQLybqm8M6WIIo6NrnhRMEBKxD",
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      const bankName =
        data.bank_name || data.bank?.name || data.issuer?.name || "";
      const scheme = data.scheme || data.card?.scheme || "";

      console.log("Bank API Response:", data);
      console.log("Extracted bank name:", bankName);
      console.log("Extracted scheme:", scheme);

      return {
        bank: bankName,
        scheme: scheme,
      };
    }
  } catch (error) {
    console.warn("Failed to fetch bank data:", error);
  }

  return null;
};

export default function WalletWidget() {
  // Array of card data (empty by default)
  const [cards, setCards] = useState<CardData[]>(() => {
    const saved = localStorage.getItem("wallet_cards");
    if (saved) {
      try {
        return JSON.parse(saved) as CardData[];
      } catch {
        // fallback to empty if parse fails
      }
    }
    return [
      { ...emptyCard },
      { ...emptyCard },
      { ...emptyCard },
      { ...emptyCard },
      { ...emptyCard },
    ];
  });
  // Which card is being edited (index), or null
  const [editing, setEditing] = useState<number | null>(null);
  // Form state for editing
  const [form, setForm] = useState(emptyCard);
  // Store fetched bank/scheme info for the current form
  const [bankInfo, setBankInfo] = useState({ bank: "", scheme: "" });
  // Loading state for Save button
  const [saving, setSaving] = useState(false);
  // Loading state for bank data fetching
  const [fetchingBankData, setFetchingBankData] = useState(false);

  // Find the next empty card index
  const nextEmptyIndex = cards.findIndex(
    (c: CardData) => !c.number && !c.name && !c.exp && !c.ccv
  );

  // Debounced bank data fetching
  const debouncedFetchBankData = useCallback(
    (() => {
      let timeout: NodeJS.Timeout;
      return (cardNumber: string) => {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
          if (cardNumber.length >= 6) {
            setFetchingBankData(true);
            const bankData = await fetchBankData(cardNumber);
            if (bankData) {
              setBankInfo(bankData);
            }
            setFetchingBankData(false);
          }
        }, 500);
      };
    })(),
    []
  );

  // Save cards to localStorage on every update
  useEffect(() => {
    localStorage.setItem("wallet_cards", JSON.stringify(cards));
  }, [cards]);

  // Handle Add button click
  const handleAdd = () => {
    if (nextEmptyIndex !== -1) {
      setEditing(nextEmptyIndex);
      setForm(emptyCard);
      setBankInfo({ bank: "", scheme: "" });
    }
  };

  // Handle input changes with real-time bank data fetching
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = value;

    // Update form state
    setForm({ ...form, [name]: newValue });

    // Fetch bank data when card number changes
    if (name === "number") {
      debouncedFetchBankData(newValue);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing !== null) {
      setSaving(true);

      // Use existing bank info or fetch fresh data
      let finalBankInfo = { ...bankInfo };
      if (!finalBankInfo.bank && form.number.length >= 6) {
        const bankData = await fetchBankData(form.number);
        if (bankData) {
          finalBankInfo = bankData;
        }
      }

      const updated = [...cards];
      updated[editing] = { ...form, ...finalBankInfo };
      setCards(updated);
      setEditing(null);
      setSaving(false);
      setForm(emptyCard);
      setBankInfo({ bank: "", scheme: "" });
    }
  };

  // Handle card click
  const handleCardClick = (index: number) => {
    if (editing === index) {
      setEditing(null);
    } else {
      setEditing(index);
      const card = cards[index];
      setForm({
        number: card.number,
        name: card.name,
        exp: card.exp,
        ccv: card.ccv,
        bank: card.bank || "",
        scheme: card.scheme || "",
      });
      setBankInfo({
        bank: card.bank || "",
        scheme: card.scheme || "",
      });
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: WALLET_WIDTH,
        height: WALLET_HEIGHT,
        margin: "0 auto",
      }}
    >
      {/* Main wallet body */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: WALLET_WIDTH,
          height: WALLET_HEIGHT,
          background: "#232323",
          borderRadius: BORDER_RADIUS,
          boxShadow: "0 8px 32px 0 rgba(35,35,35,0.18)",
          border: "2px solid #333",
          zIndex: 1,
        }}
      />
      {/* Cards stack */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          zIndex: 2,
          paddingBottom: POCKET_HEIGHT,
          top: -40,
        }}
      >
        {cards.map((card: CardData, i: number) => {
          const isEditing = editing === i;
          // Use bank info from form if editing, otherwise use card data
          const currentBank = isEditing ? bankInfo.bank : card.bank || "";
          const currentScheme = isEditing ? bankInfo.scheme : card.scheme || "";

          // Create a simple bank design object for compatibility
          const bankDesign = getBankDesign(
            currentBank,
            currentScheme,
            card.number
          );

          console.log(`Card ${i} Debug:`, {
            cardNumber: card.number,
            currentBank,
            currentScheme,
            bankDesign,
            isEditing,
            bankInfo,
          });

          // Debug logo URL specifically
          if (bankDesign.logoUrl) {
            console.log(`Card ${i} Logo URL:`, bankDesign.logoUrl);
          }

          // Debug bank design logic
          console.log(`Card ${i} Bank Design Logic:`, {
            bankName: currentBank,
            scheme: currentScheme,
            cardNumber: card.number,
            detectedCardType: creditCardType(card.number)[0]?.type,
            logo: bankDesign.logo,
            logoUrl: bankDesign.logoUrl,
            isEmpty: !currentBank && !card.number,
            willShowBank: !currentBank,
          });

          return (
            <CardItem
              key={i}
              card={card}
              index={i}
              isEditing={isEditing}
              bankDesign={bankDesign}
              form={form}
              bankInfo={bankInfo}
              saving={saving}
              fetchingBankData={fetchingBankData}
              onCardClick={() => handleCardClick(i)}
              onInputChange={handleInput}
              onInputClick={(e) => e.stopPropagation()}
              onSave={handleSubmit}
              onCancel={() => setEditing(null)}
            />
          );
        })}
      </div>
      {/* Bottom pocket box */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: (WALLET_WIDTH - POCKET_WIDTH) / 2,
          width: POCKET_WIDTH,
          height: POCKET_HEIGHT,
          background: "#232323",
          borderRadius: BORDER_RADIUS,
          boxShadow: "0 8px 32px 0 rgba(35,35,35,0.18)",
          border: "2px solid #333",
          zIndex: 1,
        }}
      />
      {/* Add button */}
      <button
        onClick={handleAdd}
        disabled={nextEmptyIndex === -1}
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: nextEmptyIndex === -1 ? "#666" : "#4CAF50",
          border: "none",
          color: "white",
          fontSize: 24,
          cursor: nextEmptyIndex === -1 ? "not-allowed" : "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          transition: "all 0.3s ease",
          zIndex: 3,
        }}
        onMouseEnter={(e) => {
          if (nextEmptyIndex !== -1) {
            e.currentTarget.style.transform = "translateX(-50%) scale(1.1)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateX(-50%) scale(1)";
        }}
      >
        +
      </button>
    </div>
  );
}
