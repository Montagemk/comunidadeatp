document.addEventListener('DOMContentLoaded', function() {
    // --- LÓGICA DO MENU RESPONSIVO (PRESERVADA) ---
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

    // --- LÓGICA DE ROLAGEM SUAVE (PRESERVADA) ---
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

    // --- LÓGICA DE AJUSTE RESPONSIVO DO VÍDEO (PRESERVADA) ---
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


    // ######################################################################
    // ### INÍCIO DA NOVA LÓGICA DO CHATBOT (SUBSTITUIÇÃO COMPLETA) ###
    // ######################################################################

    // --- Seletores dos Elementos do DOM do Chatbot ---
    const chatbotButton = document.querySelector('.chatbot-button');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const closeChatButton = document.querySelector('.close-chat-button');
    const chatMessages = document.querySelector('.chat-messages');
    const inputField = document.getElementById('chat-input-field');
    const sendButton = document.getElementById('chat-send-button');
    const quickRepliesContainer = document.querySelector('.quick-replies');

    // --- Configurações da API ---
    const API_URL = "https://atpchatbot.onrender.com/webhook"; 
    const API_KEY = "_k8_fTbg98bu-tH_z7PjG"; // Use a mesma chave que está no seu routes.py

    // --- Lógica de Abertura e Fecho do Chat ---
    chatbotButton.addEventListener('click', () => {
        chatbotWindow.classList.remove('hidden');
        chatbotButton.classList.add('hidden');
        // Se a conversa estiver vazia, envia uma mensagem inicial para obter as boas-vindas.
        if (chatMessages.children.length === 0) {
            sendMessage('oi', true); // `true` impede que 'oi' apareça na tela
        }
    });

    closeChatButton.addEventListener('click', () => {
        chatbotWindow.classList.add('hidden');
        chatbotButton.classList.remove('hidden');
    });

    // --- Lógica de Envio de Mensagens (Input e Botão Enviar) ---
    sendButton.addEventListener('click', handleTypedMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleTypedMessage();
        }
    });
    
    function handleTypedMessage() {
        const message = inputField.value.trim();
        if (message) {
            displayMessage(message, 'user-message');
            sendMessage(message);
            inputField.value = '';
        }
    }
    
    // --- FUNÇÕES PRINCIPAIS DO CHAT ---

    function displayMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`; // Nomes de classe simplificados
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        // Rola para a mensagem mais recente
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function clearQuickReplies() {
        if (quickRepliesContainer) {
            quickRepliesContainer.innerHTML = '';
        }
    }

    function displayButtons(buttons) {
        clearQuickReplies();
        if (!buttons || buttons.length === 0 || !quickRepliesContainer) return;

        buttons.forEach(buttonInfo => {
            const buttonElement = document.createElement('button');
            buttonElement.className = 'quick-reply-btn';
            
            // Adiciona classe especial para o botão WhatsApp para estilização
            if (buttonInfo.label.toLowerCase() === 'whatsapp') {
                buttonElement.classList.add('whatsapp');
            }

            buttonElement.textContent = buttonInfo.label;
            
            buttonElement.addEventListener('click', () => {
                const value = buttonInfo.value;
                
                // LÓGICA PARA LINKS
                if (value.startsWith('link:')) {
                    const url = value.substring(5);
                    window.open(url, '_blank');
                    return; 
                }
                
                // LÓGICA PARA WHATSAPP
                if (value === "Quero falar no WhatsApp") {
                    const phoneNumber = '5512996443780';
                    const message = encodeURIComponent('Olá, vim pelo site e gostaria de falar com um atendente.');
                    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
                    window.open(whatsappUrl, '_blank');
                    return;
                }
                
                // Para botões normais
                displayMessage(buttonInfo.label, 'user-message');
                sendMessage(value);
            });

            quickRepliesContainer.appendChild(buttonElement);
        });
    }

    function getVisitorId() {
        let visitorId = localStorage.getItem('chatbotVisitorId');
        if (!visitorId) {
            visitorId = 'web_user_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            localStorage.setItem('chatbotVisitorId', visitorId);
        }
        return visitorId;
    }

    async function sendMessage(messageText, isInitial = false) {
        clearQuickReplies();

        // Mostra um indicador de "a escrever..."
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot-message typing-indicator';
        typingIndicator.textContent = '...';
        if (!isInitial) {
            chatMessages.appendChild(typingIndicator);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': API_KEY
                },
                body: JSON.stringify({
                    sender: getVisitorId(),
                    message: messageText
                })
            });

            if (!response.ok) throw new Error(`Erro na rede: ${response.statusText}`);
            
            const responseData = await response.json();
            
            // Remove o indicador "..." antes de mostrar a resposta real
            typingIndicator.remove();

            if (responseData && responseData.length > 0) {
                const botResponse = responseData[0];
                displayMessage(botResponse.text, 'bot-message');
                
                if (botResponse.buttons && botResponse.buttons.length > 0) {
                    displayButtons(botResponse.buttons);
                }
            }

        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            typingIndicator.remove(); // Remove o indicador também em caso de erro
            displayMessage('Desculpe, não consigo me conectar ao servidor agora. Tente mais tarde.', 'bot-message');
        }
    }

    // ####################################################################
    // ### FIM DA NOVA LÓGICA DO CHATBOT ###
    // ####################################################################
});
