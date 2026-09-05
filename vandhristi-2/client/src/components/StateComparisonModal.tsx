import React, { useState, useMemo } from "react";
import {
  X,
  Scale,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  BarChart3,
  Columns,
  Download,
  Info,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { StateDSSData } from "./LeafletRiskMap";

interface StateComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  statesData: Record<string, StateDSSData>;
  initialState?: StateDSSData | null;
  summaryStats?: any;
  currentMonth: string;
}

export default function StateComparisonModal({
  isOpen,
  onClose,
  statesData,
  initialState,
  summaryStats,
  currentMonth,
}: StateComparisonModalProps) {
  const allStates = useMemo(() => {
    return Object.values(statesData).sort((a, b) => a.State.localeCompare(b.State));
  }, [statesData]);

  // Default selections
  const defaultState1 = initialState?.State || (allStates[0]?.State ?? "");
  const defaultState2 =
    allStates.find((s) => s.State !== defaultState1 && s.ML_Risk_Level === "High Risk")?.State ||
    allStates.find((s) => s.State !== defaultState1)?.State ||
    "";

  const [state1Name, setState1Name] = useState<string>(defaultState1);
  const [state2Name, setState2Name] = useState<string>(defaultState2);
  const [state3Name, setState3Name] = useState<string>("");
  const [showBenchmark, setShowBenchmark] = useState<boolean>(true);
  const [chartType, setChartType] = useState<"radar" | "bar">("radar");

  // Keep state1 updated if initialState changes
  React.useEffect(() => {
    if (initialState?.State && statesData[initialState.State]) {
      setState1Name(initialState.State);
    }
  }, [initialState, statesData]);

  if (!isOpen) return null;

  const state1 = statesData[state1Name];
  const state2 = statesData[state2Name];
  const state3 = state3Name ? statesData[state3Name] : null;

  // National Benchmark values (calculated from all states for the active month)
  const nationalBenchmark = (() => {
    const list = Object.values(statesData);
    if (list.length === 0) {
      return {
        disposalRate: 50,
        approvalRate: 50,
        rejectionRate: 30,
        pendingRate: 20,
        bottleneckRate: 15,
        cfrShare: 15,
        avgRiskScore: 45,
      };
    }
    const disposals = list.map((s) => s.Disposal_Rate ?? (s.Total_Claims_Received > 0 ? (s.Approved_Claims + s.Rejected_Claims) / s.Total_Claims_Received : 0));
    const rejections = list.map((s) => s.Rejection_Rate);
    const pendings = list.map((s) => s.Pending_Rate);
    const bottlenecks = list.map((s) => s.Workflow_Bottleneck_Rate);
    const cfrShares = list.map((s) => (s.Total_Claims_Received > 0 && s.Community_Claims ? (s.Community_Claims / s.Total_Claims_Received) * 100 : 8.5));
    const riskScores = list.map((s) => s.ML_Risk_Score);

    const median = (arr: number[]) => {
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    return {
      disposalRate: Math.round(median(disposals) * 1000) / 10,
      approvalRate: Math.round((100 - median(rejections) * 100 - median(pendings) * 100) * 10) / 10,
      rejectionRate: Math.round(median(rejections) * 1000) / 10,
      pendingRate: Math.round(median(pendings) * 1000) / 10,
      bottleneckRate: Math.round(median(bottlenecks) * 1000) / 10,
      cfrShare: Math.round(median(cfrShares) * 10) / 10,
      avgRiskScore: Math.round((riskScores.reduce((a, b) => a + b, 0) / riskScores.length) * 10) / 10,
    };
  })();

  // Calculate 5 core normalized dimensions for radar visualization
  const getDimensions = (s: StateDSSData | null) => {
    if (!s) return { disposal: 0, cfrShare: 0, throughput: 0, clearance: 0, stability: 0 };
    const disposal = Math.min(100, Math.round(((s.Approved_Claims + s.Rejected_Claims) / Math.max(1, s.Total_Claims_Received)) * 100));
    const cfrShare = Math.min(100, Math.round(((s.Community_Claims || Math.max(1, Math.round(s.Total_Claims_Received * 0.08))) / Math.max(1, s.Total_Claims_Received)) * 100));
    const throughput = Math.max(0, Math.min(100, Math.round((1 - s.Workflow_Bottleneck_Rate) * 100)));
    const clearance = Math.max(0, Math.min(100, Math.round((1 - s.Rejection_Rate) * 100)));
    const stability = Math.max(10, Math.min(100, Math.round(100 - s.ML_Risk_Score)));
    return { disposal, cfrShare, throughput, clearance, stability };
  };

  const d1 = getDimensions(state1);
  const d2 = getDimensions(state2);
  const d3 = getDimensions(state3);

  const radarData = [
    {
      subject: "Disposal Rate",
      [state1?.State || "State 1"]: d1.disposal,
      [state2?.State || "State 2"]: d2.disposal,
      ...(state3 ? { [state3.State]: d3.disposal } : {}),
      ...(showBenchmark ? { "National Benchmark": nationalBenchmark.disposalRate } : {}),
      fullMark: 100,
    },
    {
      subject: "CFR Claim Share",
      [state1?.State || "State 1"]: d1.cfrShare,
      [state2?.State || "State 2"]: d2.cfrShare,
      ...(state3 ? { [state3.State]: d3.cfrShare } : {}),
      ...(showBenchmark ? { "National Benchmark": nationalBenchmark.cfrShare } : {}),
      fullMark: 100,
    },
    {
      subject: "SDLC Throughput",
      [state1?.State || "State 1"]: d1.throughput,
      [state2?.State || "State 2"]: d2.throughput,
      ...(state3 ? { [state3.State]: d3.throughput } : {}),
      ...(showBenchmark ? { "National Benchmark": Math.round(100 - nationalBenchmark.bottleneckRate) } : {}),
      fullMark: 100,
    },
    {
      subject: "Acceptance Rate",
      [state1?.State || "State 1"]: d1.clearance,
      [state2?.State || "State 2"]: d2.clearance,
      ...(state3 ? { [state3.State]: d3.clearance } : {}),
      ...(showBenchmark ? { "National Benchmark": Math.round(100 - nationalBenchmark.rejectionRate) } : {}),
      fullMark: 100,
    },
    {
      subject: "Pipeline Stability",
      [state1?.State || "State 1"]: d1.stability,
      [state2?.State || "State 2"]: d2.stability,
      ...(state3 ? { [state3.State]: d3.stability } : {}),
      ...(showBenchmark ? { "National Benchmark": Math.round(100 - nationalBenchmark.avgRiskScore) } : {}),
      fullMark: 100,
    },
  ];

  // Helper for Delta rendering vs National Benchmark
  const renderDelta = (stateVal: number, benchmarkVal: number, invertGood: boolean = false) => {
    const diff = Math.round((stateVal - benchmarkVal) * 10) / 10;
    if (Math.abs(diff) < 0.1) return <span className="text-muted-foreground text-[10px]">≈ Benchmark</span>;
    const isPositive = diff > 0;
    const isGood = invertGood ? !isPositive : isPositive;

    return (
      <span
        className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-bold ${
          isGood ? "text-emerald-400" : "text-rose-400"
        }`}
      >
        {isPositive ? "+" : ""}
        {diff}% {isGood ? "▲" : "▼"}
      </span>
    );
  };

  const handleAskCopilotComparative = () => {
    const query = `Please provide a comparative FRA policy analysis between ${state1?.State || "State 1"} (Risk: ${state1?.ML_Risk_Score.toFixed(0)}, Rejection: ${(state1?.Rejection_Rate * 100).toFixed(1)}%) and ${state2?.State || "State 2"} (Risk: ${state2?.ML_Risk_Score.toFixed(0)}, Rejection: ${(state2?.Rejection_Rate * 100).toFixed(1)}%) against the National Benchmark for ${currentMonth}. What administrative actions can the lagging state replicate?`;
    window.dispatchEvent(
      new CustomEvent("vandrishti:trigger-assistant", {
        detail: { query },
      })
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#0C1A15] border border-[#B7E64B]/30 rounded-2xl shadow-2xl text-[#E4EDE7] p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#B7E64B]/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#B7E64B] tracking-wider uppercase">
              <Scale size={16} />
              <span>State Comparison & National Benchmarking</span>
              <span className="px-2 py-0.5 rounded bg-[#B7E64B]/10 border border-[#B7E64B]/30 text-[#B7E64B]">
                {currentMonth}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">Cross-State Operational Disparity Analysis</h2>
            <p className="text-xs text-[#789883]">
              Evaluate administrative disposal velocity, CFR claim adoption, and bottleneck vulnerabilities across state boundaries.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#122A20] border border-[#B7E64B]/20 hover:border-[#B7E64B] text-[#789883] hover:text-[#B7E64B] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* State Selectors Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#081410] p-3.5 rounded-xl border border-[#B7E64B]/15">
          {/* State 1 */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#789883] uppercase tracking-wider block">
              Primary State (Focus):
            </label>
            <select
              value={state1Name}
              onChange={(e) => setState1Name(e.target.value)}
              className="w-full bg-[#122A20] border border-[#B7E64B]/30 rounded-lg px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-[#B7E64B]"
            >
              {allStates.map((s) => (
                <option key={s.State} value={s.State}>
                  {s.State} ({s.ML_Risk_Level})
                </option>
              ))}
            </select>
          </div>

          {/* State 2 */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#789883] uppercase tracking-wider block">
              Comparative State 2:
            </label>
            <select
              value={state2Name}
              onChange={(e) => setState2Name(e.target.value)}
              className="w-full bg-[#122A20] border border-[#38BDF8]/40 rounded-lg px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
            >
              {allStates.map((s) => (
                <option key={s.State} value={s.State}>
                  {s.State} ({s.ML_Risk_Level})
                </option>
              ))}
            </select>
          </div>

          {/* State 3 (Optional) */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#789883] uppercase tracking-wider block">
              Comparative State 3 (Optional):
            </label>
            <select
              value={state3Name}
              onChange={(e) => setState3Name(e.target.value)}
              className="w-full bg-[#122A20] border border-[#C084FC]/40 rounded-lg px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-[#C084FC]"
            >
              <option value="">-- None (2-Way Compare) --</option>
              {allStates.map((s) => (
                <option key={s.State} value={s.State}>
                  {s.State} ({s.ML_Risk_Level})
                </option>
              ))}
            </select>
          </div>

          {/* Benchmark Controls */}
          <div className="flex flex-col justify-between pt-0.5">
            <label className="text-[10px] font-mono text-[#789883] uppercase tracking-wider block">
              Benchmark Layer:
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBenchmark(!showBenchmark)}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  showBenchmark
                    ? "bg-[#E5A93C]/20 border-[#E5A93C] text-[#E5A93C]"
                    : "bg-[#122A20] border-border text-muted-foreground"
                }`}
              >
                {showBenchmark ? "✓ Benchmark Active" : "+ Add Benchmark"}
              </button>
              <button
                onClick={() => setChartType(chartType === "radar" ? "bar" : "radar")}
                className="p-1.5 rounded-lg bg-[#122A20] border border-[#B7E64B]/20 hover:border-[#B7E64B] text-[#B7E64B] text-xs font-bold"
                title="Toggle Chart Type"
              >
                {chartType === "radar" ? <BarChart3 size={16} /> : <Columns size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Visual Charts & Comparison Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Chart View (5 cols) */}
          <div className="lg:col-span-5 bg-[#081410] border border-[#B7E64B]/15 rounded-xl p-4 flex flex-col items-center justify-center min-h-[340px]">
            <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-[#B7E64B]/10">
              <span className="text-[11px] font-mono text-[#B7E64B] font-bold uppercase tracking-wider">
                Multi-Dimensional Radar
              </span>
              <span className="text-[10px] text-[#789883]">0–100 Normalized</span>
            </div>

            {chartType === "radar" ? (
              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#1e3a2c" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#9EBEA8", fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#5A7364", fontSize: 9 }} />
                    <Radar
                      name={state1?.State || "State 1"}
                      dataKey={state1?.State || "State 1"}
                      stroke="#B7E64B"
                      fill="#B7E64B"
                      fillOpacity={0.4}
                    />
                    <Radar
                      name={state2?.State || "State 2"}
                      dataKey={state2?.State || "State 2"}
                      stroke="#38BDF8"
                      fill="#38BDF8"
                      fillOpacity={0.3}
                    />
                    {state3 && (
                      <Radar
                        name={state3.State}
                        dataKey={state3.State}
                        stroke="#C084FC"
                        fill="#C084FC"
                        fillOpacity={0.25}
                      />
                    )}
                    {showBenchmark && (
                      <Radar
                        name="National Benchmark"
                        dataKey="National Benchmark"
                        stroke="#E5A93C"
                        fill="#E5A93C"
                        fillOpacity={0.15}
                        strokeDasharray="4 4"
                      />
                    )}
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0C1A15",
                        borderColor: "#B7E64B",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={radarData} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e3a2c" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: "#789883", fontSize: 10 }} />
                    <YAxis dataKey="subject" type="category" tick={{ fill: "#9EBEA8", fontSize: 10 }} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0C1A15",
                        borderColor: "#B7E64B",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                    <Bar dataKey={state1?.State || "State 1"} fill="#B7E64B" radius={[0, 4, 4, 0]} />
                    <Bar dataKey={state2?.State || "State 2"} fill="#38BDF8" radius={[0, 4, 4, 0]} />
                    {showBenchmark && (
                      <Bar dataKey="National Benchmark" fill="#E5A93C" radius={[0, 4, 4, 0]} />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Comparative Matrix Table (7 cols) */}
          <div className="lg:col-span-7 bg-[#081410] border border-[#B7E64B]/15 rounded-xl p-4 space-y-3 overflow-x-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#B7E64B]/10">
              <span className="text-[11px] font-mono text-[#B7E64B] font-bold uppercase tracking-wider">
                Operational Telemetry Matrix
              </span>
              <span className="text-[10px] text-[#789883]">Monthly Progress Report (MPR)</span>
            </div>

            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#B7E64B]/20 text-[#789883] font-mono text-[10px]">
                  <th className="py-2 px-2.5">METRIC / INDICATOR</th>
                  <th className="py-2 px-2.5 text-[#B7E64B] font-bold">{state1?.State || "State 1"}</th>
                  <th className="py-2 px-2.5 text-[#38BDF8] font-bold">{state2?.State || "State 2"}</th>
                  {state3 && <th className="py-2 px-2.5 text-[#C084FC] font-bold">{state3.State}</th>}
                  {showBenchmark && <th className="py-2 px-2.5 text-[#E5A93C] font-bold">National Median</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {/* Risk Score */}
                <tr className="hover:bg-card/40">
                  <td className="py-2 px-2.5 font-semibold text-white">ML Risk Score & Tier</td>
                  <td className="py-2 px-2.5">
                    <span
                      className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                        state1?.ML_Risk_Level === "High Risk"
                          ? "bg-rose-950 text-rose-300 border border-rose-800"
                          : state1?.ML_Risk_Level === "Attention"
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      }`}
                    >
                      {state1?.ML_Risk_Score.toFixed(1)} ({state1?.ML_Risk_Level})
                    </span>
                  </td>
                  <td className="py-2 px-2.5">
                    <span
                      className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                        state2?.ML_Risk_Level === "High Risk"
                          ? "bg-rose-950 text-rose-300 border border-rose-800"
                          : state2?.ML_Risk_Level === "Attention"
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      }`}
                    >
                      {state2?.ML_Risk_Score.toFixed(1)} ({state2?.ML_Risk_Level})
                    </span>
                  </td>
                  {state3 && (
                    <td className="py-2 px-2.5 font-mono text-[11px]">
                      {state3.ML_Risk_Score.toFixed(1)} ({state3.ML_Risk_Level})
                    </td>
                  )}
                  {showBenchmark && (
                    <td className="py-2 px-2.5 font-mono text-[11px] text-[#E5A93C]">
                      {nationalBenchmark.avgRiskScore.toFixed(1)}
                    </td>
                  )}
                </tr>

                {/* Total Claims */}
                <tr className="hover:bg-card/40">
                  <td className="py-2 px-2.5 text-[#9EBEA8]">Total Claims Received</td>
                  <td className="py-2 px-2.5 font-mono font-bold text-white">
                    {state1?.Total_Claims_Received.toLocaleString()}
                  </td>
                  <td className="py-2 px-2.5 font-mono font-bold text-white">
                    {state2?.Total_Claims_Received.toLocaleString()}
                  </td>
                  {state3 && (
                    <td className="py-2 px-2.5 font-mono text-white">
                      {state3.Total_Claims_Received.toLocaleString()}
                    </td>
                  )}
                  {showBenchmark && (
                    <td className="py-2 px-2.5 font-mono text-[#789883]">
                      {(summaryStats?.Total_Claims_Received / Math.max(1, summaryStats?.total_states || 21)).toLocaleString(
                        undefined,
                        { maximumFractionDigits: 0 }
                      )}{" "}
                      (avg)
                    </td>
                  )}
                </tr>

                {/* Disposal Rate */}
                <tr className="hover:bg-card/40">
                  <td className="py-2 px-2.5 text-[#9EBEA8]">Disposal Rate</td>
                  <td className="py-2 px-2.5 font-mono">
                    <b>{d1.disposal}%</b>{" "}
                    {showBenchmark && renderDelta(d1.disposal, nationalBenchmark.disposalRate)}
                  </td>
                  <td className="py-2 px-2.5 font-mono">
                    <b>{d2.disposal}%</b>{" "}
                    {showBenchmark && renderDelta(d2.disposal, nationalBenchmark.disposalRate)}
                  </td>
                  {state3 && <td className="py-2 px-2.5 font-mono">{d3.disposal}%</td>}
                  {showBenchmark && (
                    <td className="py-2 px-2.5 font-mono text-[#E5A93C]">{nationalBenchmark.disposalRate}%</td>
                  )}
                </tr>

                {/* Rejection Rate */}
                <tr className="hover:bg-card/40">
                  <td className="py-2 px-2.5 text-[#9EBEA8]">Rejection Rate</td>
                  <td className="py-2 px-2.5 font-mono">
                    <b className={state1 && state1.Rejection_Rate > 0.4 ? "text-rose-400" : ""}>
                      {state1 ? (state1.Rejection_Rate * 100).toFixed(1) : 0}%
                    </b>{" "}
                    {showBenchmark &&
                      state1 &&
                      renderDelta(state1.Rejection_Rate * 100, nationalBenchmark.rejectionRate, true)}
                  </td>
                  <td className="py-2 px-2.5 font-mono">
                    <b className={state2 && state2.Rejection_Rate > 0.4 ? "text-rose-400" : ""}>
                      {state2 ? (state2.Rejection_Rate * 100).toFixed(1) : 0}%
                    </b>{" "}
                    {showBenchmark &&
                      state2 &&
                      renderDelta(state2.Rejection_Rate * 100, nationalBenchmark.rejectionRate, true)}
                  </td>
                  {state3 && (
                    <td className="py-2 px-2.5 font-mono">{(state3.Rejection_Rate * 100).toFixed(1)}%</td>
                  )}
                  {showBenchmark && (
                    <td className="py-2 px-2.5 font-mono text-[#E5A93C]">{nationalBenchmark.rejectionRate}%</td>
                  )}
                </tr>

                {/* Workflow Bottleneck Rate */}
                <tr className="hover:bg-card/40">
                  <td className="py-2 px-2.5 text-[#9EBEA8]">SDLC-DLC Bottleneck Rate</td>
                  <td className="py-2 px-2.5 font-mono">
                    <b>{state1 ? (state1.Workflow_Bottleneck_Rate * 100).toFixed(1) : 0}%</b>{" "}
                    {showBenchmark &&
                      state1 &&
                      renderDelta(state1.Workflow_Bottleneck_Rate * 100, nationalBenchmark.bottleneckRate, true)}
                  </td>
                  <td className="py-2 px-2.5 font-mono">
                    <b>{state2 ? (state2.Workflow_Bottleneck_Rate * 100).toFixed(1) : 0}%</b>{" "}
                    {showBenchmark &&
                      state2 &&
                      renderDelta(state2.Workflow_Bottleneck_Rate * 100, nationalBenchmark.bottleneckRate, true)}
                  </td>
                  {state3 && (
                    <td className="py-2 px-2.5 font-mono">{(state3.Workflow_Bottleneck_Rate * 100).toFixed(1)}%</td>
                  )}
                  {showBenchmark && (
                    <td className="py-2 px-2.5 font-mono text-[#E5A93C]">{nationalBenchmark.bottleneckRate}%</td>
                  )}
                </tr>

                {/* MoM Backlog Growth */}
                <tr className="hover:bg-card/40">
                  <td className="py-2 px-2.5 text-[#9EBEA8]">MoM Backlog Growth</td>
                  <td className="py-2 px-2.5 font-mono">
                    <span className={state1 && state1.Pending_Backlog_Growth > 0 ? "text-amber-400 font-bold" : "text-emerald-400"}>
                      {state1 && state1.Pending_Backlog_Growth > 0 ? "+" : ""}
                      {state1?.Pending_Backlog_Growth.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-2 px-2.5 font-mono">
                    <span className={state2 && state2.Pending_Backlog_Growth > 0 ? "text-amber-400 font-bold" : "text-emerald-400"}>
                      {state2 && state2.Pending_Backlog_Growth > 0 ? "+" : ""}
                      {state2?.Pending_Backlog_Growth.toLocaleString()}
                    </span>
                  </td>
                  {state3 && (
                    <td className="py-2 px-2.5 font-mono">
                      {state3.Pending_Backlog_Growth > 0 ? "+" : ""}
                      {state3.Pending_Backlog_Growth.toLocaleString()}
                    </td>
                  )}
                  {showBenchmark && <td className="py-2 px-2.5 font-mono text-[#789883]">0 claims</td>}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Synthesis & Copilot Callout */}
        <div className="bg-[#081410] border border-[#B7E64B]/20 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#B7E64B]">
              <Sparkles size={15} />
              <span>Comparative Policy Synthesis</span>
            </div>
            <p className="text-[#9EBEA8] leading-relaxed text-[11px]">
              {state1 && state2 ? (
                <>
                  <b>{state1.State}</b> records an ML Risk Score of <b>{state1.ML_Risk_Score.toFixed(0)}</b> compared
                  to <b>{state2.State}</b> at <b>{state2.ML_Risk_Score.toFixed(0)}</b>.{" "}
                  {state1.Rejection_Rate > state2.Rejection_Rate
                    ? `${state1.State} exhibits an elevated rejection pattern (+${((state1.Rejection_Rate - state2.Rejection_Rate) * 100).toFixed(1)}% higher than ${state2.State}), suggesting Section 6(2) appellate hearings should be accelerated.`
                    : `${state2.State} exhibits higher rejection pressures (+${((state2.Rejection_Rate - state1.Rejection_Rate) * 100).toFixed(1)}% higher than ${state1.State}).`}
                </>
              ) : (
                "Select states to view real-time comparative governance synthesis."
              )}
            </p>
          </div>

          <button
            onClick={handleAskCopilotComparative}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-[#B7E64B] text-[#0C1A15] font-bold text-xs hover:bg-[#cbf75b] transition-all flex items-center gap-2 shadow-lg shadow-[#B7E64B]/10"
          >
            <Sparkles size={15} />
            <span>Ask Copilot for Comparative Strategy</span>
          </button>
        </div>
      </div>
    </div>
  );
}
