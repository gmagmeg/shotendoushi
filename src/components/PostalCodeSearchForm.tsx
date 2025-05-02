import { useState, FormEvent } from 'react';
import { isValidPostalCode, formatPostalCode } from '../utils/validation';

interface PostalCodeSearchFormProps {
  onSearch: (postalCode: string) => void;
  isLoading: boolean;
}

const PostalCodeSearchForm: React.FC<PostalCodeSearchFormProps> = ({ onSearch, isLoading }) => {
  const [postalCode, setPostalCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // 入力値から空白とハイフンを削除
    const trimmedPostalCode = postalCode.trim().replace(/[\s-]/g, '');
    
    // バリデーション
    if (!trimmedPostalCode) {
      setError('郵便番号を入力してください');
      return;
    }
    
    if (!isValidPostalCode(trimmedPostalCode)) {
      setError('郵便番号は7桁の数字で入力してください（例: 1234567）');
      return;
    }
    
    // エラーをクリア
    setError(null);
    
    // 形式を統一してから検索実行
    const formattedPostalCode = formatPostalCode(trimmedPostalCode);
    onSearch(formattedPostalCode);
  };

  // 数字のみ入力を許可する処理
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 数字以外の文字を除去
    const numericValue = value.replace(/[^\d]/g, '');
    // 最大7桁まで
    const truncatedValue = numericValue.slice(0, 7);
    setPostalCode(truncatedValue);
  };

  return (
    <div className="postal-code-search-form">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-group">
          <label htmlFor="postalCode" className="form-label">
            郵便番号を入力して近くの書店を検索
          </label>
          <div className="input-group">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              id="postalCode"
              className={`form-input ${error ? 'error' : ''}`}
              placeholder="例: 1234567"
              value={postalCode}
              onChange={handlePostalCodeChange}
              aria-describedby={error ? 'postalCode-error' : undefined}
              disabled={isLoading}
              maxLength={7}
            />
            <button 
              type="submit" 
              className="search-button"
              disabled={isLoading}
              aria-label="郵便番号で検索"
            >
              {isLoading ? '検索中...' : '検索'}
            </button>
          </div>
          {error && (
            <p id="postalCode-error" className="error-message" role="alert">
              {error}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostalCodeSearchForm; 