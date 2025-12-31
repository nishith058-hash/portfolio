import './style.css';
import { initBackground } from './background.js';

// Init Background
initBackground();

// Scroll Progress Indicator
const createScrollProgress = () => {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);
  return progressBar;
};

const scrollProgress = createScrollProgress();

window.addEventListener('scroll', () => {
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  scrollProgress.style.width = `${scrolled}%`;
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Magnetic Buttons Effect
const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-ghost, .full-width');

buttons.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    btn.style.transform = `translate(${(x - rect.width / 2) / 5}px, ${(y - rect.height / 2) / 5}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 300);
  });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });

      const navLinks = document.querySelector('.nav-links');
      const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuBtn.querySelector('i').className = 'ri-menu-line';
      }
    }
  });
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');

    if (navLinks.classList.contains('active')) {
      icon.className = 'ri-close-line';
    } else {
      icon.className = 'ri-menu-line';
    }
  });
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button');
    const originalBtnContent = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<span>Sending...</span><div class="spinner"></div>';

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('https://formspree.io/f/mdaknprq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        formStatus.textContent = result.message || 'Message sent successfully!';
        formStatus.className = 'form-status status-success';
        contactForm.reset();
      } else {
        throw new Error(result.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      formStatus.textContent = error.message || 'Failed to send message. Please try again.';
      formStatus.className = 'form-status status-error';
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalBtnContent;

      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 5000);
    }
  });
}

// Scroll Spy
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (scrollY >= (sectionTop - 300)) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href').includes(current)) {
      item.classList.add('active');
    }
  });
});

// Scroll Reveal Animation (Intersection Observer)
const setupScrollReveal = () => {
  const elementsToReveal = document.querySelectorAll(
    '.section-title, .skill-item, .project-card, .contact-info, .contact-form, .about-text, .stat-card'
  );

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  elementsToReveal.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupScrollReveal();
});

setupScrollReveal();
