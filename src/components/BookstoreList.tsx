import { Bookstore } from '../types';

interface BookstoreListProps {
  bookstores: { bookstore: Bookstore; distance: number }[];
  isLoading: boolean;
}

const BookstoreList: React.FC<BookstoreListProps> = ({ bookstores, isLoading }) => {
  // 書店がない場合のメッセージ
  if (!isLoading && bookstores.length === 0) {
    return (
      <div className="no-results" role="status" style={{ backgroundColor: '#f5f5f5', color: '#333' }}>
        <p>該当する書店が見つかりませんでした。</p>
      </div>
    );
  }

  // ローディング中
  if (isLoading) {
    return (
      <div className="loading" role="status" style={{ backgroundColor: '#f5f5f5', color: '#333' }}>
        <p>検索中...</p>
      </div>
    );
  }

  return (
    <div className="bookstore-list" style={{ backgroundColor: '#ffffff' }}>
      {bookstores.map(({ bookstore, distance }) => (
        <div key={bookstore.id} className="bookstore-list-item" style={{ backgroundColor: '#ffffff' }}>
          <div className="bookstore-content">
            <div className="bookstore-info">
              <div className="store-header">
                <h3 className="store-name" style={{ color: '#3498db' }}>{bookstore.name}</h3>
                <span className="store-distance" style={{ color: '#666' }}>(約{distance.toFixed(1)}km)</span>
              </div>
              <p className="bookstore-prefecture" style={{ color: '#666' }}>{bookstore.prefecture}</p>
              <p className="store-address" style={{ color: '#555' }}>{bookstore.address}</p>
              <p className="store-phone" style={{ color: '#555' }}>TEL: {bookstore.phone}</p>
              {bookstore.url && (
                <p className="bookstore-url">
                  <a
                    href={bookstore.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#3498db' }}
                  >
                    <span className="icon" role="img" aria-label="公式サイト">🌐</span> 公式サイト
                  </a>
                </p>
              )}
              {bookstore.xaccount && (
                <p className="bookstore-xaccount">
                  <a
                    href={bookstore.xaccount}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#3498db' }}
                  >
                    <span className="icon" role="img" aria-label="SNSアカウント">🐦</span> SNSアカウント
                  </a>
                </p>
              )}
              <div className="bookstore-tags">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${bookstore.latitude},${bookstore.longitude}`}
                  className="maps-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${bookstore.name}のGoogleマップを開く`}
                  style={{ color: '#3498db', fontSize: '0.9rem' }}
                >
                  <span className="icon" role="img" aria-label="地図">📍</span> 地図を見る
                </a>
              </div>
            </div>
            <div className="bookstore-image">
              <img
                src={bookstore.image?.replace('./image/', '/image/') || '/image/default.jpg'}
                alt={`${bookstore.name}の外観`}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  backgroundColor: '#f0f0f0'
                }}
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/image/default.jpg';
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookstoreList; 