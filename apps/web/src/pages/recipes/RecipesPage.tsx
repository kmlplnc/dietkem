import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchRecipes, Recipe, RecipesResponse } from './api';
import RecipeCard from './RecipeCard';

const RecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const loadRecipes = async (query?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRecipes(1, 12, query);
      setRecipes(data.recipes);
    } catch (err) {
      setError('Tarifler yüklenirken bir hata oluştu');
      console.error('Error loading recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  // Arama için debounce
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        loadRecipes(searchQuery);
      } else {
        loadRecipes(); // Boş arama için tüm tarifler
      }
    }, 500); // 500ms bekle

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (loading && recipes.length === 0) {
    return (
      <div className="recipes-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Tarifler yükleniyor...</p>
        </div>
        <style>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            gap: 16px;
          }
          
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #2563eb;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="recipes-page">
      {/* Header */}
      <div className="recipes-header">
        <h1>🍽️ Tarifler</h1>
        <p>Geleneksel Türk mutfağının lezzetli tarifleri</p>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tarif ara... (örn: tavuk, çorba, kebap)"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <div className="search-icon">🔍</div>
          {searchQuery && (
            <button onClick={handleClearSearch} className="clear-button">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results Info */}
      {searchQuery && (
        <div className="results-info">
          <p>"{searchQuery}" için {recipes.length} sonuç bulundu</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-container">
          <p>❌ {error}</p>
        </div>
      )}

      {/* Recipes Grid */}
      {recipes.length > 0 ? (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
              <RecipeCard recipe={recipe} />
            </Link>
          ))}
        </div>
      ) : !loading && !error ? (
        <div className="no-recipes">
          <div className="no-recipes-icon">🔍</div>
          <h3>Tarif bulunamadı</h3>
          <p>
            {searchQuery 
              ? `"${searchQuery}" için sonuç bulunamadı. Farklı anahtar kelimeler deneyin.`
              : 'Şu anda tarif bulunmuyor.'
            }
          </p>
        </div>
      ) : null}

      {/* Loading indicator for search */}
      {loading && recipes.length > 0 && (
        <div className="search-loading">
          <div className="loading-spinner-small"></div>
          <p>Aranıyor...</p>
        </div>
      )}

      <style>{`
        .recipes-page {
          padding: 32px 16px;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 60vh;
          padding-top: 64px;
        }
        
        .recipes-header {
          text-align: center;
          margin-bottom: 32px;
        }
        
        .recipes-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: #1a1a1a;
        }
        
        .recipes-header p {
          font-size: 1.1rem;
          color: #666;
          margin: 0;
        }
        
        .search-container {
          max-width: 400px;
          margin: 0 auto 32px;
        }
        
        .search-box {
          position: relative;
        }
        
        .search-input {
          width: 100%;
          padding: 12px 40px 12px 40px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s ease;
        }
        
        .search-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 16px;
        }
        
        .clear-button {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s ease;
        }
        
        .clear-button:hover {
          color: #6b7280;
        }

        .results-info {
          text-align: center;
          margin-bottom: 24px;
          color: #666;
        }
        
        .error-container {
          text-align: center;
          margin-bottom: 32px;
          padding: 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
        }
        
        .recipe-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }
        
        .recipe-grid a {
          text-decoration: none !important;
        }
        
        .recipe-grid a * {
          text-decoration: none !important;
        }
        
        .no-recipes {
          text-align: center;
          padding: 64px 16px;
          color: #666;
        }

        .no-recipes-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .no-recipes h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #1a1a1a;
        }

        .no-recipes p {
          font-size: 14px;
          margin: 0;
          line-height: 1.4;
        }

        .search-loading {
          text-align: center;
          margin-top: 32px;
        }

        .loading-spinner-small {
          width: 32px;
          height: 32px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 8px;
        }
        
        @media (max-width: 768px) {
          .recipes-page {
            padding: 16px 12px;
            padding-top: 64px;
          }
          
          .recipes-header h1 {
            font-size: 2rem;
          }
          
          .recipe-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 16px;
          }
        }
        
        @media (max-width: 480px) {
          .recipe-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default RecipesPage; 