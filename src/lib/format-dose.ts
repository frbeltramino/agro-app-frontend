export const formatDose = (value: number) => {
  return value.toLocaleString("es-AR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
};