document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling; // The content div
            const isActive = this.classList.contains('active');

            // Close all open accordions first (optional, but common behavior)
            accordionHeaders.forEach(h => {
                h.classList.remove('active');
                h.setAttribute('aria-expanded', 'false');
                h.nextElementSibling.style.maxHeight = null;
                h.nextElementSibling.style.paddingTop = '0';
                h.nextElementSibling.style.paddingBottom = '0';
            });

            // If this one wasn't active, open it
            if (!isActive) {
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true'); // Indicate expanded state
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.paddingTop = '15px';
                content.style.paddingBottom = '15px';
            }
        });
    });

    // Simple smooth scrolling for internal links (optional)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
