import { useState, useEffect, useCallback, useMemo } from "react";
import { CardData } from "../../../interfaces/wallet";
import { WALLET_CONSTANTS } from "../../constants";
import { EMPTY_CARD } from "../../data";
import { WalletUtils } from "../../utils";
import { useBankData, useCardManagement, useFormManagement } from "./";

const { WALLET_WIDTH, WALLET_HEIGHT, POCKET_HEIGHT } = WALLET_CONSTANTS;

export const useWalletLogic = () => {
  const [editing, setEditing] = useState<number | null>(null);

  const {
    cards,
    setCards,
    nextEmptyIndex,
    canAddCard,
    clearWallet,
    updateCard,
  } = useCardManagement();

  const {
    form,
    setForm,
    saving,
    setSaving,
    resetForm,
    handleInput: baseHandleInput,
  } = useFormManagement();

  const {
    bankInfo,
    setBankInfo,
    fetchingBankData,
    setFetchingBankData,
    debouncedFetchBankData,
    clearBankInfo,
  } = useBankData();

  useEffect(() => {
    setEditing(null);
  }, []);

  const dynamicHeight = useMemo(() => {
    const baseHeight = WALLET_HEIGHT;

    if (cards.length > 5) {
      const additionalCards = cards.length - 5;
      const additionalHeight = additionalCards * 30;
      return baseHeight + additionalHeight;
    }

    return baseHeight;
  }, [cards.length]);

  useEffect(() => {
    if (form.number.length < 6) {
      setFetchingBankData(false);
    }
  }, [form.number, setFetchingBankData]);

  useEffect(() => {
    if (editing === null) {
      setFetchingBankData(false);
    }
  }, [editing, setFetchingBankData]);

  useEffect(() => {
    localStorage.setItem("wallet_cards", JSON.stringify(cards));
  }, [cards]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      baseHandleInput(e);
      if (e.target.name === "number") {
        debouncedFetchBankData(e.target.value);
      }
    },
    [baseHandleInput, debouncedFetchBankData]
  );

  const handleAdd = useCallback(() => {
    if (!canAddCard) {
      return;
    }

    if (nextEmptyIndex !== -1) {
      if (editing === nextEmptyIndex) {
        setEditing(null);
        resetForm();
        clearBankInfo();
      } else {
        if (editing !== null) {
          setEditing(null);
          resetForm();
          clearBankInfo();
        }

        setEditing(nextEmptyIndex);
        resetForm();
        clearBankInfo();
      }
    } else {
      const newCardIndex = cards.length;
      const newCards = [...cards, { ...EMPTY_CARD }];
      setCards(newCards);

      if (editing !== null) {
        setEditing(null);
        resetForm();
        clearBankInfo();
      }

      setEditing(newCardIndex);
      resetForm();
      clearBankInfo();
    }
  }, [
    nextEmptyIndex,
    editing,
    cards,
    canAddCard,
    setCards,
    setEditing,
    resetForm,
    clearBankInfo,
  ]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (editing !== null) {
        setSaving(true);

        let finalBankInfo = { ...bankInfo };

        if (
          (!finalBankInfo.bank || !finalBankInfo.scheme) &&
          form.number.length >= 6
        ) {
          try {
            const bankData = await WalletUtils.fetchBankData(form.number);
            if (bankData) {
              finalBankInfo = bankData;
            }
          } catch {
            // Continue with existing bank info
          }
        }

        const cardData: CardData = {
          ...form,
          bank: finalBankInfo.bank,
          scheme: finalBankInfo.scheme,
        };

        updateCard(editing, cardData);

        setEditing(null);
        setSaving(false);
        resetForm();
        clearBankInfo();
      }
    },
    [
      editing,
      form,
      bankInfo,
      updateCard,
      setSaving,
      setEditing,
      resetForm,
      clearBankInfo,
    ]
  );

  const handleCardClick = useCallback(
    (index: number) => {
      if (editing === index) {
        setEditing(null);
        resetForm();
        clearBankInfo();
      } else {
        setEditing(index);
        const card = cards[index];

        const hasCardData = card.number || card.name || card.exp || card.ccv;

        if (hasCardData) {
          const formData = {
            number: card.number,
            name: card.name,
            exp: card.exp,
            ccv: card.ccv,
            bank: card.bank || "",
            scheme: card.scheme || "",
          };
          setForm(formData);

          const savedBankInfo = {
            bank: card.bank || "",
            scheme: card.scheme || "",
          };
          setBankInfo(savedBankInfo);
          setFetchingBankData(false);
        } else {
          resetForm();
          clearBankInfo();
        }
      }
    },
    [
      editing,
      cards,
      setEditing,
      setForm,
      setBankInfo,
      setFetchingBankData,
      resetForm,
      clearBankInfo,
    ]
  );

  const getCardBankDesign = useCallback(
    (card: CardData, index: number) => {
      const isEditing = editing === index;
      const currentBank = isEditing ? bankInfo.bank : card.bank || "";
      const currentScheme = isEditing ? bankInfo.scheme : card.scheme || "";

      return WalletUtils.getBankDesign(currentBank, currentScheme, card.number);
    },
    [editing, bankInfo]
  );

  return {
    cards,
    editing,
    form,
    bankInfo,
    saving,
    fetchingBankData,
    nextEmptyIndex,
    canAddCard,
    dynamicHeight,
    WALLET_WIDTH,
    WALLET_HEIGHT,
    POCKET_HEIGHT,
    handleAdd,
    handleInput,
    handleSubmit,
    handleCardClick,
    getCardBankDesign,
    setEditing,
    clearWallet,
  };
};
