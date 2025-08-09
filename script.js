document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica do Menu Responsivo (Toggle) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            }
            // Chama o ajuste do vídeo também ao redimensionar
            adjustVideoWrapperSize();
        });
    }

    // --- Lógica de Rolagem Suave (Smooth Scroll) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const header = document.querySelector('header');
                const headerOffset = header ? header.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Lógica de Ajuste Responsivo do Vídeo ---
    const videoElement = document.querySelector('#video-marketing .responsive-video');
    const videoWrapper = document.querySelector('#video-marketing .video-wrapper');

    if (videoElement && videoWrapper) {
        function adjustVideoWrapperSize() {
            if (videoElement.readyState >= 2) {
                const videoRatio = videoElement.videoWidth / videoElement.videoHeight;
                const wrapperWidth = videoWrapper.offsetWidth;
                const calculatedHeight = wrapperWidth / videoRatio;
                videoWrapper.style.height = `${calculatedHeight}px`;
                videoWrapper.style.paddingBottom = '0';
            } else {
                setTimeout(adjustVideoWrapperSize, 100);
            }
        }
        videoElement.addEventListener('loadedmetadata', adjustVideoWrapperSize);
        window.addEventListener('resize', adjustVideoWrapperSize);
        adjustVideoWrapperSize();
    }


    // --- Lógica Completa do CHATBOT ---
    const toggleButton = document.getElementById('chatbot-toggle-button');
    const chatbotWindow = document.getElementById('chatbot-window');
    const sendButton = document.getElementById('chat-send-button');
    const inputField = document.getElementById('chat-input-field');
    const chatMessages = document.getElementById('chat-messages');

    // **A SUA URL DO CHATBOT NO RENDER**
    const CHATBOT_URL = 'https://atpchatbot.onrender.com/webhook';

    if (toggleButton && chatbotWindow) {
        toggleButton.addEventListener('click', function() {
            chatbotWindow.classList.toggle('hidden');
        });
    }

    if (sendButton && inputField) {
        sendButton.addEventListener('click', function() {
            sendMessage();
        });

        inputField.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
    }

    function sendMessage() {
        const messageText = inputField.value.trim();
        if (messageText === '') return;

        displayMessage(messageText, 'user-message');
        inputField.value = '';

        fetch(CHATBOT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: 'user_site',
                message: messageText
            })
        })
        .then(response => {
            if (!response.ok) {
                // A requisição falhou. Vamos logar o erro exato no console.
                console.error('Erro na requisição, status:', response.status);
                throw new Error('Erro na rede ou no servidor');
            }
            return response.json();
        })
        .then(data => {
            // A resposta é processada aqui
            if (data && data.length > 0 && data[0].text) {
                displayMessage(data[0].text, 'bot-message');
            } else {
                // Se a resposta for vazia ou inesperada, exibe o erro
                displayMessage('Desculpe, ocorreu um erro. Tente novamente mais tarde.', 'bot-message');
            }
        })
        .catch(error => {
            console.error('Erro ao comunicar com o chatbot:', error);
            displayMessage('Desculpe, ocorreu um erro na comunicação. Tente novamente mais tarde.', 'bot-message');
        });
    }

    function displayMessage(text, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
