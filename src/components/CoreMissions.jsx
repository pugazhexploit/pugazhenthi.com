export default function CoreMissions() {
  return (
    <section id="core-missions" className="section">
      <div className="section-label reveal">Core Missions</div>
      <h2 className="section-title reveal">
        Breaking. Building.<br />
        <span>Securing.</span>
      </h2>
      <div className="tt-grid">
        <div className="tt-card reveal">
          <div className="tt-number">01</div>
          <h3>OFFENSIVE SECURITY</h3>
          <div className="tt-subtitle">Penetration Testing & Exploitation</div>
          <div className="tt-tags">
            <span>Penetration Testing</span>
            <span>Ethical Hacking</span>
            <span>Web App Security</span>
            <span>CTF</span>
            <span>OSINT</span>
            <span>Cryptography</span>
            <span>Forensics</span>
            <span>Network Security</span>
          </div>
        </div>
        <div className="tt-card reveal">
          <div className="tt-number">02</div>
          <h3>SECURITY DEVELOPMENT</h3>
          <div className="tt-subtitle">Tools & Automation</div>
          <div className="tt-tags">
            <span>Python Security Tools</span>
            <span>FastAPI</span>
            <span>Security Automation</span>
            <span>Remote Shell Systems</span>
            <span>Secure API Design</span>
            <span>Token Auth</span>
            <span>Telegram Automation</span>
          </div>
        </div>
        <div className="tt-card reveal">
          <div className="tt-number">03</div>
          <h3>AI + CYBERSECURITY</h3>
          <div className="tt-subtitle">Intelligence & Automation</div>
          <div className="tt-tags">
            <span>Google Gemini API</span>
            <span>Prompt Engineering</span>
            <span>AI/ML</span>
            <span>Geospatial AI</span>
            <span>AI Security Automation</span>
            <span>Learning Assistants</span>
          </div>
        </div>
      </div>
      <div className="deco-label" style={{ marginTop: '30px', textAlign: 'right' }}>[ BUILD → BREAK → SECURE ]</div>
    </section>
  );
}
