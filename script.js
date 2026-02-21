(() => {
  "use strict";

  // -----------------------------
  // Helpers
  // -----------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // -----------------------------
  // 1) Smooth scroll (anchors)
  // -----------------------------
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = $(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // ferme le menu burger si ouvert (mobile)
      const navLinks = $("#navLinks");
      if (navLinks && navLinks.classList.contains("show")) navLinks.classList.remove("show");
    });
  });

  // -----------------------------
  // 2) Fade-in on scroll (once)
  // -----------------------------
  const fadeIns = $$(".fade-in");
  if ("IntersectionObserver" in window && fadeIns.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target); // pro : une seule fois
          }
        });
      },
      { threshold: 0.12 }
    );
    fadeIns.forEach((el) => observer.observe(el));
  } else {
    // fallback
    fadeIns.forEach((el) => el.classList.add("visible"));
  }

  // -----------------------------
  // 3) Dark mode persisted (localStorage)
  // -----------------------------
  const DARK_KEY = "theme";
  const darkToggle = $("#darkModeToggle");

  function applyTheme(theme) {
    document.body.classList.toggle("dark", theme === "dark");
  }

  // au chargement : lire le choix
  const savedTheme = localStorage.getItem(DARK_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // optionnel : respecter le thème du système
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark");
      localStorage.setItem(DARK_KEY, isDark ? "dark" : "light");
    });
  }

  // -----------------------------
  // 4) Burger menu toggle
  // -----------------------------
  const burger = $("#burgerMenu");
  const navLinks = $("#navLinks");
  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });

    // fermer si on clique hors menu (mobile)
    document.addEventListener("click", (e) => {
      if (!navLinks.classList.contains("show")) return;
      const clickedInside = navLinks.contains(e.target) || burger.contains(e.target);
      if (!clickedInside) navLinks.classList.remove("show");
    });
  }

  // -----------------------------
  // 5) Filter projects (with active btn)
  //     Works with: data / automation / web / all
  // -----------------------------
  const filterButtons = $$(".filter-btn");
  const cards = $$(".project-card");

  function setActive(btn) {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }

  function applyFilter(filter) {
    cards.forEach((card) => {
      const show = filter === "all" || card.classList.contains(filter);
      card.style.display = show ? "block" : "none";
    });
  }

  if (filterButtons.length && cards.length) {
    // default: all
    const defaultBtn = filterButtons.find((b) => b.dataset.filter === "all") || filterButtons[0];
    setActive(defaultBtn);
    applyFilter(defaultBtn.dataset.filter);

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        setActive(btn);
        applyFilter(filter);
      });
    });
  }

  // -----------------------------
  // 6) Contact form demo (safe)
  // -----------------------------
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      // Si tu utilises Formspree, on intercepte pour afficher un message propre
      const action = contactForm.getAttribute("action") || "";
      if (!action.includes("formspree.io")) return; // laisse faire si autre backend

      e.preventDefault();
      formStatus.textContent = "Envoi en cours...";

      try {
        const data = new FormData(contactForm);
        const res = await fetch(action, {
          method: "POST",
          body: data,
          headers: { "Accept": "application/json" }
        });

        if (res.ok) {
          formStatus.textContent = "✅ Message envoyé. Merci !";
          contactForm.reset();
        } else {
          formStatus.textContent = "❌ Erreur lors de l’envoi. Réessayez ou contactez-moi par email.";
        }
      } catch (err) {
        formStatus.textContent = "❌ Problème réseau. Réessayez plus tard.";
      }
    });
  }



  // -----------------------------
  // 7) Language toggle (placeholder)
  // -----------------------------
  // ===============================
  // I18N SYSTEM (FR/EN) - All pages
  // ===============================
  document.addEventListener("DOMContentLoaded", () => {
    // Traduction désactivée pour l’instant
  });
  // ===============================
  // CAROUSELS (Project Cards Only)
  // ===============================

function initCardCarousels() {
  const carousels = document.querySelectorAll(".project-card .carousel");

  carousels.forEach((carousel) => {
    const images = carousel.querySelectorAll("img");
    if (images.length <= 1) return;

    let index = 0;

    setInterval(() => {
      index = (index + 1) % images.length;
      carousel.style.transform = `translateX(-${index * 100}%)`;
    }, 4500);
  });
}

initCardCarousels();
 // -----------------------------
  // 8) Carousels (pro)
  //     - only for cards carousels (premium cards)
  //     - don't conflict with project page carousels
  // -----------------------------
  function initCardCarousels() {
    // uniquement ceux dans les cartes
    const carousels = $$(".project-card .carousel");
    carousels.forEach((carousel) => {
      const images = $$("img", carousel);
      if (images.length <= 1) return;

      let index = 0;
      setInterval(() => {
        index = (index + 1) % images.length;
        carousel.style.transform = `translateX(-${index * 100}%)`;
      }, 4500);
    });
  }
  initCardCarousels();

  // -----------------------------
  // 9) Project captures autopan (optional)
  //     - works on project pages with id="capturesCarousel"
  //     - pauses when user scrolls
  // -----------------------------
  function initCapturesAutopan() {
    const container = $("#capturesCarousel");
    if (!container) return;

    const rail = $(".carousel", container);
    if (!rail) return;

    const shots = $$("img", rail);
    if (!shots.length) return;

    let i = 0;
    let userInteracting = false;
    let timers = [];

    function clearTimers() {
      timers.forEach((t) => clearTimeout(t));
      timers = [];
    }

    function scrollToImageStart(index) {
      const img = shots[index];
      container.scrollTo({ left: img.offsetLeft, behavior: "smooth" });
    }

    function autopan() {
      if (userInteracting) return;

      const img = shots[i];
      const start = img.offsetLeft;
      const end = start + img.offsetWidth;
      const viewEnd = container.scrollLeft + container.clientWidth;

      if (viewEnd < end - 5) {
        container.scrollBy({ left: Math.min(240, end - viewEnd), behavior: "smooth" });
        timers.push(setTimeout(autopan, 700));
      } else {
        timers.push(
          setTimeout(() => {
            i = (i + 1) % shots.length;
            scrollToImageStart(i);
            timers.push(setTimeout(autopan, 900));
          }, 900)
        );
      }
    }

    // start
    scrollToImageStart(i);
    timers.push(setTimeout(autopan, 1000));

    // pause on manual scroll
    container.addEventListener("scroll", () => {
      userInteracting = true;
      clearTimers();
      clearTimeout(container._resumeTimer);
      container._resumeTimer = setTimeout(() => {
        userInteracting = false;
        autopan();
      }, 2200);
    });
  }
  initCapturesAutopan();
})();
