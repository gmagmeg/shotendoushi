import { useState, useEffect } from 'react';
import PostalCodeSearchForm from './PostalCodeSearchForm';
import BookstoreList from './BookstoreList';
import { Bookstore } from '../types';
import { getCoordinatesFromPostalCode } from '../utils/distance';
import { findBookstoresWithinRadius, getAllBookstores } from '../utils/bookstoreService';

const BookstoreSearch: React.FC = () => {
  const [searchResults, setSearchResults] = useState<{ bookstore: Bookstore; distance: number }[]>([]);
  const [allBookstores, setAllBookstores] = useState<Bookstore[]>([]);
  const [filteredBookstores, setFilteredBookstores] = useState<Bookstore[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
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

  // 検索処理
  const handleSearch = async (postalCode: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // 郵便番号から座標を取得
      const coordinates = await getCoordinatesFromPostalCode(postalCode);

      // 座標から近くの書店を検索
      const bookstores = findBookstoresWithinRadius(
        coordinates.latitude,
        coordinates.longitude
      );

      setSearchResults(bookstores);
    } catch (err) {
      console.error('検索エラー:', err);
      setError('検索中にエラーが発生しました。もう一度お試しください。');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 検索結果のクリア
  const handleClear = () => {
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
  };

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

  return (
    <div className="bookstore-search-container" style={{ backgroundColor: '#ffffff' }}>
      <header className="app-header" style={{ backgroundColor: '#ffffff' }}>
        <h1>あなたの街の書店"同士</h1>
        <p className="app-description">
          お近くの書店を検索、またはリストから探せます
        </p>
      </header>

      <main style={{ backgroundColor: '#ffffff' }}>
        <section className="search-section" style={{ backgroundColor: '#ffffff' }}>
          <div className="filter-section" style={{ backgroundColor: '#f5f5f5' }}>
            <h2 className="section-title">書店を絞り込む</h2>

            <div className="filter-controls">
              <div className="filter-group">
                <label htmlFor="prefectureFilter" className="filter-label">
                  都道府県で絞り込み:
                </label>
                <div className="filter-row">
                  <select
                    id="prefectureFilter"
                    className="filter-select"
                    value={selectedPrefecture}
                    onChange={handlePrefectureChange}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#333',
                      border: '1px solid #ddd'
                    }}
                  >
                    <option value="" style={{ color: '#333' }}>すべての都道府県</option>
                    {availablePrefectures.map(prefecture => (
                      <option key={prefecture} value={prefecture} style={{ color: '#333' }}>
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
                    style={{ backgroundColor: '#f8f8f8' }}
                  >
                    クリア
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bookstore-list-section" style={{ backgroundColor: '#ffffff' }}>
          <h2 className="section-title">書店一覧 ({filteredBookstores.length}件)</h2>
          <div className="bookstore-list">
            {filteredBookstores.map(bookstore => (
              <div key={bookstore.id} className="bookstore-list-item" style={{ backgroundColor: '#ffffff' }}>
                <h3 className="bookstore-name">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${bookstore.latitude},${bookstore.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#3498db' }}
                  >
                    {bookstore.name}
                  </a>
                </h3>
                <p className="bookstore-prefecture" style={{ color: '#666' }}>{bookstore.prefecture}</p>
                <p className="bookstore-address" style={{ color: '#555' }}>{bookstore.address}</p>
                <p className="bookstore-phone" style={{ color: '#555' }}>TEL: {bookstore.phone}</p>
                <div className="bookstore-tags">
                  <span className="tag" style={{ backgroundColor: '#3498db' }}>MAP</span>
                  {bookstore.phone && <span className="tag" style={{ backgroundColor: '#3498db' }}>TEL</span>}
                </div>
              </div>
            ))}
          </div>

          {filteredBookstores.length === 0 && !isLoading && (
            <div className="no-results" role="status" style={{ backgroundColor: '#f5f5f5', color: '#333' }}>
              <p>条件に一致する書店が見つかりませんでした。検索条件を変更してください。</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default BookstoreSearch; 