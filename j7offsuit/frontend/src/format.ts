export function formatChip(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value);
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export function signed(value: number, formatter: (n: number) => string) {
  if (value > 0) return `+${formatter(value)}`;
  return formatter(value);
}

export function getDiffLabel(value: number) {
  if (value === 0) return 'Cân chip';
  if (value > 0) return `Dư ${formatChip(value)} chip`;
  return `Thiếu ${formatChip(Math.abs(value))} chip`;
}
