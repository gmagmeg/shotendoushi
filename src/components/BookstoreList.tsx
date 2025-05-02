import { Bookstore } from '../types';

interface BookstoreListProps {
  bookstores: { bookstore: Bookstore; distance: number }[];
  isLoading: boolean;
}

const BookstoreList: React.FC<BookstoreListProps> = ({ bookstores, isLoading }) => {
  // 書店がない場合のメッセージ
  if (!isLoading && bookstores.length === 0) {
    return (
      <div className="no-results" role="status">
        <p>該当する書店が見つかりませんでした。</p>
      </div>
    );
  }

  // ローディング中
  if (isLoading) {
    return (
      <div className="loading" role="status">
        <p>検索中...</p>
      </div>
    );
  }

  return (
    <div className="bookstore-list">
      {bookstores.map(({ bookstore, distance }) => (
        <div key={bookstore.id} className="bookstore-list-item">
          <div className="store-header">
            <h3 className="store-name">{bookstore.name}</h3>
            <span className="store-distance">(約{distance.toFixed(1)}km)</span>
          </div>
          <p className="bookstore-prefecture">{bookstore.prefecture}</p>
          <p className="store-address">{bookstore.address}</p>
          <p className="store-phone">TEL: {bookstore.phone}</p>
          <div className="bookstore-tags">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${bookstore.latitude},${bookstore.longitude}`}
              className="maps-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${bookstore.name}のGoogleマップを開く`}
            >
              Google マップで見る
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookstoreList; 