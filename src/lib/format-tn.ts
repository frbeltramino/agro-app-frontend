export const formatTn = (value?: number | null) => {
  if (value == null) return "0,00"; // retorna 0 si es null o undefined

  return value.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};