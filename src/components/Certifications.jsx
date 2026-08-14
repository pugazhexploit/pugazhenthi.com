const certs = [
  {
    number: '01',
    name: 'Certified Cybersecurity Educator Professional (CCEP)',
    issuer: 'Red Team Leaders',
    year: '2025',
  },
  {
    number: '02',
    name: 'TryHackMe — Active Learning Path Completion',
    issuer: 'TryHackMe',
    year: '2024–2025',
  },
  {
    number: '03',
    name: 'Certified Network Security Practitioner (CNSP)',
    issuer: 'The SecOps Group',
    year: '2025',
  },
];

export default function Certifications() {
  return (
    <section id="certifications" className="section">
      <div className="section-label reveal">Certifications</div>
      <h2 className="section-title reveal">
        Earned &amp;<br />
        <span>certified.</span>
      </h2>
      <div className="cert-grid">
        {certs.map((c, i) => (
          <div key={i} className="cert-card reveal">
            <div className="cert-number">{c.number}</div>
            <div className="cert-info">
              <div className="cert-name">{c.name}</div>
              <div className="cert-issuer">{c.issuer}</div>
              <div className="cert-year">{c.year}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
