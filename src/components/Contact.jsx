export default function Contact() {
  return (
    <section id="contact" className="section">
      <div className="section-label reveal">Contact</div>
      <h2 className="section-title reveal">
        Let's build<br />
        <span>something secure.</span>
      </h2>
      <p className="section-subtitle reveal">
        Have an opportunity, cybersecurity project, collaboration, internship, or technical discussion? Let's connect.
      </p>
      <div className="contact-inner">
        <div className="contact-info reveal">
          <div className="contact-item">
            <div className="contact-item-icon">✉</div>
            <div>
              <div className="contact-label">Email</div>
              <div className="contact-value">
                <a href="mailto:pugazhenthij283@gmail.com">pugazhenthij283@gmail.com</a>
              </div>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-item-icon">📍</div>
            <div>
              <div className="contact-label">Location</div>
              <div className="contact-value">Chidambaram, Tamil Nadu, India</div>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-item-icon">📞</div>
            <div>
              <div className="contact-label">Phone</div>
              <div className="contact-value">
                <a href="tel:+918608442802">+91 8608442802</a>
              </div>
            </div>
          </div>
          <div className="contact-btns">
            <a href="mailto:pugazhenthij283@gmail.com" className="btn-solid">EMAIL ME</a>
            <a href="/cyber_security-resiume.pdf" download="cyber_security-resiume.pdf" target="_blank" rel="noopener noreferrer" className="btn-solid">DOWNLOAD RESUME ↓</a>
            <a href="https://github.com/pugazhexploit" target="_blank" rel="noopener noreferrer" className="btn-outline">GITHUB</a>
            <a href="https://linkedin.com/in/pugazh28" target="_blank" rel="noopener noreferrer" className="btn-outline">LINKEDIN</a>
            <a href="https://tryhackme.com/p/pugazhenthij283" target="_blank" rel="noopener noreferrer" className="btn-outline">TRYHACKME</a>
          </div>
        </div>
        <div className="contact-socials reveal">
          <div className="social-item">
            <a href="https://github.com/pugazhexploit" target="_blank" rel="noopener noreferrer" className="contact-social" title="GitHub">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            </a>
            <span className="contact-social-label">GitHub</span>
          </div>
          <div className="social-item">
            <a href="https://linkedin.com/in/pugazh28" target="_blank" rel="noopener noreferrer" className="contact-social" title="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <span className="contact-social-label">LinkedIn</span>
          </div>
          <div className="social-item">
            <a href="https://tryhackme.com/p/pugazhenthij283" target="_blank" rel="noopener noreferrer" className="contact-social" title="TryHackMe">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </a>
            <span className="contact-social-label">TryHackMe</span>
          </div>
          <div className="social-item">
            <a href="mailto:pugazhenthij283@gmail.com" className="contact-social" title="Email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
            </a>
            <span className="contact-social-label">Email</span>
          </div>
        </div>
      </div>
    </section>
  );
}
