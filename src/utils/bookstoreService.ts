import { Bookstore } from '../types';
import { calculateDistance } from './distance';
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

/**
 * 指定された座標から一定距離内の書店を検索する
 * @param latitude 検索中心の緯度
 * @param longitude 検索中心の経度
 * @param radius 検索半径(km)、デフォルトは5km
 * @returns 距離でソートされた書店情報と距離の配列
 */
export function findBookstoresWithinRadius(
  latitude: number, 
  longitude: number, 
  radius: number = 5
): { bookstore: Bookstore; distance: number }[] {
  // 全書店に対して距離を計算
  const storesWithDistance = bookstores.map(bookstore => {
    const distance = calculateDistance(
      latitude,
      longitude,
      bookstore.latitude,
      bookstore.longitude
    );
    
    return {
      bookstore,
      distance
    };
  });

  // 指定半径内の書店をフィルタリング
  const filteredStores = storesWithDistance.filter(store => store.distance <= radius);

  // 距離の昇順でソート
  return filteredStores.sort((a, b) => a.distance - b.distance);
}

/**
 * 都道府県別に書店を取得
 * @returns 都道府県をキーとした書店のマップ
 */
export function getBookstoresByPrefecture(): Map<string, Bookstore[]> {
  const prefectureMap = new Map<string, Bookstore[]>();
  
  // 各書店を都道府県ごとに分類
  bookstores.forEach(bookstore => {
    if (!bookstore.prefecture) return;
    
    if (!prefectureMap.has(bookstore.prefecture)) {
      prefectureMap.set(bookstore.prefecture, []);
    }
    
    prefectureMap.get(bookstore.prefecture)?.push(bookstore);
  });
  
  return prefectureMap;
}

/**
 * 指定した都道府県の書店を取得
 * @param prefecture 都道府県名
 * @returns 書店の配列
 */
export function getBookstoresByPrefectureName(prefecture: string): Bookstore[] {
  return bookstores.filter(bookstore => bookstore.prefecture === prefecture);
} 