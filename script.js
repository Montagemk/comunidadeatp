document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os elementos do menu
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav ? mainNav.querySelectorAll('a') : []; // Seleciona todos os links da navegação

    // Verifica se os elementos principais existem antes de adicionar event listeners
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
                const headerOffset = document.querySelector('header').offsetHeight; // Pega a altura do seu header
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth" // Rolagem suave
                });
            }
        });
    });

});
