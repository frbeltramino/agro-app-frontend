export const currencyFormatter = (value?: number | null) => {
  if (value == null) return "ARS 0,00"; // retorna 0 si es null o undefined

  return value.toLocaleString("es-AR", { // formato argentino
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};