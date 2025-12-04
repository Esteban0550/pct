// Menú hamburguesa
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const navOverlay = document.getElementById('navOverlay');

if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
        navOverlay.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en el overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', () => {
            closeMobileMenu();
        });
    }
}

function closeMobileMenu() {
    if (menuToggle) menuToggle.classList.remove('active');
    if (mainNav) mainNav.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
}

// Navegación entre secciones
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('section');

navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevenir cualquier comportamiento por defecto
        const sectionId = btn.getAttribute('data-section');
        navigateToSection(sectionId);
        // Cerrar menú móvil después de navegar
        if (window.innerWidth <= 768) {
            closeMobileMenu();
        }
    });
});

function navigateToSection(sectionId) {
    // Ocultar todas las secciones primero
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Remover clase active de todos los botones
    navButtons.forEach(btn => btn.classList.remove('active'));

    // Mostrar solo la sección seleccionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
    }
    
    // Añadir clase active al botón seleccionado
    const targetButton = document.querySelector(`[data-section="${sectionId}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
    
    // Animar estadísticas si se navega a inicio
    if (sectionId === 'inicio') {
        setTimeout(() => {
            const statNumbers = document.querySelectorAll('#inicio .hero-stat-number');
            statNumbers.forEach(stat => {
                stat.textContent = '0' + (stat.getAttribute('data-target') === '98' ? '%' : '+');
                stat.classList.remove('animated');
                setTimeout(() => {
                    stat.classList.add('animated');
                    animateCounter(stat);
                }, 100);
            });
        }, 300);
    }
    
    // Animar estadísticas si se navega a nosotros
    if (sectionId === 'nosotros') {
        setTimeout(() => {
            const statNumbers = document.querySelectorAll('#nosotros .stat-number');
            statNumbers.forEach(stat => {
                const target = stat.getAttribute('data-target');
                stat.textContent = '0' + (target === '98' ? '%' : '+');
                stat.classList.remove('animated');
                setTimeout(() => {
                    stat.classList.add('animated');
                    animateCounter(stat);
                }, 100);
            });
        }, 300);
    }
}

function scrollToSection(sectionId) {
    navigateToSection(sectionId);
    // Solo hacer scroll si es necesario (desde el botón CTA)
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Seleccionar servicios
let selectedService = null;

function selectService(element) {
    // Remover selección anterior
    if (selectedService) {
        selectedService.classList.remove('selected');
        const badge = selectedService.querySelector('.selected-badge');
        if (badge) badge.remove();
    }

    // Añadir selección nueva
    element.classList.add('selected');
    
    if (!element.querySelector('.selected-badge')) {
        const badge = document.createElement('div');
        badge.className = 'selected-badge';
        badge.textContent = '✓ Seleccionado';
        element.appendChild(badge);
    }

    selectedService = element;

    // Log para verificar (puedes ver en la consola)
    console.log('Servicio seleccionado:', element.querySelector('h3').textContent);
}

// CARRUSEL
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    // Asegurarse de que el índice esté dentro del rango
    if (index >= slides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = slides.length - 1;
    } else {
        currentSlideIndex = index;
    }

    // Ocultar todas las slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Mostrar la slide actual
    if (slides[currentSlideIndex]) {
        slides[currentSlideIndex].classList.add('active');
    }
    if (dots[currentSlideIndex]) {
        dots[currentSlideIndex].classList.add('active');
    }
}

function moveCarousel(direction) {
    showSlide(currentSlideIndex + direction);
}

function currentSlide(index) {
    showSlide(index - 1);
}

// Auto-play del carrusel (cambia cada 5 segundos)
let carouselInterval;

function startCarousel() {
    carouselInterval = setInterval(() => {
        moveCarousel(1);
    }, 5000);
}

function stopCarousel() {
    clearInterval(carouselInterval);
}

// Inicializar el carrusel cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    showSlide(0);
    startCarousel();
    
    // Pausar el carrusel cuando el mouse está sobre él
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopCarousel);
        carouselContainer.addEventListener('mouseleave', startCarousel);
    }
});

// Reiniciar el carrusel cuando se muestra la sección de inicio
const inicioSection = document.getElementById('inicio');
if (inicioSection) {
    const observer = new MutationObserver(() => {
        if (inicioSection.classList.contains('active')) {
            showSlide(0);
            startCarousel();
        } else {
            stopCarousel();
        }
    });
    
    observer.observe(inicioSection, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// Cerrar menú al redimensionar la ventana si vuelve a ser desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

// ANIMACIÓN DE CONTADORES EN HERO
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 segundos
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (target === 98 ? '%' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (target === 98 ? '%' : '+');
        }
    }, 16);
}

// Observar cuando la sección de inicio se vuelve activa
const inicioObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.hero-stat-number');
            statNumbers.forEach(stat => {
                if (!stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    animateCounter(stat);
                }
            });
        }
    });
}, { threshold: 0.5 });

// Inicializar observador cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const inicioSection = document.getElementById('inicio');
    if (inicioSection) {
        if (inicioSection.classList.contains('active')) {
            setTimeout(() => {
                const statNumbers = inicioSection.querySelectorAll('.hero-stat-number');
                statNumbers.forEach(stat => {
                    if (!stat.classList.contains('animated')) {
                        stat.classList.add('animated');
                        animateCounter(stat);
                    }
                });
            }, 500);
        }
        inicioObserver.observe(inicioSection);
    }
});

