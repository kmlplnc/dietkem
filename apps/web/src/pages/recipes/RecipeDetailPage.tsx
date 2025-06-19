import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchRecipeById, Recipe } from './api';

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRecipeById(parseInt(id));
        setRecipe(data);
      } catch (err) {
        setError('Tarif detayları yüklenirken bir hata oluştu');
        console.error('Error loading recipe detail:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const placeholder = target.parentElement?.querySelector('.recipe-image-placeholder') as HTMLElement;
    if (placeholder) {
      placeholder.style.display = 'block';
    }
    e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Tarif+Resmi';
  };

  if (loading) {
    return (
      <div className="recipe-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Tarif detayları yükleniyor...</p>
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

  if (error || !recipe) {
    return (
      <div className="recipe-detail-page">
        <div className="error-container">
          <p>❌ {error || 'Tarif bulunamadı'}</p>
          <Link to="/recipes" className="back-button">
            ← Tariflere Dön
          </Link>
        </div>
        <style>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            gap: 16px;
          }
          
          .back-button {
            padding: 12px 24px;
            background: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-size: 1rem;
            transition: background 0.2s ease;
          }
          
          .back-button:hover {
            background: #1d4ed8;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="recipe-detail-page">
      <div className="recipe-detail-container">
        {/* Back Button */}
        <div className="back-link-container">
          <Link to="/recipes" className="back-link">
            ← Tariflere Dön
          </Link>
        </div>

        {/* Recipe Image */}
        <div className="recipe-image-container">
          <img
            src={recipe.image_url || 'https://via.placeholder.com/600x400?text=Tarif+Resmi'}
            alt={recipe.title}
            onError={handleImageError}
            className="recipe-detail-image"
          />
        </div>

        {/* Recipe Title */}
        <div className="recipe-title-container">
          <h1 className="recipe-title">{recipe.title}</h1>
        </div>

        {/* Recipe Tags */}
        <div className="recipe-tags-container">
          <div className="recipe-tags">
            {recipe.dishTypes?.map((type, index) => (
              <span key={index} className="recipe-tag">
                {type}
              </span>
            ))}
            {!recipe.dishTypes && recipe.dish_type && (
              <span className="recipe-tag">
                {recipe.dish_type}
              </span>
            )}
            {recipe.ready_in_minutes && (
              <span className="recipe-tag">
                {recipe.ready_in_minutes} dakika
              </span>
            )}
            {recipe.servings && (
              <span className="recipe-tag">
                {recipe.servings} kişilik
              </span>
            )}
          </div>
        </div>

        {/* Recipe Content - Two Columns */}
        <div className="recipe-content">
          <div className="recipe-columns">
            {/* Left Column - Ingredients */}
            <div className="recipe-column">
              <div className="recipe-section">
                <h2>Malzemeler</h2>
                {recipe.ingredients && recipe.ingredients.length > 0 && (
                  <ul className="ingredients-list">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="ingredient-item">
                        <span className="ingredient-amount">{ingredient.amount} {ingredient.unit}</span>
                        <span className="ingredient-name">{ingredient.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right Column - Instructions */}
            <div className="recipe-column">
              <div className="recipe-section">
                <h2>Hazırlanışı</h2>
                {recipe.instructions && (
                  <div 
                    className="instructions-content"
                    dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition Section */}
        {recipe.nutrition && (
          <div className="nutrition-section">
            <h2>Besin Değerleri (100g başına)</h2>
            <div className="nutrition-grid">
              <div className="nutrition-card">
                <div className="nutrition-icon">🔥</div>
                <div className="nutrition-info">
                  <span className="nutrition-label">Kalori</span>
                  <span className="nutrition-value">
                    {recipe.nutrition.calories !== undefined ? recipe.nutrition.calories : '-'}
                  </span>
                  <span className="nutrition-unit">kcal</span>
                </div>
              </div>
              <div className="nutrition-card">
                <div className="nutrition-icon">🥩</div>
                <div className="nutrition-info">
                  <span className="nutrition-label">Protein</span>
                  <span className="nutrition-value">
                    {recipe.nutrition.protein !== undefined ? recipe.nutrition.protein : '-'}
                  </span>
                  <span className="nutrition-unit">g</span>
                </div>
              </div>
              <div className="nutrition-card">
                <div className="nutrition-icon">🍞</div>
                <div className="nutrition-info">
                  <span className="nutrition-label">Karbonhidrat</span>
                  <span className="nutrition-value">
                    {recipe.nutrition.carbohydrates !== undefined ? recipe.nutrition.carbohydrates : '-'}
                  </span>
                  <span className="nutrition-unit">g</span>
                </div>
              </div>
              <div className="nutrition-card">
                <div className="nutrition-icon">🧈</div>
                <div className="nutrition-info">
                  <span className="nutrition-label">Yağ</span>
                  <span className="nutrition-value">
                    {recipe.nutrition.fat !== undefined ? recipe.nutrition.fat : '-'}
                  </span>
                  <span className="nutrition-unit">g</span>
                </div>
              </div>
              <div className="nutrition-card">
                <div className="nutrition-icon">🌾</div>
                <div className="nutrition-info">
                  <span className="nutrition-label">Lif</span>
                  <span className="nutrition-value">
                    {recipe.nutrition.fiber !== undefined ? recipe.nutrition.fiber : '-'}
                  </span>
                  <span className="nutrition-unit">g</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .recipe-detail-page {
          padding: 32px 16px;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 60vh;
          padding-top: 64px;
        }
        
        .recipe-detail-container {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .back-link-container {
          padding: 24px 32px 16px;
        }
        
        .back-link {
          display: inline-flex;
          align-items: center;
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        
        .back-link:hover {
          color: #1d4ed8;
        }
        
        .recipe-image-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 0 32px 24px;
        }
        
        .recipe-detail-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 12px;
        }
        
        .recipe-title-container {
          text-align: center;
          padding: 0 32px 16px;
        }
        
        .recipe-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          color: #1a1a1a;
          line-height: 1.2;
        }
        
        .recipe-tags-container {
          text-align: center;
          padding: 0 32px 32px;
        }
        
        .recipe-tags {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .recipe-tag {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
        }
        
        .recipe-content {
          padding: 0 32px 32px;
        }
        
        .recipe-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
        }
        
        .recipe-column {
          display: flex;
          flex-direction: column;
        }
        
        .recipe-section {
          margin-bottom: 32px;
        }
        
        .recipe-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 20px 0;
          color: #1a1a1a;
        }
        
        .ingredients-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .ingredient-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .ingredient-amount {
          font-weight: 600;
          color: #374151;
          min-width: 80px;
        }
        
        .ingredient-name {
          color: #6b7280;
        }
        
        .instructions-content {
          line-height: 1.6;
          color: #374151;
        }
        
        .instructions-content p {
          margin-bottom: 16px;
        }
        
        .instructions-content ol,
        .instructions-content ul {
          margin-left: 20px;
          margin-bottom: 16px;
        }
        
        .instructions-content li {
          margin-bottom: 8px;
        }
        
        .nutrition-section {
          padding: 32px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }
        
        .nutrition-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 24px 0;
          color: #1a1a1a;
        }
        
        .nutrition-grid {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .nutrition-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          text-align: center;
          width: 120px;
          flex-shrink: 0;
        }
        
        .nutrition-icon {
          font-size: 28px;
          margin-bottom: 12px;
          display: block;
        }
        
        .nutrition-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .nutrition-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
        }
        
        .nutrition-value {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
        }
        
        .nutrition-unit {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .recipe-detail-page {
            padding: 16px 12px;
            padding-top: 64px;
          }
          
          .back-link-container {
            padding: 16px 16px 12px;
          }
          
          .recipe-image-container {
            padding: 0 16px 16px;
          }
          
          .recipe-detail-image {
            height: 300px;
          }
          
          .recipe-title-container {
            padding: 0 16px 12px;
          }
          
          .recipe-title {
            font-size: 2rem;
          }
          
          .recipe-tags-container {
            padding: 0 16px 24px;
          }
          
          .recipe-tags {
            gap: 8px;
          }
          
          .recipe-tag {
            padding: 6px 12px;
            font-size: 13px;
          }
          
          .recipe-content {
            padding: 0 16px 24px;
          }
          
          .recipe-columns {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          
          .nutrition-section {
            padding: 24px 16px;
          }
          
          .nutrition-grid {
            gap: 12px;
          }
          
          .nutrition-card {
            width: calc(50% - 6px);
            padding: 16px 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default RecipeDetailPage;