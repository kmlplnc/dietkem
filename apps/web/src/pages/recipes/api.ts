const API_BASE_URL = '/api';

export interface Recipe {
  id: number;
  title: string;
  description: string;
  summary?: string;
  image_url: string;
  ready_in_minutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  cuisines?: string[];
  dish_type: string;
  dishTypes?: string[];
  instructions: string;
  created_at: string;
  updated_at: string;
  ingredients?: RecipeIngredient[];
  nutrition?: NutritionInfo;
  categories?: Category[];
  averageRating?: number;
  totalRatings?: number;
  isFavorite?: boolean;
}

export interface RecipeIngredient {
  id: number;
  name: string;
  unit: string;
  amount: number;
  notes?: string;
}

export interface NutritionInfo {
  id: number;
  recipe_id: number;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface RecipesResponse {
  recipes: Recipe[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Güvenli JSON parsing fonksiyonu
const safeJsonParse = async (response: Response) => {
  try {
    const text = await response.text();
    if (!text) {
      throw new Error('Empty response');
    }
    return JSON.parse(text);
  } catch (error) {
    console.error('JSON parsing error:', error);
    console.error('Response status:', response.status);
    console.error('Response text:', await response.text());
    throw new Error(`Invalid JSON response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Tüm tarifleri getir
export const fetchRecipes = async (
  page: number = 1,
  limit: number = 12,
  search?: string,
  cuisine?: string,
  dishType?: string
): Promise<RecipesResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append('search', search);
    if (cuisine) params.append('cuisine', cuisine);
    if (dishType) params.append('dishType', dishType);

    const response = await fetch(`${API_BASE_URL}/recipes?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await safeJsonParse(response);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

// Tek tarif detayını getir
export const fetchRecipeById = async (id: number): Promise<Recipe> => {
  try {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await safeJsonParse(response);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
};

// Favori tarif ekle/çıkar
export const toggleFavorite = async (recipeId: number): Promise<{ message: string; isFavorite: boolean }> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/favorite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await safeJsonParse(response);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

// Tarif değerlendir
export const rateRecipe = async (recipeId: number, rating: number, comment?: string): Promise<{ message: string }> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, comment }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await safeJsonParse(response);
  } catch (error) {
    console.error('Error rating recipe:', error);
    throw error;
  }
};

// Kategorileri getir
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/categories/all`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await safeJsonParse(response);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Malzemeleri getir
export const fetchIngredients = async (): Promise<RecipeIngredient[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/ingredients/all`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await safeJsonParse(response);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    throw error;
  }
};

// Tarif sil (admin için)
export const deleteRecipe = async (recipeId: number): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await safeJsonParse(response);
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
}; 