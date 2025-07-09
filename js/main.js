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
                history.pushState(null, null, targetId);

                // Обновляем активный пункт меню
                document.querySelectorAll('.nav__link').forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');
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
                card.style.backgroundSize = 'cover';
                card.style.backgroundPosition = 'center';
                card.style.backgroundRepeat = 'no-repeat';

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

    window.addEventListener('scroll', animateElements);
    animateElements();

    // ========== Изменение header при скролле ==========
    const headerNav = document.querySelector('.header__nav-container');
    if (headerNav) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                headerNav.classList.add('scrolled');
            } else {
                headerNav.classList.remove('scrolled');
            }
        });
    }

    // ========== Бургер-меню ==========
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileNav = document.querySelector('.mobile-nav');

    if (burgerMenu && mobileNav) {
        burgerMenu.addEventListener('click', function () {
            this.classList.toggle('open');
            mobileNav.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });

        document.querySelectorAll('.mobile-nav__link').forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('open');
                mobileNav.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // ========== Intersection Observer для меню ==========
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        }
    );

    sections.forEach(section => observer.observe(section));
});