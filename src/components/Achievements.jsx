const achievements = [
  {
    rank: 'GOV.IN',
    title: 'Responsible Vulnerability Disclosure',
    event: 'Indian Government (*.gov.in) Web Application',
    detail: 'Officially Acknowledged & Reference Number Assigned',
    tags: ['Reconnaissance', 'Security Assessment', 'Misconfigurations', 'Bug Researcher'],
  },
  {
    rank: '14th',
    title: 'Chaitanya CTF',
    event: '9,737+ Points',
    detail: '2025',
    tags: ['Web Security', 'Cryptography', 'OSINT', 'Forensics', 'Reverse Engineering'],
  },
  {
    rank: '2nd',
    title: 'Prompt Engineering Competition',
    event: 'Tamil Nadu Government Youth Literary Festival 2025',
    detail: '₹4,000 Cash Award',
  },
  {
    rank: '2nd',
    title: 'TryHackMe Weekly League',
    event: '816 Points',
    detail: '2 Gold Tickets',
  },
  {
    rank: '30-Day',
    title: 'TryHackMe Streak',
    event: 'Consistent daily practice across hacking rooms and challenges.',
    detail: 'Active Streak',
  },
  {
    rank: '1st',
    title: 'MIME Event — National Level',
    event: 'National Level Intercollegiate Meet',
    detail: 'Rabiyammal Ahmed Maideen College, Thiruvarur',
  },
];

export default function Achievements() {
  return (
    <section id="achievements" className="section">
      <div className="section-label reveal">Achievements</div>
      <h2 className="section-title reveal">
        Recognition<br />
        <span>earned.</span>
      </h2>
      <div className="achievements-grid">
        {achievements.map((a, i) => (
          <div key={i} className="achievement-card reveal">
            <div className="achievement-rank">{a.rank}</div>
            <div className="achievement-title">{a.title}</div>
            <div className="achievement-event">{a.event}</div>
            <div className="achievement-detail">{a.detail}</div>
            {a.tags && (
              <div className="achievement-tags">
                {a.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
