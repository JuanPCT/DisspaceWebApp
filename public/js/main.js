// JavaScript principal para DisspaceWebApp
document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializar funcionalidades
    initializeApp();
    
    function initializeApp() {
        // Auto-hide alerts después de 5 segundos
        setupAutoHideAlerts();
        
        // Inicializar tooltips
        initializeTooltips();
        
        // Validación de formularios
        setupFormValidation();
        
        // Smooth scroll para enlaces internos
        setupSmoothScroll();
        
        // Animaciones
        setupAnimations();
        
        // Confirmaciones de logout
        setupLogoutConfirmation();
        
        // Toggle de contraseñas
        setupPasswordToggle();
    }
    
    // Auto-hide alerts
    function setupAutoHideAlerts() {
        const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
        alerts.forEach(alert => {
            setTimeout(() => {
                if (alert && alert.parentNode) {
                    alert.style.transition = 'opacity 0.5s ease';
                    alert.style.opacity = '0';
                    setTimeout(() => {
                        if (alert.parentNode) {
                            alert.remove();
                        }
                    }, 500);
                }
            }, 5000);
        });
    }
    
    // Inicializar tooltips de Bootstrap
    function initializeTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Validación mejorada de formularios
    function setupFormValidation() {
        const forms = document.querySelectorAll('form[novalidate]');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    // Mostrar el primer campo con error
                    const firstInvalidField = form.querySelector(':invalid');
                    if (firstInvalidField) {
                        firstInvalidField.focus();
                        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
                form.classList.add('was-validated');
            });
            
            // Validación en tiempo real
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearFieldErrors);
            });
        });
        
        // Validación específica para registro
        setupRegistrationValidation();
    }
    
    function validateField(event) {
        const field = event.target;
        const value = field.value.trim();
        
        // Limpiar mensajes de error anteriores
        clearFieldErrors(event);
        
        // Validaciones específicas
        if (field.name === 'email') {
            validateEmail(field, value);
        } else if (field.name === 'password') {
            validatePassword(field, value);
        } else if (field.name === 'confirmPassword') {
            validatePasswordConfirmation(field, value);
        } else if (field.name === 'username') {
            validateUsername(field, value);
        }
    }
    
    function clearFieldErrors(event) {
        const field = event.target;
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.remove();
        }
        field.classList.remove('is-invalid');
    }
    
    function showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        // Crear mensaje de error si no existe
        let feedback = field.parentNode.querySelector('.invalid-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            field.parentNode.appendChild(feedback);
        }
        feedback.textContent = message;
    }
    
    function validateEmail(field, value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
            showFieldError(field, 'Por favor, ingresa un email válido');
            return false;
        }
        return true;
    }
    
    function validatePassword(field, value) {
        if (value.length < 6) {
            showFieldError(field, 'La contraseña debe tener al menos 6 caracteres');
            return false;
        }
        
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            showFieldError(field, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número');
            return false;
        }
        
        return true;
    }
    
    function validatePasswordConfirmation(field, value) {
        const passwordField = document.querySelector('input[name="password"]');
        if (passwordField && value !== passwordField.value) {
            showFieldError(field, 'Las contraseñas no coinciden');
            return false;
        }
        return true;
    }
    
    function validateUsername(field, value) {
        if (value.length < 3) {
            showFieldError(field, 'El nombre de usuario debe tener al menos 3 caracteres');
            return false;
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            showFieldError(field, 'Solo se permiten letras, números y guiones bajos');
            return false;
        }
        
        return true;
    }
    
    function setupRegistrationValidation() {
        const confirmPasswordField = document.querySelector('input[name="confirmPassword"]');
        const passwordField = document.querySelector('input[name="password"]');
        
        if (confirmPasswordField && passwordField) {
            passwordField.addEventListener('input', function() {
                if (confirmPasswordField.value) {
                    validatePasswordConfirmation(confirmPasswordField, confirmPasswordField.value);
                }
            });
        }
    }
    
    // Smooth scroll para enlaces internos
    function setupSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href !== '#!') {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }
    
    // Animaciones al hacer scroll
    function setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observar elementos que se deben animar
        const animateElements = document.querySelectorAll('.feature-card, .card, .stat-item');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // Confirmación de logout
    function setupLogoutConfirmation() {
        const logoutForms = document.querySelectorAll('form[action*="/auth/logout"]');
        logoutForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                if (!confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                    e.preventDefault();
                }
            });
        });
    }
    
    // Toggle para mostrar/ocultar contraseñas
    function setupPasswordToggle() {
        const passwordFields = document.querySelectorAll('input[type="password"]');
        passwordFields.forEach(field => {
            const wrapper = field.parentNode;
            if (wrapper.classList.contains('input-group')) {
                const toggleBtn = document.createElement('button');
                toggleBtn.type = 'button';
                toggleBtn.className = 'btn btn-outline-secondary';
                toggleBtn.innerHTML = '<i class="bi bi-eye"></i>';
                toggleBtn.setAttribute('data-bs-toggle', 'tooltip');
                toggleBtn.setAttribute('title', 'Mostrar contraseña');
                
                const toggleSpan = document.createElement('span');
                toggleSpan.className = 'input-group-text';
                toggleSpan.appendChild(toggleBtn);
                
                wrapper.appendChild(toggleSpan);
                
                toggleBtn.addEventListener('click', function() {
                    const type = field.type === 'password' ? 'text' : 'password';
                    field.type = type;
                    
                    const icon = this.querySelector('i');
                    if (type === 'text') {
                        icon.className = 'bi bi-eye-slash';
                        this.setAttribute('title', 'Ocultar contraseña');
                    } else {
                        icon.className = 'bi bi-eye';
                        this.setAttribute('title', 'Mostrar contraseña');
                    }
                });
            }
        });
    }
    
    // Funciones para el dashboard
    function initializeDashboard() {
        // Actualizar estadísticas en tiempo real (simulado)
        setInterval(updateStats, 30000); // Cada 30 segundos

        // Configurar gráficos si existen
        setupCharts();

        // Configurar sidebar
        setupSidebarToggle();
    }
    
    function updateStats() {
        // Aquí se podría hacer una llamada AJAX para actualizar estadísticas
        console.log('Actualizando estadísticas...');
    }
    
    function setupCharts() {
        // Configuración de gráficos con Chart.js si está disponible
        if (typeof Chart !== 'undefined') {
            const chartElements = document.querySelectorAll('canvas[data-chart]');
            chartElements.forEach(canvas => {
                // Configurar gráfico específico según el tipo
                const chartType = canvas.getAttribute('data-chart');
                if (chartType === 'progress') {
                    createProgressChart(canvas);
                }
            });
        }
    }
    
    function createProgressChart(canvas) {
        // Ejemplo de gráfico de progreso
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completado', 'Pendiente'],
                datasets: [{
                    data: [75, 25],
                    backgroundColor: ['#198754', '#e9ecef']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    function setupSidebarToggle() {
        const wrapper = document.getElementById('dashboard-wrapper');
        const toggleBtn = document.getElementById('sidebarToggle');
        if (wrapper && toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                wrapper.classList.toggle('toggled');
            });
        }
    }
    
    // Loading states
    function showLoading(element) {
        element.classList.add('loading');
        element.style.pointerEvents = 'none';
    }
    
    function hideLoading(element) {
        element.classList.remove('loading');
        element.style.pointerEvents = 'auto';
    }
    
    // Notificaciones toast
    function showToast(message, type = 'info') {
        // Crear toast container si no existe
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        // Crear toast
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Inicializar y mostrar toast
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Remover del DOM después de ocultarse
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
    
    // Funciones de utilidad
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
    
    // API helpers
    async function apiRequest(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        
        const mergedOptions = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(url, mergedOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            showToast('Error al conectar con el servidor', 'danger');
            throw error;
        }
    }
    
    // Exponer funciones globales si es necesario
    window.DisspaceApp = {
        showToast,
        showLoading,
        hideLoading,
        apiRequest,
        debounce
    };
    
    // Inicializar dashboard si estamos en esa página
    if (document.querySelector('[data-page="dashboard"]')) {
        initializeDashboard();
    }
    
    console.log('✅ DisspaceWebApp JavaScript inicializado correctamente');
});

// Service Worker registration (opcional para PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
