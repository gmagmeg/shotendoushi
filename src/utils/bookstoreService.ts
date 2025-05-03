import { Bookstore } from '../types';
import bookstoresData from '../data/bookstores.json';

// JSONファイルの型をBookstore[]に変換
const bookstores: Bookstore[] = bookstoresData as Bookstore[];

/**
 * 全ての書店情報を取得
 * @returns 書店情報の配列
 */
export function getAllBookstores(): Bookstore[] {
  return bookstores;
} 