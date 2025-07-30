import { useState, useCallback, useRef } from "react";
import { BankInfo } from "../../../interfaces/wallet";
import { WalletUtils } from "../../utils";
import { BANK_CONSTANTS } from "../../../apis";

export const useBankData = () => {
  const [bankInfo, setBankInfo] = useState<BankInfo>({ bank: "", scheme: "" });
  const [fetchingBankData, setFetchingBankData] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const debouncedFetchBankData = useCallback((cardNumber: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(async () => {
      if (cardNumber.length >= BANK_CONSTANTS.MIN_BIN_LENGTH) {
        setFetchingBankData(true);
        try {
          const bankData = await WalletUtils.fetchBankData(cardNumber);
          if (bankData) {
            setBankInfo(bankData);
          } else {
            setBankInfo({ bank: "", scheme: "" });
          }
        } catch {
          setBankInfo({ bank: "", scheme: "" });
        } finally {
          setFetchingBankData(false);
        }
      } else {
        setBankInfo({ bank: "", scheme: "" });
        setFetchingBankData(false);
      }
    }, BANK_CONSTANTS.DEBOUNCE_DELAY);
  }, []);

  const clearBankInfo = useCallback(() => {
    setBankInfo({ bank: "", scheme: "" });
    setFetchingBankData(false);
  }, []);

  return {
    bankInfo,
    setBankInfo,
    fetchingBankData,
    setFetchingBankData,
    debouncedFetchBankData,
    clearBankInfo,
  };
};
