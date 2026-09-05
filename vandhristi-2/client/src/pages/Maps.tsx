import { useEffect, useState } from "react";
import { AlertTriangle, Calendar, ChevronDown, Download, Filter, MapPinned, PanelRight, Sparkles, TrendingUp, CheckCircle, Clock, FileText, Scale, Sliders, GitCompare } from "lucide-react";
import { Link } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import LeafletRiskMap, { StateDSSData } from "@/components/LeafletRiskMap";
import StateComparisonModal from "@/components/StateComparisonModal";
import RiskExplainabilityCard from "@/components/RiskExplainabilityCard";
import WhatIfSimulator from "@/components/WhatIfSimulator";
import fraFallbackData from "@/data/fraData.json";

export default function Maps() {
  const [theme, setTheme] = useState<"morning" | "dusk">("morning");
  const [months, setMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [statesData, setStatesData] = useState<Record<string, StateDSSData>>({});
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<StateDSSData | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All statuses");
  const [summaryStats, setSummaryStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);

  // Fetch Available Months on mount
  useEffect(() => {
    fetch("/api/fra/months")
      .then((res) => {
        if (!res.ok) throw new Error("API not ok");
        return res.json();
      })
      .then((data) => {
        if (data.months && data.months.length > 0) {
          setMonths(data.months);
          setSelectedMonth(data.months[data.months.length - 1]);
        } else {
          throw new Error("No months returned");
        }
      })
      .catch((err) => {
        console.warn("Using fallback months data:", err);
        const fbMonths = fraFallbackData.months || [];
        setMonths(fbMonths);
        if (fbMonths.length > 0) {
          setSelectedMonth(fbMonths[fbMonths.length - 1]);
        }
      });
  }, []);

  // Fetch GeoJSON Boundaries on mount
  useEffect(() => {
    fetch("/api/fra/geojson")
      .then((res) => {
        if (!res.ok) throw new Error("API not ok");
        return res.json();
      })
      .then((data) => setGeoJsonData(data))
      .catch((err) => {
        console.warn("Using fallback GeoJSON:", err);
        fetch("/india_states.geojson")
          .then((res) => res.json())
          .then((data) => setGeoJsonData(data))
          .catch((e) => console.error("Error loading fallback geojson:", e));
      });
  }, []);

  // Fetch State DSS Data whenever selectedMonth changes
  useEffect(() => {
    if (!selectedMonth) return;
    setLoading(true);

    fetch(`/api/fra/states?month=${selectedMonth}`)
      .then((res) => {
        if (!res.ok) throw new Error("API not ok");
        return res.json();
      })
      .then((data) => {
        if (data.states) {
          setStatesData(data.states);
          setSummaryStats(data.summary);

          const statesList = Object.values(data.states) as StateDSSData[];
          statesList.sort((a, b) => b.ML_Risk_Score - a.ML_Risk_Score);
          if (statesList.length > 0) {
            setSelectedState(statesList[0]);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Using fallback state data for month:", selectedMonth, err);
        const fbMonthData = (fraFallbackData.byMonth as any)?.[selectedMonth];
        if (fbMonthData && fbMonthData.states) {
          setStatesData(fbMonthData.states);
          setSummaryStats(fbMonthData.summary);

          const statesList = Object.values(fbMonthData.states) as StateDSSData[];
          statesList.sort((a, b) => b.ML_Risk_Score - a.ML_Risk_Score);
          if (statesList.length > 0) {
            setSelectedState(statesList[0]);
          }
        }
        setLoading(false);
      });
  }, [selectedMonth]);

  const allStatesList = Object.values(statesData) as StateDSSData[];
  
  // High Risk Priority Ranking
  const highRiskStates = [...allStatesList]
    .sort((a, b) => b.ML_Risk_Score - a.ML_Risk_Score)
    .filter((s) => s.ML_Risk_Level === "High Risk" || s.ML_Risk_Level === "Attention")
    .slice(0, 5);

  // Filtered states by status pill
  const filteredStates = allStatesList.filter((s) => {
    if (statusFilter === "High Risk") return s.ML_Risk_Level === "High Risk";
    if (statusFilter === "Attention") return s.ML_Risk_Level === "Attention";
    if (statusFilter === "Normal") return s.ML_Risk_Level === "Normal";
    return true;
  });

  return (
    <div className={`site-shell page-shell ${theme === "dusk" ? "theme-dusk" : "theme-morning"}`}>
      <SiteHeader theme={theme} onToggleTheme={() => setTheme(theme === "morning" ? "dusk" : "morning")} />
      
      <main className="inner-page maps-section">
        <div className="container">
          <div className="page-intro">
            <span className="eyebrow">02 / Decision support system</span>
            <h1>See the <em>signal.</em></h1>
            <p>A living state-level decision support system tracking Forest Rights Act anomalies, risk levels, and workflow bottlenecks.</p>
          </div>





          {/* Month Selector & Global KPI Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-lg bg-card border border-border w-full">
            <div className="flex items-center gap-3">
              <Calendar className="text-primary" size={18} />
              <span className="font-semibold text-sm">Monitoring Period:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-1.5 text-sm font-semibold text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {summaryStats && (
              <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-muted-foreground" />
                  <span>Total Claims: <b className="text-foreground">{summaryStats.Total_Claims_Received?.toLocaleString()}</b></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-amber-500" />
                  <span>Pending: <b className="text-foreground">{summaryStats.Pending_Claims?.toLocaleString()}</b></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DA5A5A]" />
                  <span>High Risk: <b className="text-foreground">{summaryStats.High_Risk_Count}</b></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E5A93C]" />
                  <span>Attention: <b className="text-foreground">{summaryStats.Attention_Count}</b></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4E9C6D]" />
                  <span>Normal: <b className="text-foreground">{summaryStats.Normal_Count}</b></span>
                </div>
              </div>
            )}
          </div>

          <div className="map-workspace glass-panel">
            <div className="map-toolbar flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b border-border">
              <div className="toolbar-context flex items-center gap-2 text-xs font-bold text-primary tracking-widest uppercase">
                <MapPinned size={16} /> LIVE GIS / INDIA <i>·</i> {selectedState ? selectedState.State.toUpperCase() : "MADHYA PRADESH"}
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Feature 1 Trigger: Compare States */}
                <button
                  onClick={() => setIsCompareOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-card/80 hover:bg-card border border-primary/40 hover:border-primary text-xs font-semibold text-foreground transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  title="Compare 2-3 states with National Benchmark"
                >
                  <Scale size={14} className="text-primary" />
                  <span>Compare & Benchmark</span>
                </button>

                {/* Feature 3 Trigger: Policy Simulator */}
                <button
                  onClick={() => setIsSimulatorOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary text-xs font-bold text-primary transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  title="Simulate policy levers and risk reduction"
                >
                  <Sliders size={14} />
                  <span>What-If Simulator</span>
                </button>

                <div className="flex items-center gap-2 pl-1 border-l border-border/60">
                  <Calendar className="text-primary" size={15} />
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-background/90 border border-border rounded-md px-2.5 py-1 text-xs font-semibold text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="map-content grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[580px]">
              {/* Map Column (Left 6 cols on wide screens) */}
              <div className="lg:col-span-6 map-visual p-5 border-r border-border flex flex-col justify-between gap-4">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center min-h-[480px]">
                    <span className="text-muted-foreground font-semibold text-sm">Loading geospatial model predictions...</span>
                  </div>
                ) : (
                  <LeafletRiskMap
                    statesData={statesData}
                    geoJsonData={geoJsonData}
                    selectedState={selectedState}
                    onSelectState={setSelectedState}
                    theme={theme}
                    statusFilter={statusFilter}
                  />
                )}

                {/* Filter Pills */}
                <div className="map-filter-row flex items-center gap-4 pt-2">
                  <div className="filter-label flex items-center gap-1.5 text-xs font-bold text-primary tracking-wider">
                    <Filter size={14} /> FILTER LAYERS
                  </div>
                  <div className="filter-pills flex flex-wrap gap-2">
                    {["All statuses", "High Risk", "Attention", "Normal"].map((item) => (
                      <button
                        key={item}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                          statusFilter === item
                            ? "bg-primary/20 border-primary text-foreground"
                            : "bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                        }`}
                        onClick={() => setStatusFilter(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected Region Details Panel (Middle 3 cols) */}
              <aside className="lg:col-span-3 decision-panel p-5 border-r border-border flex flex-col justify-between gap-4 overflow-y-auto max-h-[680px]">
                {selectedState ? (
                  <>
                    <div className="space-y-4">
                      <div className="decision-top flex items-center justify-between">
                        <div>
                          <span className="mono-label text-[10px] text-muted-foreground font-bold tracking-widest uppercase block">SELECTED REGION</span>
                          <h3 className="text-2xl font-bold text-foreground mt-0.5">{selectedState.State}</h3>
                        </div>
                        <button className="icon-button p-1.5 rounded-md hover:bg-muted text-muted-foreground" onClick={() => setSelectedState(null)} title="Close selection">
                          <PanelRight size={15} />
                        </button>
                      </div>

                      <div
                        className={`priority-banner p-3 rounded-lg border flex items-start gap-2.5 ${
                          selectedState.ML_Risk_Level === "High Risk"
                            ? "bg-red-950/40 border-red-900/60 text-red-400"
                            : selectedState.ML_Risk_Level === "Attention"
                            ? "bg-amber-950/40 border-amber-900/60 text-amber-400"
                            : "bg-emerald-950/40 border-emerald-900/60 text-emerald-400"
                        }`}
                      >
                        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                        <div className="text-xs">
                          <b className="block font-bold">Risk Score: {selectedState.ML_Risk_Score.toFixed(0)} / 100</b>
                          <span className="opacity-90 font-medium">Status: {selectedState.ML_Risk_Level} ({selectedState.Anomaly_Type})</span>
                        </div>
                      </div>

                      <div className="decision-metrics grid grid-cols-3 gap-2 text-center py-2 border-y border-border">
                        <div>
                          <span className="mono-label text-[9px] text-muted-foreground font-bold block">TOTAL CLAIMS</span>
                          <b className="text-sm font-bold text-foreground block mt-0.5">{selectedState.Total_Claims_Received.toLocaleString()}</b>
                        </div>
                        <div>
                          <span className="mono-label text-[9px] text-muted-foreground font-bold block">APPROVED</span>
                          <b className="text-sm font-bold text-emerald-400 block mt-0.5">{selectedState.Approved_Claims.toLocaleString()}</b>
                        </div>
                        <div>
                          <span className="mono-label text-[9px] text-muted-foreground font-bold block">PENDING</span>
                          <b className="text-sm font-bold text-amber-400 block mt-0.5">{selectedState.Pending_Claims.toLocaleString()}</b>
                        </div>
                      </div>

                      {/* Feature 2: Early Warning + Explainable Risk Decomposition */}
                      <RiskExplainabilityCard
                        state={selectedState}
                        summaryStats={summaryStats}
                        onOpenSimulator={() => setIsSimulatorOpen(true)}
                      />

                      <div className="panel-section text-xs space-y-1.5">
                        <div className="panel-section-head flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                          <span>ML Operational Signal</span>
                          <span className="signal-time">Month: {selectedState.Month}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-muted-foreground italic bg-background/50 p-2 rounded border border-border/50">
                          {selectedState.AI_Explanation}
                        </p>
                      </div>

                      <div className="panel-section text-xs space-y-1.5 pt-1">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Pending Rate:</span>
                          <b className="text-foreground font-semibold">
                            {(selectedState.Pending_Rate * (selectedState.Pending_Rate <= 1 ? 100 : 1)).toFixed(1)}%
                          </b>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Rejection Rate:</span>
                          <b className="text-foreground font-semibold">
                            {(selectedState.Rejection_Rate * (selectedState.Rejection_Rate <= 1 ? 100 : 1)).toFixed(1)}%
                          </b>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Workflow Bottleneck Rate:</span>
                          <b className="text-foreground font-semibold">
                            {(selectedState.Workflow_Bottleneck_Rate * (selectedState.Workflow_Bottleneck_Rate <= 1 ? 100 : 1)).toFixed(1)}%
                          </b>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Pending Backlog Growth:</span>
                          <b className="text-foreground font-semibold">
                            {selectedState.Pending_Backlog_Growth > 0 ? "+" : ""}{selectedState.Pending_Backlog_Growth.toLocaleString()}
                          </b>
                        </div>
                      </div>
                    </div>

                    <div className="panel-actions pt-2 space-y-2">
                      <button
                        onClick={() => setIsSimulatorOpen(true)}
                        className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 rounded-full bg-primary text-primary-foreground font-bold text-xs hover:brightness-110 transition-all shadow-md active:scale-95"
                      >
                        <Sliders size={14} /> Simulate Policy Levers
                      </button>
                      <button
                        onClick={() => setIsCompareOpen(true)}
                        className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 rounded-full bg-card border border-primary/40 text-foreground font-semibold text-xs hover:border-primary transition-all active:scale-95"
                      >
                        <Scale size={14} className="text-primary" /> Compare with Benchmark
                      </button>
                      <Link className="inline-flex items-center justify-center gap-2 w-full py-1.5 px-4 rounded-full text-muted-foreground hover:text-foreground font-medium text-xs transition-colors" href="/knowledge">
                        <FileText size={13} /> Statutory Guidelines
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-6">
                    <MapPinned size={32} className="mb-2 opacity-50 text-primary" />
                    <p className="text-xs font-semibold">Select any state on the map to view detailed ML anomaly risk analytics.</p>
                  </div>
                )}
              </aside>

              {/* Decision Priorities Panel (Right 3 cols) */}
              <aside className="lg:col-span-3 priorities-panel p-5 bg-background/30 flex flex-col justify-between gap-4 overflow-y-auto max-h-[680px]">
                <div className="space-y-4">
                  <div className="decision-top flex items-center justify-between">
                    <div>
                      <span className="mono-label text-[10px] text-primary font-bold tracking-widest uppercase block">DECISION PRIORITIES</span>
                      <h3 className="text-lg font-bold text-foreground mt-0.5">Top Priority Action States</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
                      {selectedMonth || "2026-06"}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    State administrative units flagged with high operational anomaly risk scores requiring urgent review:
                  </p>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {highRiskStates.map((st) => (
                      <button
                        key={st.State}
                        onClick={() => setSelectedState(st)}
                        className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between min-h-[75px] ${
                          selectedState?.State === st.State
                            ? "bg-primary/20 border-primary shadow-md"
                            : "bg-card/70 border-border hover:border-primary/50 hover:bg-card"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                            st.ML_Risk_Level === "High Risk"
                              ? "bg-red-950 text-red-400 border border-red-800/50"
                              : "bg-amber-950 text-amber-400 border border-amber-800/50"
                          }`}>
                            {st.ML_Risk_Score.toFixed(0)}
                          </span>
                          <span className="text-[9px] text-muted-foreground font-semibold truncate max-w-[55px]">
                            {st.Anomaly_Type.split(" ")[0]}
                          </span>
                        </div>
                        <b className="text-xs text-foreground font-bold mt-2 truncate block">{st.State}</b>
                      </button>
                    ))}
                  </div>

                  {/* Quick Compare Action */}
                  <div className="pt-2">
                    <button
                      onClick={() => setIsCompareOpen(true)}
                      className="w-full py-2 px-3 rounded-xl bg-card/80 border border-border hover:border-primary/50 text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <Scale size={13} className="text-primary" />
                      <span>Compare Top Risk States</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50 text-[10px] text-muted-foreground flex items-center justify-between">
                  <span>ML Isolation Forest Engine</span>
                  <span className="text-primary font-semibold">Active Monitoring</span>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>

      {/* Feature 1: State Comparison & National Benchmark Modal */}
      <StateComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        statesData={statesData}
        initialState={selectedState}
        summaryStats={summaryStats}
        currentMonth={selectedMonth}
      />

      {/* Feature 3: What-If Policy Intervention Simulator */}
      <WhatIfSimulator
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        state={selectedState}
        currentMonth={selectedMonth}
      />
    </div>
  );
}
