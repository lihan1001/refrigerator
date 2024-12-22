export function initModal() {
    const showBoxButton = document.getElementById('showBoxButton');
    const popupBox = document.getElementById('popupBox');
    const closeButton = document.getElementById('closeButton');

    showBoxButton.addEventListener('click', () => {
        popupBox.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        popupBox.style.display = 'none';
    });
}
