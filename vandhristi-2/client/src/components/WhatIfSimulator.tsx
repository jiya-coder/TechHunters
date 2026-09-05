import React, { useState, useMemo } from "react";
import {
  X,
  Sliders,
  Sparkles,
  RotateCcw,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Users,
  Building2,
  HelpCircle,
} from "lucide-react";
import { StateDSSData } from "./LeafletRiskMap";

interface WhatIfSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  state: StateDSSData | null;
  currentMonth: string;
}

export default function WhatIfSimulator({
  isOpen,
  onClose,
  state,
  currentMonth,
}: WhatIfSimulatorProps) {
  // Policy Lever State
  const [sdlcClearanceLever, setSdlcClearanceLever] = useState<number>(0); // -60% to +40%
  const [rejectionReviewLever, setRejectionReviewLever] = useState<number>(0); // -30% to +20%
  const [cfrMobilizationLever, setCfrMobilizationLever] = useState<number>(0); // 0% to +100%

  if (!isOpen || !state) return null;

  // Baseline Metrics
  const baseScore = state.ML_Risk_Score;
  const baseLevel = state.ML_Risk_Level;
  const basePending = state.Pending_Claims;
  const baseRejectionRate = state.Rejection_Rate;
  const baseBottleneck = state.Workflow_Bottleneck_Rate;
  const totalClaims = Math.max(1, state.Total_Claims_Received);

  // Simulation Calculations
  const simPendingClaims = Math.max(
    0,
    Math.round(basePending * (1 + sdlcClearanceLever / 100))
  );
  const simPendingRate = simPendingClaims / totalClaims;

  const simRejectionRate = Math.max(
    0.005,
    Math.min(0.99, baseRejectionRate + rejectionReviewLever / 100)
  );

  const simBottleneckRate = Math.max(
    0,
    Math.min(0.95, baseBottleneck * (1 + sdlcClearanceLever / 100))
  );

  // Recalculate ML Risk Score delta based on Isolation Forest sensitivity
  const deltaBottleneck = (simBottleneckRate - baseBottleneck) * 45;
  const deltaRejection = (simRejectionRate - baseRejectionRate) * 40;
  const deltaClearance = (sdlcClearanceLever / 100) * 20;

  const calculatedSimScore = Math.max(
    0,
    Math.min(100, Math.round((baseScore + deltaBottleneck + deltaRejection + deltaClearance) * 10) / 10)
  );

  const scoreDelta = Math.round((calculatedSimScore - baseScore) * 10) / 10;
  const pctImprovement =
    baseScore > 0 ? Math.round(((baseScore - calculatedSimScore) / baseScore) * 100) : 0;

  // Simulated Risk Tier
  let simLevel: "Normal" | "Attention" | "High Risk" = "Normal";
  if (calculatedSimScore >= 65) {
    simLevel = "High Risk";
  } else if (calculatedSimScore >= 40) {
    simLevel = "Attention";
  } else {
    simLevel = "Normal";
  }

  // Presets
  const applyPreset = (sdlc: number, rej: number, cfr: number) => {
    setSdlcClearanceLever(sdlc);
    setRejectionReviewLever(rej);
    setCfrMobilizationLever(cfr);
  };

  const handleReset = () => {
    setSdlcClearanceLever(0);
    setRejectionReviewLever(0);
    setCfrMobilizationLever(0);
  };

  // AI Copilot Integration
  const handleAskCopilot = () => {
    const prompt = `### What-If Policy Simulation Evaluation: ${state.State} (${currentMonth})

**Simulated Policy Interventions:**
1. SDLC Backlog Clearance Target: ${sdlcClearanceLever > 0 ? "+" : ""}${sdlcClearanceLever}%
2. Rejection Review & Section 6(2) Appeal Resolution: ${rejectionReviewLever > 0 ? "+" : ""}${rejectionReviewLever}%
3. Gram Sabha CFR Mobilization Drive: +${cfrMobilizationLever}%

**Projected Administrative Outcomes:**
- Baseline Risk: ${baseScore.toFixed(1)} (${baseLevel}) ➔ Simulated Risk: ${calculatedSimScore.toFixed(1)} (${simLevel}) [Delta: ${scoreDelta > 0 ? "+" : ""}${scoreDelta} pts]
- Projected Pending Claims: ${simPendingClaims.toLocaleString()} (was ${basePending.toLocaleString()})
- Projected Rejection Rate: ${(simRejectionRate * 100).toFixed(1)}% (was ${(baseRejectionRate * 100).toFixed(1)}%)
- Projected SDLC-DLC Bottleneck: ${(simBottleneckRate * 100).toFixed(1)}% (was ${(baseBottleneck * 100).toFixed(1)}%)

Please evaluate this intervention scenario under FRA 2006 Rules 12A & 14. Detail administrative feasibility, required mobile SDLC units, and priority district instructions.`;

    window.dispatchEvent(
      new CustomEvent("vandrishti:trigger-assistant", {
        detail: { query: prompt },
      })
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0C1A15] border border-[#B7E64B]/30 rounded-2xl shadow-2xl text-[#E4EDE7] p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#B7E64B]/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#B7E64B] tracking-wider uppercase">
              <Sliders size={16} />
              <span>AI Copilot & Policy Intervention Simulator</span>
              <span className="px-2 py-0.5 rounded bg-[#B7E64B]/10 border border-[#B7E64B]/30 text-[#B7E64B]">
                {state.State} · {currentMonth}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">Simulate Administrative Levers & Risk Outcomes</h2>
            <p className="text-xs text-[#789883]">
              Model how targeted clearance drives, appellate reviews under Section 6(2), and CFR mobilization alter state ML anomaly risk scores.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#122A20] border border-[#B7E64B]/20 hover:border-[#B7E64B] text-[#789883] hover:text-[#B7E64B] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Top Outcome Comparison Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#081410] border border-[#B7E64B]/20 rounded-xl p-4 items-center">
          {/* Baseline State */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#789883] uppercase tracking-wider block">
              Current Baseline ({state.Month})
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">{baseScore.toFixed(1)}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  baseLevel === "High Risk"
                    ? "bg-rose-950 text-rose-300 border border-rose-800"
                    : baseLevel === "Attention"
                    ? "bg-amber-950 text-amber-300 border border-amber-800"
                    : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                }`}
              >
                {baseLevel}
              </span>
            </div>
            <span className="text-[11px] text-[#789883] block">
              Rejection: {(baseRejectionRate * 100).toFixed(1)}% · Bottleneck: {(baseBottleneck * 100).toFixed(1)}%
            </span>
          </div>

          {/* Transition Indicator */}
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#122A20]/60 border border-[#B7E64B]/15 text-center">
            <div className="flex items-center gap-2 text-xs font-bold text-[#B7E64B]">
              <span>Scenario Delta</span>
              <ArrowRight size={14} />
            </div>
            <div className="mt-1 font-mono text-base font-bold flex items-center gap-1.5">
              {scoreDelta <= 0 ? (
                <span className="text-emerald-400 flex items-center">
                  <TrendingDown size={16} className="mr-0.5" />
                  {scoreDelta} pts ({pctImprovement}% drop)
                </span>
              ) : (
                <span className="text-rose-400 flex items-center">
                  <TrendingUp size={16} className="mr-0.5" />
                  +{scoreDelta} pts
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#789883] mt-0.5">Projected Risk Shift</span>
          </div>

          {/* Simulated State */}
          <div className="space-y-1 md:text-right">
            <span className="text-[10px] font-mono text-[#B7E64B] uppercase tracking-wider block">
              Simulated Projected Outcome
            </span>
            <div className="flex items-baseline md:justify-end gap-2">
              <span className="text-2xl font-bold font-mono text-white">{calculatedSimScore.toFixed(1)}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  simLevel === "High Risk"
                    ? "bg-rose-950 text-rose-300 border border-rose-800 animate-pulse"
                    : simLevel === "Attention"
                    ? "bg-amber-950 text-amber-300 border border-amber-800"
                    : "bg-emerald-950 text-emerald-300 border border-emerald-800 shadow-sm"
                }`}
              >
                {simLevel}
              </span>
            </div>
            <span className="text-[11px] text-[#9EBEA8] block">
              Rejection: {(simRejectionRate * 100).toFixed(1)}% · Bottleneck: {(simBottleneckRate * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Preset Intervention Packages */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-[#789883] uppercase tracking-wider block">
            Recommended Policy Presets:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <button
              onClick={() => applyPreset(-40, -15, 30)}
              className="p-2.5 text-left rounded-xl bg-[#081410] border border-[#B7E64B]/20 hover:border-[#B7E64B] transition-all group"
            >
              <b className="text-xs text-white group-hover:text-[#B7E64B] block">
                ⚡ 100-Day Clearance Drive
              </b>
              <span className="text-[10px] text-[#789883] block mt-0.5">
                -40% SDLC Backlog, -15% Rejection, +30% CFR mobilization
              </span>
            </button>

            <button
              onClick={() => applyPreset(-20, -25, 20)}
              className="p-2.5 text-left rounded-xl bg-[#081410] border border-[#B7E64B]/20 hover:border-[#B7E64B] transition-all group"
            >
              <b className="text-xs text-white group-hover:text-[#B7E64B] block">
                ⚖️ Rule 12A Appellate Review
              </b>
              <span className="text-[10px] text-[#789883] block mt-0.5">
                -20% SDLC Backlog, -25% Rejection reconsideration
              </span>
            </button>

            <button
              onClick={() => applyPreset(-25, -10, 80)}
              className="p-2.5 text-left rounded-xl bg-[#081410] border border-[#B7E64B]/20 hover:border-[#B7E64B] transition-all group"
            >
              <b className="text-xs text-white group-hover:text-[#B7E64B] block">
                🌳 Gram Sabha CFR Campaign
              </b>
              <span className="text-[10px] text-[#789883] block mt-0.5">
                +80% Community Forest Resource claims under 3(1)(i)
              </span>
            </button>
          </div>
        </div>

        {/* Interactive Sliders (Policy Levers) */}
        <div className="space-y-4 bg-[#081410] p-4 rounded-xl border border-[#B7E64B]/15">
          {/* Lever 1: SDLC Clearance Acceleration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Building2 size={15} className="text-[#B7E64B]" />
                <span className="font-bold text-white">SDLC Backlog Clearance Target</span>
              </div>
              <span className="font-mono font-bold text-[#B7E64B] text-xs">
                {sdlcClearanceLever > 0 ? `+${sdlcClearanceLever}% Delay` : `${sdlcClearanceLever}% Cleared`}
              </span>
            </div>
            <input
              type="range"
              min="-60"
              max="40"
              step="5"
              value={sdlcClearanceLever}
              onChange={(e) => setSdlcClearanceLever(Number(e.target.value))}
              className="w-full accent-[#B7E64B] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#789883]">
              <span>-60% Rapid Clearance (Mobile Units)</span>
              <span>0% Baseline</span>
              <span>+40% Accumulation</span>
            </div>
          </div>

          {/* Lever 2: Rejection Review & Appeal Resolution */}
          <div className="space-y-2 pt-2 border-t border-[#B7E64B]/10">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileCheck size={15} className="text-[#38BDF8]" />
                <span className="font-bold text-white">Rejection Review & Section 6(2) Resolution</span>
              </div>
              <span className="font-mono font-bold text-[#38BDF8] text-xs">
                {rejectionReviewLever > 0 ? `+${rejectionReviewLever}% Rejection` : `${rejectionReviewLever}% Re-examined`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="20"
              step="2"
              value={rejectionReviewLever}
              onChange={(e) => setRejectionReviewLever(Number(e.target.value))}
              className="w-full accent-[#38BDF8] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#789883]">
              <span>-30% Appellate Reversal (Due Hearing)</span>
              <span>0% Baseline</span>
              <span>+20% High Rejection</span>
            </div>
          </div>

          {/* Lever 3: Gram Sabha CFR Mobilization */}
          <div className="space-y-2 pt-2 border-t border-[#B7E64B]/10">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Users size={15} className="text-[#C084FC]" />
                <span className="font-bold text-white">Gram Sabha CFR Mobilization Drive</span>
              </div>
              <span className="font-mono font-bold text-[#C084FC] text-xs">
                +{cfrMobilizationLever}% CFR Adoption
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={cfrMobilizationLever}
              onChange={(e) => setCfrMobilizationLever(Number(e.target.value))}
              className="w-full accent-[#C084FC] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#789883]">
              <span>0% Standard Inflow</span>
              <span>+50% Village Mobilization</span>
              <span>+100% Comprehensive Titling</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Copilot Trigger */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-[#122A20] border border-[#B7E64B]/20 hover:border-[#B7E64B] text-xs font-semibold text-[#789883] hover:text-white transition-colors flex items-center gap-1.5"
          >
            <RotateCcw size={14} />
            <span>Reset All Levers</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#122A20] border border-border text-xs font-semibold text-[#789883] hover:text-white transition-colors"
            >
              Close
            </button>

            <button
              onClick={handleAskCopilot}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#B7E64B] text-[#0C1A15] font-bold text-xs hover:bg-[#cbf75b] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#B7E64B]/20"
            >
              <Sparkles size={16} />
              <span>Ask AI Copilot to Evaluate Scenario</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
