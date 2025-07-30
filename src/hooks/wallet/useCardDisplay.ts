import { useState, useEffect, useCallback } from "react";

export const useCardDisplay = (
  cardNumber: string,
  cardHolder: string,
  expirationDate: string,
  isEditing: boolean,
  formInputs?: {
    number: string;
    name: string;
    exp: string;
    ccv: string;
    scheme?: string;
  }
) => {
  const [externalLogoLoaded, setExternalLogoLoaded] = useState(false);
  const [externalLogoFailed, setExternalLogoFailed] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const displayNumber = isEditing
    ? formInputs?.number || cardNumber
    : cardNumber;

  const hasCardData = Boolean(cardNumber || cardHolder || expirationDate);

  const formatExpirationDate = useCallback((value: string) => {
    const digits = value.replace(/\D/g, "");
    const limited = digits.slice(0, 4);

    if (limited.length > 2) {
      return limited.slice(0, 2) + "/" + limited.slice(2);
    }

    return limited;
  }, []);

  const validateExpirationDate = useCallback((value: string) => {
    if (!value || value.length !== 5) return false;

    const [month, year] = value.split("/");
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (monthNum < 1 || monthNum > 12) return false;
    if (yearNum < 0 || yearNum > 99) return false;

    return true;
  }, []);

  const isExpirationDateValid = formInputs?.exp
    ? validateExpirationDate(formInputs.exp)
    : true;

  const maskedDisplayNumber = isEditing
    ? hasCardData && !isInfoVisible
      ? displayNumber.length > 8
        ? displayNumber.slice(0, -8) + "********"
        : displayNumber
      : displayNumber
    : displayNumber.length > 8
      ? displayNumber.slice(0, -8) + "********"
      : displayNumber;

  const displayHolder = isEditing ? formInputs?.name || cardHolder : cardHolder;
  const displayExp = isEditing
    ? formInputs?.exp || expirationDate
    : expirationDate;

  const maskedDisplayHolder = isEditing
    ? hasCardData && !isInfoVisible
      ? displayHolder.length > 0
        ? "**** ****"
        : ""
      : displayHolder
    : displayHolder.length > 0
      ? "**** ****"
      : "";

  const maskedDisplayExp = isEditing
    ? hasCardData && !isInfoVisible
      ? displayExp.length > 0
        ? "**/**"
        : ""
      : displayExp
    : displayExp.length > 0
      ? "**/**"
      : "";

  const displayScheme = isEditing ? formInputs?.scheme : undefined;

  const handleExpirationDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatExpirationDate(e.target.value);

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name: "exp",
          value: formattedValue,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      return syntheticEvent;
    },
    [formatExpirationDate]
  );

  const getTextColor = useCallback(
    (bankDesignTextColor: string) => {
      if (isEditing) {
        return hasCardData && !isInfoVisible ? "#888" : bankDesignTextColor;
      }
      return "#888";
    },
    [isEditing, hasCardData, isInfoVisible]
  );

  const toggleInfoVisibility = useCallback(() => {
    setIsInfoVisible(!isInfoVisible);
  }, [isInfoVisible]);

  useEffect(() => {
    setExternalLogoLoaded(false);
    setExternalLogoFailed(false);
  }, []);

  useEffect(() => {
    if (isEditing && hasCardData) {
      setIsInfoVisible(false);
    }
  }, [isEditing, hasCardData]);

  return {
    externalLogoLoaded,
    setExternalLogoLoaded,
    externalLogoFailed,
    setExternalLogoFailed,
    isInfoVisible,
    displayNumber,
    hasCardData,
    formatExpirationDate,
    validateExpirationDate,
    isExpirationDateValid,
    maskedDisplayNumber,
    displayHolder,
    displayExp,
    maskedDisplayHolder,
    maskedDisplayExp,
    displayScheme,
    handleExpirationDateChange,
    getTextColor,
    toggleInfoVisibility,
  };
};
