import { useState } from 'react';

const categories = {
  ALL: null,
  CYBERSECURITY: 'cyber',
  PROGRAMMING: 'prog',
  'FRAMEWORKS': 'frameworks',
  TOOLS: 'tools',
  'AI & ML': 'ai',
  CLOUD: 'cloud',
  OTHER: 'other',
};

const skills = [
  { name: 'Penetration Testing', icon: 'fas fa-crosshairs', cat: 'cyber', topics: ['Web Apps', 'Network', 'API Testing'] },
  { name: 'Ethical Hacking', icon: 'fas fa-user-secret', cat: 'cyber', topics: ['Exploitation', 'Recon', 'Privilege Escalation'] },
  { name: 'Web App Security', icon: 'fas fa-globe', cat: 'cyber', topics: ['OWASP Top 10', 'XSS/SQLi', 'Auth Bypass'] },
  { name: 'OSINT', icon: 'fas fa-search', cat: 'cyber', topics: ['Open Source Intel', 'Recon', 'Data Gathering'] },
  { name: 'Cryptography', icon: 'fas fa-lock', cat: 'cyber', topics: ['Encryption', 'Hash Cracking', 'PKI'] },
  { name: 'Digital Forensics', icon: 'fas fa-microscope', cat: 'cyber', topics: ['Evidence Analysis', 'Memory Forensics', 'Log Analysis'] },
  { name: 'Network Security', icon: 'fas fa-network-wired', cat: 'cyber', topics: ['Firewalls', 'IDS/IPS', 'Traffic Analysis'] },
  { name: 'CTF', icon: 'fas fa-flag', cat: 'cyber', topics: ['Web', 'Crypto', 'Forensics', 'RE'] },
  { name: 'Python', icon: 'fab fa-python', cat: 'prog', topics: ['Security Tools', 'Automation', 'FastAPI'] },
  { name: 'JavaScript', icon: 'fab fa-js', cat: 'prog', topics: ['Web Dev', 'DOM', 'Node.js'] },
  { name: 'HTML/CSS', icon: 'fab fa-html5', cat: 'prog', topics: ['Semantic HTML', 'Responsive', 'Layouts'] },
  { name: 'Bash/Linux', icon: 'fas fa-terminal', cat: 'prog', topics: ['Shell Scripting', 'Automation', 'Admin'] },
  { name: 'FastAPI', icon: 'fas fa-bolt', cat: 'frameworks', topics: ['REST APIs', 'Auth', 'WebSockets'] },
  { name: 'React.js', icon: 'fab fa-react', cat: 'frameworks', topics: ['Components', 'State', 'Hooks'] },
  { name: 'Telegram Bot API', icon: 'fas fa-robot', cat: 'frameworks', topics: ['Bot Dev', 'Automation', 'Commands'] },
  { name: 'GIS Mapping', icon: 'fas fa-map-marked-alt', cat: 'frameworks', topics: ['Geospatial', 'Data Viz', 'Mapping'] },
  { name: 'Google Gemini API', icon: 'fas fa-brain', cat: 'frameworks', topics: ['AI Integration', 'NLP', 'Prompts'] },
  { name: 'Kali Linux', icon: 'fab fa-linux', cat: 'tools', topics: ['Pentesting OS', 'Tool Suite', 'Workflows'] },
  { name: 'Nmap', icon: 'fas fa-radar', cat: 'tools', topics: ['Port Scanning', 'Service Detection', 'Scripts'] },
  { name: 'Nuclei', icon: 'fas fa-atom', cat: 'tools', topics: ['Vuln Scanning', 'Templates', 'Automation'] },
  { name: 'GitHub', icon: 'fab fa-github', cat: 'tools', topics: ['Version Control', 'CI/CD', 'Collaboration'] },
  { name: 'TryHackMe', icon: 'fas fa-shield-alt', cat: 'tools', topics: ['Learning Paths', 'CTF Rooms', 'Labs'] },
  { name: 'Prompt Engineering', icon: 'fas fa-comment-dots', cat: 'ai', topics: ['LLM Prompts', 'Chain of Thought', 'Fine-tuning'] },
  { name: 'Machine Learning', icon: 'fas fa-cogs', cat: 'ai', topics: ['Classification', 'NLP', 'Data Analysis'] },
  { name: 'Geospatial AI', icon: 'fas fa-satellite', cat: 'ai', topics: ['GIS + ML', 'Mapping', 'Prediction'] },
  { name: 'AWS', icon: 'fab fa-aws', cat: 'cloud', level: 'Beginner', topics: ['IAM', 'S3', 'CloudFront', 'EC2'] },
  { name: 'Token Auth', icon: 'fas fa-key', cat: 'other', topics: ['JWT', 'OAuth', 'API Keys'] },
  { name: 'Secure API Design', icon: 'fas fa-shield-alt', cat: 'other', topics: ['Input Validation', 'Rate Limiting', 'CORS'] },
  { name: 'Remote Shell', icon: 'fas fa-terminal', cat: 'other', topics: ['WebSocket Shell', 'Command Exec', 'Security'] },
  { name: 'Telegram Automation', icon: 'fas fa-paper-plane', cat: 'other', topics: ['Bots', 'Webhooks', 'Workflows'] },
];

export default function Skills() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [flippedCards, setFlippedCards] = useState(new Set());

  const filtered = activeFilter === 'ALL'
    ? skills
    : skills.filter((s) => s.cat === categories[activeFilter]);

  const toggleFlip = (index) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section id="skills" className="section">
      <div className="section-label reveal">Skills</div>
      <h2 className="section-title reveal">
        Weaponized<br />
        <span>skill matrix.</span>
      </h2>
      <div className="skills-filter reveal">
        {Object.keys(categories).map((cat) => (
          <button
            key={cat}
            className={activeFilter === cat ? 'active' : ''}
            onClick={() => { setActiveFilter(cat); setFlippedCards(new Set()); }}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="skills-grid">
        {filtered.map((skill, i) => (
          <div
            key={`${skill.name}-${i}`}
            className={`sk-card${flippedCards.has(i) ? ' flipped' : ''}`}
            onClick={() => toggleFlip(i)}
          >
            <div className="sk-inner">
              <div className="sk-front">
                <div className="sk-logo"><i className={skill.icon}></i></div>
                <div className="sk-name">{skill.name}</div>
                {skill.level && <div className="sk-level">{skill.level}</div>}
                <div className="sk-flip-hint">click ↻</div>
              </div>
              <div className="sk-back">
                <div className="sk-back-title">
                  {skill.name}
                  <span>{skill.cat === 'cyber' ? 'Security' : skill.cat === 'prog' ? 'Development' : skill.cat === 'frameworks' ? 'Framework' : skill.cat === 'tools' ? 'Platform' : skill.cat === 'ai' ? 'AI/ML' : skill.cat === 'cloud' ? 'Cloud' : 'Specialty'}</span>
                </div>
                <div className="sk-topics">
                  {skill.topics.map((t) => (
                    <div className="sk-topic" key={t}><span>{t}</span></div>
                  ))}
                </div>
                <div className="sk-close-hint">click ↺</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="deco-label" style={{ marginTop: '30px' }}>[ RECON MODE ]</div>
    </section>
  );
}
