const projects = [
  {
    number: 'PROJECT 01',
    title: 'KALI MCP TERMINAL',
    subtitle: 'FastAPI Remote Shell + AI Cybersecurity Assistant',
    year: '2025',
    desc: 'Developed a FastAPI-powered Remote Shell System integrated with Gemini AI for cybersecurity tasks and CTF challenges through a web-based terminal interface.',
    features: ['Model Context Protocol communication', 'Web-based terminal', 'Real-time CTF support', 'Secure token authentication', 'Linux command execution', 'AI-assisted cybersecurity workflows'],
    tech: ['Gemini AI', 'FastAPI', 'Linux Terminal', 'HTML', 'CSS', 'JavaScript', 'Network Security'],
    purpose: 'Empower cybersecurity learners to practice Linux commands, solve CTF challenges, and automate selected pentesting workflows.',
    github: 'https://github.com/pugazhexploit/kali-mcp',
  },
  {
    number: 'PROJECT 02',
    title: 'AI-AGENT-SARA V2.0',
    subtitle: 'Telegram AI Cybersecurity & Automation Bot',
    year: '2025',
    desc: 'Built an intelligent Telegram bot using Google Gemini API and Python for cybersecurity learning assistance, automated email generation, and natural-language interaction.',
    features: ['Automated email letter generation', 'AI-powered email writing', 'Natural language interaction', 'Multi-command automation', 'Cybersecurity guidance', 'OSINT assistance'],
    tech: ['Python', 'Google Gemini API', 'Telegram Bot API', 'SMTP', 'Automation'],
    github: 'https://github.com/pugazhexploit/AI-agent-sara-cyber-security-',
    commands: ['/start', '/email'],
    deployment: ['Render', 'Replit', 'VPS'],
  },
  {
    number: 'PROJECT 03',
    title: 'RURALCARE-MAP-AI',
    subtitle: 'AI-Powered Geospatial Rural Healthcare Platform',
    year: '2025',
    achievement: '2nd Prize + ₹4,000 Cash Award — TN Govt Youth Literary Festival',
    desc: 'Developed an AI-driven geospatial healthcare platform designed to improve healthcare accessibility in rural Tamil Nadu.',
    features: ['Demographic data analysis', 'GIS mapping', 'Machine learning', 'Vulnerability scoring', 'Health-risk prediction', 'Ambulance routing optimization', 'Mobile clinic deployment', 'Emergency response planning'],
    tech: ['React.js', 'Python', 'Prompt Engineering', 'AI/ML', 'GIS Mapping'],
    recognition: 'Awarded 2nd Prize and ₹4,000 cash by District Collector Srikanth H.S.',
    github: 'https://github.com/pugazhexploit/Ruralcare-Map-AI',
  },
  {
    number: 'PROJECT 04',
    title: 'WEBPYS',
    subtitle: 'Web Pentesting, Vulnerability & Subdomain Scanner',
    year: '2025',
    desc: 'Built a Python-based passive reconnaissance and vulnerability scanning tool for web penetration testing and attack-surface mapping.',
    features: ['SSL analysis', 'HTTP header auditing', 'WAF detection', 'Subdomain enumeration', 'Nmap port scanning', 'Nuclei vulnerability scanning', 'TXT/HTML/XML reports'],
    tech: ['Python', 'Nmap', 'Nuclei', 'SSL/TLS', 'DNS Enumeration'],
    github: 'https://github.com/pugazhexploit/Webpys',
  },
  {
    number: 'PROJECT 05',
    title: 'IT WEBSITE & MAGAZINE PLATFORM',
    subtitle: 'Departmental Web Portal & Digital Publication',
    year: '2024–2025',
    desc: 'Engineered and launched the official interactive web platform for the department and student magazine, showcasing technical articles, event archives, and publication showcases.',
    features: ['Responsive UI architecture', 'Digital magazine edition viewer', 'Student publication archive', 'Department event management', 'Fast static rendering', 'Cybersecurity & tech aesthetics'],
    tech: ['React.js', 'HTML5', 'CSS3', 'JavaScript', 'Web Security', 'Git'],
    github: 'https://github.com/pugazhexploit/it-website',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="section-label reveal">Selected Projects</div>
      <h2 className="section-title reveal">
        Selected<br />
        <span>projects.</span>
      </h2>
      <p className="section-subtitle reveal">Building tools for security, automation and AI.</p>
      <div className="projects-grid">
        {projects.map((p, i) => (
          <div key={i} className="project-card reveal">
            <div className="project-header">
              <span className="project-number">{p.number}</span>
              <span className="project-year">{p.year}</span>
            </div>
            <div className="project-body">
              <h3 className="project-title">{p.title}</h3>
              <div className="project-subtitle">{p.subtitle}</div>
              {p.achievement && (
                <div className="project-achievement">🏆 {p.achievement}</div>
              )}
              <p className="project-desc">{p.desc}</p>
              <ul className="project-features">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="project-tech">
                {p.tech.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              {p.recognition && (
                <p className="project-desc" style={{ fontStyle: 'italic', color: 'var(--primary)', fontSize: '0.65rem' }}>
                  {p.recognition}
                </p>
              )}
              <div className="project-links">
                {p.github && (
                  <a href={p.github} target="_blank" rel="noopener noreferrer">
                    → GitHub
                  </a>
                )}
                {p.commands && (
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>
                    Commands: {p.commands.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '40px' }} className="reveal">
        <a href="https://github.com/pugazhexploit" target="_blank" rel="noopener noreferrer" className="btn-solid">
          → View All on GitHub
        </a>
      </div>
      <div className="deco-label" style={{ marginTop: '30px', textAlign: 'right' }}>[ TARGET: PORTFOLIO ]</div>
    </section>
  );
}
