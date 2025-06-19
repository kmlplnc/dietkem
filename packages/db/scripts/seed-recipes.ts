import { db } from '../src/index';
import { categories, ingredients, recipes, recipe_ingredients, nutrition_info, recipe_categories } from '../schema';

async function seedData() {
  console.log('🌱 Seeding recipe data...');

  try {
    // Kategorileri ekle
    console.log('Adding categories...');
    const categoryData = [
      { name: 'Ana Yemek', description: 'Ana yemek tarifleri', icon: '🍽️' },
      { name: 'Çorba', description: 'Çorba tarifleri', icon: '🥣' },
      { name: 'Salata', description: 'Salata tarifleri', icon: '🥗' },
      { name: 'Tatlı', description: 'Tatlı tarifleri', icon: '🍰' },
      { name: 'Kahvaltı', description: 'Kahvaltı tarifleri', icon: '🍳' },
      { name: 'Atıştırmalık', description: 'Atıştırmalık tarifleri', icon: '🥨' },
      { name: 'İçecek', description: 'İçecek tarifleri', icon: '🥤' },
      { name: 'Vejetaryen', description: 'Vejetaryen tarifleri', icon: '🥬' },
      { name: 'Glutensiz', description: 'Glutensiz tarifler', icon: '🌾' },
      { name: 'Düşük Kalorili', description: 'Düşük kalorili tarifler', icon: '⚖️' },
    ];

    const insertedCategories = await db.insert(categories).values(categoryData).returning();
    console.log(`✅ Added ${insertedCategories.length} categories`);

    // Malzemeleri ekle
    console.log('Adding ingredients...');
    const ingredientData = [
      { name: 'Un', unit: 'g' },
      { name: 'Şeker', unit: 'g' },
      { name: 'Tuz', unit: 'g' },
      { name: 'Yağ', unit: 'ml' },
      { name: 'Süt', unit: 'ml' },
      { name: 'Yumurta', unit: 'adet' },
      { name: 'Domates', unit: 'adet' },
      { name: 'Soğan', unit: 'adet' },
      { name: 'Sarımsak', unit: 'diş' },
      { name: 'Havuç', unit: 'adet' },
      { name: 'Patates', unit: 'adet' },
      { name: 'Tavuk Göğsü', unit: 'g' },
      { name: 'Kıyma', unit: 'g' },
      { name: 'Pirinç', unit: 'g' },
      { name: 'Mercimek', unit: 'g' },
      { name: 'Nohut', unit: 'g' },
      { name: 'Fasulye', unit: 'g' },
      { name: 'Zeytinyağı', unit: 'ml' },
      { name: 'Tereyağı', unit: 'g' },
      { name: 'Peynir', unit: 'g' },
      { name: 'Yoğurt', unit: 'g' },
      { name: 'Limon', unit: 'adet' },
      { name: 'Maydanoz', unit: 'demet' },
      { name: 'Dereotu', unit: 'demet' },
      { name: 'Nane', unit: 'demet' },
      { name: 'Karabiber', unit: 'g' },
      { name: 'Kırmızı Biber', unit: 'g' },
      { name: 'Kekik', unit: 'g' },
      { name: 'Köri', unit: 'g' },
      { name: 'Zerdeçal', unit: 'g' },
      { name: 'Tarçın', unit: 'g' },
      { name: 'Vanilya', unit: 'g' },
      { name: 'Kakao', unit: 'g' },
      { name: 'Çikolata', unit: 'g' },
      { name: 'Bal', unit: 'ml' },
      { name: 'Reçel', unit: 'g' },
      { name: 'Fındık', unit: 'g' },
      { name: 'Ceviz', unit: 'g' },
      { name: 'Badem', unit: 'g' },
      { name: 'Kuru Üzüm', unit: 'g' },
      { name: 'Kuru Kayısı', unit: 'g' },
      { name: 'Kuru İncir', unit: 'adet' },
    ];

    const insertedIngredients = await db.insert(ingredients).values(ingredientData).returning();
    console.log(`✅ Added ${insertedIngredients.length} ingredients`);

    // Tarifleri ekle
    console.log('Adding recipes...');
    const recipeData = [
      {
        title: 'Mercimek Çorbası',
        description: 'Geleneksel Türk mutfağının vazgeçilmez çorbası',
        image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
        ready_in_minutes: 45,
        servings: 4,
        difficulty: 'Kolay',
        cuisine: 'Türk',
        dish_type: 'Çorba',
        instructions: `
          <h3>Hazırlanışı:</h3>
          <ol>
            <li>Soğanları yemeklik doğrayın ve zeytinyağında kavurun</li>
            <li>Havuçları küp küp doğrayıp ekleyin</li>
            <li>Mercimeği yıkayıp ekleyin</li>
            <li>Su ekleyip kaynamaya bırakın</li>
            <li>Yumuşayınca blenderdan geçirin</li>
            <li>Tuz ve karabiber ekleyip servis yapın</li>
          </ol>
        `,
        is_public: true,
      },
      {
        title: 'Tavuk Sote',
        description: 'Pratik ve lezzetli ana yemek',
        image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
        ready_in_minutes: 30,
        servings: 4,
        difficulty: 'Kolay',
        cuisine: 'Türk',
        dish_type: 'Ana Yemek',
        instructions: `
          <h3>Hazırlanışı:</h3>
          <ol>
            <li>Tavuk göğsünü kuşbaşı doğrayın</li>
            <li>Zeytinyağında tavukları soteleyin</li>
            <li>Soğan ve sarımsak ekleyin</li>
            <li>Domates ve baharatları ekleyin</li>
            <li>Su ekleyip pişirin</li>
            <li>Maydanoz ile süsleyip servis yapın</li>
          </ol>
        `,
        is_public: true,
      },
      {
        title: 'Cevizli Kek',
        description: 'Ev yapımı cevizli kek tarifi',
        image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
        ready_in_minutes: 60,
        servings: 8,
        difficulty: 'Orta',
        cuisine: 'Türk',
        dish_type: 'Tatlı',
        instructions: `
          <h3>Hazırlanışı:</h3>
          <ol>
            <li>Yumurta ve şekeri çırpın</li>
            <li>Süt ve yağı ekleyin</li>
            <li>Un, kabartma tozu ve vanilyayı ekleyin</li>
            <li>Cevizleri ekleyin</li>
            <li>Kek kalıbına dökün</li>
            <li>180°C'de 40-45 dakika pişirin</li>
          </ol>
        `,
        is_public: true,
      },
      {
        title: 'Akdeniz Salatası',
        description: 'Taze ve sağlıklı Akdeniz salatası',
        image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        ready_in_minutes: 15,
        servings: 4,
        difficulty: 'Kolay',
        cuisine: 'Akdeniz',
        dish_type: 'Salata',
        instructions: `
          <h3>Hazırlanışı:</h3>
          <ol>
            <li>Domates, salatalık ve soğanı doğrayın</li>
            <li>Zeytinleri ekleyin</li>
            <li>Zeytinyağı ve limon suyu ekleyin</li>
            <li>Tuz ve karabiber ekleyin</li>
            <li>Maydanoz ile süsleyin</li>
            <li>Servis yapın</li>
          </ol>
        `,
        is_public: true,
      },
      {
        title: 'Omlet',
        description: 'Kahvaltı için pratik omlet',
        image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
        ready_in_minutes: 10,
        servings: 2,
        difficulty: 'Kolay',
        cuisine: 'Türk',
        dish_type: 'Kahvaltı',
        instructions: `
          <h3>Hazırlanışı:</h3>
          <ol>
            <li>Yumurtaları çırpın</li>
            <li>Tuz ve karabiber ekleyin</li>
            <li>Tavada yağı ısıtın</li>
            <li>Yumurta karışımını dökün</li>
            <li>Peynir ekleyin</li>
            <li>Katlayıp servis yapın</li>
          </ol>
        `,
        is_public: true,
      },
      {
        title: 'Humus',
        description: 'Geleneksel Orta Doğu humus tarifi',
        image_url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400',
        ready_in_minutes: 20,
        servings: 6,
        difficulty: 'Kolay',
        cuisine: 'Orta Doğu',
        dish_type: 'Atıştırmalık',
        instructions: `
          <h3>Hazırlanışı:</h3>
          <ol>
            <li>Nohutları haşlayın</li>
            <li>Tahin, limon suyu ve sarımsak ekleyin</li>
            <li>Blenderdan geçirin</li>
            <li>Zeytinyağı ekleyin</li>
            <li>Tuz ekleyin</li>
            <li>Servis yapın</li>
          </ol>
        `,
        is_public: true,
      },
    ];

    const insertedRecipes = await db.insert(recipes).values(recipeData).returning();
    console.log(`✅ Added ${insertedRecipes.length} recipes`);

    // Tarif malzemelerini ekle
    console.log('Adding recipe ingredients...');
    const recipeIngredientsData = [
      // Mercimek Çorbası
      { recipe_id: insertedRecipes[0].id, ingredient_id: insertedIngredients.find(i => i.name === 'Kırmızı Mercimek')?.id || 1, amount: 200, notes: 'Kırmızı mercimek' },
      { recipe_id: insertedRecipes[0].id, ingredient_id: insertedIngredients.find(i => i.name === 'Soğan')?.id || 1, amount: 1, notes: 'Yemeklik doğranmış' },
      { recipe_id: insertedRecipes[0].id, ingredient_id: insertedIngredients.find(i => i.name === 'Havuç')?.id || 1, amount: 2, notes: 'Küp küp doğranmış' },
      { recipe_id: insertedRecipes[0].id, ingredient_id: insertedIngredients.find(i => i.name === 'Zeytinyağı')?.id || 1, amount: 30, notes: '' },
      { recipe_id: insertedRecipes[0].id, ingredient_id: insertedIngredients.find(i => i.name === 'Tuz')?.id || 1, amount: 10, notes: '' },
      { recipe_id: insertedRecipes[0].id, ingredient_id: insertedIngredients.find(i => i.name === 'Karabiber')?.id || 1, amount: 5, notes: '' },

      // Tavuk Sote
      { recipe_id: insertedRecipes[1].id, ingredient_id: insertedIngredients.find(i => i.name === 'Tavuk Göğsü')?.id || 1, amount: 500, notes: 'Kuşbaşı doğranmış' },
      { recipe_id: insertedRecipes[1].id, ingredient_id: insertedIngredients.find(i => i.name === 'Soğan')?.id || 1, amount: 2, notes: 'Yemeklik doğranmış' },
      { recipe_id: insertedRecipes[1].id, ingredient_id: insertedIngredients.find(i => i.name === 'Sarımsak')?.id || 1, amount: 3, notes: 'Rendelenmiş' },
      { recipe_id: insertedRecipes[1].id, ingredient_id: insertedIngredients.find(i => i.name === 'Domates')?.id || 1, amount: 3, notes: 'Küp küp doğranmış' },
      { recipe_id: insertedRecipes[1].id, ingredient_id: insertedIngredients.find(i => i.name === 'Zeytinyağı')?.id || 1, amount: 30, notes: '' },
      { recipe_id: insertedRecipes[1].id, ingredient_id: insertedIngredients.find(i => i.name === 'Maydanoz')?.id || 1, amount: 1, notes: 'Demet' },

      // Cevizli Kek
      { recipe_id: insertedRecipes[2].id, ingredient_id: insertedIngredients.find(i => i.name === 'Un')?.id || 1, amount: 300, notes: '' },
      { recipe_id: insertedRecipes[2].id, ingredient_id: insertedIngredients.find(i => i.name === 'Şeker')?.id || 1, amount: 200, notes: '' },
      { recipe_id: insertedRecipes[2].id, ingredient_id: insertedIngredients.find(i => i.name === 'Yumurta')?.id || 1, amount: 3, notes: '' },
      { recipe_id: insertedRecipes[2].id, ingredient_id: insertedIngredients.find(i => i.name === 'Süt')?.id || 1, amount: 200, notes: '' },
      { recipe_id: insertedRecipes[2].id, ingredient_id: insertedIngredients.find(i => i.name === 'Yağ')?.id || 1, amount: 100, notes: '' },
      { recipe_id: insertedRecipes[2].id, ingredient_id: insertedIngredients.find(i => i.name === 'Ceviz')?.id || 1, amount: 100, notes: 'Kırılmış' },
      { recipe_id: insertedRecipes[2].id, ingredient_id: insertedIngredients.find(i => i.name === 'Vanilya')?.id || 1, amount: 5, notes: '' },
    ];

    await db.insert(recipe_ingredients).values(recipeIngredientsData);
    console.log(`✅ Added recipe ingredients`);

    // Besin değerlerini ekle
    console.log('Adding nutrition info...');
    const nutritionData = [
      {
        recipe_id: insertedRecipes[0].id,
        calories: 180,
        protein: 12,
        carbohydrates: 30,
        fat: 4,
        fiber: 8,
        sugar: 2,
        sodium: 400,
      },
      {
        recipe_id: insertedRecipes[1].id,
        calories: 320,
        protein: 35,
        carbohydrates: 8,
        fat: 18,
        fiber: 3,
        sugar: 4,
        sodium: 600,
      },
      {
        recipe_id: insertedRecipes[2].id,
        calories: 280,
        protein: 6,
        carbohydrates: 45,
        fat: 12,
        fiber: 2,
        sugar: 25,
        sodium: 200,
      },
    ];

    await db.insert(nutrition_info).values(nutritionData);
    console.log(`✅ Added nutrition info`);

    // Tarif kategorilerini ekle
    console.log('Adding recipe categories...');
    const recipeCategoriesData = [
      { recipe_id: insertedRecipes[0].id, category_id: insertedCategories.find(c => c.name === 'Çorba')?.id || 1 },
      { recipe_id: insertedRecipes[0].id, category_id: insertedCategories.find(c => c.name === 'Vejetaryen')?.id || 1 },
      { recipe_id: insertedRecipes[1].id, category_id: insertedCategories.find(c => c.name === 'Ana Yemek')?.id || 1 },
      { recipe_id: insertedRecipes[2].id, category_id: insertedCategories.find(c => c.name === 'Tatlı')?.id || 1 },
      { recipe_id: insertedRecipes[3].id, category_id: insertedCategories.find(c => c.name === 'Salata')?.id || 1 },
      { recipe_id: insertedRecipes[3].id, category_id: insertedCategories.find(c => c.name === 'Vejetaryen')?.id || 1 },
      { recipe_id: insertedRecipes[4].id, category_id: insertedCategories.find(c => c.name === 'Kahvaltı')?.id || 1 },
      { recipe_id: insertedRecipes[5].id, category_id: insertedCategories.find(c => c.name === 'Atıştırmalık')?.id || 1 },
      { recipe_id: insertedRecipes[5].id, category_id: insertedCategories.find(c => c.name === 'Vejetaryen')?.id || 1 },
    ];

    await db.insert(recipe_categories).values(recipeCategoriesData);
    console.log(`✅ Added recipe categories`);

    console.log('🎉 Recipe seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding recipe data:', error);
    throw error;
  }
}

// Script'i çalıştır
seedData()
  .then(() => {
    console.log('✅ Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }); 