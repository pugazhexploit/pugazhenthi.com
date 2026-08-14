export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <span className="footer-brand">PUGAZHENTHI J <i className="fas fa-bug" style={{ fontSize: '0.8rem', marginLeft: '2px' }}></i></span>
        <span className="footer-tagline">CYBERSECURITY • ETHICAL HACKING • AI • CTF</span>
        <span>Tamil Nadu, India</span>
        <span>© 2026 Pugazhenthi J</span>
      </div>
      <div className="footer-socials" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <a href="https://github.com/pugazhexploit" target="_blank" rel="noopener noreferrer" className="footer-social">GitHub</a>
        <a href="https://linkedin.com/in/pugazh28" target="_blank" rel="noopener noreferrer" className="footer-social">LinkedIn</a>
        <a href="https://tryhackme.com/p/pugazhenthij283" target="_blank" rel="noopener noreferrer" className="footer-social">TryHackMe</a>
        <a href="mailto:pugazhenthij283@gmail.com" className="footer-social">Email</a>
      </div>
    </footer>
  );
}
