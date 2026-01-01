const admin = require('firebase-admin');

// Initialize Firebase Admin SDK (lazy initialization)
let db;
function initializeFirebase() {
  if (!admin.apps.length) {
    // Decode base64-encoded service account JSON
    const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    const json = Buffer.from(base64, 'base64').toString('utf8');
    const serviceAccount = JSON.parse(json);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'recipeapp-13bdc'
    });
  }
  db = admin.firestore();
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    initializeFirebase();

    // Query public recipes
    const recipesSnapshot = await db.collection('recipes')
      .where('visibility', '==', 'PUBLIC')
      .limit(50)
      .get();

    let recipes = [];
    recipesSnapshot.forEach(doc => {
      const data = doc.data();
      recipes.push({
        id: doc.id,
        title: data.title || 'Untitled Recipe',
        description: data.description || '',
        cuisine: data.cuisine || '',
        difficulty: data.difficulty || 'BEGINNER',
        prepTime: data.prepTime || 0,
        cookTime: data.cookTime || 0,
        servings: data.servings || 4,
        imageUrl: data.imageUrls?.[0] || null,
        likeCount: data.likeCount || 0,
        viewCount: data.viewCount || 0,
        saveCount: data.saveCount || 0,
        ingredients: data.ingredients || [],
        instructions: data.instructions || [],
        tags: data.tags || []
      });
    });

    // Sort by likeCount (desc), then viewCount (desc)
    recipes.sort((a, b) => {
      if (b.likeCount !== a.likeCount) {
        return b.likeCount - a.likeCount;
      }
      return b.viewCount - a.viewCount;
    });

    // Take top 10
    const trendingRecipes = recipes.slice(0, 10);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        recipes: trendingRecipes,
        count: trendingRecipes.length,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error fetching trending recipes:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch trending recipes',
        message: error.message
      })
    };
  }
};
