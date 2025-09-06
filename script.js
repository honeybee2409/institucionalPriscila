document.addEventListener('DOMContentLoaded', () => {
    // Código para o envio do formulário de contato
    const form = document.querySelector('[data-form-submit]');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const statusDiv = document.getElementById('form-status');
            const submitButton = form.querySelector('button[type="submit"]');
            
            statusDiv.textContent = 'Enviando...';
            submitButton.disabled = true;

            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => (data[key] = value));

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    statusDiv.textContent = 'Mensagem enviada com sucesso!';
                    statusDiv.className = 'form-status success';
                    form.reset();
                } else {
                    statusDiv.textContent = 'Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.';
                    statusDiv.className = 'form-status error';
                }
            } catch (error) {
                console.error('Erro:', error);
                statusDiv.textContent = 'Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.';
                statusDiv.className = 'form-status error';
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    // --- Carrossel de Feedbacks ---
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let slideIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationId = 0;

    const setPositionByIndex = () => {
        currentTranslate = slideIndex * -carouselSlides[0].offsetWidth;
        setSliderPosition();
    };

    const setSliderPosition = () => {
        carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
    };

    const handleNext = () => {
        if (slideIndex < carouselSlides.length - 1) {
            slideIndex++;
        } else {
            slideIndex = 0;
        }
        setPositionByIndex();
    };

    const handlePrev = () => {
        if (slideIndex > 0) {
            slideIndex--;
        } else {
            slideIndex = carouselSlides.length - 1;
        }
        setPositionByIndex();
    };

    // Eventos de clique nas setas
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', handlePrev);
        nextBtn.addEventListener('click', handleNext);
    }
    
    // --- Lógica para arrastar o carrossel ---
    const getPositionX = (event) => {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    };

    const dragStart = (event) => {
        isDragging = true;
        startPos = getPositionX(event);
        carouselTrack.classList.add('grabbing');
        animationId = requestAnimationFrame(animation);
        prevTranslate = currentTranslate;
    };

    const dragging = (event) => {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    };

    const dragEnd = () => {
        cancelAnimationFrame(animationId);
        isDragging = false;
        carouselTrack.classList.remove('grabbing');
        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -100 && slideIndex < carouselSlides.length - 1) {
            slideIndex++;
        }
        if (movedBy > 100 && slideIndex > 0) {
            slideIndex--;
        }
        setPositionByIndex();
    };

    const animation = () => {
        setSliderPosition();
        if (isDragging) {
            requestAnimationFrame(animation);
        }
    };

    if (carouselTrack) {
        // Eventos para mouse
        carouselTrack.addEventListener('mousedown', dragStart);
        carouselTrack.addEventListener('mouseup', dragEnd);
        carouselTrack.addEventListener('mouseleave', dragEnd);
        carouselTrack.addEventListener('mousemove', dragging);

        // Eventos para toque em dispositivos móveis
        carouselTrack.addEventListener('touchstart', dragStart);
        carouselTrack.addEventListener('touchend', dragEnd);
        carouselTrack.addEventListener('touchmove', dragging);
    }

    // --- Pop-up da Imagem (Lightbox) ---
    const imageModalOverlay = document.querySelector('.image-modal-overlay');
    const modalImage = document.querySelector('.modal-image');
    const closeModalBtn = document.querySelector('.close-modal');

    const openModal = (imageSrc) => {
        modalImage.src = imageSrc;
        imageModalOverlay.style.display = 'flex';
    };

    const closeModal = () => {
        imageModalOverlay.style.display = 'none';
        modalImage.src = '';
    };

    // Adiciona o evento de clique em cada imagem do carrossel
    carouselSlides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            img.addEventListener('click', () => {
                openModal(img.src);
            });
        }
    });

    // Eventos para fechar o pop-up
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (imageModalOverlay) {
        imageModalOverlay.addEventListener('click', (event) => {
            if (event.target === imageModalOverlay) {
                closeModal();
            }
        });
    }
});
