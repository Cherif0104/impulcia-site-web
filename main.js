// Smooth scroll pour la navigation interne et animations scroll-triggered

document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll pour la navigation interne
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  // Intersection Observer pour les animations scroll-triggered
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Observer seulement une fois pour optimiser les performances
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observer tous les éléments avec les classes d'animation scroll-triggered
  const animatedElements = document.querySelectorAll(
    ".scroll-fade-in, .scroll-fade-in-left, .scroll-fade-in-right, .scroll-scale-in, .section-reveal"
  );

  animatedElements.forEach((el) => {
    observer.observe(el);
  });

  // Animation d'apparition progressive pour les cartes avec délai
  const cards = document.querySelectorAll(".card-expert");
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          cardObserver.unobserve(entry.target);
        }, index * 100); // Délai de 100ms entre chaque carte
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    cardObserver.observe(card);
  });

  // Animation pour les éléments du hero au chargement
  const heroElements = document.querySelectorAll(".hero-animate");
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add("fade-in-up");
      el.style.opacity = "1";
    }, index * 150);
  });

  // Animation de fade-in pour les sections principales
  const sections = document.querySelectorAll("section");
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-revealed");
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.1 });

  sections.forEach((section) => {
    if (!section.id || section.id === "contact") return; // Skip hero and contact
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
    sectionObserver.observe(section);
  });

  // Animation pour les chiffres/compteurs (si présents)
  const counters = document.querySelectorAll(".counter-animate");
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target") || "0");
    const duration = parseInt(counter.getAttribute("data-duration") || "2000");
    let current = 0;
    const increment = target / (duration / 16);

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString("fr-FR");
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString("fr-FR");
      }
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateCounter();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterObserver.observe(counter);
  });

  // Animation de parallaxe subtile pour le background
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll(".parallax");
        parallaxElements.forEach((el) => {
          const speed = parseFloat(el.dataset.speed || "0.5");
          el.style.transform = `translateY(${scrolled * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  // Effet de hover amélioré pour les boutons
  const buttons = document.querySelectorAll(".btn-primary, a[class*='bg-sky-600']");
  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", function() {
      this.style.transform = "scale(1.05)";
    });
    btn.addEventListener("mouseleave", function() {
      this.style.transform = "scale(1)";
    });
  });

  // Animations inspirées d'OpenAI.com - Particules flottantes
  function createParticles() {
    if (document.querySelector(".particles-bg")) return;
    const particlesContainer = document.createElement("div");
    particlesContainer.className = "particles-bg";
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 20 + "s";
      particle.style.animationDuration = (15 + Math.random() * 10) + "s";
      particlesContainer.appendChild(particle);
    }
  }
  createParticles();

  // Parallaxe multi-couches au scroll
  let parallaxTicking = false;
  window.addEventListener("scroll", () => {
    if (!parallaxTicking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        
        const parallaxSlow = document.querySelectorAll(".parallax-slow");
        const parallaxMedium = document.querySelectorAll(".parallax-medium");
        const parallaxFast = document.querySelectorAll(".parallax-fast");
        
        parallaxSlow.forEach((el) => {
          el.style.transform = `translateY(${currentScrollY * 0.2}px)`;
        });
        
        parallaxMedium.forEach((el) => {
          el.style.transform = `translateY(${currentScrollY * 0.4}px)`;
        });
        
        parallaxFast.forEach((el) => {
          el.style.transform = `translateY(${currentScrollY * 0.6}px)`;
        });
        
        parallaxTicking = false;
      });
      parallaxTicking = true;
    }
  });

  // Blur reveal pour les sections
  const blurRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        blurRevealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll(".blur-reveal").forEach((el) => {
    blurRevealObserver.observe(el);
  });

  // Staggered reveal pour les cards
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll(".stagger-reveal").forEach((el) => {
    staggerObserver.observe(el);
  });

  // Scale on scroll
  const scaleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.3, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll(".scale-on-scroll").forEach((el) => {
    scaleObserver.observe(el);
  });
});
