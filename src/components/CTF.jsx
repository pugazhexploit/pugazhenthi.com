import CTFChallenge from './CTFChallenge';

export default function CTF() {
  const killChainSteps = ['RECON', 'ENUMERATION', 'EXPLOIT', 'PRIVESC', 'FORENSICS', 'FLAG CAPTURED'];
  const focusAreas = ['Web Security', 'Cryptography', 'OSINT', 'Forensics', 'Reverse Engineering', 'Steganography'];

  return (
    <section id="ctf" className="section">
      <div className="section-label reveal">CTF / Cyber Range</div>
      <h2 className="section-title reveal">
        Capture<br />
        <span>the flag.</span>
      </h2>

      <div className="ctf-profile reveal">
        <div>
          <div className="ctf-platform-name">TRYHACKME</div>
          <div className="ctf-status">● Active Participant</div>
          <div className="ctf-team">Team: <strong>Team ASTRA</strong></div>
          <div className="ctf-recognition">Weekly League Top Performer · 30-Day Streak</div>
        </div>
        <div>
          <a href="https://tryhackme.com/p/pugazhenthij283" target="_blank" rel="noopener noreferrer" className="btn-outline">
            View Profile →
          </a>
        </div>
      </div>

      <div className="kill-chain reveal">
        {killChainSteps.map((step, i) => (
          <div
            key={step}
            className={`kill-chain-step${i === killChainSteps.length - 1 ? ' captured' : ''}`}
          >
            {step}
          </div>
        ))}
      </div>

      <h3 className="ctf-focus-heading reveal">FOCUS AREAS</h3>
      <div className="ctf-focus-grid reveal">
        {focusAreas.map((area) => (
          <div key={area} className="ctf-focus-item">{area}</div>
        ))}
      </div>

      {/* Interactive CTF Challenge & Decoder Component */}
      <CTFChallenge />

      <div className="deco-label" style={{ marginTop: '30px' }}>[ CTF MODE ]</div>
    </section>
  );
}
