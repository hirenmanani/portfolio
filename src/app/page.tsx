"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/* -------------------- Types -------------------- */
type Link = { label: string; href: string };

type Experience = {
  role: string;
  company: string;
  location?: string;
  dates: string;
  bullets: string[];
  tech: string[];
};

type Project = {
  name: string;
  tagline: string;
  problem: string;
  architecture: string;
  challenges: string[];
  results: string[];
  tech: string[];
  links: Link[];
  tags: ("Data" | "MLOps" | "Streaming" | "ML")[];
};

type CommandItem =
  | { type: "link"; label: string; hint?: string; href: string }
  | { type: "action"; label: string; hint?: string; onSelect: () => void };

/* -------------------- Data -------------------- */
const PROFILE = {
  name: "Hiren Manani",
  headline: "Data / ML Engineer",
  subhead: "Scalable ETL • MLOps • Deep Learning",
  valueProp:
    "I build production-grade data and ML systems: reliable pipelines, observable training, and warehouse-ready outputs—optimized for performance and measurable impact.",
  location: "Syracuse, NY",
  email: "hirenmanani25@gmail.com",
  resumeUrl: "/resume.pdf",
  github: "https://github.com/hirenmanani", // TODO
  linkedin: "https://www.linkedin.com/in/hirenmanani",
};

const SKILLS: Record<string, string[]> = {
  Languages: ["Python", "SQL", "JavaScript"],
  "Data Engineering": [
    "Airflow",
    "Spark",
    "Hadoop",
    "ETL/ELT",
    "Data Modeling",
    "Data Quality",
    "Feature Pipelines",
  ],
  "Streaming / Eventing": ["Kafka patterns", "Near real-time telemetry"],
  "ML/AI": ["PyTorch", "TensorFlow", "Scikit-learn", "OpenCV", "Evaluation", "PCA/Stats"],
  "Databases / Warehousing": ["BigQuery", "PostgreSQL", "MySQL", "MongoDB", "Snowflake"],
  "Cloud / DevOps": ["GCP", "AWS", "Azure", "Docker", "Kubernetes", "CI/CD"],
  Analytics: ["Tableau", "Looker", "Dashboards/KPIs"],
};

const EXPERIENCE: Experience[] = [
  {
    role: "Research Assistant — Organoid Image Analysis",
    company: "Syracuse University",
    location: "Syracuse, NY",
    dates: "Aug 2024 — Present",
    bullets: [
      "Built end-to-end data + ML pipelines for brightfield organoid analysis (PyTorch/TensorFlow), reaching 85%+ agreement vs manual annotations.",
      "Containerized training/inference with Docker; orchestrated production jobs via Kubernetes; improved GPU throughput including multi-GPU workflows.",
      "Created reproducible Airflow workflows for scheduled ETL + retraining; exported features to BigQuery/Postgres for analytics and dashboards.",
      "Applied PCA + experimental design to quantify phenotypes; documented methods and enforced data integrity across iterations.",
    ],
    tech: ["Python", "PyTorch", "TensorFlow", "Airflow", "Docker", "Kubernetes", "BigQuery", "Postgres", "OpenCV"],
  },
  {
    role: "Software Engineer (Data / ML Pipelines)",
    company: "Hackveda",
    location: "Remote",
    dates: "Dec 2023 — Mar 2024",
    bullets: [
      "Developed geospatial predictive pipelines with Spark/Hadoop; integrated outputs with BigQuery/Postgres for warehousing and analytics.",
      "Implemented ML + feature workflows in Dataiku DSS and Python, improving forecast accuracy by 22%; automated batch scoring via Airflow.",
      "Built streaming ingestion patterns for near real-time telemetry; surfaced KPIs in Tableau/Looker for stakeholders.",
      "Owned data modeling decisions (schemas, partitioning) and introduced CI practices for reliable deployments.",
    ],
    tech: ["Spark", "Hadoop", "Airflow", "Dataiku DSS", "Python", "BigQuery", "Postgres", "Tableau", "Looker"],
  },
  {
    role: "Software Engineer (Data Engineering)",
    company: "Phemesoft (IBM Platinum Business Partner)",
    location: "Remote",
    dates: "May 2023 — Jul 2023",
    bullets: [
      "Built tracking + analytics workflows in Python/Pandas, improving order processing and delivery efficiency by 14%.",
      "Ran Market Basket Analysis on 50,000+ transactions; drove 20% repeat purchases and 15% loyalty improvement.",
      "Optimized Tableau dashboards; reduced reporting turnaround to 1 day and improved decision cycles.",
      "Improved data quality via schema validation + cross-team troubleshooting.",
    ],
    tech: ["Python", "Pandas", "SQL", "ETL", "Tableau"],
  },
];

const PROJECTS: Project[] = [
  {
    name: "Organoid Brightfield Image Analysis Pipeline",
    tagline: "Reproducible training + deployment for phenotype quantification.",
    problem: "Manual organoid annotation is slow and inconsistent; we need scalable and reliable phenotype quantification.",
    architecture:
      "ETL → preprocessing → training (PyTorch/TensorFlow) → containerized inference → Kubernetes jobs; Airflow retraining; features to BigQuery/Postgres.",
    challenges: [
      "Reproducible pipelines + evaluation against manual labels.",
      "Operational GPU training/inference with Docker/Kubernetes (multi-GPU).",
      "Stable data contracts + monitoring-friendly exports.",
    ],
    results: [
      "85%+ agreement vs manual annotations.",
      "Automated ETL + retraining with warehouse-ready feature exports.",
    ],
    tech: ["Python", "PyTorch", "TensorFlow", "Airflow", "Docker", "Kubernetes", "BigQuery", "Postgres"],
    links: [
      { label: "LinkedIn", href: PROFILE.linkedin },
      { label: "Email", href: `mailto:${PROFILE.email}` },
    ],
    tags: ["ML", "MLOps", "Data"],
  },
  {
    name: "Geospatial Forecasting at Scale (Spark/Hadoop)",
    tagline: "Distributed batch + ML scoring feeding cloud warehouses + BI.",
    problem: "Geospatial prediction requires scalable compute + reliable warehouse outputs for reporting.",
    architecture:
      "Spark/Hadoop batch → feature pipeline + ML scoring (Dataiku/Python) → BigQuery/Postgres → Tableau/Looker; Airflow schedules.",
    challenges: [
      "Schema contracts into warehouse.",
      "Reliable batch scoring orchestration.",
      "Partitioning strategies for performance.",
    ],
    results: ["22% forecast accuracy improvement.", "Stakeholder-ready KPI reporting from curated tables."],
    tech: ["Spark", "Hadoop", "Airflow", "Python", "BigQuery", "Postgres", "Tableau", "Looker"],
    links: [
      { label: "GitHub", href: PROFILE.github },
      { label: "LinkedIn", href: PROFILE.linkedin },
    ],
    tags: ["Data", "ML"],
  },
  {
    name: "Streaming Telemetry Patterns (Kafka)",
    tagline: "Near real-time ingestion patterns with observable outputs.",
    problem: "Stakeholders need near real-time signals; batch-only pipelines introduce latency and blind spots.",
    architecture:
      "Event ingestion → validation + enrichment → durable topics/partitions → sink to warehouse + BI dashboards; alerting on lag/errors.",
    challenges: ["Idempotent processing patterns.", "Schema evolution considerations.", "Operational visibility (lag, failures)."],
    results: ["Reduced freshness lag for key metrics; enabled near real-time dashboards and operational alerting."],
    tech: ["Kafka", "Python", "Data Contracts", "Monitoring"],
    links: [{ label: "Email", href: `mailto:${PROFILE.email}` }],
    tags: ["Streaming", "Data"],
  },
  {
    name: "Chronic Kidney Disease Prediction",
    tagline: "ML classification with threshold tuning to reduce false positives.",
    problem: "Predict CKD risk from clinical indicators while reducing unnecessary false positives.",
    architecture:
      "Cleaning → features → Logistic Regression/Random Forest → cross-val → threshold calibration → metrics + error analysis.",
    challenges: ["Small dataset validation discipline.", "Threshold tuning + error analysis.", "Reproducible pipeline + reporting."],
    results: ["92% accuracy; 15% reduction in false positives vs baseline."],
    tech: ["Python", "Scikit-learn", "Pandas", "NumPy"],
    links: [{ label: "LinkedIn", href: PROFILE.linkedin }],
    tags: ["ML"],
  },
];

const EDUCATION = {
  degree: "M.S. in Computer Science",
  school: "Syracuse University",
  grad: "May 2026",
  coursework: ["Algorithms", "Machine Learning", "Operating Systems", "Computer Architecture"],
};

const ACHIEVEMENTS = [
  "Google Professional Data Engineer (Certification).",
  "Hackathon 2023 — Ambiora SVKM Mukesh Patel Technology Park.",
  "IBM ICE DAY — Technical Poster Competition.",
  "Volunteer — Vineyard Church, Syracuse (Logistics & Outreach), Sep 2024 – Present.",
];

/* -------------------- Motion helpers -------------------- */
const fade = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.10 } } };

function MotionSection({ id, children }: { id: string; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      variants={reduce ? undefined : stagger}
      className="mt-20 scroll-mt-28"
    >
      {children}
    </motion.section>
  );
}

/* -------------------- Active section observer -------------------- */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] || "");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (best?.target?.id) setActive(best.target.id);
      },
      { threshold: [0.16, 0.24, 0.32], rootMargin: "-12% 0px -70% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

/* -------------------- Theme -------------------- */
function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const initial =
      (saved as "light" | "dark" | null) ||
      (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };
  return { theme, toggle };
}

/* -------------------- Count up -------------------- */
function useCountUp(target: number, durationMs = 900) {
  const [v, setV] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    let raf = 0;
    const tick = (t: number) => {
      if (startRef.current == null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return v;
}

function MetricCard({
  label,
  valueText,
  targetNumber,
  suffix,
  detail,
  tint,
}: {
  label: string;
  valueText?: string;
  targetNumber?: number;
  suffix?: string;
  detail: string;
  tint: "indigo" | "cyan" | "fuchsia" | "amber";
}) {
  const reduce = useReducedMotion();
  const n = targetNumber != null ? useCountUp(targetNumber, 950) : 0;

  const tintMap: Record<typeof tint, string> = {
    indigo: "from-indigo-500/18 via-white/[0.03] to-cyan-500/10",
    cyan: "from-cyan-500/16 via-white/[0.03] to-indigo-500/10",
    fuchsia: "from-fuchsia-500/16 via-white/[0.03] to-indigo-500/10",
    amber: "from-amber-400/14 via-white/[0.03] to-fuchsia-500/10",
  };

  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-gradient-to-br p-4",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
        "transition hover:-translate-y-1 hover:border-white/20",
        tintMap[tint],
      ].join(" ")}
    >
      <div className="text-xs font-semibold tracking-widest text-zinc-300">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">
        {valueText ? valueText : reduce ? `${targetNumber}${suffix ?? ""}` : `${n}${suffix ?? ""}`}
      </div>
      <div className="mt-1 text-sm text-zinc-200">{detail}</div>
    </div>
  );
}

/* -------------------- Command palette -------------------- */
function CommandPalette({
  open,
  onClose,
  items,
}: {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) => it.label.toLowerCase().includes(s) || (it.hint ?? "").toLowerCase().includes(s));
  }, [q, items]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl"
            initial={{ y: 16, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 16, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="border-b border-white/10 p-4">
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search… (Work, Experience, Stack, Contact, Resume)"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-white/20"
              />
              <div className="mt-2 text-xs text-zinc-500">
                Tip: Press <span className="rounded border border-white/10 px-1.5 py-0.5">Esc</span> to close
              </div>
            </div>

            <div className="max-h-[340px] overflow-auto p-2">
              {filtered.map((it) => (
                <button
                  key={it.label + (it.type === "link" ? it.href : "")}
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm text-zinc-200 hover:bg-white/[0.06]"
                  onClick={() => {
                    onClose();
                    if (it.type === "link") {
                      if (it.href.startsWith("#")) window.location.hash = it.href.replace("#", "");
                      else window.location.href = it.href;
                    } else it.onSelect();
                  }}
                >
                  <span className="font-medium text-white">{it.label}</span>
                  {it.hint ? <span className="text-xs text-zinc-500">{it.hint}</span> : null}
                </button>
              ))}
              {!filtered.length ? <div className="px-4 py-8 text-center text-sm text-zinc-500">No results.</div> : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* -------------------- Marquee pills -------------------- */
function MarqueePills({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur">
      <div className="marquee-track gap-2">
        {loop.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-sm font-medium text-zinc-100 shadow-sm transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* -------------------- Tilt Card (projects) -------------------- */
function TiltCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 220, damping: 18 });
  const sy = useSpring(ry, { stiffness: 220, damping: 18 });

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0..1
      const py = (e.clientY - r.top) / r.height; // 0..1
      const rotY = (px - 0.5) * 10; // left/right
      const rotX = -(py - 0.5) * 10; // up/down
      rx.set(rotX);
      ry.set(rotY);
    };

    const onLeave = () => {
      rx.set(0);
      ry.set(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce, rx, ry]);

  return (
    <motion.div
      ref={ref}
      style={reduce ? undefined : { rotateX: sx, rotateY: sy, transformStyle: "preserve-3d" as any }}
      className={["will-change-transform", className].join(" ")}
    >
      <div className="relative">{children}</div>
    </motion.div>
  );
}

/* -------------------- Section Rail (sticky left) -------------------- */
function SectionRail({
  sections,
  active,
}: {
  sections: { id: string; label: string }[];
  active: string;
}) {
  return (
    <aside className="pointer-events-none fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 2xl:block">
      <div className="pointer-events-auto flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
        <div className="text-xs font-semibold tracking-widest text-zinc-400">SECTIONS</div>
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={[
                "group relative rounded-2xl px-4 py-3 text-sm font-semibold transition",
                isActive ? "text-white" : "text-zinc-300 hover:text-white",
              ].join(" ")}
            >
              {isActive ? (
                <motion.span
                  layoutId="rail"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/25 via-cyan-500/20 to-fuchsia-500/25"
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                />
              ) : null}
              <span className="relative font-mono tracking-wide">{s.label}</span>
              <span className="relative block text-xs font-normal text-zinc-400 group-hover:text-zinc-300">
                #{s.id}
              </span>
            </a>
          );
        })}
      </div>
    </aside>
  );
}

/* -------------------- Main Page -------------------- */
export default function Page() {
  const { toggle } = useTheme();

  const navLinks = useMemo<Link[]>(
    () => [
      { label: "Work", href: "#projects" },
      { label: "Experience", href: "#experience" },
      { label: "Stack", href: "#skills" },
      { label: "Education", href: "#education" },
      { label: "Contact", href: "#contact" },
    ],
    []
  );

  const sections = useMemo(
    () => [
      { id: "projects", label: "WORK" },
      { id: "experience", label: "EXPERIENCE" },
      { id: "skills", label: "STACK" },
      { id: "education", label: "EDUCATION" },
      { id: "contact", label: "CONTACT" },
    ],
    []
  );

  const active = useActiveSection(sections.map((s) => s.id));

  const [filter, setFilter] = useState<"All" | "Data" | "MLOps" | "Streaming" | "ML">("All");
  const filteredProjects = useMemo(() => {
    if (filter === "All") return PROJECTS;
    return PROJECTS.filter((p) => p.tags.includes(filter));
  }, [filter]);

  // command palette
  const [cmdOpen, setCmdOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isCmdK) {
        e.preventDefault();
        setCmdOpen(true);
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        const el = document.activeElement as HTMLElement | null;
        const isTyping = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA");
        if (!isTyping) {
          e.preventDefault();
          setCmdOpen(true);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const commandItems: CommandItem[] = [
    { type: "link", label: "Work (Projects)", hint: "Jump to projects", href: "#projects" },
    { type: "link", label: "Experience", hint: "Impact bullets", href: "#experience" },
    { type: "link", label: "Tech Stack", hint: "Skills grid", href: "#skills" },
    { type: "link", label: "Education", hint: "Coursework + achievements", href: "#education" },
    { type: "link", label: "Contact", hint: "Email + form", href: "#contact" },
    { type: "link", label: "Open Resume", hint: "PDF", href: PROFILE.resumeUrl },
    { type: "action", label: "Toggle Theme", hint: "Dark / Light", onSelect: toggle },
  ];

  // hero marquee that slides on scroll
  const { scrollY } = useScroll();
  const marqueeX = useTransform(scrollY, [0, 900], [0, -260]); // subtle
  const marqueeOpacity = useTransform(scrollY, [0, 350], [0.55, 0.12]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 antialiased">
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} items={commandItems} />
      <SectionRail sections={sections} active={active} />

      {/* Colorful background (NOT all black) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-950" />
        <div className="absolute -top-56 left-1/2 h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-indigo-500/18 blur-3xl" />
        <div className="absolute top-[34vh] right-[-260px] h-[620px] w-[620px] rounded-full bg-cyan-500/18 blur-3xl" />
        <div className="absolute bottom-[-280px] left-[-220px] h-[720px] w-[720px] rounded-full bg-fuchsia-500/16 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="noise" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/55 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="group inline-flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-white/90 shadow-[0_0_26px_rgba(99,102,241,0.35)]" />
            <div className="leading-tight">
              <div className="text-base font-semibold tracking-tight">{PROFILE.name}</div>
              <div className="hidden text-sm text-zinc-300 md:block">
                {PROFILE.headline} · {PROFILE.subhead}
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((l) => {
              const id = l.href.replace("#", "");
              const isActive = active === id;
              return (
                <a key={l.href} href={l.href} className="relative text-sm font-medium text-zinc-200 hover:text-white">
                  {l.label}
                  <span
                    className={[
                      "absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-indigo-400 via-cyan-300 to-fuchsia-300 transition-opacity",
                      isActive ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCmdOpen(true)}
              className="hidden rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-zinc-100 transition hover:border-white/20 hover:bg-white/[0.08] md:inline-flex"
              aria-label="Open command palette"
            >
              ⌘K
            </button>

            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={PROFILE.resumeUrl}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 shadow-sm transition hover:shadow-md"
            >
              View Resume
            </motion.a>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggle}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-white/20 hover:bg-white/[0.08]"
              aria-label="Toggle theme"
            >
              Theme
            </motion.button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-28 pt-10 md:pt-16">
        {/* HERO */}
        <motion.section initial="hidden" animate="show" variants={stagger} className="relative">
          {/* Big sliding marquee text (Harnoor-inspired) */}
          <motion.div
            aria-hidden
            style={{ x: marqueeX, opacity: marqueeOpacity }}
            className="pointer-events-none absolute -top-10 left-0 right-0 select-none overflow-hidden"
          >
            <div className="whitespace-nowrap text-[72px] font-semibold tracking-tight text-white/10 md:text-[110px]">
              <span className="mr-10">{PROFILE.headline}</span>
              <span className="mr-10">{PROFILE.subhead}</span>
              <span className="mr-10">{PROFILE.headline}</span>
              <span className="mr-10">{PROFILE.subhead}</span>
            </div>
          </motion.div>

          <motion.div
            variants={fade}
            className="relative overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-indigo-500/14 via-white/[0.04] to-cyan-500/12 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur md:p-12"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(244,114,182,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.12),transparent_40%)]" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-200/90">
                <span>{PROFILE.location}</span>
                <span className="text-white/30">•</span>
                <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-zinc-100">
                  Open to 2026 Full-Time
                </span>
                <span className="text-white/30">•</span>
                <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-zinc-100">
                  Press ⌘K
                </span>
              </div>

              <h1 className="mt-5 text-5xl font-semibold tracking-tight text-white md:text-7xl">
                {PROFILE.headline}
                <span className="block text-zinc-100/85 md:mt-2">{PROFILE.subhead}</span>
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-50/90 md:text-xl">
                {PROFILE.valueProp}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href={PROFILE.resumeUrl}
                  className="rounded-2xl bg-white px-6 py-3 text-base font-semibold text-zinc-950 shadow-sm transition hover:shadow-md"
                >
                  View Resume
                </motion.a>

                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href="#contact"
                  className="rounded-2xl border border-white/15 bg-white/[0.05] px-6 py-3 text-base font-semibold text-white transition hover:bg-white/[0.10]"
                >
                  Contact
                </motion.a>

                <div className="flex items-center gap-4 pl-2 text-base text-zinc-100/80">
                  <a className="hover:text-white" href={PROFILE.linkedin}>LinkedIn</a>
                  <span className="text-white/30">•</span>
                  <a className="hover:text-white" href={`mailto:${PROFILE.email}`}>Email</a>
                  <span className="text-white/30">•</span>
                  <a className="hover:text-white" href={PROFILE.github}>GitHub</a>
                </div>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-4">
                <MetricCard tint="indigo" label="Impact" valueText="85%+" detail="Agreement vs manual annotations" />
                <MetricCard tint="cyan" label="Forecasting" targetNumber={22} suffix="%" detail="Improved prediction accuracy" />
                <MetricCard tint="fuchsia" label="Ops" valueText="MLOps" detail="Docker + Kubernetes + Airflow" />
                <MetricCard tint="amber" label="Warehouse" valueText="BQ/PG" detail="BigQuery + Postgres exports" />
              </div>

              <MarqueePills
                items={[
                  "Airflow orchestration",
                  "Kubernetes ML jobs",
                  "Spark/Hadoop",
                  "BigQuery/Postgres",
                  "Data contracts",
                  "Model retraining",
                  "Monitoring-ready",
                ]}
              />
            </div>
          </motion.div>
        </motion.section>

        {/* ABOUT */}
        <MotionSection id="about">
          <motion.div variants={fade}>
            <SectionLabel text="ABOUT_ME" />
            <SectionTitle
              title="Builder mindset. Production standards."
              subtitle="I like ownership—reliable pipelines, observable training, and warehouse-ready outputs. Clean data contracts and measurable results."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <TintCard tint="indigo" title="Focus" body="Data-to-AI lifecycle: ingestion → warehouse → orchestration → training → deployment." />
              <TintCard tint="cyan" title="Strength" body="Systems thinking: performance, reliability, reproducibility, and clean interfaces." />
              <TintCard tint="fuchsia" title="Style" body="Fast iteration with high standards: metrics, monitoring, and documented decisions." />
            </div>
          </motion.div>
        </MotionSection>

        {/* PROJECTS */}
        <MotionSection id="projects">
          <motion.div variants={fade} className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel text="WORK_I'M_PROUD_OF" />
              <SectionTitle title="Projects that read like case studies." subtitle="Filter by area. Expand for architecture and outcomes." />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(["All", "Data", "MLOps", "Streaming", "ML"] as const).map((t) => {
                const isActive = filter === t;
                return (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={[
                      "relative rounded-full border px-4 py-2 text-sm font-semibold transition",
                      isActive
                        ? "border-white/25 bg-white/[0.10] text-white"
                        : "border-white/10 bg-white/[0.04] text-zinc-200 hover:border-white/20 hover:bg-white/[0.08]",
                    ].join(" ")}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="pill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/25 via-cyan-500/20 to-fuchsia-500/25"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    ) : null}
                    <span className="relative">{t}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={fade} className="mt-10 grid gap-4">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p) => (
                <ProjectCard key={p.name} p={p} />
              ))}
            </AnimatePresence>
          </motion.div>
        </MotionSection>

        {/* EXPERIENCE */}
        <MotionSection id="experience">
          <motion.div variants={fade}>
            <SectionLabel text="WORK_EXPERIENCE" />
            <SectionTitle title="Impact-first bullets." subtitle="Problem → solution → measurable outcome, with tooling signal." />
          </motion.div>

          <motion.div variants={fade} className="mt-10 grid gap-4">
            {EXPERIENCE.map((e) => (
              <HoverCard key={`${e.role}-${e.company}`} tint="cyan">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-white">
                      {e.role} <span className="text-zinc-200/70">· {e.company}</span>
                    </h3>
                    <p className="mt-1 text-sm text-zinc-200/60">
                      {e.location ? `${e.location} · ` : ""}
                      {e.dates}
                    </p>
                  </div>
                </div>

                <ul className="mt-5 space-y-3 text-base leading-relaxed text-zinc-100/90">
                  {e.bullets.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span className="mt-3 h-1.5 w-1.5 flex-none rounded-full bg-white/40" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2">
                  {e.tech.map((t) => (
                    <span key={t} className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-sm text-zinc-100">
                      {t}
                    </span>
                  ))}
                </div>
              </HoverCard>
            ))}
          </motion.div>
        </MotionSection>

        {/* SKILLS */}
        <MotionSection id="skills">
          <motion.div variants={fade}>
            <SectionLabel text="TECH_STACK" />
            <SectionTitle title="Depth over buzzwords." subtitle="Bigger type, cleaner scan, stronger grouping." />
          </motion.div>

          <motion.div variants={fade} className="mt-10 grid gap-4 md:grid-cols-2">
            {Object.entries(SKILLS).map(([k, items], idx) => (
              <HoverCard key={k} tint={idx % 3 === 0 ? "indigo" : idx % 3 === 1 ? "fuchsia" : "cyan"}>
                <div className="text-lg font-semibold text-white">{k}</div>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {items.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-sm font-medium text-zinc-100 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.10]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </HoverCard>
            ))}
          </motion.div>
        </MotionSection>

        {/* EDUCATION */}
        <MotionSection id="education">
          <motion.div variants={fade}>
            <SectionLabel text="EDUCATION" />
            <SectionTitle title={`${EDUCATION.degree} · ${EDUCATION.school}`} subtitle={`Graduating ${EDUCATION.grad}`} />
          </motion.div>

          <motion.div variants={fade} className="mt-10 grid gap-4 md:grid-cols-2">
            <HoverCard tint="indigo">
              <div className="text-lg font-semibold text-white">Relevant coursework</div>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {EDUCATION.coursework.map((c) => (
                  <span key={c} className="rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-sm text-zinc-100">
                    {c}
                  </span>
                ))}
              </div>
            </HoverCard>

            <HoverCard tint="fuchsia">
              <div className="text-lg font-semibold text-white">Achievements</div>
              <ul className="mt-4 space-y-3 text-base text-zinc-100/90">
                {ACHIEVEMENTS.map((a) => (
                  <li key={a} className="flex gap-3">
                    <span className="mt-3 h-1.5 w-1.5 flex-none rounded-full bg-white/40" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </HoverCard>
          </motion.div>
        </MotionSection>

        {/* CONTACT */}
        <MotionSection id="contact">
          <motion.div variants={fade}>
            <SectionLabel text="GET_IN_TOUCH" />
            <SectionTitle title="Let’s talk." subtitle="Best way: email. I reply fast." />
          </motion.div>

          <motion.div variants={fade} className="mt-10 grid gap-4 md:grid-cols-2">
            <HoverCard tint="cyan">
              <div className="space-y-4 text-base text-zinc-100/90">
                <p>
                  <span className="font-semibold text-white">Email:</span>{" "}
                  <a className="underline underline-offset-4 hover:text-white" href={`mailto:${PROFILE.email}`}>
                    {PROFILE.email}
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-white">LinkedIn:</span>{" "}
                  <a className="underline underline-offset-4 hover:text-white" href={PROFILE.linkedin}>
                    {PROFILE.linkedin}
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-white">GitHub:</span>{" "}
                  <a className="underline underline-offset-4 hover:text-white" href={PROFILE.github}>
                    {PROFILE.github}
                  </a>
                </p>
              </div>
            </HoverCard>

            <HoverCard tint="indigo">
              <form
                className="grid gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Hook this form to Formspree / Resend / a Next.js API route.");
                }}
              >
                <Field label="Name" name="name" placeholder="Jane Recruiter" />
                <Field label="Email" name="email" placeholder="jane@company.com" type="email" />
                <div>
                  <label className="text-sm font-semibold text-white">Message</label>
                  <textarea
                    name="message"
                    placeholder="What role are you hiring for?"
                    className="mt-2 min-h-[140px] w-full rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-base text-zinc-100 outline-none placeholder:text-zinc-200/40 focus:border-white/25 focus:bg-white/[0.08]"
                  />
                </div>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="rounded-2xl bg-white px-6 py-3 text-base font-semibold text-zinc-950 shadow-sm transition hover:shadow-md"
                >
                  Send Message
                </motion.button>
              </form>
            </HoverCard>
          </motion.div>
        </MotionSection>
      </main>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 text-sm text-zinc-300/70">
          <p>© {new Date().getFullYear()} {PROFILE.name}. Built with Next.js.</p>
          <p className="text-xs">⌘K • rail • tilt • scroll marquee • color gradients</p>
        </div>
      </footer>
    </div>
  );
}

/* -------------------- UI Components -------------------- */
function SectionLabel({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold tracking-widest text-zinc-100/80">
      <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
      <span className="font-mono">{text}</span>
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mt-4">
      <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 max-w-3xl text-lg leading-relaxed text-zinc-100/85">{subtitle}</p> : null}
    </div>
  );
}

function tintBg(tint: "indigo" | "cyan" | "fuchsia") {
  if (tint === "indigo") return "from-indigo-500/14 via-white/[0.04] to-cyan-500/10";
  if (tint === "cyan") return "from-cyan-500/14 via-white/[0.04] to-indigo-500/10";
  return "from-fuchsia-500/14 via-white/[0.04] to-indigo-500/10";
}

function HoverCard({
  children,
  tint = "indigo",
}: {
  children: React.ReactNode;
  tint?: "indigo" | "cyan" | "fuchsia";
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={[
        "relative overflow-hidden rounded-[28px] border border-white/10 p-6 backdrop-blur",
        "bg-gradient-to-br shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
        tintBg(tint),
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100">
        <div className="absolute -top-24 left-1/2 h-48 w-[620px] -translate-x-1/2 rounded-full bg-white/10 blur-2xl" />
      </div>
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function TintCard({
  tint,
  title,
  body,
}: {
  tint: "indigo" | "cyan" | "fuchsia";
  title: string;
  body: string;
}) {
  return (
    <HoverCard tint={tint}>
      <div className="text-sm font-semibold tracking-widest text-zinc-200/80">{title.toUpperCase()}</div>
      <div className="mt-3 text-lg leading-relaxed text-zinc-50/90">{body}</div>
    </HoverCard>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-white">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-base text-zinc-100 outline-none placeholder:text-zinc-200/40 focus:border-white/25 focus:bg-white/[0.08]"
      />
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group relative"
    >
      <TiltCard className="perspective-[1000px]">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-white/[0.06] p-6 backdrop-blur">
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute -top-28 left-1/2 h-56 w-[680px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/18 via-cyan-500/16 to-fuchsia-500/18 blur-2xl" />
          </div>

          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-white">{p.name}</h3>
              <p className="mt-2 text-lg leading-relaxed text-zinc-100/85">{p.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-sm font-semibold text-zinc-100"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {p.links.map((l) => (
                <motion.a
                  key={l.href}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href={l.href}
                  className="rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-white/25 hover:bg-white/[0.10]"
                >
                  {l.label}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="relative mt-6">
            <button onClick={() => setOpen((v) => !v)} className="text-base font-semibold text-zinc-100 hover:text-white">
              {open ? "Hide details" : "View details"} <span aria-hidden>→</span>
            </button>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1, transition: { duration: 0.35, ease: "easeOut" } }}
                  exit={{ height: 0, opacity: 0, transition: { duration: 0.22, ease: "easeInOut" } }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <InfoCard title="Problem" body={p.problem} />
                    <InfoCard title="Architecture" body={p.architecture} />
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <BulletCard title="Technical Challenges Solved" items={p.challenges} />
                    <BulletCard title="Results & Scale" items={p.results} />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-2.5">
            {p.tech.map((t) => (
              <span key={t} className="rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-sm text-zinc-100">
                {t}
              </span>
            ))}
          </div>
        </div>
      </TiltCard>
    </motion.article>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.05] p-5">
      <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-100/70">{title}</h4>
      <p className="mt-3 text-base leading-relaxed text-zinc-50/90">{body}</p>
    </div>
  );
}

function BulletCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.05] p-5">
      <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-100/70">{title}</h4>
      <ul className="mt-3 space-y-3 text-base text-zinc-50/90">
        {items.map((i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-3 h-1.5 w-1.5 flex-none rounded-full bg-white/40" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
