import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

const SearchBox = ({ onSearch }: SearchBoxProps) => {
  const { currentLang } = useLanguage();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder={currentLang === 'tr' ? 'Blogda ara...' : 'Search in blog...'}
        value={query}
        onChange={handleSearch}
        className="search-input"
      />
      <style>{`
        .search-box {
          width: 100%;
          max-width: 600px;
          margin: 0 auto 2rem;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          color: #111827;
          background-color: white;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        @media (max-width: 640px) {
          .search-box {
            margin-bottom: 1.5rem;
          }

          .search-input {
            font-size: 0.875rem;
            padding: 0.625rem 0.875rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchBox; 