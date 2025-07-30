import { useState } from "react";
import { CardForm, EMPTY_CARD } from "../../../interfaces/wallet";

export const useFormManagement = () => {
  const [form, setForm] = useState<CardForm>(EMPTY_CARD);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setForm(EMPTY_CARD);
    setSaving(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return {
    form,
    setForm,
    saving,
    setSaving,
    resetForm,
    handleInput,
  };
};
