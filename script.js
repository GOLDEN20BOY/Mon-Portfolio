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
  