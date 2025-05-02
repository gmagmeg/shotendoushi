/**
 * 2点間の距離をHaversine公式で計算する
 * @param lat1 地点1の緯度
 * @param lon1 地点1の経度
 * @param lat2 地点2の緯度
 * @param lon2 地点2の経度
 * @returns 距離(km)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // 地球の半径 (km)
  const R = 6371;
  
  // 緯度・経度をラジアンに変換
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  // haversine公式の計算
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * 郵便番号から座標を取得する関数（外部APIを使用）
 * @param postalCode 郵便番号
 * @returns 緯度・経度の座標
 */
export async function getCoordinatesFromPostalCode(postalCode: string): Promise<{latitude: number, longitude: number}> {
  try {
    // ハイフンを削除して7桁の数字のみにする
    const cleanedPostalCode = postalCode.replace(/-/g, '');
    
    // 郵便番号から住所情報を取得するAPIを使用
    const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanedPostalCode}`);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // 本番環境では緯度・経度を返すAPIを使用する必要があります
      // このAPIは緯度・経度を直接返さないため、本来は別のAPIやサービスを利用する必要があります
      // デモとして仮の値を返しています
      const address = data.results[0];
      
      // 別のAPIで緯度・経度を取得するロジックが必要
      // 仮の実装としてダミーデータを返す
      return {
        latitude: 35.6895, // 仮の値
        longitude: 139.6917 // 仮の値
      };
    } else {
      throw new Error("郵便番号に対応する住所が見つかりませんでした");
    }
  } catch (error) {
    console.error("郵便番号から座標を取得できませんでした", error);
    throw error;
  }
} 