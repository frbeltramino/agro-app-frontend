import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface CurrencyInputProps {
  register: UseFormRegisterReturn;
  placeholder?: string;
  className?: string;
}

export const CustomCurrencyInput: React.FC<CurrencyInputProps> = ({ register, placeholder = "0,00", className }) => {
  return (
    <input
      type="text"
      {...register}
      onChange={(e) => {
        // Solo dejar números, punto y coma
        let raw = e.target.value.replace(/[^0-9.,]/g, "");
        // Reemplazar múltiplos puntos por nada
        const parts = raw.split(",");
        raw = parts[0].replace(/\./g, "") + (parts[1] ? "," + parts[1] : "");
        e.target.value = raw;
      }}
      placeholder={placeholder}
      className={className || "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"}
    />
  );
};