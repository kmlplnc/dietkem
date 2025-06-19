import React, { useEffect, useState } from 'react';
import { fetchRecipes, Recipe, deleteRecipe, fetchRecipeById } from '../recipes/api';
import { useNavigate } from 'react-router-dom';

const AdminRecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [form, setForm] = useState({ 
    title: '', 
    image_file: null as File | null,
    image_url: '',
    ready_in_minutes: 30,
    servings: 4,
    difficulty: 'Orta',
    dish_type: 'Ana Yemek',
    instructions: '',
    ingredients: [{ name: '', amount: '', unit: '' }],
    nutrition: {
      calories: null as number | null,
      protein: null as number | null,
      carbohydrates: null as number | null,
      fat: null as number | null,
      fiber: null as number | null
    }
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; recipeId: number | null; recipeTitle: string }>({
    show: false,
    recipeId: null,
    recipeTitle: ''
  });
  const [imageUploading, setImageUploading] = useState(false);
  const navigate = useNavigate();

  // Cloudinary configuration
  const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dup6ahhjt/image/upload';
  const CLOUDINARY_UPLOAD_PRESET = 'dietkem_recipes';

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRecipes();
        setRecipes(data.recipes);
      } catch (err) {
        setError('Tarifler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    loadRecipes();
  }, []);

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    setFormError('');
    
    try {
      // Dosyayı base64'e çevir
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setForm(prev => ({
          ...prev,
          image_url: result
        }));
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Image upload error:', error);
      setFormError('Resim yüklenirken bir hata oluştu');
      setImageUploading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('nutrition.')) {
      const nutritionField = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        nutrition: {
          ...prev.nutrition,
          [nutritionField]: value === '' ? null : parseFloat(value)
        }
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleIngredientChange = (index: number, field: string, value: string) => {
    const newIngredients = [...form.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setForm({ ...form, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setForm({
      ...form,
      ingredients: [...form.ingredients, { name: '', amount: '', unit: '' }]
    });
  };

  const removeIngredient = (index: number) => {
    if (form.ingredients.length > 1) {
      const newIngredients = form.ingredients.filter((_, i) => i !== index);
      setForm({ ...form, ingredients: newIngredients });
    }
  };

  const handleEdit = async (recipe: Recipe) => {
    setFormLoading(true);
    try {
      // Detaylı tarif verisini çek
      const detailedRecipe = await fetchRecipeById(recipe.id);
      setEditingRecipe(detailedRecipe);
      setForm({
        title: detailedRecipe.title || '',
        image_file: null,
        image_url: detailedRecipe.image_url || '',
        ready_in_minutes: detailedRecipe.ready_in_minutes || 30,
        servings: detailedRecipe.servings || 4,
        difficulty: detailedRecipe.difficulty || 'Orta',
        dish_type: detailedRecipe.dish_type || 'Ana Yemek',
        instructions: detailedRecipe.instructions || '',
        ingredients: detailedRecipe.ingredients && detailedRecipe.ingredients.length > 0 ? detailedRecipe.ingredients.map(ing => ({
          name: ing.name || '',
          amount: ing.amount?.toString() || '',
          unit: ing.unit || ''
        })) : [{ name: '', amount: '', unit: '' }],
        nutrition: detailedRecipe.nutrition || {
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
          fiber: 0
        }
      });
      setShowForm(true);
    } catch (err) {
      setFormError('Tarif detayları yüklenemedi');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    
    // Filter out empty ingredients
    const validIngredients = form.ingredients.filter(ing => ing.name.trim() !== '');
    
    try {
      const url = editingRecipe 
        ? `/api/recipes/${editingRecipe.id}`
        : '/api/recipes';
      
      const method = editingRecipe ? 'PUT' : 'POST';
      
      // Use default placeholder image if no image is uploaded
      const imageUrl = form.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
          title: form.title,
          image_url: imageUrl,
          ready_in_minutes: Math.round(parseFloat(form.ready_in_minutes.toString()) || 30),
          servings: Math.round(parseFloat(form.servings.toString()) || 4),
          difficulty: form.difficulty,
          dish_type: form.dish_type,
          instructions: form.instructions,
          ingredients: validIngredients.map(ing => ({
            name: ing.name,
            amount: Math.round(parseFloat(ing.amount) || 0),
            unit: ing.unit
          })),
          nutrition: form.nutrition,
          categories: [],
        }),
      });
      
      if (!res.ok) throw new Error('API error');
      
      setShowForm(false);
      setEditingRecipe(null);
      setForm({ 
        title: '', 
        image_file: null,
        image_url: '',
        ready_in_minutes: 30,
        servings: 4,
        difficulty: 'Orta',
        dish_type: 'Ana Yemek',
        instructions: '',
        ingredients: [{ name: '', amount: '', unit: '' }],
        nutrition: {
          calories: null,
          protein: null,
          carbohydrates: null,
          fat: null,
          fiber: null
        }
      });
      // Refresh recipes
      const data = await fetchRecipes();
      setRecipes(data.recipes);
    } catch (err) {
      setFormError(editingRecipe ? 'Tarif güncellenemedi' : 'Tarif eklenemedi');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (recipeId: number, recipeTitle: string) => {
    setDeleteModal({
      show: true,
      recipeId,
      recipeTitle
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.recipeId) return;
    
    setDeleteLoading(deleteModal.recipeId);
    try {
      await deleteRecipe(deleteModal.recipeId);
      // Remove from local state
      setRecipes(recipes.filter(recipe => recipe.id !== deleteModal.recipeId));
      setDeleteModal({ show: false, recipeId: null, recipeTitle: '' });
    } catch (err) {
      alert('Tarif silinirken bir hata oluştu');
    } finally {
      setDeleteLoading(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false, recipeId: null, recipeTitle: '' });
  };

  return (
    <div className="admin-recipes-page">
      <div className="page-container">
        <div className="header">
          <button
            className="back-button"
            onClick={() => navigate('/admin')}
          >
            <span style={{fontSize: '1.2em', marginRight: 4}}>←</span> Admin Paneline Dön
          </button>
          <h1 className="page-title">Tarif Yönetimi</h1>
          <button className="add-button" onClick={() => setShowForm(true)}>
            + Yeni Tarif Ekle
          </button>
        </div>

        {showForm && (
          <div className="form-container">
            <div className="form-header">
              <h3>{editingRecipe ? 'Tarifi Düzenle' : 'Yeni Tarif Ekle'}</h3>
              <button onClick={() => {
                setShowForm(false);
                setEditingRecipe(null);
                setForm({ 
                  title: '', 
                  image_file: null,
                  image_url: '',
                  ready_in_minutes: 30,
                  servings: 4,
                  difficulty: 'Orta',
                  dish_type: 'Ana Yemek',
                  instructions: '',
                  ingredients: [{ name: '', amount: '', unit: '' }],
                  nutrition: {
                    calories: null,
                    protein: null,
                    carbohydrates: null,
                    fat: null,
                    fiber: null
                  }
                });
              }} className="close-button">✕</button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="recipe-form">
              {/* Recipe Image */}
              <div className="recipe-form-image-container">
                <div className="form-group">
                  <div 
                    className="image-upload-area"
                    onClick={() => document.getElementById('image-input')?.click()}
                  >
                    {form.image_url ? (
                      <div className="image-preview-container">
                        <img src={form.image_url} alt="Önizleme" className="preview-image" />
                        <div className="image-overlay">
                          <span>Resmi değiştirmek için tıklayın</span>
                        </div>
                      </div>
                    ) : (
                      <div className="image-upload-placeholder">
                        <div className="upload-icon">📷</div>
                      </div>
                    )}
                    <input 
                      id="image-input"
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file);
                        }
                      }}
                      className="hidden-file-input"
                      disabled={imageUploading}
                    />
                  </div>
                  {imageUploading && <p className="upload-status">Resim yükleniyor...</p>}
                </div>
              </div>

              {/* Recipe Title */}
              <div className="recipe-form-title-container">
                <div className="form-group">
                  <input 
                    name="title" 
                    value={form.title || ''} 
                    onChange={handleFormChange} 
                    required 
                    className="form-input title-input"
                    placeholder="Tarif Adı (örn: Mercimek Çorbası)"
                  />
                </div>
              </div>

              {/* Recipe Tags */}
              <div className="recipe-form-tags-container">
                <div className="recipe-form-tags">
                  <div className="form-group">
                    <input 
                      name="dish_type" 
                      value={form.dish_type || ''} 
                      onChange={handleFormChange} 
                      required 
                      className="form-input tag-input"
                      placeholder="Yemek Tipi (örn: Ana Yemek)"
                    />
                    <small className="field-info">Tarifin kategorisini belirtir (Ana Yemek, Çorba, Tatlı vb.)</small>
                  </div>
                  <div className="form-group">
                    <input 
                      name="ready_in_minutes" 
                      value={form.ready_in_minutes || 30} 
                      onChange={handleFormChange} 
                      required 
                      className="form-input tag-input"
                      type="number"
                      min="1"
                      placeholder="Hazırlık Süresi (dk)"
                    />
                    <small className="field-info">Tarifin hazırlanma süresini dakika cinsinden belirtir</small>
                  </div>
                  <div className="form-group">
                    <input 
                      name="servings" 
                      value={form.servings || 4} 
                      onChange={handleFormChange} 
                      required 
                      className="form-input tag-input"
                      type="number"
                      min="1"
                      placeholder="Servis Sayısı"
                    />
                    <small className="field-info">Tarifin kaç kişilik olduğunu belirtir</small>
                  </div>
                </div>
              </div>
              
              {/* Recipe Content - Two Columns */}
              <div className="recipe-form-content">
                <div className="recipe-form-columns">
                  {/* Left Column - Ingredients */}
                  <div className="recipe-form-column">
                    <div className="recipe-form-section">
                      <h3>Malzemeler</h3>
                      <textarea 
                        placeholder="Örn: 2 su bardağı un&#10;1 adet yumurta&#10;1 çay kaşığı tuz&#10;1/2 su bardağı süt"
                        value={form.ingredients.map(ing => `${ing.amount} ${ing.unit} ${ing.name}`.trim()).filter(text => text).join('\n')} 
                              onChange={(e) => {
                          const lines = e.target.value.split('\n').filter(line => line.trim());
                          const newIngredients = lines.map(line => {
                            const parts = line.split(' ');
                                const amount = parts[0] || '';
                                const unit = parts[1] || '';
                                const name = parts.slice(2).join(' ') || '';
                            return { name, amount, unit };
                          });
                          setForm({ ...form, ingredients: newIngredients.length > 0 ? newIngredients : [{ name: '', amount: '', unit: '' }] });
                              }}
                        className="form-textarea ingredients-textarea"
                        rows={12}
                      />
                    </div>
                  </div>

                  {/* Right Column - Instructions */}
                  <div className="recipe-form-column">
                    <div className="recipe-form-section">
                      <h3>Hazırlanışı</h3>
                      <textarea 
                        name="instructions" 
                        value={form.instructions} 
                        onChange={handleFormChange} 
                        required 
                        className="form-textarea instructions-textarea"
                        placeholder="1. İlk adım...
2. İkinci adım...
3. Üçüncü adım..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Nutrition Section */}
              <div className="recipe-form-section nutrition-section">
                <h3>Besin Değerleri (100g başına)</h3>
                <div className="nutrition-form-grid">
                  <div className="nutrition-form-item">
                    <div className="nutrition-form-icon">🔥</div>
                    <label>Kalori (kcal)</label>
                    <input 
                      name="nutrition.calories" 
                      value={form.nutrition.calories === null ? '' : form.nutrition.calories} 
                      onChange={handleFormChange} 
                      className="form-input"
                      type="number"
                      min="0"
                    />
                  </div>
                  <div className="nutrition-form-item">
                    <div className="nutrition-form-icon">🥩</div>
                    <label>Protein (g)</label>
                    <input 
                      name="nutrition.protein" 
                      value={form.nutrition.protein === null ? '' : form.nutrition.protein} 
                      onChange={handleFormChange} 
                      className="form-input"
                      type="number"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div className="nutrition-form-item">
                    <div className="nutrition-form-icon">🍞</div>
                    <label>Karbonhidrat (g)</label>
                    <input 
                      name="nutrition.carbohydrates" 
                      value={form.nutrition.carbohydrates === null ? '' : form.nutrition.carbohydrates} 
                      onChange={handleFormChange} 
                      className="form-input"
                      type="number"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div className="nutrition-form-item">
                    <div className="nutrition-form-icon">🧈</div>
                    <label>Yağ (g)</label>
                    <input 
                      name="nutrition.fat" 
                      value={form.nutrition.fat === null ? '' : form.nutrition.fat} 
                      onChange={handleFormChange} 
                      className="form-input"
                      type="number"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div className="nutrition-form-item">
                    <div className="nutrition-form-icon">🌾</div>
                    <label>Lif (g)</label>
                    <input 
                      name="nutrition.fiber" 
                      value={form.nutrition.fiber === null ? '' : form.nutrition.fiber} 
                      onChange={handleFormChange} 
                      className="form-input"
                      type="number"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
              
              {formError && <div className="error-message">{formError}</div>}
              <div className="form-actions">
                <button type="submit" disabled={formLoading} className="submit-button">
                  {formLoading 
                    ? (editingRecipe ? 'Güncelleniyor...' : 'Ekleniyor...') 
                    : (editingRecipe ? 'Tarifi Güncelle' : 'Tarifi Ekle')
                  }
                </button>
                <button type="button" onClick={() => {
                  setShowForm(false);
                  setEditingRecipe(null);
                  setForm({ 
                    title: '', 
                    image_file: null,
                    image_url: '',
                    ready_in_minutes: 30,
                    servings: 4,
                    difficulty: 'Orta',
                    dish_type: 'Ana Yemek',
                    instructions: '',
                    ingredients: [{ name: '', amount: '', unit: '' }],
                    nutrition: {
                      calories: null,
                      protein: null,
                      carbohydrates: null,
                      fat: null,
                      fiber: null
                    }
                  });
                }} className="cancel-button">
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <p>Yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
          </div>
        ) : !showForm ? (
          <div className="recipes-list">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-item">
                <div className="recipe-info">
                  <h3>{recipe.title}</h3>
                  <p>{recipe.description}</p>
                </div>
                <div className="recipe-actions">
                  <button 
                    onClick={() => handleEdit(recipe)} 
                    className="edit-button"
                  >
                    Düzenle
                  </button>
                  <button 
                    onClick={() => navigate(`/recipes/${recipe.id}`)} 
                    className="view-button"
                  >
                    Görüntüle
                  </button>
                  <button 
                    onClick={() => handleDelete(recipe.id, recipe.title)} 
                    className="delete-button"
                    disabled={deleteLoading === recipe.id}
                  >
                    {deleteLoading === recipe.id ? 'Siliniyor...' : 'Sil'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <h3>️ Tarif Silme</h3>
            </div>
            <div className="delete-modal-content">
              <p>
                <strong>"{deleteModal.recipeTitle}"</strong> tarifini silmek istediğinize emin misiniz?
              </p>
              <p className="delete-warning">
                Bu işlem geri alınamaz!
              </p>
            </div>
            <div className="delete-modal-actions">
              <button 
                onClick={cancelDelete}
                className="cancel-delete-button"
                disabled={deleteLoading !== null}
              >
                İptal
              </button>
              <button 
                onClick={confirmDelete}
                className="confirm-delete-button"
                disabled={deleteLoading !== null}
              >
                {deleteLoading !== null ? 'Siliniyor...' : 'Evet, Sil'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-recipes-page {
          padding: 2rem;
          min-height: 100vh;
          background: #f9fafb;
        }

        .page-container {
          max-width: 1400px;
          margin: 0 auto;
          padding-top: 64px;
        }

        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          position: relative;
        }

        .back-button {
          position: absolute;
          left: 0;
          padding: 0.5rem 1rem;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          color: #4b5563;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .back-button:hover {
          background: #e5e7eb;
          transform: translateX(-2px);
        }

        .page-title {
          font-size: 2rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          text-align: center;
        }

        .add-button {
          position: absolute;
          right: 0;
          background: #2563eb;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .add-button:hover {
          background: #1d4ed8;
        }

        .form-container {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .form-header h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #6b7280;
          cursor: pointer;
        }

        .recipe-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .recipe-form-image-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 0 16px 24px;
        }
        
        .recipe-form-image-container .form-group {
          margin-bottom: 0;
        }
        
        .image-upload-area {
          width: 100%;
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          min-height: 300px;
        }

        .image-upload-area:hover {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .image-upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
        }

        .upload-icon {
          font-size: 48px;
          color: #6b7280;
          margin-bottom: 16px;
        }

        .image-preview-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
        }

        .preview-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 8px;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .image-preview-container:hover .image-overlay {
          opacity: 1;
        }

        .image-overlay span {
          color: white;
          font-weight: 500;
          font-size: 14px;
        }

        .recipe-form-title-container {
          text-align: center;
          padding: 0 32px 16px;
        }
        
        .recipe-form-title-container .form-group {
          margin-bottom: 0;
        }
        
        .title-input {
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
          padding: 16px 24px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          transition: border-color 0.2s ease;
        }
        
        .title-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .recipe-form-tags-container {
          text-align: center;
          padding: 0 32px 32px;
        }
        
        .recipe-form-tags {
          display: flex;
          justify-content: space-between;
          flex-wrap: nowrap;
          gap: 16px;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .recipe-form-tags .form-group {
          margin-bottom: 0;
        }
        
        .tag-input {
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          background: #f3f4f6;
          text-align: center;
          min-width: 140px;
          transition: border-color 0.2s ease;
        }
        
        .tag-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          background: white;
        }
        
        .field-info {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
          text-align: center;
          line-height: 1.3;
        }
        
        .recipe-form-content {
          padding: 0 16px 32px;
        }
        
        .recipe-form-columns {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 48px;
          align-items: start;
        }
        
        .recipe-form-column {
          display: flex;
          flex-direction: column;
        }
        
        .recipe-form-section {
          margin-bottom: 32px;
        }
        
        .recipe-form-section h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 20px 0;
          color: #1a1a1a;
          padding-left: 0;
          text-align: center;
        }
        
        .recipe-form-section:has(.ingredients-textarea) h3,
        .recipe-form-section:has(.instructions-textarea) h3 {
          text-align: center;
          width: 100%;
        }
        
        .ingredients-form-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
          align-items: flex-start;
        }
        
        .ingredient-form-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
          width: 100%;
          max-width: 400px;
        }
        
        .ingredient-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }
        
        .ingredients-textarea {
          min-height: 120px;
          height: 120px;
          resize: vertical;
          font-family: inherit;
          line-height: 1.4;
          width: 100%;
          min-width: 400px;
        }
        
        .instructions-textarea {
          min-height: 300px;
          height: 300px;
          resize: vertical;
          font-family: inherit;
          line-height: 1.4;
          width: 100%;
          min-width: 400px;
        }
        
        .nutrition-section {
          padding: 32px 16px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }
        
        .nutrition-section h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 24px 0;
          color: #1a1a1a;
        }
        
        .nutrition-form-grid {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .nutrition-form-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          width: 160px;
          flex-shrink: 0;
        }
        
        .nutrition-form-icon {
          font-size: 28px;
          margin-bottom: 8px;
        }
        
        .nutrition-form-item label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          text-align: center;
          white-space: nowrap;
        }
        
        .nutrition-form-item input {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          text-align: center;
          width: 100%;
        }

        .error-message {
          color: #dc2626;
          font-size: 0.875rem;
          padding: 0.5rem;
          background: #fef2f2;
          border-radius: 4px;
          border: 1px solid #fecaca;
        }

        .form-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .submit-button, .cancel-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .submit-button {
          background: #10b981;
          color: white;
        }

        .submit-button:hover:not(:disabled) {
          background: #059669;
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cancel-button {
          background: #f3f4f6;
          color: #374151;
        }

        .cancel-button:hover {
          background: #e5e7eb;
        }

        .loading-container, .error-container {
          text-align: center;
          padding: 2rem;
        }

        .error-container {
          color: #dc2626;
        }

        .recipes-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .recipe-item {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .recipe-info h3 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }

        .recipe-info p {
          margin: 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .recipe-actions {
          display: flex;
          gap: 0.5rem;
        }

        .view-button, .edit-button, .delete-button {
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .view-button {
          background: #f3f4f6;
          color: #374151;
        }

        .view-button:hover {
          background: #e5e7eb;
        }

        .edit-button {
          background: #10b981;
          color: white;
        }

        .edit-button:hover {
          background: #059669;
        }

        .delete-button {
          background: #dc2626;
          color: white;
        }

        .delete-button:hover:not(:disabled) {
          background: #b91c1c;
        }

        .delete-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .image-upload-info {
          background: #f8f9fa;
          border: 2px dashed #dee2e6;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          color: #6c757d;
        }
        
        .image-upload-info p {
          margin: 0;
          font-size: 14px;
        }

        .upload-status {
          color: #059669;
          font-size: 14px;
          margin-top: 8px;
        }

        .hidden-file-input {
          display: none;
        }

        /* Delete Modal Styles */
        .delete-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .delete-modal {
          background: white;
          border-radius: 12px;
          padding: 0;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .delete-modal-header {
          padding: 24px 24px 0 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .delete-modal-header h3 {
          margin: 0;
          color: #1f2937;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .delete-modal-content {
          padding: 24px;
        }

        .delete-modal-content p {
          margin: 0 0 12px 0;
          color: #374151;
          line-height: 1.5;
        }

        .delete-modal-content p:last-child {
          margin-bottom: 0;
        }

        .delete-warning {
          color: #dc2626 !important;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .delete-modal-actions {
          padding: 0 24px 24px 24px;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .cancel-delete-button, .confirm-delete-button {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .cancel-delete-button {
          background: #f3f4f6;
          color: #374151;
        }

        .cancel-delete-button:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .confirm-delete-button {
          background: #dc2626;
          color: white;
        }

        .confirm-delete-button:hover:not(:disabled) {
          background: #b91c1c;
        }

        .cancel-delete-button:disabled, .confirm-delete-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .admin-recipes-page {
            padding: 1rem;
          }

          .header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .back-button, .add-button {
            position: static;
            align-self: flex-start;
          }

          .recipe-item {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .recipe-form-image-container {
            padding: 0 16px 16px;
          }
          
          .image-upload-area {
            min-height: 250px;
          }
          
          .preview-image {
            height: 250px;
          }
          
          .recipe-form-title-container {
            padding: 0 16px 12px;
          }
          
          .title-input {
            font-size: 1.25rem;
            padding: 12px 16px;
          }
          
          .recipe-form-tags-container {
            padding: 0 16px 24px;
          }
          
          .recipe-form-tags {
            gap: 12px;
          }
          
          .tag-input {
            min-width: 120px;
            padding: 10px 12px;
            font-size: 13px;
          }
          
          .recipe-form-content {
            padding: 0 16px 24px;
          }
          
          .recipe-form-columns {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          
          .ingredient-form-item {
            grid-template-columns: 70px 70px 1fr auto;
            gap: 6px;
          }
          
          .amount-input, .unit-input {
            padding: 6px 8px;
            font-size: 13px;
          }
          
          .name-input {
            padding: 6px 8px;
            font-size: 13px;
          }
          
          .instructions-textarea {
            min-height: 250px;
            padding: 12px;
            font-size: 13px;
          }
          
          .nutrition-section {
            padding: 24px 16px;
          }
          
          .nutrition-form-grid {
            gap: 12px;
          }
          
          .nutrition-form-item {
            width: calc(50% - 6px);
            padding: 16px 12px;
          }
          
          .nutrition-form-icon {
            font-size: 24px;
          }
          
          .nutrition-form-item label {
            font-size: 13px;
          }
          
          .nutrition-form-item input {
            padding: 6px 8px;
            font-size: 13px;
          }
        }

        .nutrition-form-item input {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          text-align: center;
          width: 100%;
        }
        
        .form-group label {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
          margin-bottom: 8px;
          display: block;
        }
        
        .form-input, .form-textarea, .form-select {
          padding: 14px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease;
          background: white;
          height: 48px;
          box-sizing: border-box;
        }
        
        .form-input:focus, .form-textarea:focus, .form-select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .form-textarea {
          min-height: 120px;
          resize: vertical;
          line-height: 1.5;
          height: auto;
        }
        
        .ingredients-textarea {
          min-height: 120px;
          height: 120px;
          resize: vertical;
          font-family: inherit;
          line-height: 1.4;
          width: 100%;
          min-width: 400px;
        }
        
        .remove-ingredient-button {
          background: #dc2626;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }
        
        .remove-ingredient-button:hover {
          background: #b91c1c;
        }
        
        .add-ingredient-button {
          background: #10b981;
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          font-size: 14px;
          font-weight: 600;
          margin-top: 16px;
          min-height: 48px;
        }
        
        .add-ingredient-button:hover {
          background: #059669;
        }

        .add-ingredient-plus-button {
          background: #10b981;
          color: white;
          border: none;
          padding: 4px 6px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          font-size: 12px;
          font-weight: 600;
          width: 40px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 4px;
          align-self: flex-start;
          margin-left: 0;
          position: relative;
          left: 0;
        }
        
        .add-ingredient-plus-button:hover {
          background: #059669;
        }
      `}</style>
    </div>
  );
};

export default AdminRecipesPage; 