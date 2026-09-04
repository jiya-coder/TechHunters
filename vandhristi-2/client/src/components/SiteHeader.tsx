import { Moon, Sun, Trees } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function SiteHeader({ theme, onToggleTheme }: { theme: "morning" | "dusk"; onToggleTheme: () => void }) {
  const [location] = useLocation();
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="VanDhristi home">
        <span className="brand-mark"><Trees size={22} strokeWidth={1.8} /></span>
        <span><b>VanDhristi</b><small>by TeachHunters</small></span>
      </Link>
      <nav className="main-nav">
        <Link className={`nav-link ${location === "/" ? "active" : ""}`} href="/"><span>01</span>Home</Link>
        <Link className={`nav-link ${location === "/maps" ? "active" : ""}`} href="/maps"><span>02</span>Maps</Link>
        <Link className={`nav-link ${location === "/knowledge" ? "active" : ""}`} href="/knowledge"><span>03</span>Knowledge Hub</Link>
      </nav>
      <div className="header-actions">
        <button className="mode-switch" onClick={onToggleTheme} aria-label="Toggle morning and dusk mode">
          <Sun size={17} className={theme === "morning" ? "mode-active" : ""} />
          <span className="switch-track"><span /></span>
          <Moon size={17} className={theme === "dusk" ? "mode-active" : ""} />
        </button>
        <Link className="header-cta" href="/maps">Launch GIS <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
  );
}
