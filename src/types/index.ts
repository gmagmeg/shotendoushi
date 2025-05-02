export interface Bookstore {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  prefecture: string;
  xaccount?: string; // X（旧Twitter）のアカウント
  url?: string; // 書店のWebサイト
  image?: string; // 書店の画像パス
}

export interface Prefecture {
  code: string;
  name: string;
} 