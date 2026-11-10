import { useEffect, useRef, useState } from "react";
import {
  profile, projects, experiences, featuredAcademic, otherProjects,
  skills, education, certifications, languages,
} from "./data";


const nav = [
  ["apropos", "À propos"],
  ["projets", "Projets"],
  ["parcours", "Parcours"],
  ["competences", "Compétences"],
];

const roles = ["Développement web", "Intelligence artificielle", "Blockchain et sécurité", "Applications mobiles"];

const marquee = [
  "React", "FastAPI", "Python", "Java", "Jakarta EE", ".NET", "Flutter", "PostgreSQL",
  "MongoDB", "Solidity", "Machine Learning", "TALN", "Scrum", "DevOps",
];

/* ---------- hooks ---------- */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useGlow() {
  useEffect(() => {
    const move = (e) => {
      document.documentElement.style.setProperty("--mx", e.clientX + "px");
      document.documentElement.style.setProperty("--my", e.clientY + "px");
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
}

function useRotating(list, ms = 2400) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % list.length), ms);
    return () => clearInterval(t);
  }, [list, ms]);
  return list[i];
}

/* ---------- composants ---------- */
const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

function Title({ kicker, children }) {
  return (
    <div className="title reveal">
      <span className="kicker">{kicker}</span>
      <h2>{children}</h2>
    </div>
  );
}

/* Aperçu : capture locale si elle existe (public/projects/<nom>.png), sinon site en direct */
function Preview({ p }) {
  const slug = p.title.toLowerCase().replace(/\s+/g, "-");
  const [mode, setMode] = useState("img");
  const [scale, setScale] = useState(0.35);
  const wrap = useRef(null);

  useEffect(() => {
    if (!wrap.current) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / 1280));
    ro.observe(wrap.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrap} className="browser-view">
      {mode === "img" ? (
        <img
          src={`/projects/${slug}.png`}
          alt={`Aperçu de ${p.title}`}
          onError={() => setMode("iframe")}
        />
      ) : (
        <iframe
          src={p.url}
          title={`Aperçu de ${p.title}`}
          loading="lazy"
          tabIndex={-1}
          style={{ transform: `scale(${scale})` }}
        />
      )}
    </div>
  );
}

function ProjectCard({ p, i }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 9).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <a
      ref={ref}
      className="pcard reveal"
      href={p.url}
      target="_blank"
      rel="noreferrer"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="browser">
        <div className="browser-bar">
          <i /><i /><i />
          <span className="mono">{p.url.replace("https://", "").replace(/\/$/, "")}</span>
        </div>
        <Preview p={p} />
      </div>
      <div className="pbody">
        <div className="phead">
          <span className="pnum mono">{String(i + 1).padStart(2, "0")}</span>
          <h3>{p.title}</h3>
          <span className="pgo"><Arrow /></span>
        </div>
        <p>{p.description}</p>
        <div className="chips">
          {p.stack.map((s) => <span key={s} className="chip">{s}</span>)}
        </div>
      </div>
    </a>
  );
}

/* ---------- page ---------- */
export default function App() {
  const [open, setOpen] = useState(false);
  const role = useRotating(roles);
  useReveal();
  useGlow();

  const total = projects.length + featuredAcademic.length + otherProjects.length;

  return (
    <>
      <div className="aurora" aria-hidden="true">
        <span className="a1" /><span className="a2" /><span className="a3" />
      </div>
      <div className="cursor-glow" aria-hidden="true" />

      <header className="topbar">
        <a href="#top" className="brand">nada<span>.</span>tlili</a>
        <nav className={open ? "open" : ""}>
          {nav.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </nav>
        <a className="pill-cta" href="#contact">Contact</a>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span />
        </button>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="hero-text">
            <span className="status reveal"><i /> {profile.availability}</span>
            <h1 className="reveal">
              Nada <span className="grad">Tlili</span>
            </h1>
            <p className="rotator reveal">
              <span className="mono">/</span> <b key={role}>{role}</b>
            </p>
            <p className="statement reveal">{profile.statement}</p>
            <div className="actions reveal">
              <a className="btn primary" href="#projets">Découvrir mes projets <Arrow /></a>
              <a className="btn ghost" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>

          <div className="hero-visual reveal">
            <div className="ring" />
            <div className="arch">
              <img src="/nada.jpg" alt="Portrait de Nada Tlili" />
            </div>
            <span className="float f1">React</span>
            <span className="float f2">IA</span>
            <span className="float f3">FastAPI</span>
            <span className="float f4">Blockchain</span>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="marquee" aria-hidden="true">
          <div className="track">
            {[...marquee, ...marquee].map((m, i) => (
              <span key={i}>{m}<em>✦</em></span>
            ))}
          </div>
        </div>

        {/* À PROPOS : bento */}
        <section id="apropos" className="section">
          <Title kicker="À propos">Quelques mots <span className="grad">sur moi</span></Title>
          <div className="bento">
            <div className="b about reveal">
              {profile.about.map((t, i) => <p key={i}>{t}</p>)}
            </div>
            <div className="b stat reveal"><strong>3ᵉ</strong><span>année cycle ingénieur</span></div>
            <div className="b stat reveal"><strong>{total}</strong><span>projets réalisés</span></div>
            <div className="b stat alt reveal"><strong>{experiences.length}</strong><span>stages en entreprise</span></div>
            <div className="b langs reveal">
              <h4>Langues</h4>
              {languages.map((l) => (
                <div key={l.name}><span>{l.name}</span><em>{l.level}</em></div>
              ))}
            </div>
            <div className="b school reveal">
              <span className="mono">Établissement</span>
              <strong>{profile.school}</strong>
              <p>Génie Logiciel et Systèmes d'Information</p>
            </div>
            <div className="b avail reveal">
              <span className="mono">Recherche</span>
              <strong>Stage de PFE</strong>
              <p>À partir de février 2027</p>
            </div>
          </div>
        </section>

        {/* PROJETS */}
        <section id="projets" className="section">
          <Title kicker="Projets du module">Mes <span className="grad">réalisations</span></Title>
          <div className="pgrid">
            {projects.map((p, i) => <ProjectCard key={p.title} p={p} i={i} />)}
          </div>
        </section>

        {/* PARCOURS */}
        <section id="parcours" className="section">
          <Title kicker="Parcours">Expériences et <span className="grad">formation</span></Title>
          <div className="two-col">
            <div>
              <h3 className="col-title reveal">Expériences</h3>
              <div className="timeline">
                {experiences.map((e) => (
                  <article key={e.role} className="t-item reveal">
                    <span className="mono when">{e.period}</span>
                    <h4>{e.role}</h4>
                    <p className="org">{e.org}</p>
                    <p>{e.text}</p>
                    <div className="chips">
                      {e.stack.split(", ").map((s) => <span key={s} className="chip">{s}</span>)}
                    </div>
                  </article>
                ))}
                {featuredAcademic.map((a) => (
                  <article key={a.title} className="t-item reveal">
                    <span className="mono when">{a.year} · {a.tag}</span>
                    <h4>{a.title}</h4>
                    <div className="chips">
                      {a.stack.split(", ").map((s) => <span key={s} className="chip">{s}</span>)}
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <h3 className="col-title reveal">Formation</h3>
              <div className="timeline sky">
                {education.map((e) => (
                  <article key={e.period} className="t-item reveal">
                    <span className="mono when">{e.period}</span>
                    <p className="edu">{e.text}</p>
                  </article>
                ))}
              </div>
              <h3 className="col-title reveal" style={{ marginTop: 44 }}>Certifications</h3>
              <div className="certs">
                {certifications.map((c) => (
                  <div key={c.text} className="cert reveal">
                    <span className="mono">{c.year}</span>
                    <strong>{c.text}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h3 className="col-title reveal" style={{ marginTop: 70 }}>Autres projets académiques</h3>
          <div className="mini-grid">
            {otherProjects.map((p) => (
              <div key={p.title} className="mini reveal">
                <span className="mono">{p.year}</span>
                <strong>{p.title}</strong>
                <em>{p.stack}</em>
              </div>
            ))}
          </div>
        </section>

        {/* COMPÉTENCES */}
        <section id="competences" className="section">
          <Title kicker="Compétences">Ma <span className="grad">boîte à outils</span></Title>
          <div className="skills">
            {skills.map((s) => (
              <div key={s.group} className="skill reveal">
                <h4>{s.group}</h4>
                <div className="chips">
                  {s.items.split(", ").map((i) => <span key={i} className="chip">{i}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section">
          <div className="contact reveal">
            <span className="kicker">Contact</span>
            <h2>Travaillons <span className="grad">ensemble</span></h2>
            <p>Un stage, une collaboration, une question ? Je réponds avec plaisir.</p>
            <a className="mail" href={`mailto:${profile.email}`}>{profile.email}</a>
            <div className="actions center">
              <a className="btn primary" href={`mailto:${profile.email}`}>Envoyer un message <Arrow /></a>
              <a className="btn ghost" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a className="btn ghost" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
            </div>
            <span className="mono phone">{profile.phone}</span>
          </div>
        </section>
      </main>

      <footer className="footer" style={{center: true}}>
        <span>© {new Date().getFullYear()} Nada Tlili</span>
      </footer>
    </>
  );
}
