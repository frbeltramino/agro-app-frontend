export function formatCurrency(num?: number | null): string {
  if (num == null) return "$0,00";

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}