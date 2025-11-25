export const parseAmount = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null) return 0;

  let str = String(value).trim();

  // Reemplaza coma por punto
  str = str.replace(",", ".");

  // Elimina cualquier caracter que no sea dígito o punto
  str = str.replace(/[^0-9.]/g, "");

  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
};