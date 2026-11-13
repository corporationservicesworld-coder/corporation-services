
/* =========================================
   CORPORATION SERVICES WORLD
   JavaScript principal
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       PRELOADER
    ===================================== */

    const preloader = document.getElementById("preloader");

    function hidePreloader() {
        if (preloader) {
            preloader.classList.add("hide");
        }
    }

    window.addEventListener("load", hidePreloader);

    // Evita que el preloader quede bloqueado
    // si alguna imagen externa tarda en cargar.
    setTimeout(hidePreloader, 2500);


    /* =====================================
       HEADER AL HACER SCROLL
    ===================================== */

    const header = document.getElementById("header");

    function updateHeader() {
        if (!header) return;

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateHeader);
    updateHeader();


    /* =====================================
       MENU HAMBURGUESA
    ===================================== */

    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("navigation");
    const navLinks = document.querySelectorAll(".nav-link");

    function closeMenu() {
        if (!navigation || !menuToggle) return;

        navigation.classList.remove("open");
        document.body.classList.remove("menu-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");

        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }

    if (menuToggle && navigation) {

        menuToggle.addEventListener("click", () => {

            const isOpen = navigation.classList.toggle("open");

            document.body.classList.toggle("menu-open", isOpen);

            menuToggle.setAttribute("aria-expanded", String(isOpen));

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Cerrar menú" : "Abrir menú"
            );

            menuToggle.innerHTML = isOpen
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';

        });

        navLinks.forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        navigation.querySelector(".nav-cta")?.addEventListener(
            "click",
            closeMenu
        );

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

    }


    /* =====================================
       ANIMACIONES AL HACER SCROLL
    ===================================== */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -30px 0px"
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /* =====================================
       FILTROS DE SERVICIOS
    ===================================== */

    const filterButtons = document.querySelectorAll(".filter-btn");
    const serviceCards = document.querySelectorAll(".service-card");
    const serviceSearch = document.getElementById("serviceSearch");
    const noResults = document.getElementById("noResults");

    let activeFilter = "all";

    function filterServices() {

        const searchText = serviceSearch
            ? serviceSearch.value.toLowerCase().trim()
            : "";

        let visibleCount = 0;

        serviceCards.forEach(card => {

            const categories = (
                card.dataset.category || ""
            ).split(" ");

            const searchData = (
                card.dataset.search || ""
            ).toLowerCase();

            const title = (
                card.querySelector("h3")?.textContent || ""
            ).toLowerCase();

            const matchesCategory =
                activeFilter === "all" ||
                categories.includes(activeFilter);

            const matchesSearch =
                searchText === "" ||
                searchData.includes(searchText) ||
                title.includes(searchText);

            const isVisible = matchesCategory && matchesSearch;

            card.classList.toggle("hidden", !isVisible);

            if (isVisible) {
                visibleCount++;
            }

        });

        if (noResults) {
            noResults.classList.toggle("show", visibleCount === 0);
        }

    }

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            activeFilter = button.dataset.filter || "all";

            filterServices();

        });

    });

    if (serviceSearch) {
        serviceSearch.addEventListener("input", filterServices);
    }


    /* =====================================
       SELECCIÓN AUTOMÁTICA DE SERVICIO
    ===================================== */

    const serviceLinks = document.querySelectorAll(".service-link");
    const serviceSelect = document.getElementById("service");

    serviceLinks.forEach(link => {

        link.addEventListener("click", () => {

            const selectedService = link.dataset.service;

            if (serviceSelect && selectedService) {

                serviceSelect.value = selectedService;

            }

        });

    });


    /* =====================================
       ESTADÍSTICAS ANIMADAS
    ===================================== */

    const counters = document.querySelectorAll(".counter");

    function animateCounter(counter) {

        const target = Number(counter.dataset.target);

        if (!Number.isFinite(target)) return;

        const duration = 1500;
        const startTime = performance.now();

        function updateCounter(currentTime) {

            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const easedProgress = 1 - Math.pow(1 - progress, 3);

            const currentNumber = Math.floor(
                easedProgress * target
            );

            counter.textContent = currentNumber.toLocaleString("es-EC");

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString("es-EC");
            }

        }

        requestAnimationFrame(updateCounter);

    }

    if ("IntersectionObserver" in window) {

        const counterObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        animateCounter(entry.target);

                        observer.unobserve(entry.target);

                    }

                });

            },
            { threshold: 0.6 }
        );

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });

    } else {

        counters.forEach(counter => {
            counter.textContent = counter.dataset.target;
        });

    }


    /* =====================================
       NAVEGACIÓN ACTIVA
    ===================================== */

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        const currentId = entry.target.id;

                        navLinks.forEach(link => {

                            const isActive =
                                link.getAttribute("href") === "#" + currentId;

                            link.classList.toggle("active", isActive);

                        });

                    }

                });

            },
            {
                rootMargin: "-30% 0px -60% 0px"
            }
        );

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

    }


    /* =====================================
       FORMULARIO DE CONTACTO
       ENVÍO REAL MEDIANTE FORMSUBMIT
    ===================================== */

    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");
    const submitBtn = document.getElementById("submitBtn");

    if (contactForm) {

        contactForm.addEventListener("submit", event => {

            // No se utiliza preventDefault:
            // el navegador debe enviar el formulario
            // mediante POST directamente a FormSubmit.

            if (!contactForm.checkValidity()) {
                return;
            }

            if (formStatus) {
                formStatus.textContent =
                    "Enviando tu consulta. Por favor espera...";
            }

            if (submitBtn) {

                submitBtn.disabled = true;

                submitBtn.innerHTML =
                    'Enviando... <i class="fas fa-spinner fa-spin"></i>';

            }

        });

    }


    /* =====================================
       AÑO AUTOMÁTICO DEL COPYRIGHT
    ===================================== */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================
       EFECTO SUAVE EN TARJETAS
    ===================================== */

    const cards = document.querySelectorAll(".service-card");

    cards.forEach(card => {

        card.addEventListener("mouseenter", () => {
            card.style.zIndex = "2";
        });

        card.addEventListener("mouseleave", () => {
            card.style.zIndex = "1";
        });

    });


    console.log(
        "Corporation Services World | Página web inicializada correctamente."
    );

});
