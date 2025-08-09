document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica do Menu Responsivo (Toggle) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const body = document.body;
    const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            // CORREÇÃO: Usando a classe 'menu-open' que será definida no CSS
            body.classList.toggle('menu-open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    body.classList.remove('menu-open');
                }
            });
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    body.classList.remove('menu-open');
                }
            }
        });
    }

    // --- Lógica de Rolagem Suave (Smooth Scroll) ---
    // (Esta parte não precisou de alterações)
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
    // (Esta parte não precisou de alterações, apenas movi a chamada da função para o seu próprio listener)
    const videoElement = document.querySelector('#video-marketing .responsive-video');
    const videoWrapper = document.querySelector('#video-marketing .video-wrapper');

    function adjustVideoWrapperSize() {
        if (videoElement && videoWrapper && videoElement.readyState >= 2) {
            const videoRatio = videoElement.videoWidth / videoElement.videoHeight;
            const wrapperWidth = videoWrapper.offsetWidth;
            const calculatedHeight = wrapperWidth / videoRatio;
            videoWrapper.style.height = `${calculatedHeight}px`;
            videoWrapper.style.paddingBottom = '0';
        }
    }
    
    if (videoElement) {
        videoElement.addEventListener('loadedmetadata', adjustVideoWrapperSize);
        window.addEventListener('resize', adjustVideoWrapperSize);
        // Chama uma vez para o caso de o vídeo já estar carregado
        adjustVideoWrapperSize();
    }


    // --- Lógica Completa do CHATBOT (Corrigida) ---
    // CORREÇÃO: Selecionando os elementos pela CLASSE, para corresponder ao CSS.
    const toggleButton = document.querySelector('.chatbot-button'); 
    const chatbotWindow = document.querySelector('.chatbot-window');
    const sendButton = document.getElementById('chat-send-button');
    const inputField = document.getElementById('chat-input-field');
    const chatMessages = document.querySelector('.chat-messages');

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
                console.error('Erro na requisição, status:', response.status);
                throw new Error('Erro na rede ou no servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0 && data[0].text) {
                displayMessage(data[0].text, 'bot-message');
            } else {
                displayMessage('Desculpe, ocorreu um erro. Tente novamente mais tarde.', 'bot-message');
            }
        })
        .catch(error => {
            console.error('Erro ao comunicar com o chatbot:', error);
            displayMessage('Desculpe, ocorreu um erro na comunicação. Tente novamente mais tarde.', 'bot-message');
        });
    }

    function displayMessage(text, type) {
        if (!chatMessages) return;
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
