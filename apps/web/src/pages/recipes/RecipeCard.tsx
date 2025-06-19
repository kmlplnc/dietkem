import React from 'react';
import { Recipe } from './api';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const placeholder = target.parentElement?.querySelector('.recipe-image-placeholder') as HTMLElement;
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  };

  return (
    <div className="recipe-card">
      <div className="recipe-image-container">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="recipe-image"
            onError={handleImageError}
          />
        ) : null}
        <div className="recipe-image-placeholder" style={{ display: recipe.image_url ? 'none' : 'flex' }}>
          <span>📷</span>
          <p>Resim Yok</p>
        </div>
        {recipe.ready_in_minutes && (
          <div className="recipe-time-badge">
            {recipe.ready_in_minutes} dk
          </div>
        )}
      </div>
      
      <div className="recipe-info">
        <h3 className="recipe-title">
          {recipe.title}
        </h3>
        
        <div className="recipe-meta">
          {recipe.servings && (
            <span className="recipe-servings">
              👥 {recipe.servings} kişilik
            </span>
          )}
          {recipe.cuisine && (
            <span className="recipe-cuisine">
              {recipe.cuisine}
            </span>
          )}
        </div>
        
        {recipe.nutrition && (
          <div className="recipe-nutrition">
            <div className="nutrition-grid">
              <div className="nutrition-item">
                <span className="nutrition-icon">🔥</span>
                <span className="nutrition-value">
                  {recipe.nutrition.calories && recipe.nutrition.calories > 0 ? recipe.nutrition.calories : '-'}
                </span>
                <span className="nutrition-unit">kcal</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-icon">🥩</span>
                <span className="nutrition-value">
                  {recipe.nutrition.protein && recipe.nutrition.protein > 0 ? recipe.nutrition.protein : '-'}
                </span>
                <span className="nutrition-unit">g</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-icon">🍞</span>
                <span className="nutrition-value">
                  {recipe.nutrition.carbohydrates && recipe.nutrition.carbohydrates > 0 ? recipe.nutrition.carbohydrates : '-'}
                </span>
                <span className="nutrition-unit">g</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-icon">🧈</span>
                <span className="nutrition-value">
                  {recipe.nutrition.fat && recipe.nutrition.fat > 0 ? recipe.nutrition.fat : '-'}
                </span>
                <span className="nutrition-unit">g</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-icon">🌾</span>
                <span className="nutrition-value">
                  {recipe.nutrition.fiber && recipe.nutrition.fiber > 0 ? recipe.nutrition.fiber : '-'}
                </span>
                <span className="nutrition-unit">g</span>
              </div>
            </div>
          </div>
        )}
        
        {recipe.dish_type && (
          <div className="recipe-tags">
            <span className="recipe-tag">
              {recipe.dish_type}
            </span>
          </div>
        )}
        
        <div className="recipe-action">
          <span className="recipe-action-text">
            Detayları görüntüle →
          </span>
        </div>
      </div>

      <style>{`
        .recipe-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          text-decoration: none !important;
          color: inherit;
          display: block;
        }
        
        .recipe-card * {
          text-decoration: none !important;
        }
        
        .recipe-card h3,
        .recipe-card span,
        .recipe-card div,
        .recipe-card p {
          text-decoration: none !important;
        }
        
        .recipe-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }
        
        .recipe-image-container {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }
        
        .recipe-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .recipe-card:hover .recipe-image {
          transform: scale(1.05);
        }
        
        .recipe-time-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #059669;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .recipe-info {
          padding: 16px;
        }
        
        .recipe-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 12px 0;
          color: #1a1a1a;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .recipe-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
          color: #666;
        }
        
        .recipe-servings {
          display: flex;
          align-items: center;
          gap: 4px;
          text-decoration: none !important;
        }
        
        .recipe-servings,
        .recipe-servings *,
        .recipe-servings span {
          text-decoration: none !important;
          text-decoration-line: none !important;
          text-decoration-style: none !important;
          text-decoration-color: transparent !important;
        }
        
        .recipe-cuisine {
          background: #f3f4f6;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .recipe-nutrition {
          margin-bottom: 12px;
        }
        
        .nutrition-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 6px;
        }
        
        .nutrition-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 6px 4px;
          background: #f9fafb;
          border-radius: 6px;
          min-height: 50px;
        }
        
        .nutrition-icon {
          font-size: 12px;
          margin-bottom: 2px;
        }
        
        .nutrition-value {
          font-size: 11px;
          font-weight: 600;
          color: #1f2937;
          line-height: 1;
        }
        
        .nutrition-unit {
          font-size: 9px;
          color: #6b7280;
          line-height: 1;
        }
        
        .recipe-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 12px;
        }
        
        .recipe-tag {
          background: #dcfce7;
          color: #166534;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
        }
        
        .recipe-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .recipe-action-text {
          font-size: 14px;
          color: #9ca3af;
        }
        
        @media (max-width: 768px) {
          .recipe-image-container {
            height: 160px;
          }
          
          .recipe-info {
            padding: 12px;
          }
          
          .recipe-title {
            font-size: 16px;
          }
        }
        
        .recipe-image-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: #f3f4f6;
          color: #9ca3af;
          font-size: 24px;
        }
        
        .recipe-image-placeholder p {
          margin: 8px 0 0 0;
          font-size: 14px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default RecipeCard; 