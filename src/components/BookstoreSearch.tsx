import { useState, useEffect } from 'react';
import PostalCodeSearchForm from './PostalCodeSearchForm';
import BookstoreList from './BookstoreList';
import { Bookstore } from '../types';
import { getCoordinatesFromPostalCode } from '../utils/distance';
import { findBookstoresWithinRadius, getAllBookstores } from '../utils/bookstoreService';
import { prefectures } from '../data/prefectures';

const BookstoreSearch: React.FC = () => {
  const [searchResults, setSearchResults] = useState<{ bookstore: Bookstore; distance: number }[]>([]);
  const [allBookstores, setAllBookstores] = useState<Bookstore[]>([]);
  const [filteredBookstores, setFilteredBookstores] = useState<Bookstore[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [postalCodeFilter, setPostalCodeFilter] = useState<string>('');
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>('');

  // 初期化時に全書店データを取得
  useEffect(() => {
    setAllBookstores(getAllBookstores());
    setFilteredBookstores(getAllBookstores());
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

  // 郵便番号フィルタリング処理
  const handlePostalCodeFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPostalCodeFilter(value);
    
    // フィルタリング条件：郵便番号と選択された都道府県の両方に一致する書店を表示
    filterBookstores(value, selectedPrefecture);
  };

  // 都道府県選択処理
  const handlePrefectureChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedPrefecture(value);
    
    // フィルタリング条件：郵便番号と選択された都道府県の両方に一致する書店を表示
    filterBookstores(postalCodeFilter, value);
  };

  // 書店のフィルタリング
  const filterBookstores = (postalCode: string, prefecture: string) => {
    let filtered = [...allBookstores];
    
    // 都道府県でフィルタリング
    if (prefecture) {
      filtered = filtered.filter(store => store.prefecture === prefecture);
    }
    
    // 郵便番号でフィルタリング（住所に含まれる場合）
    if (postalCode) {
      // 数字のみの場合はゆるめの検索（住所に含まれていればOK）
      filtered = filtered.filter(store => 
        store.address.includes(postalCode)
      );
    }
    
    setFilteredBookstores(filtered);
  };

  return (
    <div className="bookstore-search-container">
      <header className="app-header">
        <h1>書店検索</h1>
        <p className="app-description">
          お近くの書店を郵便番号から検索、またはリストから探せます
        </p>
      </header>

      <main>
        <section className="search-section">
          <div className="search-options">
            <div className="distance-search">
              <h2 className="section-title">距離で検索</h2>
              <PostalCodeSearchForm
                onSearch={handleSearch}
                isLoading={isLoading}
              />
              
              {error && (
                <div className="error-container" role="alert">
                  <p className="error-message">{error}</p>
                </div>
              )}

              {hasSearched && (
                <div className="results-section">
                  <div className="results-header">
                    <h3 className="list-title">検索結果 ({searchResults.length}件)</h3>
                    <button 
                      type="button"
                      onClick={handleClear}
                      className="clear-button"
                      aria-label="検索結果をクリア"
                    >
                      クリア
                    </button>
                  </div>
                  <BookstoreList
                    bookstores={searchResults}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </div>

            <div className="filter-section">
              <h2 className="section-title">書店を絞り込む</h2>
              
              <div className="filter-controls">
                <div className="filter-group">
                  <label htmlFor="postalCodeFilter" className="filter-label">
                    郵便番号／住所で絞り込み:
                  </label>
                  <input
                    type="text"
                    id="postalCodeFilter"
                    className="filter-input"
                    placeholder="例: 123-4567 または 東京都新宿区"
                    value={postalCodeFilter}
                    onChange={handlePostalCodeFilterChange}
                  />
                </div>
                
                <div className="filter-group">
                  <label htmlFor="prefectureFilter" className="filter-label">
                    都道府県で絞り込み:
                  </label>
                  <select
                    id="prefectureFilter"
                    className="filter-select"
                    value={selectedPrefecture}
                    onChange={handlePrefectureChange}
                  >
                    <option value="">すべての都道府県</option>
                    {prefectures.map(pref => (
                      <option key={pref.code} value={pref.name}>
                        {pref.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bookstore-list-section">
          <h2 className="section-title">書店一覧 ({filteredBookstores.length}件)</h2>
          <div className="bookstore-grid">
            {filteredBookstores.map(bookstore => (
              <div key={bookstore.id} className="bookstore-card">
                <h3 className="bookstore-name">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${bookstore.latitude},${bookstore.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {bookstore.name}
                  </a>
                </h3>
                <p className="bookstore-prefecture">{bookstore.prefecture}</p>
                <p className="bookstore-address">{bookstore.address}</p>
                <p className="bookstore-phone">TEL: {bookstore.phone}</p>
                <div className="bookstore-tags">
                  <span className="tag">MAP</span>
                  {bookstore.phone && <span className="tag">TEL</span>}
                </div>
              </div>
            ))}
          </div>
          
          {filteredBookstores.length === 0 && !isLoading && (
            <div className="no-results" role="status">
              <p>条件に一致する書店が見つかりませんでした。検索条件を変更してください。</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default BookstoreSearch; 