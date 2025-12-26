const stepsData = [
  {
    step: 1,
    title: "Ignite Connections",
    focus: "Welcome, verify, and give everyone a crisp home to land on.",
    points: [
      "Simple alumni and student onboarding with verified access",
      "Clean profile set-up with interests and expertise tags",
      "Privacy-first defaults with role-aware visibility",
    ],
    icon: "fa-leaf",
  },
  {
    step: 2,
    title: "Spark Engagement",
    focus: "Lightweight interactions that build trust and momentum.",
    points: [
      "Topic spaces for discussions, polls, and announcements",
      "Event drops for meetups, webinars, and reunions",
      "Direct and group messaging with gentle prompts",
    ],
    icon: "fa-seedling",
  },
  {
    step: 3,
    title: "Create Impact",
    focus: "Channel the energy into outcomes that matter.",
    points: [
      "Mentorship pairings with check-ins and goals",
      "Job boards, referrals, and project collabs",
      "Recognition badges and highlight reels to celebrate wins",
    ],
    icon: "fa-tree",
  },
];

export default function AlumniHubRoadmap() {
  return (
    <>
      <style>{`
      :root {
        --bg: #ffffff;
        --panel: #f0f9f5;
        --panel-soft: #e8f5f0;
        --accent: #10b981;
        --accent-2: #059669;
        --text: #1f2937;
        --muted: #6b7280;
        --border: #d1f4e8;
        --panel-text: #064e3b;
        --panel-muted: #047857;
        --shadow: 0 18px 50px rgba(0, 0, 0, 0.08);
      }

      .roadmap-shell {
        min-height: 100vh;
        background: 
          radial-gradient(circle, #d1f4e8 1.5px, transparent 1.5px);
        background-size: 20px 20px;
        background-color: #ffffff;
        color: var(--text);
        padding: 48px 18px 72px;
        font-family: "Segoe UI", sans-serif;
      }

      .roadmap-header {
        text-align: center;
        max-width: 780px;
        margin: 0 auto 46px;
      }

      .roadmap-title {
        font-weight: 800;
        letter-spacing: 0.04em;
      }

      .roadmap-subtitle {
        color: var(--muted);
        margin-top: 12px;
        line-height: 1.6;
      }

      .timeline-wrap {
        background: 
          radial-gradient(circle, #d1f4e8 1.5px, transparent 1.5px);
        background-size: 20px 20px;
        background-color: #ffffff;
      }

      .timeline {
        display: flex;
        flex-direction: column;
        gap: 36px;
        max-width: 1100px;
        margin: 0 auto;
      }

      .timeline-row {
        position: relative;
        display: grid;
        grid-template-columns: 1fr;
        gap: 22px;
        align-items: center;
      }

      @media (min-width: 900px) {
        .timeline-row {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .timeline-row.flip {
          direction: rtl;
        }
        .timeline-row.flip > * {
          direction: ltr;
        }
      }

      .circle-col {
        display: flex;
        justify-content: center;
      }

      .circle-node {
        position: relative;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: linear-gradient(135deg, #e8f5f0 0%, #f0f9f5 50%, #e8f5f0 100%);
        border: 3px solid var(--accent);
        
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        overflow: visible;
        padding: 20px;
      }

      .circle-node::before {
        content: "";
        position: absolute;
        inset: 15px;
        border-radius: 50%;
        border: 2px solid rgba(16, 185, 129, 0.3);
        pointer-events: none;
      }

      .circle-icon {
        font-size: 4rem;
        color: var(--accent-2);
        margin-bottom: 8px;
        z-index: 10;
        position: relative;
        line-height: 1;
      }

      .circle-step {
        margin: 8px 0 4px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--panel-text);
        font-weight: 700;
        font-size: 0.75rem;
        z-index: 10;
        position: relative;
      }

      .circle-title {
        margin: 0;
        font-weight: 800;
        color: var(--panel-text);
        font-size: 1.1rem;
        z-index: 10;
        position: relative;
      }

      .card-panel {
        position: relative;
        background: linear-gradient(120deg, #ffffff, #f0f9f5);
        border: 2px solid var(--accent);
        border-radius: 26px;
        padding: 20px 22px;
        box-shadow: var(--shadow);
        transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
      }

      .card-panel:hover {
        transform: translateY(-4px);
        border-color: rgba(34, 197, 94, 0.55);
        box-shadow: 0 18px 40px rgba(34, 197, 94, 0.18);
      }

      .card-heading {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(34, 197, 94, 0.12);
        color: var(--accent);
        border: 1px solid rgba(34, 197, 94, 0.4);
        font-size: 0.8rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-weight: 700;
      }

      .title-block h5 {
        margin: 0;
        color: var(--panel-text);
        letter-spacing: 0.02em;
      }

      .card-focus {
        color: var(--panel-muted);
        margin: 10px 0 14px;
        line-height: 1.6;
      }

      .card-points {
        margin: 0;
        padding-left: 18px;
        color: var(--panel-muted);
        line-height: 1.6;
      }

      /* Utility fallbacks */
      .d-flex { display: flex; }
      `}</style>

      <div className="roadmap-shell">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #10B981 0%, #34d399 100%)',
            color: 'white',
            fontWeight: 600,
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.875rem',
            marginBottom: '16px',
          }}>
            Roadmap
          </div>
          <h1 style={{
            fontWeight: 800,
            marginBottom: '16px',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 16px 0',
          }}>
            Alumni Hub Roadmap
          </h1>
          <p style={{
            color: '#6b7280',
            marginTop: '16px',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto',
            fontSize: '1rem',
          }}>
            Three crisp milestones with alternating circles and cards, all in a lush green palette.
          </p>
        </div>

        <div className="timeline-wrap">
          <div className="timeline">
            {stepsData.map((item, idx) => {
              const flip = idx % 2 === 1;
              return (
                <section key={item.step} className={`timeline-row ${flip ? "flip" : ""}`}>
                  <div className="circle-col">
                    <div className="circle-node">
                      <div className="circle-icon">
                        <i className={`fa-solid ${item.icon}`}></i>
                      </div>
                      <p className="circle-step">Step {item.step}</p>
                      <h4 className="circle-title">{item.title}</h4>
                    </div>
                  </div>

                  <article className="card-panel">
                    <header className="card-heading">
                      <span className="pill">Milestone</span>
                      <div className="title-block">
                        <h5>{item.title}</h5>
                      </div>
                    </header>
                    <p className="card-focus">{item.focus}</p>
                    <ul className="card-points">
                      {item.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </article>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
