document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os elementos do menu
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    // Usa uma verificação para garantir que mainNav exista antes de tentar selecionar os links
    const navLinks = mainNav ? mainNav.querySelectorAll('a') : []; 

    // Verifica se os elementos principais do menu existem antes de adicionar event listeners
    if (menuToggle && mainNav) {
        // --- Funcionalidade do Menu Responsivo (Toggle) ---
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active'); // Adiciona/remove a classe 'active' na navegação
            menuToggle.classList.toggle('active'); // Adiciona/remove a classe 'active' no botão de hambúrguer para animação
            // Adiciona/remove a classe 'no-scroll' ao body para evitar rolagem de fundo quando o menu está aberto
            document.body.classList.toggle('no-scroll'); 
        });

        // --- Fechar Menu ao Clicar em Link ou Redimensionar ---

        // Fechar o menu ao clicar em um item de navegação (para links âncora)
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.classList.remove('no-scroll'); // Remove o no-scroll ao fechar
                }
            });
        });

        // Fechar o menu e redefinir o botão se a tela for redimensionada para desktop
        window.addEventListener('resize', function() {
            // Verifica se a largura da tela é maior que o breakpoint mobile (768px definido no CSS)
            if (window.innerWidth > 768) {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.classList.remove('no-scroll'); // Remove o no-scroll se o menu estiver aberto e a tela for desktop
                }
            }
            // Chama o ajuste do vídeo também ao redimensionar
            adjustVideoWrapperSize(); 
        });
    }

    // --- Funcionalidade de Rolagem Suave (Smooth Scroll) ---
    // Esta parte é para todos os links âncora na página, não apenas no menu
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Previne o comportamento padrão do link

            const targetId = this.getAttribute('href'); // Pega o ID da seção alvo
            const targetElement = document.querySelector(targetId); // Seleciona o elemento alvo

            if (targetElement) {
                // Calcula a posição para scrollar, ajustando para a altura do header fixo
                const header = document.querySelector('header');
                const headerOffset = header ? header.offsetHeight : 0; // Pega a altura do seu header, ou 0 se não encontrar
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth" // Rolagem suave
                });
            }
        });
    });


    // --- NOVA FUNCIONALIDADE: Ajuste Responsivo do Vídeo ---
    const videoElement = document.querySelector('#video-marketing .responsive-video');
    const videoWrapper = document.querySelector('#video-marketing .video-wrapper');

    if (videoElement && videoWrapper) {
        // Função para ajustar o tamanho do wrapper com base na proporção do vídeo
        function adjustVideoWrapperSize() {
            // Verifica se o vídeo já carregou metadados para ter as dimensões (videoWidth/videoHeight)
            // readyState 2 (HAVE_CURRENT_DATA) ou superior garante que esses dados estão disponíveis
            if (videoElement.readyState >= 2) { 
                const videoRatio = videoElement.videoWidth / videoElement.videoHeight;
                const wrapperWidth = videoWrapper.offsetWidth; // Largura atual do contêiner do vídeo

                // Calcula a altura ideal para o wrapper para manter a proporção exata do vídeo
                const calculatedHeight = wrapperWidth / videoRatio;
                videoWrapper.style.height = `${calculatedHeight}px`; // Define a altura exata
                videoWrapper.style.paddingBottom = '0'; // Garante que padding-bottom não interfira se foi definido em CSS
            } else {
                // Se metadados ainda não carregaram, tenta novamente após um pequeno atraso.
                // Isso ajuda a lidar com o carregamento assíncrono do vídeo.
                setTimeout(adjustVideoWrapperSize, 100); 
            }
        }

        // Adiciona um listener para quando os metadados do vídeo forem carregados.
        // Isso é crucial para que as dimensões do vídeo estejam disponíveis.
        videoElement.addEventListener('loadedmetadata', adjustVideoWrapperSize);

        // Adiciona um listener para quando a janela for redimensionada.
        // Isso garante que o vídeo se ajuste se o tamanho da tela mudar.
        window.addEventListener('resize', adjustVideoWrapperSize);

        // Chama a função uma vez ao carregar o DOM.
        // Isso é importante caso o vídeo já esteja 'pronto' quando o script é executado.
        adjustVideoWrapperSize(); 
    }
});
