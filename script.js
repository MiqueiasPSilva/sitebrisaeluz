/* ==========================================================================
   JAVASCRIPT - BRISA & LUZ ENERGIA
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {

    /* ======================================================================
       1. NAVEGAÇÃO ENTRE SEÇÕES
       ====================================================================== */
    function showSection(sectionId) {
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
        const target = document.getElementById(sectionId);
        if (target) {
            target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (sectionId === 'home') {
            animateNumbers();
            startTestimonialCarousel();
        }
    }

    // Todos os botões/links com data-section
    document.querySelectorAll('[data-section]').forEach(el => {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            showSection(this.getAttribute('data-section'));
        });
    });

    // Botões "Solicitar Orçamento" com data-quote
    document.querySelectorAll('[data-quote]').forEach(el => {
        el.addEventListener('click', function() {
            const tipo = this.getAttribute('data-quote');
            showSection('orcamento');
            document.getElementById('servico').value = tipo;
            resetForm();
        });
    });

    /* ======================================================================
       2. EFEITO MÁQUINA DE ESCREVER
       ====================================================================== */
    const text = "Transformando o sol, vento e água em economia para você.";
    const typewriterElement = document.getElementById('typewriter');
    let charIndex = 0;

    function type() {
        if (charIndex < text.length) {
            typewriterElement.textContent = text.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(type, 50);
        } else {
            setTimeout(function() {
                charIndex = 0;
                type();
            }, 5000);
        }
    }
    if (typewriterElement) type();

    /* ======================================================================
       3. CONTADORES ANIMADOS (NÚMEROS)
       ====================================================================== */
    function animateNumbers() {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000;
            const startTime = performance.now();
            stat.textContent = '0';

            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = progress * (2 - progress);
                const currentValue = Math.floor(easeOut * target);
                stat.textContent = currentValue.toLocaleString('pt-BR');

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target.toLocaleString('pt-BR');
                }
            }
            requestAnimationFrame(updateCount);
        });
    }

    // Inicia os contadores assim que a página carregar
    animateNumbers();

    /* ======================================================================
       4. CARROSSEL DE DEPOIMENTOS
       ====================================================================== */
    let currentTestimonial = 0;
    let testimonialInterval = null;

    function nextTestimonial() {
        const testimonials = document.querySelectorAll('.testimonial');
        if (testimonials.length === 0) return;

        testimonials[currentTestimonial].classList.remove('active');
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
    }

    function startTestimonialCarousel() {
        if (testimonialInterval) clearInterval(testimonialInterval);
        currentTestimonial = 0;
        const testimonials = document.querySelectorAll('.testimonial');
        testimonials.forEach(function(t, i) {
            t.classList.toggle('active', i === 0);
        });
        testimonialInterval = setInterval(nextTestimonial, 4000);
    }

    startTestimonialCarousel();

    /* ======================================================================
       5. FAQ - ACORDEÃO
       ====================================================================== */
    document.querySelectorAll('.faq-question').forEach(function(question) {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';

            // Fecha todos
            document.querySelectorAll('.faq-answer').forEach(function(ans) {
                ans.style.maxHeight = null;
            });

            // Abre o clicado
            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    /* ======================================================================
       6. VALIDAÇÃO DO FORMULÁRIO
       ====================================================================== */
    const fields = {
        nome: {
            element: document.getElementById('nome'),
            validate: function(value) {
                if (!value.trim()) return "O nome é obrigatório.";
                if (!/^[a-zA-ZÀ-ú\s]+$/.test(value)) return "Digite apenas letras e espaços.";
                if (value.trim().length < 3) return "O nome deve ter pelo menos 3 letras.";
                return "";
            }
        },
        email: {
            element: document.getElementById('email'),
            validate: function(value) {
                if (!value.trim()) return "O e-mail é obrigatório.";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Digite um e-mail válido (ex: nome@dominio.com).";
                return "";
            }
        },
        telefone: {
            element: document.getElementById('telefone'),
            validate: function(value) {
                if (!value.trim()) return "O telefone é obrigatório.";
                const digits = value.replace(/\D/g, '');
                if (digits.length < 10 || digits.length > 11) return "Digite um telefone válido com DDD (10 ou 11 dígitos).";
                return "";
            }
        },
        servico: {
            element: document.getElementById('servico'),
            validate: function(value) {
                if (!value) return "Selecione um tipo de energia.";
                return "";
            }
        },
        consumo: {
            element: document.getElementById('consumo'),
            validate: function(value) {
                if (value.trim() && !/^[0-9.,]+$/.test(value)) return "Use apenas números (ex: 350,00).";
                return "";
            }
        },
        mensagem: {
            element: document.getElementById('mensagem'),
            validate: function(value) {
                if (!value.trim()) return "Descreva seu projeto.";
                if (value.trim().length < 10) return "Descreva com mais detalhes (mín. 10 caracteres).";
                return "";
            }
        }
    };

    function validateField(fieldObj) {
        const errorMsg = fieldObj.validate(fieldObj.element.value);
        const msgElement = fieldObj.element.parentElement.querySelector('.error-message');

        if (errorMsg) {
            fieldObj.element.classList.add('input-error');
            fieldObj.element.classList.remove('input-success');
            if (msgElement) msgElement.textContent = errorMsg;
            return false;
        } else {
            fieldObj.element.classList.remove('input-error');
            fieldObj.element.classList.add('input-success');
            if (msgElement) msgElement.textContent = "";
            return true;
        }
    }

    // Adiciona listeners de validação em cada campo
    Object.values(fields).forEach(function(field) {
        if (field.element) {
            field.element.addEventListener('blur', function() {
                validateField(field);
            });
            field.element.addEventListener('input', function() {
                if (field.element.classList.contains('input-error')) {
                    validateField(field);
                }
            });
        }
    });

    // Função para resetar o formulário
    function resetForm() {
        const form = document.getElementById('quoteForm');
        if (!form) return;
        form.reset();
        form.style.display = 'block';
        document.getElementById('successMessage').style.display = 'none';

        document.querySelectorAll('.input-error, .input-success').forEach(function(el) {
            el.classList.remove('input-error', 'input-success');
            const msgElement = el.parentElement.querySelector('.error-message');
            if (msgElement) msgElement.textContent = "";
        });
    }

    // Botão "Enviar Novo Pedido"
    const newQuoteBtn = document.getElementById('newQuoteBtn');
    if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', resetForm);
    }

    // Envio do formulário
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(event) {
            event.preventDefault();

            let isValid = true;
            let firstInvalidField = null;

            Object.values(fields).forEach(function(field) {
                const valid = validateField(field);
                if (!valid) {
                    isValid = false;
                    if (!firstInvalidField) firstInvalidField = field.element;
                }
            });

            if (!isValid) {
                if (firstInvalidField) firstInvalidField.focus();
                return;
            }

            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.textContent = "Enviando...";

            setTimeout(function() {
                quoteForm.style.display = 'none';
                document.getElementById('successMessage').style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = "Enviar Solicitação de Orçamento";
            }, 1200);
        });
    }

}); // <-- FIM DO DOMContentLoaded
