/**
 * Оптимизированный main.js для сайта фотографа
 * Включает только: модальное окно портфолио, плавную прокрутку, анимации
 */

document.addEventListener('DOMContentLoaded', function () {
    // ========== Плавная прокрутка ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Обновляем URL без перезагрузки
                history.pushState(null, null, targetId);
            }
        });
    });

    // ========== Модальное окно портфолио ==========
    const portfolioCards = document.querySelectorAll('.portfolio__card');
    if (portfolioCards.length > 0) {
        const body = document.body;

        // Создаем элементы модального окна
        const modal = document.createElement('div');
        modal.className = 'portfolio-modal';
        modal.innerHTML = `
        <div class="modal-content">
          <img class="modal-image" alt="Фото из портфолио">
          <button class="modal-close" aria-label="Закрыть">&times;</button>
        </div>
      `;
        body.appendChild(modal);

        const modalImg = modal.querySelector('.modal-image');
        const closeBtn = modal.querySelector('.modal-close');

        // Функции управления модальным окном
        const openModal = (imageSrc) => {
            modalImg.src = imageSrc;
            modal.classList.add('active');
            body.classList.add('no-scroll');
            closeBtn.focus();
        };

        const closeModal = () => {
            modal.classList.remove('active');
            body.classList.remove('no-scroll');
        };

        // Инициализация карточек
        portfolioCards.forEach(card => {
            const bgImage = card.dataset.bg;
            if (bgImage) {
                card.style.backgroundImage = `url(${bgImage})`;

                card.addEventListener('click', () => openModal(bgImage));
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') openModal(bgImage);
                });
            }
        });

        // Обработчики закрытия
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => e.target === modal && closeModal());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // ========== Анимации при скролле ==========
    const animateElements = () => {
        document.querySelectorAll('[data-animate]').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.75) {
                el.classList.add('animated');
            }
        });
    };

    // Инициализация
    window.addEventListener('scroll', animateElements);
    animateElements();
});

// Плавная прокрутка панели навигаии по сайту
document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault(); // Отменяем стандартное поведение

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Плавная прокрутка
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Добавляем класс активного пункта меню (опционально)
            document.querySelectorAll('.nav__link').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Находим все секции с id и пункты меню
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

// Создаем Observer
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Получаем id видимой секции
                const id = entry.target.getAttribute('id');

                // Удаляем класс active у всех пунктов меню
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Добавляем класс active к соответствующему пункту меню
                document.querySelector(`.nav__link[href="#${id}"]`).classList.add('active');
            }
        });
    }, {
        rootMargin: '-50% 0px -50% 0px', // Настройка зоны срабатывания (середина экрана)
        threshold: 0
    }
);

// Функция для оптимизации scroll-событий
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function () {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function () {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}

// Обработчик скролла с throttle
window.addEventListener('scroll', throttle(function () {
    const headerNav = document.querySelector('.header__nav-container');
    if (window.scrollY > 50) {
        headerNav.classList.add('scrolled');
    } else {
        headerNav.classList.remove('scrolled');
    }
}, 100));