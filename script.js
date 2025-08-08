document.addEventListener('DOMContentLoaded', function() {
    // --- Funcionalidade do Menu Responsivo (Toggle) ---
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
            adjustVideoWrapperSize();
        });
    }

    // --- Funcionalidade de Rolagem Suave (Smooth Scroll) ---
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

    // --- Funcionalidade de Ajuste Responsivo do Vídeo ---
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


    // --- API CHATBOT (Código corrigido e completo) ---
    const toggleButton = document.getElementById('chatbot-toggle-button');
    const chatbotWindow = document.getElementById('chatbot-window');
    const sendButton = document.getElementById('chat-send-button');
    const inputField = document.getElementById('chat-input-field');
    const chatMessages = document.getElementById('chat-messages');

    // **A SUA URL DO CHATBOT NO RENDER**
    // Lembre-se de usar o endpoint da API no final da URL
    const CHATBOT_URL = 'https://atpchatbot.onrender.com/webhooks/rest/webhook';

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
                sender: 'user',
                message: messageText
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                displayMessage(data[0].text, 'bot-message');
            }
        })
        .catch(error => {
            console.error('Erro ao comunicar com o chatbot:', error);
            displayMessage('Desculpe, ocorreu um erro. Tente novamente mais tarde.', 'bot-message');
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
