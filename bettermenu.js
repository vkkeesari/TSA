// Add animations on scroll
window.addEventListener('scroll', () => {
    const items = document.querySelectorAll('.menu-item');

    items.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (itemTop < windowHeight - 50) {
            item.classList.add('show');
        }
    });
});
