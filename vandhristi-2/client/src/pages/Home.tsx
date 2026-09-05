import { useEffect, useRef, useState, type WheelEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Trees,
  Scale,
  Sliders,
  ShieldAlert,
  Cpu,
  Sparkles,
  Database,
  BarChart3,
  Users,
  CheckCircle2,
  ChevronRight,
  Activity,
  MapPinned,
  Building2,
  FileText,
  Workflow,
  AlertTriangle,
  Layers,
  Bot,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import SiteHeader from "@/components/SiteHeader";


const orbitPictures = [
  {
    tag: "01 / CLAIMS",
    title: "The national picture",
    description: "Track Individual and Community Forest Rights claims across monitored states.",
    species: "Claims & Coverage",
    navLabel: "CLAIMS",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=85"
  },
  {
    tag: "02 / AI RISK",
    title: "Signals in the data",
    description: "AI-assisted anomaly detection identifies unusual state-level patterns that may require administrative attention.",
    species: "AI-Assisted Monitoring",
    navLabel: "AI RISK",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=85"
  },
  {
    tag: "03 / WORKFLOW",
    title: "Where processes slow",
    description: "Identify workflow bottlenecks across recommendation, approval and disposal stages.",
    species: "Process Intelligence",
    navLabel: "WORKFLOW",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1000&q=85"
  },
  {
    tag: "04 / COMMUNITY",
    title: "Rights in focus",
    description: "Compare Individual and Community claim patterns to reveal imbalances in implementation.",
    species: "FRA Claim Intelligence",
    navLabel: "COMMUNITY",
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1000&q=85"
  },
  {
    tag: "05 / BACKLOG",
    title: "What remains pending",
    description: "Monitor pending backlogs and identify states where unresolved claims require priority attention.",
    species: "Backlog Monitoring",
    navLabel: "BACKLOG",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1000&q=85"
  },
  {
    tag: "06 / DECISION",
    title: "From insight to action",
    description: "Turn risk scores, anomalies and operational signals into clear priorities for decision-makers.",
    species: "Actionable Intelligence",
    navLabel: "DECISION",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=85"
  },
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const lastWheel = useRef(0);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") setActiveIndex((value) => Math.min(orbitPictures.length - 1, value + 1));
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") setActiveIndex((value) => Math.max(0, value - 1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleCarouselWheel = (event: WheelEvent<HTMLElement>) => {
    const now = Date.now();
    if (now - lastWheel.current < 620) return;
    const direction = event.deltaY > 0 ? 1 : -1;
    if ((direction > 0 && activeIndex < orbitPictures.length - 1) || (direction < 0 && activeIndex > 0)) {
      event.preventDefault();
      lastWheel.current = now;
      setActiveIndex((value) => Math.min(orbitPictures.length - 1, Math.max(0, value + direction)));
    }
  };

  return (
    <div className="site-shell theme-dusk">
      <SiteHeader />
      
      <main>
        {/* HERO SECTION — 3D Model Kept 100% Intact with Atmospheric CTAs & Live Telemetry */}
        <section className="landing-hero static-hero">
          <div className="hero-backdrop" />
          <div className="hero-model-frame">
            <iframe
              title="Mountain with rivers and lakes, forest 3D model"
              src="https://sketchfab.com/models/8c31757aa3f44880af5e38257daab659/embed?autostart=1&preload=1&autospin=0.08&camera=0&ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0&transparent=0&dnt=1&ui_hint=2&ui_help=0&ui_theme=dark"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
            />
          </div>

          <div className="local-forest-model" aria-hidden="true">
            <div className="local-sun" />
            <div className="local-mountain mountain-back" />
            <div className="local-mountain mountain-front" />
            <div className="local-pines pine-left" />
            <div className="local-pines pine-center" />
            <div className="local-pines pine-right" />
            <div className="local-river" />
          </div>
          <div className="hero-vignette" />
          <div className="grain" />
          
          <div className="container landing-hero-content flex flex-col items-center justify-center text-center min-h-[calc(100vh-140px)] py-12 z-20">
            <div className="hero-copy max-w-4xl w-full text-center mx-auto space-y-6">
              <div>
                <h1 className="hero-title-large text-7xl sm:text-8xl md:text-9xl lg:text-[125px] font-extrabold tracking-tight leading-none mb-3 text-center">VanDrishti</h1>
                <p className="hero-lede text-sm sm:text-base md:text-lg font-medium tracking-wide text-center mx-auto max-w-2xl">
                  Geospatial AI & Decision Intelligence for the Forest Rights Act (FRA 2006).
                </p>
                <p className="hero-sublede text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed font-medium">
                  Over 5.1M tribal forest rights claims across 21 states. Detecting workflow bottlenecks, rejection anomalies, and statutory risks via unsupervised machine learning.
                </p>
              </div>

              {/* Instant Action CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/maps"
                  className="hero-btn-primary px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 active:scale-95 shadow-lg"
                >
                  <MapPinned size={16} />
                  <span>Explore Live GIS Map</span>
                  <ArrowRight size={15} />
                </Link>

                <Link
                  href="/maps?action=simulator"
                  className="hero-btn-simulator px-5 py-3 rounded-full font-semibold text-sm transition-all flex items-center gap-2 backdrop-blur-md active:scale-95 shadow-md"
                >
                  <Sliders size={15} />
                  <span>Policy Simulator</span>
                </Link>

                <Link
                  href="/maps?action=compare"
                  className="hero-btn-compare px-5 py-3 rounded-full font-semibold text-sm transition-all flex items-center gap-2 backdrop-blur-md active:scale-95 shadow-md"
                >
                  <Scale size={15} />
                  <span>State Benchmarking</span>
                </Link>
              </div>

              {/* Real-time National Telemetry Strip */}
              <div className="pt-4 max-w-3xl mx-auto w-full">
                <div className="telemetry-strip grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 rounded-2xl backdrop-blur-md text-center shadow-2xl">
                  <div className="p-2">
                    <span className="telemetry-val font-mono text-base sm:text-lg font-bold block">5,104,904</span>
                    <span className="telemetry-lbl text-[10px] font-mono uppercase tracking-wider block">Claims Monitored</span>
                  </div>
                  <div className="p-2">
                    <span className="font-mono text-base sm:text-lg font-bold text-amber-500 block">784,276</span>
                    <span className="telemetry-lbl text-[10px] font-mono uppercase tracking-wider block">Unresolved Pending</span>
                  </div>
                  <div className="p-2">
                    <span className="font-mono text-base sm:text-lg font-bold text-emerald-500 block">21</span>
                    <span className="telemetry-lbl text-[10px] font-mono uppercase tracking-wider block">Monitored States</span>
                  </div>
                  <div className="p-2">
                    <span className="font-mono text-base sm:text-lg font-bold text-sky-500 block">18 Mo.</span>
                    <span className="telemetry-lbl text-[10px] font-mono uppercase tracking-wider block">Historical MPR</span>
                  </div>
                  <div className="p-2 col-span-2 sm:col-span-1">
                    <span className="font-mono text-base sm:text-lg font-bold text-violet-500 block">Rule 12A</span>
                    <span className="telemetry-lbl text-[10px] font-mono uppercase tracking-wider block">Statutory Audit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: EVALUATOR FAST-TRACK — 1-Click State Anomaly Test Cases */}
        <section className="evaluator-fast-track py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="section-eyebrow text-xs font-mono font-bold tracking-widest uppercase block">
                  FAST-TRACK TEST CASES · CURATED FOR EVALUATION
                </span>
                <h2 className="section-title text-2xl sm:text-3xl font-bold mt-1">
                  Test Live Machine Learning Signals in 1-Click
                </h2>
                <p className="section-subtitle text-xs sm:text-sm mt-1 max-w-xl">
                  Select any benchmark state below to directly launch the GIS map with its explainable risk decomposition:
                </p>
              </div>
              <Link
                href="/maps"
                className="section-link inline-flex items-center gap-1.5 text-xs font-bold hover:underline shrink-0"
              >
                <span>View all 21 states</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Madhya Pradesh */}
              <Link
                href="/maps?state=Madhya%20Pradesh"
                className="state-card card-mp p-4 rounded-xl transition-all group hover:-translate-y-1 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold badge-mp">
                      🔴 High Risk 87.6
                    </span>
                    <span className="text-[10px] font-mono card-meta">MoTA MPR</span>
                  </div>
                  <b className="text-base font-bold card-name group-hover:text-rose-500 transition-colors block">
                    Madhya Pradesh
                  </b>
                  <span className="text-xs font-semibold text-rose-500 block mt-1">
                    Rejection Spike: 51.4%
                  </span>
                  <p className="text-[11px] card-desc mt-2 leading-relaxed">
                    Highest rejection volume nationwide. Flagged for urgent Section 4(5) audit to prevent wrongful eviction.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t card-action flex items-center justify-between text-xs font-bold text-rose-500 group-hover:translate-x-1 transition-transform">
                  <span>Inspect Signal</span>
                  <ArrowUpRight size={14} />
                </div>
              </Link>

              {/* Odisha */}
              <Link
                href="/maps?state=Odisha"
                className="state-card card-odisha p-4 rounded-xl transition-all group hover:-translate-y-1 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold badge-odisha">
                      🔴 High Risk 85.2
                    </span>
                    <span className="text-[10px] font-mono card-meta">MoTA MPR</span>
                  </div>
                  <b className="text-base font-bold card-name group-hover:text-amber-500 transition-colors block">
                    Odisha
                  </b>
                  <span className="text-xs font-semibold text-amber-500 block mt-1">
                    CFR Imbalance & 96K Backlog
                  </span>
                  <p className="text-[11px] card-desc mt-2 leading-relaxed">
                    High structural divergence between individual and community titling with rapid backlog velocity.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t card-action flex items-center justify-between text-xs font-bold text-amber-500 group-hover:translate-x-1 transition-transform">
                  <span>Inspect Signal</span>
                  <ArrowUpRight size={14} />
                </div>
              </Link>

              {/* Goa */}
              <Link
                href="/maps?state=Goa"
                className="state-card card-goa p-4 rounded-xl transition-all group hover:-translate-y-1 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold badge-goa">
                      🟡 High Risk 67.6
                    </span>
                    <span className="text-[10px] font-mono card-meta">MoTA MPR</span>
                  </div>
                  <b className="text-base font-bold card-name group-hover:text-indigo-500 transition-colors block">
                    Goa
                  </b>
                  <span className="text-xs font-semibold text-indigo-500 block mt-1">
                    SDLC Drop-off: 50.8%
                  </span>
                  <p className="text-[11px] card-desc mt-2 leading-relaxed">
                    Severe workflow blockage: Sub-Divisional Committee recommendations stall before District Collector vesting.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t card-action flex items-center justify-between text-xs font-bold text-indigo-500 group-hover:translate-x-1 transition-transform">
                  <span>Inspect Signal</span>
                  <ArrowUpRight size={14} />
                </div>
              </Link>

              {/* Rajasthan */}
              <Link
                href="/maps?state=Rajasthan"
                className="state-card card-rajasthan p-4 rounded-xl transition-all group hover:-translate-y-1 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold badge-rajasthan">
                      🟢 Normal 0.0
                    </span>
                    <span className="text-[10px] font-mono card-meta">MoTA MPR</span>
                  </div>
                  <b className="text-base font-bold card-name group-hover:text-emerald-500 transition-colors block">
                    Rajasthan
                  </b>
                  <span className="text-xs font-semibold text-emerald-500 block mt-1">
                    Equilibrium Flow
                  </span>
                  <p className="text-[11px] card-desc mt-2 leading-relaxed">
                    Administrative equilibrium: Disposal velocity exceeds intake volume, maintaining zero pending accumulation.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t card-action flex items-center justify-between text-xs font-bold text-emerald-500 group-hover:translate-x-1 transition-transform">
                  <span>Inspect Signal</span>
                  <ArrowUpRight size={14} />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 3: CORE BREAKTHROUGHS — Three Pillars of Decision Intelligence */}
        <section className="core-breakthroughs py-20">
          <div className="container max-w-6xl mx-auto px-4 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="section-eyebrow text-xs font-mono font-bold tracking-widest uppercase block">
                INNOVATION BLUEPRINT
              </span>
              <h2 className="section-title text-3xl sm:text-4xl font-bold">
                Three Pillars of Autonomous Decision Intelligence
              </h2>
              <p className="section-subtitle text-xs sm:text-sm">
                Moving beyond static dashboards into explainable machine learning anomaly detection and actionable policy simulations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1 */}
              <div className="pillar-card pillar-1 p-6 rounded-2xl transition-all space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-xl pillar-icon-1 flex items-center justify-center">
                  <Cpu size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-mono pillar-meta uppercase tracking-wider block">Pillar 01</span>
                  <h3 className="text-lg font-bold pillar-heading mt-1">Unsupervised Isolation Forest ML</h3>
                </div>
                <p className="text-xs pillar-body leading-relaxed">
                  Trained on 18 months of official MoTA records. Detects 4 distinct anomaly signatures: SDLC Bottlenecks, Rejection Spikes, Imbalanced Filings, and Backlog Momentum.
                </p>
                <div className="pt-2 border-t pillar-divider space-y-1 text-[11px] pillar-meta">
                  <div className="flex justify-between">
                    <span>Algorithm:</span>
                    <b className="pillar-bold">Isolation Forest (Scikit-Learn)</b>
                  </div>
                  <div className="flex justify-between">
                    <span>XAI Attribution:</span>
                    <b className="text-emerald-500">Surrogate Shapley Vectors</b>
                  </div>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="pillar-card pillar-2 p-6 rounded-2xl transition-all space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-xl pillar-icon-2 flex items-center justify-center">
                  <Scale size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-mono pillar-meta uppercase tracking-wider block">Pillar 02</span>
                  <h3 className="text-lg font-bold pillar-heading mt-1">5D National Benchmarking</h3>
                </div>
                <p className="text-xs pillar-body leading-relaxed">
                  Multi-attribute Recharts Radar & Bar analysis benchmarking any focus state against dynamic monthly national medians across Disposal, CFR Share, and Throughput.
                </p>
                <div className="pt-2 border-t pillar-divider space-y-1 text-[11px] pillar-meta">
                  <div className="flex justify-between">
                    <span>Dimensions:</span>
                    <b className="pillar-bold">5 Core Metrics</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Benchmark Layer:</span>
                    <b className="text-sky-500">Dynamic Monthly Median</b>
                  </div>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="pillar-card pillar-3 p-6 rounded-2xl transition-all space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-xl pillar-icon-3 flex items-center justify-center">
                  <Sliders size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-mono pillar-meta uppercase tracking-wider block">Pillar 03</span>
                  <h3 className="text-lg font-bold pillar-heading mt-1">What-If Simulator & AI Copilot</h3>
                </div>
                <p className="text-xs pillar-body leading-relaxed">
                  Interactive policy sliders model the real-time impact of SDLC clearance drives and appellate reviews under Section 6(2), with 1-click legal briefings under FRA Rule 12A.
                </p>
                <div className="pt-2 border-t pillar-divider space-y-1 text-[11px] pillar-meta">
                  <div className="flex justify-between">
                    <span>Policy Levers:</span>
                    <b className="pillar-bold">3 Calibrated Sliders</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Copilot Bridge:</span>
                    <b className="text-violet-500">Automated Legal Briefing</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: THE ORBIT CAROUSEL (Kept Intact) */}
        <section id="landscape-sequence" className="landscape-sequence stable-carousel" onWheel={handleCarouselWheel}>
          <div className="landscape-sticky stable-carousel-stage">
            <div className="landscape-fallback" />
            <div className="landscape-overlay" />
            <div className="landscape-copy container">
              <h2>See where<br />action is<br /><em>needed.</em></h2>
              <p>AI powered monitoring that helps decision makers identify bottlenecks, unusual patterns and high risk states across Forest Rights Act implementation.</p>
            </div>
            <div className="planar-circle-guide" aria-hidden="true"><span /><i /></div>
            
            <div className="stable-card-track circular-card-track">
              {orbitPictures.map((picture, index) => {
                const angle = ((index - activeIndex) / orbitPictures.length) * Math.PI * 2 - Math.PI / 2;
                return (
                  <div
                    className={`stable-picture circular-picture ${index === activeIndex ? "focused" : ""}`}
                    key={picture.tag}
                    onClick={() => setActiveIndex(index)}
                    style={{
                      transform: `translate3d(-50%, -50%, 0) rotate(${angle}rad) translateY(-232px) rotate(${-angle}rad)`,
                      opacity: index === activeIndex ? 1 : 0.56,
                      zIndex: index === activeIndex ? 20 : 10 - Math.abs(index - activeIndex),
                    }}
                  >
                    <img src={picture.image} alt={picture.title} />
                    <span>{picture.tag}</span>
                    <b>{picture.title}</b>
                    <p className="card-desc">{picture.description}</p>
                    <small>{picture.species}</small>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 5: TECHNICAL ARCHITECTURE & DATA PIPELINE */}
        <section className="architecture-section py-20">
          <div className="container max-w-5xl mx-auto px-4 space-y-10">
            <div className="text-center space-y-2">
              <span className="section-eyebrow text-xs font-mono font-bold tracking-widest uppercase block">
                SYSTEM PIPELINE & DATA PROVENANCE
              </span>
              <h2 className="section-title text-3xl font-bold">End-to-End Architectural Flow</h2>
              <p className="section-subtitle text-xs sm:text-sm max-w-xl mx-auto">
                How official government Monthly Progress Reports are transformed into actionable judicial insights.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
              <div className="pipeline-card p-4 rounded-xl text-center space-y-2">
                <span className="w-7 h-7 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-mono font-bold text-xs flex items-center justify-center mx-auto">
                  01
                </span>
                <b className="text-xs pipeline-title block">MoTA MPR Bulletins</b>
                <p className="text-[11px] pipeline-desc">Official state-wise monthly claim submissions (21 states)</p>
              </div>

              <div className="pipeline-card p-4 rounded-xl text-center space-y-2">
                <span className="w-7 h-7 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30 font-mono font-bold text-xs flex items-center justify-center mx-auto">
                  02
                </span>
                <b className="text-xs pipeline-title block">Feature Engineering</b>
                <p className="text-[11px] pipeline-desc">Bottleneck drop-off, MoM growth velocity, CFR share</p>
              </div>

              <div className="pipeline-card p-4 rounded-xl text-center space-y-2">
                <span className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono font-bold text-xs flex items-center justify-center mx-auto">
                  03
                </span>
                <b className="text-xs pipeline-title block">Isolation Forest ML</b>
                <p className="text-[11px] pipeline-desc">Unsupervised multidimensional anomaly detection (0-100 score)</p>
              </div>

              <div className="pipeline-card p-4 rounded-xl text-center space-y-2">
                <span className="w-7 h-7 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30 font-mono font-bold text-xs flex items-center justify-center mx-auto">
                  04
                </span>
                <b className="text-xs pipeline-title block">Leaflet GIS Engine</b>
                <p className="text-[11px] pipeline-desc">Dynamic GeoJSON chloropleth with risk tier coloration</p>
              </div>

              <div className="pipeline-card p-4 rounded-xl text-center space-y-2">
                <span className="w-7 h-7 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/30 font-mono font-bold text-xs flex items-center justify-center mx-auto">
                  05
                </span>
                <b className="text-xs pipeline-title block">AI Statutory Copilot</b>
                <p className="text-[11px] pipeline-desc">FRA Rules 12A & 14 policy briefing & action recommendations</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: CHOOSE YOUR VANTAGE POINT */}
        <section className="landing-navigation-section relative overflow-hidden min-h-[480px] py-20 lg:py-24 flex flex-col justify-center">
          {/* Background Aerial Drone Forest Photograph */}
          <div className="absolute inset-0 z-0 group overflow-hidden">
            <img
              src="/misty-forest-bg.png"
              alt="Indian Forest Landscape"
              className="vantage-bg-img w-full h-full object-cover opacity-25 filter saturate-[0.85] contrast-[1.1]"
            />
            {/* Atmospheric Forest Gradient Overlay */}
            <div className="vantage-overlay absolute inset-0 z-10" />
          </div>

          <div className="container relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8 text-center sm:text-left">
              <div>
                <span className="section-eyebrow text-[11px] font-mono tracking-[0.2em] uppercase font-semibold block">
                  CHOOSE YOUR VANTAGE POINT
                </span>
                <h2 className="vantage-heading text-4xl sm:text-5xl lg:text-[58px] font-bold tracking-tight mt-2.5 leading-[1.05]">
                  One landscape.<br />
                  <em className="vantage-em italic font-serif font-normal block mt-1">Different decisions.</em>
                </h2>
              </div>

              {/* 2 Navigation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Link
                  href="/maps"
                  className="vantage-card group relative p-6 rounded-2xl backdrop-blur-md hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col justify-between min-h-[195px] text-left"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400 tracking-widest block uppercase">
                      02 / GEOSPATIAL MAPS
                    </span>
                    <b className="text-xl font-bold card-name group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors flex items-center justify-between mt-3">
                      Find the signal
                      <ArrowUpRight size={18} className="text-sky-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </b>
                  </div>
                  <small className="text-xs card-desc font-mono block mt-4 leading-relaxed">
                    Open the Forest Rights state-level decision support map with ML risk attribution.
                  </small>
                </Link>

                <Link
                  href="/knowledge"
                  className="vantage-card group relative p-6 rounded-2xl backdrop-blur-md hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col justify-between min-h-[195px] text-left"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 tracking-widest block uppercase">
                      03 / KNOWLEDGE HUB
                    </span>
                    <b className="text-xl font-bold card-name group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center justify-between mt-3">
                      Learn the framework
                      <ArrowUpRight size={18} className="text-amber-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </b>
                  </div>
                  <small className="text-xs card-desc font-mono block mt-4 leading-relaxed">
                    Read statutory process timelines and download official FRA documents.
                  </small>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <footer className="site-footer">
          <div className="container footer-inner">
            <div className="footer-brand">
              <span className="brand-mark"><Trees size={22} /></span>
              <span><b>VanDhristi</b><small>Empowering forest rights through intelligence.</small></span>
            </div>
            <span className="footer-credit">Designed & developed by <b>Team TechHunters</b></span>
            <span className="footer-meta">PS-7 / DECISION SUPPORT SYSTEM</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
