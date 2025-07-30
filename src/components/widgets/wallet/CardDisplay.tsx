import React from "react";
import { CardDisplayProps } from "../../../../interfaces/wallet";
import { useCardDisplay } from "../../../hooks/wallet/useCardDisplay";
import {
  BankLogo,
  ActionButtons,
  CardNumberSection,
  BankInfoDisplay,
  CardDetailsSection,
} from "./card-display";

export default function CardDisplay({
  cardNumber,
  cardHolder,
  expirationDate,
  bankName,
  scheme,
  bankDesign,
  isEditing = false,
  formInputs,
  onInputChange,
  onInputClick,
  bankInfo,
  saving,
  fetchingBankData,
  onSave,
  onCancel,
}: CardDisplayProps) {
  const {
    externalLogoLoaded,
    setExternalLogoLoaded,
    externalLogoFailed,
    setExternalLogoFailed,
    isInfoVisible,
    hasCardData,
    isExpirationDateValid,
    maskedDisplayNumber,
    maskedDisplayHolder,
    maskedDisplayExp,
    displayScheme,
    handleExpirationDateChange,
    getTextColor,
    toggleInfoVisibility,
  } = useCardDisplay(
    cardNumber,
    cardHolder,
    expirationDate,
    isEditing,
    formInputs
  );

  const currentBankName = isEditing ? bankInfo?.bank : bankName;
  const textColor = getTextColor(bankDesign.textColor);

  const handleExpirationDateInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const syntheticEvent = handleExpirationDateChange(e);
    onInputChange?.(syntheticEvent);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: 20,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        <BankLogo
          currentBankName={currentBankName}
          bankDesign={bankDesign}
          externalLogoLoaded={externalLogoLoaded}
          externalLogoFailed={externalLogoFailed}
          setExternalLogoLoaded={setExternalLogoLoaded}
          setExternalLogoFailed={setExternalLogoFailed}
        />

        <ActionButtons
          isEditing={isEditing}
          hasCardData={hasCardData}
          saving={saving}
          bankDesign={bankDesign}
          onSave={onSave}
          onCancel={onCancel}
          onToggleVisibility={toggleInfoVisibility}
          isInfoVisible={isInfoVisible}
          textColor={textColor}
        />
      </div>

      <CardNumberSection
        isEditing={isEditing}
        hasCardData={hasCardData}
        isInfoVisible={isInfoVisible}
        maskedDisplayNumber={maskedDisplayNumber}
        formInputs={formInputs}
        onInputChange={onInputChange}
        onInputClick={onInputClick}
        textColor={textColor}
        bankDesign={bankDesign}
      />

      <BankInfoDisplay
        isEditing={isEditing}
        currentBankName={currentBankName}
        scheme={scheme}
        bankInfo={bankInfo}
        fetchingBankData={fetchingBankData}
        textColor={textColor}
      />

      <CardDetailsSection
        isEditing={isEditing}
        hasCardData={hasCardData}
        isInfoVisible={isInfoVisible}
        maskedDisplayHolder={maskedDisplayHolder}
        maskedDisplayExp={maskedDisplayExp}
        displayScheme={displayScheme}
        formInputs={formInputs}
        onInputChange={onInputChange}
        onInputClick={onInputClick}
        onExpirationDateChange={handleExpirationDateInputChange}
        isExpirationDateValid={isExpirationDateValid}
        textColor={textColor}
        bankDesign={bankDesign}
      />
    </div>
  );
}
