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


    // --- LÓGICA COMPLETA DO CHATBOT (COM AS NOVAS MELHORIAS) ---
    const toggleButton = document.querySelector('.chatbot-button'); 
    const chatbotWindow = document.querySelector('.chatbot-window');
    const sendButton = document.getElementById('chat-send-button');
    const inputField = document.getElementById('chat-input-field');
    const chatMessages = document.querySelector('.chat-messages');

    // **CONFIGURAÇÕES DE COMUNICAÇÃO**
    const CHATBOT_URL = 'https://atpchatbot.onrender.com/webhook';
    // IMPORTANTE: Coloque aqui a mesma chave que você configurou no Render.
    const API_KEY = '_k8_fTbg98bu-tH_z7PjG'; 

    // --- CORREÇÃO 1: Lógica para criar e gerenciar um ID único para cada visitante ---
    function getOrSetSenderId() {
        let senderId = localStorage.getItem('chatbotSenderId');
        if (!senderId) {
            // Cria um ID único baseado no tempo e um número aleatório
            senderId = 'web_user_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            localStorage.setItem('chatbotSenderId', senderId);
        }
        return senderId;
    }
    
    const uniqueSenderId = getOrSetSenderId();
    // --- FIM DA CORREÇÃO 1 ---

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

        // --- CORREÇÃO 2: Atualizando a chamada fetch com o ID único e a chave de API ---
        fetch(CHATBOT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY // Adiciona a chave de API no cabeçalho
            },
            body: JSON.stringify({
                sender: uniqueSenderId, // Envia o ID único do visitante
                message: messageText
            })
        })
        // --- FIM DA CORREÇÃO 2 ---
        .then(response => {
            if (!response.ok) {
                console.error('Erro na requisição, status:', response.status);
                // Tenta ler a mensagem de erro do servidor
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

    function displayMessage(text, type) {
        if (!chatMessages) return;
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
