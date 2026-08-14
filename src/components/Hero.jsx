import { useEffect, useRef, useState, lazy, Suspense } from 'react';

const LightRays = lazy(() => import('./LightRays'));
const Lanyard = lazy(() => import('./Lanyard'));

const roles = ['Cybersecurity Enthusiast', 'Bug Researcher', 'Ethical Hacker', 'Penetration Tester', 'CTF Player'];

export default function Hero() {
  const typingRef = useRef(null);
  const [theme, setTheme] = useState(() => 
    typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'dark' : 'dark'
  );

  // Sync theme changes from document attribute
  useEffect(() => {
    const updateTheme = () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(current);
    };

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    window.addEventListener('storage', updateTheme);
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', updateTheme);
    };
  }, []);

  // Typing animation
  useEffect(() => {
    const el = typingRef.current;
    if (!el) return;
    let wordIndex = 0, charIndex = 0, isDeleting = false, timeout;

    function type() {
      const word = roles[wordIndex];
      if (isDeleting) {
        charIndex--;
        el.textContent = word.substring(0, charIndex);
      } else {
        charIndex++;
        el.textContent = word.substring(0, charIndex);
      }
      let delay = isDeleting ? 40 : 80;
      if (!isDeleting && charIndex === word.length) { delay = 2000; isDeleting = true; }
      else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % roles.length; delay = 500; }
      timeout = setTimeout(type, delay);
    }
    timeout = setTimeout(type, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const isLight = theme === 'light';

  return (
    <section id="hero" className="hero">
      <Suspense fallback={null}>
        <LightRays
          raysOrigin="top-center"
          raysColor={isLight ? '#059669' : '#00ff41'}
          raysSpeed={isLight ? 1.0 : 1.2}
          lightSpread={isLight ? 0.9 : 0.85}
          rayLength={isLight ? 1.5 : 1.6}
          pulsating={true}
          fadeDistance={isLight ? 1.1 : 1.2}
          saturation={isLight ? 0.95 : 1.0}
          followMouse={true}
          mouseInfluence={0.15}
          noiseAmount={isLight ? 0.04 : 0.06}
          distortion={0.03}
          className="hero-light-rays"
        />
      </Suspense>
      <div className="hero-bg"></div>
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-label">CYBERSECURITY / ETHICAL HACKING / AI</div>
          <h1 className="hero-name" data-text="PUGAZHENTHI J">PUGAZHENTHI J</h1>
          <p className="hero-sub">
            <span ref={typingRef} id="typingText">Cybersecurity Enthusiast</span>
            <span className="typing-cursor"></span>
          </p>
          <div className="hero-statement">
            Breaking systems to understand them.<br />
            Building technology to secure them.
          </div>
          <p className="hero-intro">
            B.Sc Computer Science student focused on cybersecurity, ethical hacking,
            penetration testing, web security, AI-driven security tools, and CTF challenges.
          </p>
          <div className="hero-btns">
            <a href="#projects" className="btn-outline" onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}>VIEW PROJECTS</a>
            <a href="/cyber_security-resiume.pdf" download="cyber_security-resiume.pdf" target="_blank" rel="noopener noreferrer" className="btn-solid">DOWNLOAD RESUME ↓</a>
          </div>
          <div className="hero-socials">
            <a href="https://github.com/pugazhexploit" target="_blank" rel="noopener noreferrer" className="hero-social-icon" title="GitHub">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            </a>
            <a href="https://linkedin.com/in/pugazh28" target="_blank" rel="noopener noreferrer" className="hero-social-icon" title="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://tryhackme.com/p/pugazhenthij283" target="_blank" rel="noopener noreferrer" className="hero-social-icon" title="TryHackMe">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </a>
            <a href="mailto:pugazhenthij283@gmail.com" className="hero-social-icon" title="Email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
            </a>
          </div>
        </div>

        <div className="hero-lanyard-stage">
          <Suspense
            fallback={
              <div className="lanyard-skeleton" aria-hidden="true">
                <div className="lanyard-skeleton-strap"></div>
                <div className="lanyard-skeleton-card">
                  <img src="/profilepic.jpg" alt="Pugazhenthi J" className="lanyard-skeleton-img" width="220" height="300" />
                </div>
              </div>
            }
          >
            <Lanyard
              position={[0, -0.4, 12.5]}
              gravity={[0, -35, 0]}
              fov={20}
              frontImage="/profilepic.jpg"
              backImage="/profilepic.jpg"
              imageFit="cover"
              lanyardWidth={1.3}
            />
          </Suspense>
        </div>
      </div>
      <div className="deco-label" style={{ position: 'absolute', bottom: '30px', right: '60px' }}>[ SYSTEM ONLINE ]</div>
    </section>
  );
}
