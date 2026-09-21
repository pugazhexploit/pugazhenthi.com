const recognitions = [
  { icon: '🛡️', text: 'Indian Government (*.gov.in) Vulnerability Disclosure — Acknowledged' },
  { icon: '🏆', text: '14th Place — Chaitanya CTF' },
  { icon: '🥈', text: '2nd Prize — TN Govt Youth Literary Festival' },
  { icon: '🥈', text: '2nd Place — TryHackMe Weekly League' },
  { icon: '🥇', text: '1st Place — National Level MIME Event' },
  { icon: '🔥', text: '30-Day TryHackMe Streak' },
];

export default function Recognition() {
  return (
    <section id="recognition" className="section">
      <div className="section-label reveal">Recognition</div>
      <h2 className="section-title reveal">
        Milestones<br />
        <span>achieved.</span>
      </h2>
      <p className="recognition-intro reveal">
        Achievements earned through practical learning, cybersecurity competitions,
        projects, and technical experimentation.
      </p>
      <div className="recognition-grid">
        {recognitions.map((r, i) => (
          <div key={i} className="recognition-card reveal">
            <div className="recognition-icon">{r.icon}</div>
            <div className="recognition-text">{r.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
