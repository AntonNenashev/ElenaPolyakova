document.addEventListener('DOMContentLoaded', function () {
    try {
        // ========== Настройки анимаций ==========
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        function shouldAnimate() {
            return !motionQuery.matches;
        }

        function setupMotionPreferences() {
            motionQuery.addEventListener('change', () => {
                if (motionQuery.matches) {
                    document.querySelectorAll('*').forEach(el => {
                        el.getAnimations().forEach(anim => anim.cancel());
                    });
                }
            });
        }

        setupMotionPreferences();

        // ========== Плавная прокрутка ==========
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const scrollOptions = {
                        behavior: shouldAnimate() ? 'smooth' : 'auto',
                        block: 'start'
                    };

                    targetElement.scrollIntoView(scrollOptions);
                    history.pushState(null, null, targetId);

                    document.querySelectorAll('.nav__link').forEach(item => {
                        item.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            });
        });

        // ========== Анимации при скролле ==========
        const animateElements = () => {
            document.querySelectorAll('[data-animate]').forEach(el => {
                const rect = el.getBoundingClientRect();
                const isInView = rect.top < window.innerHeight * 0.75;

                if (isInView) {
                    if (shouldAnimate()) {
                        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    }
                    el.classList.add('animated');
                }
            });
        };

        let isScrolling;
        window.addEventListener('scroll', () => {
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(animateElements, 50);
        }, { passive: true });

        animateElements();

        // ========== Бургер-меню ==========
        const burgerMenu = document.querySelector('.burger-menu');
        const mobileNav = document.querySelector('.mobile-nav');

        if (burgerMenu && mobileNav) {
            const toggleMenu = () => {
                const isOpening = !burgerMenu.classList.contains('open');

                if (shouldAnimate()) {
                    mobileNav.style.transition = 'transform 0.3s ease';
                } else {
                    mobileNav.style.transition = 'none';
                }

                burgerMenu.classList.toggle('open');
                mobileNav.classList.toggle('open');
                document.body.classList.toggle('no-scroll');

                if (isOpening) {
                    mobileNav.querySelector('a')?.focus();
                }
            };

            burgerMenu.addEventListener('click', toggleMenu);

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

        if (sections.length && navLinks.length) {
            const observerOptions = {
                rootMargin: '-50% 0px -50% 0px',
                threshold: 0
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        navLinks.forEach(link => {
                            link.classList.toggle(
                                'active',
                                link.getAttribute('href') === `#${id}`
                            );
                        });
                    }
                });
            }, observerOptions);

            sections.forEach(section => observer.observe(section));
        }

        // ========== Модальное окно портфолио ==========
        const portfolioCards = document.querySelectorAll('.portfolio__card');
        if (portfolioCards.length > 0) {
            const body = document.body;

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

            portfolioCards.forEach(card => {
                const bgImage = card.dataset.bg;
                if (bgImage) {
                    card.style.backgroundImage = `url(${bgImage})`;
                    card.style.backgroundSize = 'cover';
                    card.style.backgroundPosition = 'center';
                    card.style.backgroundRepeat = 'no-repeat';

                    const clickHandler = () => openModal(bgImage);
                    const keyHandler = (e) => {
                        if (e.key === 'Enter') openModal(bgImage);
                    };

                    card.addEventListener('click', clickHandler);
                    card.addEventListener('keydown', keyHandler);

                    // Сохраняем ссылки на обработчики для последующей очистки
                    card._clickHandler = clickHandler;
                    card._keyHandler = keyHandler;
                }
            });

            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => e.target === modal && closeModal());
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    closeModal();
                }
            });
        }

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

        // ========== Обработка клика по ссылке "Главная" ==========
        document.querySelectorAll('.nav__link[href="#main"], .mobile-nav__link[href="#main"]').forEach(link => {
            link.addEventListener('click', function (e) {
                if (window.pageYOffset === 0) return;

                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

                if (document.querySelector('.mobile-nav').classList.contains('open')) {
                    document.querySelector('.mobile-nav').classList.remove('open');
                    document.querySelector('.burger-menu').classList.remove('active');
                }
            });
        });

    } catch (error) {
        console.error('Произошла ошибка в основном скрипте:', error);
        // Дополнительная обработка ошибок
    }
});