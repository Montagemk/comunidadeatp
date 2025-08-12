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
    const quickRepliesContainer = document.querySelector('.quick-replies');

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
        if (quickRepliesContainer) {
            quickRepliesContainer.style.display = 'flex';
        }
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
        sendButton.addEventListener('click', () => handleUserMessage(inputField.value));
        inputField.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                handleUserMessage(inputField.value);
            }
        });
    }

    // --- LÓGICA ATUALIZADA PARA OS BOTÕES DE RESPOSTA RÁPIDA ---
    if (quickRepliesContainer) {
        quickRepliesContainer.addEventListener('click', function(event) {
            const button = event.target.closest('.quick-reply-btn');
            if (button) {
                // VERIFICA SE O BOTÃO É O DE WHATSAPP
                if (button.classList.contains('whatsapp')) {
                    const phoneNumber = '5512996443780';
                    const message = encodeURIComponent('Quero saber mais');
                    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
                    window.open(whatsappUrl, '_blank'); // Abre o WhatsApp em uma nova aba
                } else {
                    // LÓGICA ANTIGA PARA OS OUTROS BOTÕES
                    const message = button.getAttribute('data-message');
                    handleUserMessage(message);
                }
            }
        });
    }
    // --- FIM DA ATUALIZAÇÃO ---

    function handleUserMessage(messageText) {
        const trimmedMessage = messageText.trim();
        if (trimmedMessage === '') return;

        displayMessage(trimmedMessage, 'user-message');
        if (inputField) inputField.value = '';

        if (quickRepliesContainer) {
            quickRepliesContainer.style.display = 'none';
        }
        
        removeDynamicChoices();
        sendMessageToAI(trimmedMessage);
    }

    function sendMessageToAI(messageText) {
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
                return response.json().then(err => { throw new Error(err.error || 'Erro na rede'); });
            }
            return response.json();
        })
        .then(data => {
            // Lógica para lidar com múltiplas respostas
            if (Array.isArray(data)) {
                data.forEach((msg, index) => {
                    setTimeout(() => {
                        displayMessage(msg.text, 'bot-message');
                    }, index * 1200); // Adiciona um pequeno atraso entre as mensagens
                });
            } else if (data && data.text) { // Fallback para resposta única
                 displayMessage(data.text, 'bot-message');
            } else {
                displayMessage('Desculpe, recebi uma resposta inesperada.', 'bot-message');
            }
        })
        .catch(error => {
            console.error('Erro ao comunicar com o chatbot:', error);
            displayMessage(`Desculpe, ocorreu um erro: ${error.message}.`, 'bot-message');
        });
    }

    function displayMessage(text, type) {
        if (!chatMessages) return;

        removeDynamicChoices(); // Remove botões antigos antes de mostrar a nova mensagem

        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);

        const choiceRegex = /\[choice:([^|\]]+)\|?([^\]]*)\]/g;
        const buttonRegex = /\[botão:(.*?)\|(https?:\/\/[^\s\]]+)\]/g;
        const urlRegex = /(https?:\/\/[^\s.,?!)]+)/g;

        let mainText = text;
        let choices = [];

        if (type === 'bot-message') {
            mainText = text.replace(choiceRegex, (match, choiceText, value) => {
                choices.push({ text: choiceText, value: value || choiceText });
                return '';
            }).trim();
        }

        let processedHtml = mainText;
        if (buttonRegex.test(processedHtml)) {
            processedHtml = processedHtml.replace(buttonRegex, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-button-link">$1</a>');
        } else {
            processedHtml = processedHtml.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
        }
        
        messageElement.innerHTML = processedHtml;
        chatMessages.appendChild(messageElement);

        if (choices.length > 0) {
            const choicesContainer = document.createElement('div');
            choicesContainer.classList.add('dynamic-choices');
            choices.forEach(choice => {
                const choiceButton = document.createElement('button');
                choiceButton.classList.add('choice-btn');
                choiceButton.textContent = choice.text;
                choiceButton.addEventListener('click', () => {
                    handleUserMessage(choice.value);
                });
                choicesContainer.appendChild(choiceButton);
            });
            chatMessages.appendChild(choicesContainer);
        }

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function removeDynamicChoices() {
        const existingChoices = document.querySelectorAll('.dynamic-choices');
        existingChoices.forEach(container => container.remove());
    }
});
