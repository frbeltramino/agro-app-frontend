export const currencyFormatter = (value: number) => {
  return value.toLocaleString("es-AR", { // para formato argentino
    style: "currency",
    currency: "ARS", // código ISO de pesos argentinos
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};