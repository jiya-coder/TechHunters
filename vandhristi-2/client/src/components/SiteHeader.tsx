import { Trees } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function SiteHeader({ theme = "dusk", onToggleTheme }: { theme?: "morning" | "dusk"; onToggleTheme?: () => void }) {
  const [location] = useLocation();
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="VanRakshak home">
        <span className="brand-mark"><Trees size={22} strokeWidth={1.8} /></span>
        <span><b>VanRakshak</b><small>by TeachHunters</small></span>
      </Link>
      <nav className="main-nav">
        <Link className={`nav-link ${location === "/" ? "active" : ""}`} href="/"><span>01</span>Home</Link>
        <Link className={`nav-link ${location === "/maps" ? "active" : ""}`} href="/maps"><span>02</span>Maps</Link>
        <Link className={`nav-link ${location === "/knowledge" ? "active" : ""}`} href="/knowledge"><span>03</span>Knowledge Hub</Link>
      </nav>
      <div className="header-actions">
        <Link className="header-cta" href="/maps">Launch GIS <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
  );
}
