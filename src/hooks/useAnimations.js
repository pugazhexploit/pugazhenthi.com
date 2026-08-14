import { useEffect } from 'react';

// ========================================
// 1. SCROLL REVEAL HOOK
// ========================================
export function useScrollReveal() {
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    
    const checkVisibility = () => {
      const windowHeight = window.innerHeight;
      revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= windowHeight - 20) {
          el.classList.add('active');
        }
      });
    };

    // Check immediately and on next tick
    checkVisibility();
    const timeoutId = setTimeout(checkVisibility, 100);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px 50px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));

    window.addEventListener('scroll', checkVisibility, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener('scroll', checkVisibility);
    };
  }, []);
}

// ========================================
// 2. TYPING ANIMATION HOOK
// ========================================
export function useTypingAnimation(elementId, words, typingSpeed = 80, deletingSpeed = 40, pauseTime = 2000) {
  useEffect(() => {
    const element = document.getElementById(elementId);
    if (!element) return;

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    function type() {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        charIndex--;
        element.textContent = currentWord.substring(0, charIndex);
      } else {
        charIndex++;
        element.textContent = currentWord.substring(0, charIndex);
      }

      let delay = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentWord.length) {
        delay = pauseTime;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 500;
      }

      timeout = setTimeout(type, delay);
    }

    timeout = setTimeout(type, 1000);
    return () => clearTimeout(timeout);
  }, [elementId, words, typingSpeed, deletingSpeed, pauseTime]);
}

// ========================================
// 3. ACTIVE NAV TRACKING HOOK
// ========================================
export function useActiveNav(sectionIds) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            document.querySelectorAll('.nav-pill').forEach((pill) => {
              pill.classList.remove('active');
              if (pill.getAttribute('href') === `#${id}` || pill.dataset.section === id) {
                pill.classList.add('active');
              }
            });
          }
        });
      },
      { threshold: 0.2, rootMargin: '-70px 0px 0px 0px' }
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [sectionIds]);
}

// ========================================
// 4. SCROLL NAV BACKGROUND HOOK
// ========================================
export function useNavScroll() {
  useEffect(() => {
    const nav = document.querySelector('nav');
    if (!nav) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 50) {
            nav.classList.add('scrolled');
          } else {
            nav.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

// ========================================
// 5. TERMINAL ANIMATION HOOK
// ========================================
export function useTerminalAnimation() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const lines = document.querySelectorAll('.terminal-line');
      lines.forEach((line, index) => {
        setTimeout(() => {
          line.classList.add('visible');
        }, index * 300);
      });
    }, 800);
    return () => clearTimeout(timer);
  }, []);
}

// ========================================
// 6. PARTICLE CANVAS HOOK
// ========================================
export function useParticleCanvas(canvasId) {
  useEffect(() => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 25000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.2 + 0.05,
          color: Math.random() > 0.5 ? '0,255,65' : '0,243,255',
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    }

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [canvasId]);
}

// ========================================
// 7. BACK TO TOP HOOK
// ========================================
export function useBackToTop(buttonSelector = '.back-to-top') {
  useEffect(() => {
    const button = document.querySelector(buttonSelector);
    if (!button) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 500) {
            button.classList.add('visible');
          } else {
            button.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleClick = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    button.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      button.removeEventListener('click', handleClick);
    };
  }, [buttonSelector]);
}

// ========================================
// 8. CONSOLE EASTER EGG
// ========================================
export function useConsoleEasterEgg() {
  useEffect(() => {
    console.log('%c PUGAZHENTHI J ', 'background: #00ff41; color: #0a0a0f; font-size: 20px; font-weight: bold; padding: 10px 20px;');
    console.log('%c Cybersecurity Enthusiast | Ethical Hacker | CTF Player ', 'color: #00f3ff; font-size: 12px;');
    console.log('%c "Break. Learn. Build. Secure." ', 'color: #00ff41; font-size: 11px; font-style: italic;');
  }, []);
}

// ========================================
// 9. GLITCH EFFECT HOOK
// ========================================
export function useGlitchEffect(selector = '.hero-name') {
  useEffect(() => {
    const el = document.querySelector(selector);
    if (el && !el.dataset.text) {
      el.dataset.text = el.textContent;
    }
  }, [selector]);
}
