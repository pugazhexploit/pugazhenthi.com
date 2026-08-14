export default function About() {
  return (
    <section id="about" className="section">
      <div className="section-label reveal">About</div>
      <h2 className="section-title reveal">
        Breaking systems.<br />
        Understanding threats.<br />
        <span>Building secure solutions.</span>
      </h2>
      <div className="about-inner">
        <div className="about-text reveal">
          <p>
            I am Pugazhenthi J, a B.Sc Computer Science student at AVC College (Autonomous),
            Mayiladuthurai, with a strong interest in <strong>cybersecurity</strong>, ethical hacking,
            penetration testing, web application security, OSINT, cryptography, digital forensics,
            network security, and AI-driven security systems.
          </p>
          <p>
            I actively participate in CTF competitions and practical cybersecurity challenges while
            building security-focused tools and automation systems.
          </p>
          <p>
            My work combines cybersecurity, Python development, AI, FastAPI, web technologies,
            Linux, and security automation.
          </p>
          <p>
            I am particularly interested in understanding how systems fail, identifying security
            weaknesses, and developing practical tools that help security learners and researchers.
          </p>
          <div className="about-mission">
            <span>Learn.</span>
            <span>Break.</span>
            <span>Build.</span>
            <span>Secure.</span>
          </div>
        </div>
        <div className="about-stats reveal">
          <div className="stat-box">
            <div className="stat-num">B.Sc CS</div>
            <div className="stat-label">2024 — 2027</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">2-Year</div>
            <div className="stat-label">Internship<br/>Ilanthoodhu Magazine</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">14th</div>
            <div className="stat-label">Chaitanya CTF</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">2nd</div>
            <div className="stat-label">TN Govt Youth<br/>Literary Festival</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">30-Day</div>
            <div className="stat-label">TryHackMe Streak</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">2nd</div>
            <div className="stat-label">TryHackMe<br/>Weekly League</div>
          </div>
        </div>
      </div>
      <div className="deco-label" style={{ marginTop: '40px' }}>[ ACCESS GRANTED ]</div>
    </section>
  );
}
