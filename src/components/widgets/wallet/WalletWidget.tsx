import React, { useState, useEffect } from "react";
import CardItem from "./CardItem";

const WALLET_WIDTH = 400;
const POCKET_WIDTH = 320;
const WALLET_HEIGHT = 400;
const POCKET_HEIGHT = 200;
const BORDER_RADIUS = 32;

// Bank-specific card designs
const bankCardDesigns = {
  revolut: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    logo: "Revolut",
    logoColor: "#fff",
    textColor: "#fff",
    chipColor: "#d4af37",
  },
  chase: {
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    logo: "Chase",
    logoColor: "#fff",
    textColor: "#fff",
    chipColor: "#d4af37",
  },
  citibank: {
    background: "linear-gradient(135deg, #000428 0%, #004e92 100%)",
    logo: "Citi",
    logoColor: "#fff",
    textColor: "#fff",
    chipColor: "#d4af37",
  },
  wells_fargo: {
    background: "linear-gradient(135deg, #d31027 0%, #ea384d 100%)",
    logo: "Wells Fargo",
    logoColor: "#fff",
    textColor: "#fff",
    chipColor: "#d4af37",
  },
  bank_of_america: {
    background: "linear-gradient(135deg, #012169 0%, #1e3a8a 100%)",
    logo: "Bank of America",
    logoColor: "#fff",
    textColor: "#fff",
    chipColor: "#d4af37",
  },
  american_express: {
    background: "linear-gradient(135deg, #2e77bb 0%, #1e3a8a 100%)",
    logo: "American Express",
    logoColor: "#fff",
    textColor: "#fff",
    chipColor: "#d4af37",
  },
  capital_one: {
    background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
    logo: "Capital One",
    logoColor: "#fff",
    textColor: "#fff",
    chipColor: "#d4af37",
  },
  discover: {
    background: "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
    logo: "Discover",
    logoColor: "#fff",
    textColor: "#fff",
    chipColor: "#d4af37",
  },
  default: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    logo: "BANK",
    logoColor: "#fff",
    textColor: "#fff",
    chipColor: "#d4af37",
  },
};

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

// Function to get bank design based on bank name
const getBankDesign = (bankName: string, scheme: string) => {
  const bankLower = bankName.toLowerCase();

  if (bankLower.includes("revolut")) return bankCardDesigns.revolut;
  if (bankLower.includes("chase")) return bankCardDesigns.chase;
  if (bankLower.includes("citi")) return bankCardDesigns.citibank;
  if (bankLower.includes("wells")) return bankCardDesigns.wells_fargo;
  if (bankLower.includes("bank of america") || bankLower.includes("boa"))
    return bankCardDesigns.bank_of_america;
  if (bankLower.includes("american express") || bankLower.includes("amex"))
    return bankCardDesigns.american_express;
  if (bankLower.includes("capital one")) return bankCardDesigns.capital_one;
  if (bankLower.includes("discover")) return bankCardDesigns.discover;

  // Fallback based on scheme
  if (scheme === "visa")
    return {
      ...bankCardDesigns.default,
      background: "linear-gradient(135deg, #1a1f71 0%, #2a5298 100%)",
    };
  if (scheme === "mastercard")
    return {
      ...bankCardDesigns.default,
      background: "linear-gradient(135deg, #eb001b 0%, #f7931e 100%)",
    };
  if (scheme === "amex") return bankCardDesigns.american_express;

  return bankCardDesigns.default;
};

// Function to get bank logo URL
const getBankLogoUrl = (bankName: string) => {
  const bankLower = bankName.toLowerCase();

  // Try to fetch from a bank logo API or use a placeholder
  // For now, we'll use a simple approach with bank initials
  if (bankLower.includes("revolut"))
    return "https://logo.clearbit.com/revolut.com";
  if (bankLower.includes("chase")) return "https://logo.clearbit.com/chase.com";
  if (bankLower.includes("citi")) return "https://logo.clearbit.com/citi.com";
  if (bankLower.includes("wells"))
    return "https://logo.clearbit.com/wellsfargo.com";
  if (bankLower.includes("bank of america"))
    return "https://logo.clearbit.com/bankofamerica.com";
  if (bankLower.includes("american express"))
    return "https://logo.clearbit.com/americanexpress.com";
  if (bankLower.includes("capital one"))
    return "https://logo.clearbit.com/capitalone.com";
  if (bankLower.includes("discover"))
    return "https://logo.clearbit.com/discover.com";

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

  // Find the next empty card index
  const nextEmptyIndex = cards.findIndex(
    (c: CardData) => !c.number && !c.name && !c.exp && !c.ccv
  );

  // Remove auto-fetch on input; only fetch on Save if full card number

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

  // Handle form input change with validation/formatting
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "number") {
      // Only digits, add space every 4 digits
      newValue = newValue.replace(/\D/g, "").slice(0, 16);
      newValue = newValue.replace(/(.{4})/g, "$1 ").trim();
    } else if (name === "name") {
      // Only letters and spaces, uppercase
      newValue = newValue.replace(/[^A-Za-z ]/g, "").toUpperCase();
    } else if (name === "exp") {
      // Only digits and /, format MM/YY
      newValue = newValue.replace(/[^0-9]/g, "").slice(0, 4);
      if (newValue.length > 2) {
        newValue = newValue.slice(0, 2) + "/" + newValue.slice(2);
      }
    } else if (name === "ccv") {
      // Only digits, max 3
      newValue = newValue.replace(/\D/g, "").slice(0, 3);
    }
    setForm({ ...form, [name]: newValue });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing !== null) {
      setSaving(true);
      const digits = form.number.replace(/\D/g, "");
      let fetchedInfo = { ...bankInfo };
      if (digits.length >= 6) {
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
            fetchedInfo = {
              bank:
                data.bank_name || data.bank?.name || data.issuer?.name || "",
              scheme: data.scheme || data.card?.scheme || "",
            };
            console.log("Parsed bank info:", fetchedInfo);

            // Fallback scheme detection based on card number if API doesn't provide it
            if (!fetchedInfo.scheme && digits.length >= 6) {
              const firstDigit = digits[0];
              const firstTwoDigits = parseInt(digits.slice(0, 2));
              const firstFourDigits = parseInt(digits.slice(0, 4));

              if (firstDigit === "4") {
                fetchedInfo.scheme = "visa";
              } else if (firstTwoDigits >= 51 && firstTwoDigits <= 55) {
                fetchedInfo.scheme = "mastercard";
              } else if (firstTwoDigits === 34 || firstTwoDigits === 37) {
                fetchedInfo.scheme = "amex";
              } else if (firstFourDigits >= 2221 && firstFourDigits <= 2720) {
                fetchedInfo.scheme = "mastercard";
              }
            }
          }
        } catch {
          // Ignore fetch errors, proceed to save anyway
        }
      }
      const updated = [...cards];
      updated[editing] = { ...form, ...fetchedInfo };
      setCards(updated);
      setEditing(null);
      setSaving(false);
      setForm(emptyCard);
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
          const bankDesign = getBankDesign(card.bank || "", card.scheme || "");
          const bankLogoUrl = getBankLogoUrl(card.bank || "");

          return (
            <CardItem
              key={i}
              card={card}
              index={i}
              isEditing={isEditing}
              bankDesign={bankDesign}
              bankLogoUrl={bankLogoUrl}
              form={form}
              bankInfo={bankInfo}
              saving={saving}
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
          left: "50%",
          bottom: 0,
          width: POCKET_WIDTH,
          height: POCKET_HEIGHT,
          background: "#232323",
          borderTop: "none",
          borderTopLeftRadius: BORDER_RADIUS,
          borderTopRightRadius: BORDER_RADIUS,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          transform: "translateX(-50%)",
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          onClick={handleAdd}
          disabled={nextEmptyIndex === -1 || editing !== null}
          style={{
            padding: "12px 32px",
            borderRadius: 16,
            border: "none",
            background:
              nextEmptyIndex === -1 || editing !== null ? "#888" : "#ff6b4a",
            color: "#fff",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: 18,
            cursor:
              nextEmptyIndex === -1 || editing !== null
                ? "not-allowed"
                : "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            marginTop: 24,
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
