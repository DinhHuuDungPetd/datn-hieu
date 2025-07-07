export function formatCurrencyVND(number : number) {
  if (isNaN(number)) return '0 ₫';

  return number.toLocaleString('vi-VN') + ' ₫';
}