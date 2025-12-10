export const formatNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};