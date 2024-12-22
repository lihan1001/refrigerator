import { loadFood, addIngredient } from './food.js';
import { loadRecipes, fetchRecipes } from './recipes.js';
import { initNavigation } from './navigation.js';
import { initModal } from './modal.js';

window.onload = () => {
    loadFood();
    loadRecipes();
    initNavigation();
    initModal();
};