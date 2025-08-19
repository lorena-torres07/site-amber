/**
 * Amber Engineering and Consulting - Website JavaScript
 * Este arquivo contém todas as funcionalidades interativas do site
 */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicialização de todas as funcionalidades
    initNavigation();
    initEnhancedScrollAnimations(); // Versão melhorada das animações
    initPortfolioFilter();
    initContactForm(); // Esta função foi modificada para o WhatsApp
    initCounterAnimation();
    
    initParallaxEffect();
    initAdvancedHoverEffects(); // Novos efeitos hover
    
    
    // Adiciona classe ao body quando tudo estiver carregado
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

/**
 * NAVEGAÇÃO E MENU MOBILE
 * Gerencia o menu hamburger e navegação suave
 */
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');

    // Toggle do menu mobile
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Previne scroll do body quando menu está aberto
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Fecha menu ao clicar em um link (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Fecha menu ao clicar fora dele
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Efeito de scroll no header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Navegação suave personalizada para melhor controle
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                smoothScrollTo(targetPosition, 800);
            }
        });
    });
}

/**
 * ANIMAÇÕES DE SCROLL
 * Controla as animações que aparecem quando elementos entram na viewport
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-up');
    
    // Configuração do Intersection Observer para performance otimizada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona delay baseado no índice para efeito cascata
                const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, delay);
                
                // Para de observar o elemento após animar
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observa todos os elementos animados
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * FILTRO DO PORTFÓLIO
 * Gerencia a filtragem dinâmica dos projetos
 */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adiciona classe active no botão clicado
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filtra os itens do portfólio
            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block';
                    // Reaplica animação
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, 100);
                } else {
                    item.style.display = 'none';
                    item.classList.remove('animate');
                }
            });
        });
    });
}

/**
 * FORMULÁRIO DE CONTATO
 * Validação e envio do formulário
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Limpa mensagens de erro anteriores
        clearErrorMessages();
        
        // Validação dos campos
        const formData = new FormData(form);
        const errors = validateForm(formData);
        
        if (errors.length > 0) {
            displayErrors(errors);
            return;
        }
        
        // >>> ALTERAÇÃO CHAVE: CHAMA A FUNÇÃO openWhatsApp APÓS A VALIDAÇÃO <<<
        openWhatsApp(formData);
    });
    
    // Validação em tempo real
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Remove mensagem de erro quando usuário começa a digitar
            const errorElement = document.getElementById(this.name + '-error');
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    });
}

/**
 * Validação individual de campo
 */
function validateField(field) {
    const value = field.value.trim();
    const name = field.name;
    const errorElement = document.getElementById(name + '-error');
    
    let errorMessage = '';
    
    switch (name) {
        case 'name':
            if (!value) {
                errorMessage = 'Nome é obrigatório';
            } else if (value.length < 2) {
                errorMessage = 'Nome deve ter pelo menos 2 caracteres';
            }
            break;
            
        case 'email':
            if (!value) {
                errorMessage = 'E-mail é obrigatório';
            } else if (!isValidEmail(value)) {
                errorMessage = 'E-mail inválido';
            }
            break;
            
        case 'message':
            if (!value) {
                errorMessage = 'Mensagem é obrigatória';
            } else if (value.length < 10) {
                errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
            }
            break;
    }
    
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }
    
    return errorMessage === '';
}

/**
 * Validação completa do formulário
 */
function validateForm(formData) {
    const errors = [];
    
    // Validação do nome
    const name = formData.get('name').trim();
    if (!name) {
        errors.push({ field: 'name', message: 'Nome é obrigatório' });
    } else if (name.length < 2) {
        errors.push({ field: 'name', message: 'Nome deve ter pelo menos 2 caracteres' });
    }
    
    // Validação do e-mail
    const email = formData.get('email').trim();
    if (!email) {
        errors.push({ field: 'email', message: 'E-mail é obrigatório' });
    } else if (!isValidEmail(email)) {
        errors.push({ field: 'email', message: 'E-mail inválido' });
    }
    
    // Validação da mensagem
    const message = formData.get('message').trim();
    if (!message) {
        errors.push({ field: 'message', message: 'Mensagem é obrigatória' });
    } else if (message.length < 10) {
        errors.push({ field: 'message', message: 'Mensagem deve ter pelo menos 10 caracteres' });
    }
    
    return errors;
}

/**
 * Verifica se e-mail é válido
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Exibe mensagens de erro
 */
function displayErrors(errors) {
    errors.forEach(error => {
        const errorElement = document.getElementById(error.field + '-error');
        if (errorElement) {
            errorElement.textContent = error.message;
        }
    });
}

/**
 * Limpa todas as mensagens de erro
 */
function clearErrorMessages() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

/**
 * >>> NOVA FUNÇÃO PARA ABRIR O WHATSAPP COM A MENSAGEM DO FORMULÁRIO <<<
 * Esta função é chamada após a validação bem-sucedida do formulário.
 */
function openWhatsApp(formData) {
    // Coleta os dados do formulário
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Construção da mensagem pré-preenchida para o WhatsApp
    // Usamos encodeURIComponent para garantir que os caracteres especiais sejam formatados corretamente para a URL
    const whatsappMessage = `Olá, Amber! Gostaria de falar sobre os serviços da empresa.
Meu nome é: ${name}
Meu e-mail é: ${email}
Meu telefone é: ${phone || 'Não informado'}
Assunto: ${subject || 'Não informado'}
Mensagem: ${message}`;
    
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Seu número de telefone (DDI+DDD+número)
    // O número correto é 81 8819-1775, que no formato para link é 558188191775
    const whatsappNumber = '558188191775'; 
    
    // Monta o link completo do WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Abre o link em uma nova aba do navegador
    window.open(whatsappUrl, '_blank');
    
    // Opcional: Limpa o formulário após abrir o WhatsApp
    document.getElementById('contact-form').reset();
    
    // Opcional: Mostra uma mensagem na tela para o usuário, indicando que a aba foi aberta
    const statusDiv = document.getElementById('form-status');
    if (statusDiv) {
        statusDiv.className = 'form-status success';
        statusDiv.textContent = 'Estamos te redirecionando para o WhatsApp...';
        setTimeout(() => {
            statusDiv.textContent = '';
            statusDiv.className = 'form-status';
        }, 5000); // A mensagem desaparece após 5 segundos
    }
}


/**
 * ANIMAÇÃO DOS CONTADORES
 * Anima os números da seção "Sobre"
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
            }
        });
    }, observerOptions);
    
    // Observa a seção de estatísticas
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

/**
 * Anima os contadores numericamente
 */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 segundos
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    });
}

/**
 * EFEITO PARALLAX
 * Cria efeito de parallax sutil e otimizado no hero
 */
function initParallaxEffect() {
    const parallaxElement = document.querySelector('.parallax-bg');
    
    if (!parallaxElement) return;
    
    // Verifica se o usuário prefere animações reduzidas
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrollTop = window.pageYOffset;
        const rate = scrollTop * -0.5; // Velocidade do parallax aumentada para mais dinamismo
        
        parallaxElement.style.transform = `translate3d(0, ${rate}px, 0)`;
        ticking = false;
    }
    
    window.addEventListener('scroll', throttle(() => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, 16)); // ~60fps
}

/**
 * EFEITOS HOVER AVANÇADOS
 * Adiciona interações sofisticadas aos elementos
 */
function initAdvancedHoverEffects() {
    // Efeito de inclinação nos cards de serviço
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
        });
    });
    
    // Efeito magnético nos botões
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.02)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

/**
 * ANIMAÇÕES DE ENTRADA MELHORADAS
 * Sistema de animações mais sofisticado com delays escalonados
 */
function initEnhancedScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-up');
    
    // Configuração otimizada do Intersection Observer
    const observerOptions = {
        threshold: [0.1, 0.2, 0.3],
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                // Delay baseado na posição do elemento para efeito cascata
                const elementIndex = Array.from(document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-up')).indexOf(entry.target);
                const delay = (elementIndex % 4) * 150; // Agrupa em sets de 4 elementos
                
                setTimeout(() => {
                    entry.target.classList.add('animate');
                    
                    // Adiciona classe especial para elementos que entraram na viewport
                    entry.target.classList.add('in-viewport');
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * FUNÇÕES UTILITÁRIAS
 */

/**
 * Scroll suave personalizado
 */
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    // Função de easing cúbica para animação mais suave
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t--;
        return c / 2 * (t * t * t + 2) + b;
    }
    
    requestAnimationFrame(animation);
}

/**
 * SISTEMA DE CURSOR PERSONALIZADO
 * Adiciona cursor interativo para melhor UX
 */
function initCustomCursor() {
    // Verifica se é dispositivo touch
    if ('ontouchstart' in window) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: linear-gradient(135deg, #C9A74D, #E6843C);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        opacity: 0;
    `;
    
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '0.8';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Animação suave do cursor
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Efeitos especiais em elementos interativos
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .portfolio-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = 'linear-gradient(135deg, #243B55, #C9A74D)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'linear-gradient(135deg, #C9A74D, #E6843C)';
        });
    });
}

/**
 * Throttle para otimizar performance em eventos de scroll
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/**
 * Debounce para otimizar performance em redimensionamento
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * OTIMIZAÇÕES DE PERFORMANCE
 */

// Lazy loading para imagens (se necessário)
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Otimização de redimensionamento
window.addEventListener('resize', debounce(() => {
    // Recalcula posições se necessário
    // console.log('Window resized');
}, 250));

/**
 * ACESSIBILIDADE
 * Melhorias para usuários com necessidades especiais
 */

// Navegação por teclado
document.addEventListener('keydown', function(e) {
    // ESC fecha o menu mobile
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Anuncia mudanças para leitores de tela
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.classList.add('sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/**
 * MODO DE ALTA PERFORMANCE
 * Reduz animações em dispositivos com bateria baixa
 */
if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
        if (battery.level < 0.2) {
            document.body.classList.add('reduced-motion');
        }
    });
}
