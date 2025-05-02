export interface Bookstore {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  prefecture?: string; // 都道府県情報（オプション）
}

export interface Prefecture {
  code: string;
  name: string;
} 