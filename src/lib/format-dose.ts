export const formatDose = (value?: number | null) =>
  value == null
    ? "0,000"
    : value.toLocaleString("es-AR", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });