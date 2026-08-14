export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="section-label reveal">Experience</div>
      <h2 className="section-title reveal">
        My journey<br />
        <span>so far.</span>
      </h2>
      <div className="exp-timeline reveal">
        <div className="exp-item current">
          <div className="exp-date">2 Years — Internship</div>
          <div className="exp-title">Web Developer · Stage Designer · Book Wrapper Designer</div>
          <div className="exp-company">Ilanthoodhu Student Magazine — AVC College (Autonomous), Mayiladuthurai</div>
          <p className="exp-desc">
            Worked with the Ilanthoodhu student magazine team at AVC College (Autonomous),
            contributing across web development, event stage design, and publication design.
          </p>
          <div className="exp-category">Web Development</div>
          <ul className="exp-responsibilities">
            <li>Built and maintained the magazine web platform</li>
            <li>Worked on web content and presentation</li>
          </ul>
          <div className="exp-category">Stage Design</div>
          <ul className="exp-responsibilities">
            <li>Planned stage setups for magazine launches</li>
            <li>Executed stage designs for college programs</li>
          </ul>
          <div className="exp-category">Publication Design</div>
          <ul className="exp-responsibilities">
            <li>Designed book wrappers for publications</li>
            <li>Created cover layouts for magazine editions</li>
          </ul>
        </div>
      </div>
      <div className="deco-label" style={{ marginTop: '20px' }}>[ SECURITY RESEARCH ]</div>
    </section>
  );
}
