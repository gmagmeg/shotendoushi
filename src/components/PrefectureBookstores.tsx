import { useState } from 'react';
import { Bookstore, Prefecture } from '../types';
import { prefectures } from '../data/prefectures';
import { getBookstoresByPrefectureName, getAllBookstores } from '../utils/bookstoreService';

// 地域グループの定義
const regionGroups = [
  {
    id: 'hokkaido',
    name: '北海道地区',
    nameEn: 'HOKKAIDO AREA',
    prefectureCodes: ['01']
  },
  {
    id: 'tohoku',
    name: '東北地区',
    nameEn: 'TOHOKU AREA',
    prefectureCodes: ['02', '03', '04', '05', '06', '07']
  },
  {
    id: 'kanto',
    name: '関東地区',
    nameEn: 'KANTO AREA',
    prefectureCodes: ['08', '09', '10', '11', '12', '13', '14']
  },
  {
    id: 'chubu',
    name: '中部地区',
    nameEn: 'CHUBU AREA',
    prefectureCodes: ['15', '16', '17', '18', '19', '20', '21', '22', '23']
  },
  {
    id: 'kinki',
    name: '近畿地区',
    nameEn: 'KINKI AREA',
    prefectureCodes: ['24', '25', '26', '27', '28', '29', '30']
  },
  {
    id: 'chugoku',
    name: '中国地区',
    nameEn: 'CHUGOKU AREA',
    prefectureCodes: ['31', '32', '33', '34', '35']
  },
  {
    id: 'shikoku',
    name: '四国地区',
    nameEn: 'SHIKOKU AREA',
    prefectureCodes: ['36', '37', '38', '39']
  },
  {
    id: 'kyushu',
    name: '九州・沖縄地区',
    nameEn: 'KYUSHU/OKINAWA AREA',
    prefectureCodes: ['40', '41', '42', '43', '44', '45', '46', '47']
  }
];

const PrefectureBookstores: React.FC = () => {
  const [expandedRegions, setExpandedRegions] = useState<{ [key: string]: boolean }>({});
  const [bookstores] = useState<Bookstore[]>(getAllBookstores());

  // 地域の展開/折りたたみを切り替える
  const toggleRegion = (regionId: string) => {
    setExpandedRegions(prev => ({
      ...prev,
      [regionId]: !prev[regionId]
    }));
  };

  // 都道府県コードから都道府県情報を取得
  const getPrefectureByCode = (code: string): Prefecture | undefined => {
    return prefectures.find(p => p.code === code);
  };

  // 都道府県の書店を取得
  const getBookstoresByPrefectureCode = (code: string): Bookstore[] => {
    const prefecture = getPrefectureByCode(code);
    if (!prefecture) return [];
    return getBookstoresByPrefectureName(prefecture.name);
  };

  // 地域に書店が存在するかチェック
  const hasBookstoresInRegion = (prefectureCodes: string[]): boolean => {
    return prefectureCodes.some(code => {
      const prefecture = getPrefectureByCode(code);
      return prefecture && getBookstoresByPrefectureName(prefecture.name).length > 0;
    });
  };

  return (
    <div className="prefecture-bookstores theater-list">
      <h2 className="section-title">都道府県別書店一覧</h2>
      
      {regionGroups.map(region => {
        // この地域に書店がなければ表示しない
        if (!hasBookstoresInRegion(region.prefectureCodes)) return null;
        
        const isExpanded = expandedRegions[region.id];
        
        return (
          <div key={region.id} className="region-group">
            <div 
              className={`region-header ${isExpanded ? 'expanded' : ''}`}
              onClick={() => toggleRegion(region.id)}
            >
              <div className="region-title">
                <h3>{region.name}</h3>
                <p className="region-name-en">{region.nameEn}</p>
              </div>
              <div className="region-toggle">
                <span className="toggle-icon">{isExpanded ? '▲' : '▼'}</span>
              </div>
            </div>
            
            {isExpanded && (
              <div className="region-content">
                {region.prefectureCodes.map(code => {
                  const prefecture = getPrefectureByCode(code);
                  if (!prefecture) return null;
                  
                  const prefectureBookstores = getBookstoresByPrefectureCode(code);
                  if (prefectureBookstores.length === 0) return null;
                  
                  return (
                    <div key={code} className="prefecture-section">
                      <div className="prefecture-header">
                        <h4 className="prefecture-name">{prefecture.name}</h4>
                        <p className="prefecture-name-en">{prefecture.name.toUpperCase()}</p>
                      </div>
                      
                      <div className="bookstore-items">
                        {prefectureBookstores.map(bookstore => (
                          <div key={bookstore.id} className="bookstore-item">
                            <h5 className="bookstore-name">
                              <a href={`https://www.google.com/maps/search/?api=1&query=${bookstore.latitude},${bookstore.longitude}`} 
                                 target="_blank" 
                                 rel="noopener noreferrer">
                                {bookstore.name}
                              </a>
                            </h5>
                            <p className="bookstore-address">{bookstore.address}</p>
                            <p className="bookstore-phone">TEL: {bookstore.phone}</p>
                            <div className="bookstore-tags">
                              {bookstore.phone && <span className="tag">TEL</span>}
                              <span className="tag">MAP</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PrefectureBookstores; 