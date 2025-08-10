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
        adjustVideoWrapperSize();
    }


    // --- LÓGICA COMPLETA DO CHATBOT ---
    const toggleButton = document.querySelector('.chatbot-button'); 
    const chatbotWindow = document.querySelector('.chatbot-window');
    const closeButton = document.querySelector('.close-chat-button');
    const sendButton = document.getElementById('chat-send-button');
    const inputField = document.getElementById('chat-input-field');
    const chatMessages = document.querySelector('.chat-messages');

    // **CONFIGURAÇÕES DE COMUNICAÇÃO**
    const CHATBOT_URL = 'https://atpchatbot.onrender.com/webhook';
    const API_KEY = '_k8_fTbg98bu-tH_z7PjG'; // Lembre-se de usar a sua chave real aqui

    function getOrSetSenderId() {
        let senderId = localStorage.getItem('chatbotSenderId');
        if (!senderId) {
            senderId = 'web_user_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            localStorage.setItem('chatbotSenderId', senderId);
        }
        return senderId;
    }
    
    const uniqueSenderId = getOrSetSenderId();

    function openChat() {
        chatbotWindow.classList.remove('hidden');
        toggleButton.classList.add('hidden');
    }

    function closeChat() {
        chatbotWindow.classList.add('hidden');
        toggleButton.classList.remove('hidden');
    }

    if (toggleButton) {
        toggleButton.addEventListener('click', openChat);
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', closeChat);
    }

    if (sendButton && inputField) {
        sendButton.addEventListener('click', sendMessage);
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
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                sender: uniqueSenderId,
                message: messageText
            })
        })
        .then(response => {
            if (!response.ok) {
                console.error('Erro na requisição, status:', response.status);
                return response.json().then(err => {
                    throw new Error(err.error || 'Erro na rede ou no servidor');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0 && data[0].text) {
                displayMessage(data[0].text, 'bot-message');
            } else {
                displayMessage('Desculpe, recebi uma resposta inesperada. Tente novamente.', 'bot-message');
            }
        })
        .catch(error => {
            console.error('Erro ao comunicar com o chatbot:', error);
            displayMessage(`Desculpe, ocorreu um erro: ${error.message}. Tente novamente mais tarde.`, 'bot-message');
        });
    }

    // --- FUNÇÃO MODIFICADA PARA CRIAR BOTÕES E LINKS CLICÁVEIS ---
    function displayMessage(text, type) {
        if (!chatMessages) return;
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);

        const buttonRegex = /\[botão:(.*?)\|(https?:\/\/[^\s\]]+)\]/g;
        const urlRegex = /(https?:\/\/[^\s.,?!)]+)/g;

        let processedHtml = text;

        // Primeiro, procuramos pelo formato de botão
        if (buttonRegex.test(processedHtml)) {
            // Substitui o código por um botão HTML
            processedHtml = processedHtml.replace(buttonRegex, (match, buttonText, url) => {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-button-link">${buttonText}</a>`;
            });
        } else {
            // Se não houver botão, procuramos por links normais
            processedHtml = processedHtml.replace(urlRegex, (url) => {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
            });
        }
        
        messageElement.innerHTML = processedHtml;

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    // --- FIM DA MODIFICAÇÃO ---
});
