/**
 * 郵便番号が正しい形式かチェックする
 * @param postalCode 郵便番号
 * @returns 有効な郵便番号ならtrue
 */
export function isValidPostalCode(postalCode: string): boolean {
  // 7桁の数字のみを有効とする
  const postalCodeRegex = /^\d{7}$/;
  return postalCodeRegex.test(postalCode);
}

/**
 * 郵便番号をハイフンありの形式に統一する
 * @param postalCode 郵便番号
 * @returns ハイフン付き郵便番号
 */
export function formatPostalCode(postalCode: string): string {
  // 必ずハイフンを追加して返す
  if (/^\d{7}$/.test(postalCode)) {
    return `${postalCode.slice(0, 3)}-${postalCode.slice(3)}`;
  }
  return postalCode;
} 