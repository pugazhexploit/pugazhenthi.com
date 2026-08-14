import { useState, useEffect } from 'react';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'milestone', label: 'Milestone 🛡️' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achieve' },
  { id: 'experience', label: 'Exp' },
  { id: 'certifications', label: 'Certs' },
  { id: 'ctf', label: 'CTF' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-70px 0px 0px 0px' }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offset = 70;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <div
        className={`nav-backdrop${menuOpen ? ' active' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <nav className={scrolled ? 'scrolled' : ''}>
        <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
          <span className="nav-logo-name">PUGAZHENTHI J</span>
          <span className="nav-logo-bug"><i className="fas fa-bug"></i></span>
          <div className="nav-logo-dot"></div>
        </div>
        <div className={`nav-links${menuOpen ? ' open' : ''}`} id="navLinks">
        {sections.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`nav-pill${activeSection === id ? ' active' : ''}`}
            data-section={id}
            onClick={(e) => handleNavClick(e, id)}
          >
            <span>{label}</span>
          </a>
        ))}
        <a href="/cyber_security-resiume.pdf" download="cyber_security-resiume.pdf" target="_blank" rel="noopener noreferrer" className="nav-resume-btn">
          Resume ↓
        </a>
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
        </button>
      </div>
      <button
        className="theme-toggle-btn mobile-theme-btn"
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      >
        <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
      </button>
      <button
        className={`nav-hamburger${menuOpen ? ' active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span></span><span></span><span></span>
      </button>
      </nav>
    </>
  );
}
