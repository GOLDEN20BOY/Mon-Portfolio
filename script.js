// Scroll doux
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  // Animation fade-in on scroll
  const fadeIns = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });
  fadeIns.forEach(el => observer.observe(el));
  
  // Dark mode toggle
  document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
  
  // Burger menu toggle
  document.getElementById('burgerMenu').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('show');
  });
  
  // Filtrage des projets
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        card.style.display = (filter === 'all' || card.classList.contains(filter)) ? 'block' : 'none';
      });
    });
  });
  
  // Formulaire de contact (démo)
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Merci pour votre message !");
    e.target.reset();
  });
  
  // Bouton de langue (non implémenté mais prêt)
  document.getElementById('langToggle').addEventListener('click', () => {
    alert("Traduction à venir !");
  });
  
  // Carrousel automatique dans les cartes premium
  document.querySelectorAll('.carousel').forEach(carousel => {
    let index = 0;
    const images = carousel.querySelectorAll('img');
    setInterval(() => {
      index = (index + 1) % images.length;
      carousel.style.transform = `translateX(-${index * 100}%)`;
    }, 4000);
  });
  
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("capturesCarousel");
  if (!container) return;

  const rail = container.querySelector(".carousel");
  const shots = Array.from(rail.querySelectorAll("img"));
  if (shots.length === 0) return;

  let i = 0;

  function scrollToImageStart(index) {
    const img = shots[index];
    container.scrollTo({ left: img.offsetLeft, behavior: "smooth" });
  }

  function next() {
    i = (i + 1) % shots.length;
    scrollToImageStart(i);
    setTimeout(autopan, 700); // laisser le temps au scroll
  }

  function autopan() {
    const img = shots[i];
    const start = img.offsetLeft;
    const end = start + img.offsetWidth;
    const viewEnd = container.scrollLeft + container.clientWidth;

    // Si l'image déborde encore à droite, on avance un peu
    if (viewEnd < end - 5) {
      container.scrollBy({ left: Math.min(200, end - viewEnd), behavior: "smooth" });
      setTimeout(autopan, 700);
    } else {
      // sinon on passe à l'image suivante
      setTimeout(next, 900);
    }
  }

  // Démarrage : on se place au début
  scrollToImageStart(i);
  setTimeout(autopan, 900);

  // Optionnel : pause auto si l'utilisateur scrolle manuellement
  let userInteracting = false;
  container.addEventListener("scroll", () => {
    userInteracting = true;
    clearTimeout(container._resumeTimer);
    container._resumeTimer = setTimeout(() => {
      userInteracting = false;
      autopan();
    }, 2000);
  });
});
