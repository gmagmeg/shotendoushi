import { useState, useEffect } from 'react';
import { Bookstore } from '../types';
import { getAllBookstores } from '../utils/bookstoreService';

const BookstoreSearch: React.FC = () => {
  const [allBookstores, setAllBookstores] = useState<Bookstore[]>([]);
  const [filteredBookstores, setFilteredBookstores] = useState<Bookstore[]>([]);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>('');
  const [availablePrefectures, setAvailablePrefectures] = useState<string[]>([]);

  // 初期化時に全書店データを取得
  useEffect(() => {
    const bookstores = getAllBookstores();
    setAllBookstores(bookstores);
    setFilteredBookstores(bookstores);

    // 登録されている都道府県のリストを生成
    const prefectures = [...new Set(bookstores.map(store => store.prefecture)
      .filter((pref): pref is string => pref !== undefined))]
      .sort();
    setAvailablePrefectures(prefectures);
  }, []);

  // 都道府県選択処理
  const handlePrefectureChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedPrefecture(value);

    // フィルタリング条件：選択された都道府県に一致する書店を表示
    filterBookstores(value);
  };

  // フィルタリングのクリア
  const handleClearFilter = () => {
    setSelectedPrefecture('');
    setFilteredBookstores(allBookstores);
  };

  // 書店のフィルタリング
  const filterBookstores = (prefecture: string) => {
    let filtered = [...allBookstores];

    // 都道府県でフィルタリング
    if (prefecture) {
      filtered = filtered.filter(store => store.prefecture === prefecture);
    }

    setFilteredBookstores(filtered);
  };

  // 画像レンダリング処理を共通化
  const renderBookstoreImage = (bookstore: Bookstore, className: string) => (
    <div className={className}>
      <img
        src={bookstore.image?.replace('./image/', './image/') || './image/default.jpg'}
        alt={`${bookstore.name}の外観`}
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/image/default.jpg';
        }}
      />
    </div>
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>あなたの街の書店"同士</h1>
        <p className="app-description">
          お近くの書店を検索、またはリストから探せます
        </p>
      </header>

      <main>
        <section>
          <div className="filter-section">
            <h2 className="section-title">都道府県で絞り込み</h2>

            <div className="filter-controls">
              <div className="filter-group">
                <div className="filter-row">
                  <select
                    id="prefectureFilter"
                    className="filter-select"
                    value={selectedPrefecture}
                    onChange={handlePrefectureChange}
                  >
                    <option value="">すべての都道府県</option>
                    {availablePrefectures.map(prefecture => (
                      <option key={prefecture} value={prefecture}>
                        {prefecture}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleClearFilter}
                    className="clear-filter-button"
                    aria-label="フィルタリングをクリア"
                    disabled={!selectedPrefecture}
                  >
                    クリア
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bookstore-list-section">
          <h2 className="section-title">書店一覧 ({filteredBookstores.length}件)</h2>
          <div className="bookstore-list">
            {filteredBookstores.map(bookstore => (
              <div key={bookstore.id} className="bookstore-list-item">
                <div className="bookstore-content">
                  <div className="bookstore-info">
                    <h3 className="bookstore-name">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${bookstore.latitude},${bookstore.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {bookstore.name}
                      </a>
                    </h3>
                    {/* モバイル向け画像表示 */}
                    {renderBookstoreImage(bookstore, "block md:hidden bookstore-image mb-4")}
                    <p className="bookstore-prefecture">{bookstore.prefecture}</p>
                    <p className="bookstore-address">{bookstore.address}</p>
                    <p className="bookstore-phone">TEL: {bookstore.phone}</p>
                    {bookstore.url && (
                      <p className="bookstore-url">
                        <a
                          href={bookstore.url}
                          target="_blank"
                          rel="noopener noreferrer"
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
                        >
                          <span className="icon" role="img" aria-label="SNSアカウント">🐦</span> SNSアカウント
                        </a>
                      </p>
                    )}
                    <div className="bookstore-tags">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${bookstore.latitude},${bookstore.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="icon" role="img" aria-label="地図">📍</span> 地図を見る
                      </a>
                    </div>
                  </div>
                  {/* デスクトップ向け画像表示 */}
                  {renderBookstoreImage(bookstore, "hidden md:flex bookstore-image")}
                </div>
              </div>
            ))}
          </div>

          {filteredBookstores.length === 0 && (
            <div className="no-results">
              <p>条件に一致する書店が見つかりませんでした。検索条件を変更してください。</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default BookstoreSearch; 