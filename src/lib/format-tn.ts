export const formatTn = (value?: number | null) => {
  if (value == null) return "0,000"; // retorna 0 si es null o undefined

  return value.toLocaleString("es-AR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
};