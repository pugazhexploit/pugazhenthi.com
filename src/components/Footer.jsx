export default function Footer() {
  return (
    <footer role="contentinfo" aria-label="Site footer" itemScope itemType="https://schema.org/WPFooter">
      <div className="footer-inner">
        <span className="footer-brand" itemProp="name">PUGAZHENTHI J <i className="fas fa-bug" style={{ fontSize: '0.8rem', marginLeft: '2px' }}></i></span>
        <span className="footer-tagline">CYBERSECURITY • ETHICAL HACKING • AI • CTF</span>
        <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
          <span itemProp="addressRegion">Tamil Nadu</span>, <span itemProp="addressCountry">India</span>
        </span>
        <span>© 2026 Pugazhenthi J. All rights reserved.</span>
      </div>
      <div className="footer-socials" aria-label="Social media links" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <a href="https://github.com/pugazhexploit" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="GitHub Profile">GitHub</a>
        <a href="https://in.linkedin.com/in/pugazhenthij-cyber" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="LinkedIn Profile">LinkedIn</a>
        <a href="https://tryhackme.com/p/pugazhenthij283" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="TryHackMe Profile">TryHackMe</a>
        <a href="mailto:pugazhenthij283@gmail.com" className="footer-social" aria-label="Email Pugazhenthi J">Email</a>
      </div>
    </footer>
  );
}
