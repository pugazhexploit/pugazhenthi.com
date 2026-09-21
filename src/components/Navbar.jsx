import { useState, useEffect, useRef, useCallback } from 'react';
import './Navbar.css';

const sections = [
  { id: 'hero', label: 'Home', icon: 'fas fa-house' },
  { id: 'about', label: 'About', icon: 'fas fa-user-secret' },
  { id: 'milestone', label: 'Milestones', icon: 'fas fa-shield-halved' },
  { id: 'skills', label: 'Skills', icon: 'fas fa-microchip' },
  { id: 'projects', label: 'Projects', icon: 'fas fa-terminal' },
  { id: 'achievements', label: 'Achieve', icon: 'fas fa-trophy' },
  { id: 'experience', label: 'Exp', icon: 'fas fa-briefcase' },
  { id: 'certifications', label: 'Certs', icon: 'fas fa-certificate' },
  { id: 'ctf', label: 'CTF', icon: 'fas fa-flag' },
  { id: 'contact', label: 'Contact', icon: 'fas fa-paper-plane' },
];

export default function Navbar() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredSection, setHoveredSection] = useState(null);

  const navMenuRef = useRef(null);
  const itemRefs = useRef({});
  const [pillStyle, setPillStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  // Sync theme with DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Scroll spy detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for Active Section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.25, rootMargin: '-80px 0px -40% 0px' }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Smooth Sliding Pill Position Updater
  const updatePillPosition = useCallback(() => {
    const targetId = hoveredSection || activeSection;
    const targetEl = itemRefs.current[targetId];

    if (navMenuRef.current && targetEl) {
      const menuRect = navMenuRef.current.getBoundingClientRect();
      const itemRect = targetEl.getBoundingClientRect();

      setPillStyle({
        left: itemRect.left - menuRect.left,
        top: itemRect.top - menuRect.top,
        width: itemRect.width,
        height: itemRect.height,
        opacity: 1,
      });
    } else {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [hoveredSection, activeSection]);

  useEffect(() => {
    updatePillPosition();
  }, [updatePillPosition]);

  // Handle Window Resize for Pill
  useEffect(() => {
    const handleResize = () => {
      updatePillPosition();
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [updatePillPosition]);

  // Smooth Scroll to Section
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 85;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    document.body.style.overflow = '';
    setTimeout(() => {
      scrollToSection(id);
      setActiveSection(id);
    }, 60);
  };

  // Lock body scroll when mobile menu open
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

  // Close mobile menu on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`smooth-mobile-backdrop ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Floating Island Header */}
      <header className={`smooth-nav-wrapper ${scrolled ? 'scrolled' : ''}`}>
        <nav
          className="smooth-nav-container"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <a
            href="#hero"
            className="smooth-nav-logo"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              document.body.style.overflow = '';
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveSection('hero');
              }, 60);
            }}
            aria-label="Pugazhenthi J - Return to top"
          >
            <span className="smooth-nav-logo-icon">
              <i className="fas fa-shield-halved" />
            </span>
            <span className="smooth-nav-logo-title">PUGAZHENTHI J</span>
            <span className="smooth-nav-status" title="System Online">
              <span className="smooth-status-ping" />
              <span className="smooth-status-dot" />
            </span>
          </a>

          {/* Desktop Smooth Sliding Dock */}
          <div className="smooth-nav-menu-wrapper">
            <ul
              className="smooth-nav-menu"
              ref={navMenuRef}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {/* Sliding highlight pill */}
              <li
                className="smooth-nav-pill-indicator"
                style={{
                  transform: `translate3d(${pillStyle.left}px, ${pillStyle.top}px, 0)`,
                  width: `${pillStyle.width}px`,
                  height: `${pillStyle.height}px`,
                  opacity: pillStyle.opacity,
                }}
                aria-hidden="true"
              />

              {sections.map(({ id, label }) => {
                const isActive = activeSection === id;
                return (
                  <li
                    key={id}
                    ref={(el) => (itemRefs.current[id] = el)}
                    className={`smooth-nav-item ${isActive ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredSection(id)}
                  >
                    <a
                      href={`#${id}`}
                      className="smooth-nav-link"
                      onClick={(e) => handleNavClick(e, id)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right Action Buttons */}
          <div className="smooth-nav-actions">
            <a
              href="/cyber_security-resiume.pdf"
              download="cyber_security-resiume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="smooth-resume-btn"
              title="Download Cybersecurity Resume"
            >
              <span>Resume</span>
              <i className="fas fa-download" />
            </a>

            <button
              type="button"
              className="smooth-theme-btn"
              onClick={toggleTheme}
              aria-label="Toggle Dark and Light theme"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'} />
            </button>

            <button
              type="button"
              className={`smooth-hamburger-btn ${menuOpen ? 'active' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`smooth-mobile-drawer ${menuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="smooth-mobile-links">
          {sections.map(({ id, label, icon }) => {
            const isActive = activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`smooth-mobile-link ${isActive ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, id)}
              >
                <i className={icon} />
                <span>{label}</span>
              </a>
            );
          })}
        </div>

        <div className="smooth-mobile-actions">
          <a
            href="/cyber_security-resiume.pdf"
            download="cyber_security-resiume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="smooth-mobile-resume-btn"
          >
            <i className="fas fa-file-arrow-down" />
            <span>Download Resume</span>
          </a>
        </div>
      </div>
    </>
  );
}
