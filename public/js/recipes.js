async function fetchRecipes() {
    try {
        const response = await fetch('http://localhost:8000/recipes'); // 從本地後端伺服器獲取資料
        const recipes = await response.json();

        const container = document.getElementById('recipes-container');
        container.innerHTML = ''; // 清空容器內容

        recipes.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');

            recipeDiv.innerHTML = `
                <h2>${recipe.RecipeName}</h2>
                <p><strong>網址：</strong> <a href="${recipe.Url}" target="_blank">${recipe.Url}</a></p>
                <p><strong>食材：</strong> ${recipe.Ingredients.join(', ')}</p>
                <p><strong>作法：</strong><br>${recipe.RecipeDetail.replace(/\n/g, '<br>')}</p>
                <img src="${recipe.Image || 'placeholder.jpg'}" alt="食譜圖片">
            `;

            container.appendChild(recipeDiv);
        });
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}
