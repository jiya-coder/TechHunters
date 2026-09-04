import { useEffect, useRef, useState, type WheelEvent } from "react";
import { ArrowRight, ArrowUpRight, Trees } from "lucide-react";
import { Link } from "wouter";
import SiteHeader from "@/components/SiteHeader";

type Theme = "morning" | "dusk";

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
  const [theme, setTheme] = useState<Theme>("morning");
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
    <div className={`site-shell ${theme === "dusk" ? "theme-dusk" : "theme-morning"}`}>
      <SiteHeader theme={theme} onToggleTheme={() => setTheme(theme === "morning" ? "dusk" : "morning")} />
      
      <main>
        <section className="landing-hero static-hero">
          <div className="hero-backdrop" />
          <div className="hero-model-frame">
            <iframe
              title="Mountain with rivers and lakes, forest 3D model"
              src="https://sketchfab.com/models/8c31757aa3f44880af5e38257daab659/embed?autostart=1&preload=1&autospin=0.08&camera=0&ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0&transparent=0&dnt=1&ui_hint=0&ui_theme=dark"
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
          
          <div className="container landing-hero-content flex flex-col items-center justify-center text-center min-h-[calc(100vh-140px)] py-12">
            <div className="hero-copy max-w-4xl w-full text-center mx-auto">
              <h1 className="hero-title-large text-7xl sm:text-8xl md:text-9xl lg:text-[125px] font-extrabold tracking-tight leading-none mb-3 text-center">VanDrishti</h1>
              <p className="hero-lede text-sm sm:text-base md:text-lg text-white/95 font-medium tracking-wide text-center mx-auto">Geospatial AI & Decision Intelligence for the Forest Rights Act.</p>
            </div>
          </div>
          

        </section>

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

        <section className="landing-navigation-section relative overflow-hidden bg-[#081A12] min-h-[480px] py-20 lg:py-24 flex flex-col justify-center border-t border-[#789883]/15">
          {/* Background Aerial Drone Forest Photograph */}
          <div className="absolute inset-0 z-0 group overflow-hidden">
            <img
              src="/misty-forest-bg.png"
              alt="Indian Forest Landscape"
              className="w-full h-full object-cover opacity-30 filter saturate-[0.85] contrast-[1.1] brightness-[0.85]"
            />
            {/* Dark Moody Forest Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#081A12] via-[#081A12]/85 to-[#081A12] z-10" />
          </div>

          <div className="container relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8 text-center sm:text-left">
              <div>
                <span className="eyebrow text-[#B7E64B] text-[11px] font-mono tracking-[0.2em] uppercase font-semibold block">
                  CHOOSE YOUR VANTAGE POINT
                </span>
                <h2 className="text-4xl sm:text-5xl lg:text-[58px] font-bold tracking-tight mt-2.5 leading-[1.05] text-[#F2F3E9]">
                  One landscape.<br />
                  <em className="text-[#B7E64B] italic font-serif font-normal block mt-1">Different decisions.</em>
                </h2>
              </div>

              {/* 2 Navigation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Link
                  href="/maps"
                  className="group relative p-6 rounded-2xl border border-[#B7E64B]/20 bg-[#123D2A]/40 backdrop-blur-md hover:bg-[#123D2A]/70 hover:border-[#B7E64B]/60 hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col justify-between min-h-[195px] text-left"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#B7E64B] tracking-widest block uppercase">
                      02 / GEOSPATIAL MAPS
                    </span>
                    <b className="text-xl font-bold text-[#F2F3E9] group-hover:text-[#B7E64B] transition-colors flex items-center justify-between mt-3">
                      Find the signal
                      <ArrowUpRight size={18} className="text-[#B7E64B] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </b>
                  </div>
                  <small className="text-xs text-[#789883] font-mono block mt-4 leading-relaxed">
                    Open the Forest Rights state-level decision support map.
                  </small>
                </Link>

                <Link
                  href="/knowledge"
                  className="group relative p-6 rounded-2xl border border-[#B7E64B]/20 bg-[#123D2A]/40 backdrop-blur-md hover:bg-[#123D2A]/70 hover:border-[#B7E64B]/60 hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col justify-between min-h-[195px] text-left"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#B7E64B] tracking-widest block uppercase">
                      03 / KNOWLEDGE HUB
                    </span>
                    <b className="text-xl font-bold text-[#F2F3E9] group-hover:text-[#B7E64B] transition-colors flex items-center justify-between mt-3">
                      Learn the framework
                      <ArrowUpRight size={18} className="text-[#B7E64B] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </b>
                  </div>
                  <small className="text-xs text-[#789883] font-mono block mt-4 leading-relaxed">
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
            <span className="footer-credit">Designed & developed by <b>Team TeachHunters</b></span>
            <span className="footer-meta">PS-7 / DECISION SUPPORT SYSTEM</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
