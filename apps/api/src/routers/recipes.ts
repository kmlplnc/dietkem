import { Router } from 'express';
import { db } from '@dietkem/db';
import { recipes, ingredients, recipe_ingredients, nutrition_info, categories, recipe_categories, favorite_recipes, recipe_ratings, recipe_views, users } from '@dietkem/db/schema';
import { eq, and, desc, asc, like, sql } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Tüm tarifleri getir (sayfalama ile)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const search = req.query.search as string;
    const cuisine = req.query.cuisine as string;
    const dishType = req.query.dishType as string;
    const offset = (page - 1) * limit;

    const filters = [eq(recipes.is_public, true)];
    if (search) filters.push(like(recipes.title, `%${search}%`));
    if (cuisine) filters.push(eq(recipes.cuisine, cuisine));
    if (dishType) filters.push(eq(recipes.dish_type, dishType));

    const results = await db
      .select({
        id: recipes.id,
        title: recipes.title,
        description: recipes.description,
        image_url: recipes.image_url,
        ready_in_minutes: recipes.ready_in_minutes,
        servings: recipes.servings,
        difficulty: recipes.difficulty,
        cuisine: recipes.cuisine,
        dish_type: recipes.dish_type,
        created_at: recipes.created_at,
        updated_at: recipes.updated_at,
      })
      .from(recipes)
      .where(and(...filters))
      .orderBy(desc(recipes.created_at))
      .limit(limit)
      .offset(offset);

    // Her tarif için besin değerlerini al
    const recipesWithNutrition = await Promise.all(
      results.map(async (recipe) => {
        const nutrition = await db
          .select()
          .from(nutrition_info)
          .where(eq(nutrition_info.recipe_id, recipe.id))
          .limit(1);
        
        return {
          ...recipe,
          nutrition: nutrition[0] || null,
        };
      })
    );

    // Toplam sayıyı al
    const totalFilters = [eq(recipes.is_public, true)];
    if (search) totalFilters.push(like(recipes.title, `%${search}%`));
    if (cuisine) totalFilters.push(eq(recipes.cuisine, cuisine));
    if (dishType) totalFilters.push(eq(recipes.dish_type, dishType));

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(recipes)
      .where(and(...totalFilters));
    const total = totalResult[0]?.count || 0;

    res.json({
      recipes: recipesWithNutrition,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Tarifler yüklenirken hata oluştu' });
  }
});

// Tek tarif detayını getir
router.get('/:id', async (req, res) => {
  try {
    const recipeId = parseInt(req.params.id);
    const userId = req.user?.userId;

    // Tarif bilgilerini al
    const recipe = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, recipeId))
      .limit(1);

    if (!recipe.length) {
      return res.status(404).json({ error: 'Tarif bulunamadı' });
    }

    // Malzemeleri al
    const recipeIngredients = await db
      .select({
        id: ingredients.id,
        name: ingredients.name,
        unit: ingredients.unit,
        amount: recipe_ingredients.amount,
        notes: recipe_ingredients.notes,
      })
      .from(recipe_ingredients)
      .innerJoin(ingredients, eq(recipe_ingredients.ingredient_id, ingredients.id))
      .where(eq(recipe_ingredients.recipe_id, recipeId));

    // Besin değerlerini al
    const nutrition = await db
      .select()
      .from(nutrition_info)
      .where(eq(nutrition_info.recipe_id, recipeId))
      .limit(1);

    // Kategorileri al
    const recipeCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        description: categories.description,
        icon: categories.icon,
      })
      .from(recipe_categories)
      .innerJoin(categories, eq(recipe_categories.category_id, categories.id))
      .where(eq(recipe_categories.recipe_id, recipeId));

    // Görüntülenme sayısını artır
    if (userId) {
      await db.insert(recipe_views).values({
        recipe_id: Number(recipeId),
        user_id: Number(userId),
      });
    }

    // Ortalama puanı hesapla
    const ratings = await db
      .select({ rating: recipe_ratings.rating })
      .from(recipe_ratings)
      .where(eq(recipe_ratings.recipe_id, recipeId));

    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : 0;

    // Kullanıcının favori olup olmadığını kontrol et
    let isFavorite = false;
    if (userId) {
      const favorite = await db
        .select()
        .from(favorite_recipes)
        .where(and(
          eq(favorite_recipes.recipe_id, Number(recipeId)),
          eq(favorite_recipes.user_id, Number(userId))
        ))
        .limit(1);
      
      isFavorite = favorite.length > 0;
    }

    res.json({
      ...recipe[0],
      ingredients: recipeIngredients,
      nutrition: nutrition[0] || null,
      categories: recipeCategories,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: ratings.length,
      isFavorite,
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Tarif detayları yüklenirken hata oluştu' });
  }
});

// Yeni tarif oluştur (authenticated)
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('Gelen veri:', req.body); // DEBUG LOG
    const {
      title,
      description,
      image_url,
      ready_in_minutes,
      servings,
      difficulty,
      cuisine,
      dish_type,
      instructions,
      ingredients: recipeIngredients,
      nutrition,
      categories: recipeCategories,
    } = req.body;

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Kullanıcı kimliği gerekli' });
    }

    // Tarifi oluştur
    const [newRecipe] = await db
      .insert(recipes)
      .values({
        title,
        description,
        image_url,
        ready_in_minutes: Math.round(parseFloat(ready_in_minutes) || 30),
        servings: Math.round(parseFloat(servings) || 4),
        difficulty,
        cuisine,
        dish_type,
        instructions,
        created_by: Number(userId),
        is_public: true,
      })
      .returning();

    // Malzemeleri ekle
    if (recipeIngredients && recipeIngredients.length > 0) {
      for (const ingredient of recipeIngredients) {
        // Malzeme var mı kontrol et, yoksa oluştur
        let ingredientId = ingredient.id;
        if (!ingredientId && ingredient.name) {
          const [newIngredient] = await db
            .insert(ingredients)
            .values({
              name: ingredient.name,
              unit: ingredient.unit,
            })
            .returning();
          ingredientId = newIngredient.id;
        }

        if (ingredientId) {
          await db.insert(recipe_ingredients).values({
            recipe_id: Number(newRecipe.id),
            ingredient_id: Number(ingredientId),
            amount: Math.round(parseFloat(ingredient.amount) || 0),
            notes: ingredient.notes,
          });
        }
      }
    }

    // Besin değerlerini ekle
    if (nutrition) {
      await db.insert(nutrition_info).values({
        recipe_id: Number(newRecipe.id),
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbohydrates: nutrition.carbohydrates,
        fat: nutrition.fat,
        fiber: nutrition.fiber,
        sugar: nutrition.sugar,
        sodium: nutrition.sodium,
      });
    }

    // Kategorileri ekle
    if (recipeCategories && recipeCategories.length > 0) {
      for (const categoryId of recipeCategories) {
        await db.insert(recipe_categories).values({
          recipe_id: Number(newRecipe.id),
          category_id: Number(categoryId),
        });
      }
    }

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Tarif oluşturulurken hata oluştu' });
  }
});

// Tarifi güncelle (authenticated, sadece kendi tarifini)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const recipeId = parseInt(req.params.id);
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Kullanıcı kimliği gerekli' });
    }

    // Tarifin kullanıcıya ait olup olmadığını kontrol et
    const existingRecipe = await db
      .select()
      .from(recipes)
      .where(and(
        eq(recipes.id, recipeId),
        eq(recipes.created_by, Number(userId))
      ))
      .limit(1);

    if (!existingRecipe.length) {
      return res.status(404).json({ error: 'Tarif bulunamadı veya düzenleme yetkiniz yok' });
    }

    const {
      title,
      description,
      image_url,
      ready_in_minutes,
      servings,
      difficulty,
      cuisine,
      dish_type,
      instructions,
    } = req.body;

    // Tarifi güncelle
    const [updatedRecipe] = await db
      .update(recipes)
      .set({
        title,
        description,
        image_url,
        ready_in_minutes: Math.round(parseFloat(ready_in_minutes) || 30),
        servings: Math.round(parseFloat(servings) || 4),
        difficulty,
        cuisine,
        dish_type,
        instructions,
        updated_at: new Date(),
      })
      .where(eq(recipes.id, recipeId))
      .returning();

    res.json(updatedRecipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Tarif güncellenirken hata oluştu' });
  }
});

// Tarifi sil (authenticated, admin tüm tarifleri silebilir, normal kullanıcı sadece kendi tarifini)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const recipeId = parseInt(req.params.id);
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Kullanıcı kimliği gerekli' });
    }

    // Kullanıcının rolünü kontrol et
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(userId)))
      .limit(1);

    const isAdmin = user[0]?.role === 'superadmin';

    // Tarifin var olup olmadığını kontrol et
    const existingRecipe = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, recipeId))
      .limit(1);

    if (!existingRecipe.length) {
      return res.status(404).json({ error: 'Tarif bulunamadı' });
    }

    // Admin değilse, tarifin kendisine ait olup olmadığını kontrol et
    if (!isAdmin && existingRecipe[0].created_by !== Number(userId)) {
      return res.status(403).json({ error: 'Bu tarifi silme yetkiniz yok' });
    }

    // İlişkili kayıtları sil
    await db.delete(recipe_ingredients).where(eq(recipe_ingredients.recipe_id, recipeId));
    await db.delete(nutrition_info).where(eq(nutrition_info.recipe_id, recipeId));
    await db.delete(recipe_categories).where(eq(recipe_categories.recipe_id, recipeId));
    await db.delete(favorite_recipes).where(eq(favorite_recipes.recipe_id, recipeId));
    await db.delete(recipe_ratings).where(eq(recipe_ratings.recipe_id, recipeId));
    await db.delete(recipe_views).where(eq(recipe_views.recipe_id, recipeId));

    // Tarifi sil
    await db.delete(recipes).where(eq(recipes.id, recipeId));

    res.json({ message: 'Tarif başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Tarif silinirken hata oluştu' });
  }
});

// Favori tarif ekle/çıkar
router.post('/:id/favorite', authenticateToken, async (req, res) => {
  try {
    const recipeId = parseInt(req.params.id);
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Kullanıcı kimliği gerekli' });
    }

    // Mevcut favori durumunu kontrol et
    const existingFavorite = await db
      .select()
      .from(favorite_recipes)
      .where(and(
        eq(favorite_recipes.recipe_id, Number(recipeId)),
        eq(favorite_recipes.user_id, Number(userId))
      ))
      .limit(1);

    if (existingFavorite.length > 0) {
      // Favoriden çıkar
      await db
        .delete(favorite_recipes)
        .where(and(
          eq(favorite_recipes.recipe_id, Number(recipeId)),
          eq(favorite_recipes.user_id, Number(userId))
        ));
      
      res.json({ message: 'Tarif favorilerden çıkarıldı', isFavorite: false });
    } else {
      // Favorilere ekle
      await db.insert(favorite_recipes).values({
        recipe_id: Number(recipeId),
        user_id: Number(userId),
      });
      
      res.json({ message: 'Tarif favorilere eklendi', isFavorite: true });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Favori işlemi sırasında hata oluştu' });
  }
});

// Tarif değerlendir
router.post('/:id/rate', authenticateToken, async (req, res) => {
  try {
    const recipeId = parseInt(req.params.id);
    const userId = req.user?.userId;
    const { rating, comment } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Kullanıcı kimliği gerekli' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Geçerli bir puan gerekli (1-5)' });
    }

    // Mevcut değerlendirmeyi kontrol et
    const existingRating = await db
      .select()
      .from(recipe_ratings)
      .where(and(
        eq(recipe_ratings.recipe_id, Number(recipeId)),
        eq(recipe_ratings.user_id, Number(userId))
      ))
      .limit(1);

    if (existingRating.length > 0) {
      // Değerlendirmeyi güncelle
      await db
        .update(recipe_ratings)
        .set({
          rating,
          comment,
          created_at: new Date(),
        })
        .where(and(
          eq(recipe_ratings.recipe_id, Number(recipeId)),
          eq(recipe_ratings.user_id, Number(userId))
        ));
    } else {
      // Yeni değerlendirme ekle
      await db.insert(recipe_ratings).values({
        recipe_id: Number(recipeId),
        user_id: Number(userId),
        rating,
        comment,
      });
    }

    res.json({ message: 'Değerlendirme kaydedildi' });
  } catch (error) {
    console.error('Error rating recipe:', error);
    res.status(500).json({ error: 'Değerlendirme sırasında hata oluştu' });
  }
});

// Kategorileri getir
router.get('/categories/all', async (req, res) => {
  try {
    const categoriesList = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.name));

    res.json(categoriesList);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Kategoriler yüklenirken hata oluştu' });
  }
});

// Malzemeleri getir
router.get('/ingredients/all', async (req, res) => {
  try {
    const ingredientsList = await db
      .select()
      .from(ingredients)
      .orderBy(asc(ingredients.name));

    res.json(ingredientsList);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ error: 'Malzemeler yüklenirken hata oluştu' });
  }
});

export default router; 