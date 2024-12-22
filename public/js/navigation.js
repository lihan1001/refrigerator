export function initNavigation() {
    // 切換頁面功能
    const fridgePage = document.getElementById('fridge');
    const listPage = document.getElementById('list');
    const recipesPage = document.getElementById('recipes');

    document.getElementById('nav-fridge').onclick = () => showPage(fridgePage);
    document.getElementById('nav-list').onclick = () => showPage(listPage);
    document.getElementById('nav-recipes').onclick = () => showPage(recipesPage);

    function showPage(page) {
        fridgePage.classList.add('hidden');
        listPage.classList.add('hidden');
        recipesPage.classList.add('hidden');
        page.classList.remove('hidden');
    }
}
