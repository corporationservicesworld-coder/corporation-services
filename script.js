
document.addEventListener("DOMContentLoaded", () => {

    // PRELOADER
    const preloader = document.getElementById("preloader");

    window.addEventListener("load", () => {
        preloader.classList.add("hide");
    });

    // Respaldo por si alguna imagen tarda en cargar
    setTimeout(() => {
        preloader.classList.add("hide");
    }, 2500);

    // HEADER STICKY
    const header = document.getElementById("header");

    function handleHeader() {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", handleHeader);
    handleHeader();

    // MENU HAMBURGUESA
    const menuToggle = document.getElementById("menuToggle");
    const navbar = document.getElementById("navbar");
    const navLinks = document.querySelectorAll(".nav-link");

    function closeMenu() {
        navbar.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    }

    menuToggle.addEventListener("click", () => {

        const isOpen = navbar.classList.toggle("open");

        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));

        document.body.classList.toggle("menu-open", isOpen);

    });

    navLinks.forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.querySelectorAll(".mobile-cta").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeMenu();
        }
    });

    // FILTRO DE DIVISIONES
    const filterButtons = document.querySelectorAll(".filter-btn");
    const serviceCards = document.querySelectorAll(".service-card");
    const noResults = document.getElementById("noResults");

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            // Activar botón seleccionado
            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const filter = button.dataset.filter;

            let visibleCount = 0;

            serviceCards.forEach(card => {

                const category = card.dataset.category;

                const shouldShow =
                    filter === "all" || category === filter;

                card.classList.toggle("hide", !shouldShow);

                if (shouldShow) {
                    visibleCount++;
                }

            });

            // Mostrar mensaje si no existen resultados
            noResults.style.display =
                visibleCount === 0 ? "block" : "none";

        });

    });

    // ANIMACIONES AL HACER SCROLL
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.12
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // CONTADORES ANIMADOS
    const counters = document.querySelectorAll(".counter");
    let countersStarted = false;

    function animateCounter(counter) {

        const target = Number(counter.dataset.target);
        const duration = 1500;
        const startTime = performance.now();

        function update(currentTime) {

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easedProgress = 1 - Math.pow(1 - progress, 3);

            const current = Math.floor(target * easedProgress);

            counter.textContent = current.toLocaleString("es-EC");

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target.toLocaleString("es-EC");
            }

        }

        requestAnimationFrame(update);

    }

    const statsSection = document.querySelector(".stats");

    const statsObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting && !countersStarted) {

                countersStarted = true;

                counters.forEach(counter => {
                    animateCounter(counter);
                });

                statsObserver.disconnect();

            }

        });

    }, {
        threshold: 0.3
    });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // BOTON VOLVER ARRIBA
    const backToTop = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }

    });

    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

    // ACTUALIZAR AÑO AUTOMATICAMENTE
    document.getElementById("year").textContent =
        new Date().getFullYear();

    // NAVEGACION ACTIVA
    const sections = document.querySelectorAll("main section[id]");

    const sectionObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                const currentId = entry.target.id;

                navLinks.forEach(link => {

                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === "#" + currentId
                    );

                });

            }

        });

    }, {
        rootMargin: "-30% 0px -60% 0px"
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // FORMULARIO DE CONTACTO
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    contactForm.addEventListener("submit", event => {

        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const formData = new FormData(contactForm);

        const name = formData.get("name").trim();
        const email = formData.get("email").trim();
        const service = formData.get("service");
        const message = formData.get("message").trim();

        if (!name || !email || !service || !message) {
            formStatus.textContent =
                "Por favor, completa todos los campos.";
            return;
        }

        const subject = encodeURIComponent(
            "Nueva consulta - Corporation Services World"
        );

        const body = encodeURIComponent(
            "Nombre: " + name + "\n" +
            "Correo: " + email + "\n" +
            "Servicio: " + service + "\n\n" +
            "Mensaje:\n" + message
        );

        // Cambia este correo por el correo empresarial de CSW
        const companyEmail = "contacto@tudominio.com";

        formStatus.textContent =
            "Preparando tu mensaje en tu aplicación de correo...";

        window.location.href =
            `mailto:${companyEmail}?subject=${subject}&body=${body}`;

    });

    // EFECTO PARALLAX SUTIL EN HERO
    const hero = document.querySelector(".hero");
    const heroBackground = document.querySelector(".hero-background");

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

        hero.addEventListener("mousemove", event => {

            const rect = hero.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            heroBackground.style.transform =
                `scale(1.05) translate(${x * -12}px, ${y * -12}px)`;

        });

        hero.addEventListener("mouseleave", () => {
            heroBackground.style.transform = "";
        });

    }

});