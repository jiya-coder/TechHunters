import { useState } from "react";
import { 
  ArrowUpRight, 
  Download, 
  FileText, 
  Search, 
  ShieldCheck, 
  Users, 
  ExternalLink, 
  FileCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Scale,
  Landmark,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Layers,
  FileSpreadsheet
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

const pdfResources = [
  {
    icon: FileText,
    label: "FRA Act, 2006 Statute (Official Gazette)",
    meta: "Official Legislation · Act No. 2 of 2007 · 48 Pages · Verified PDF",
    fileUrl: "/documents/FRA_Act_2006_Statute.pdf",
    fileName: "FRA_Act_2006_Statute.pdf",
    externalUrl: "https://tribal.nic.in/FRA.aspx",
    category: "Statutory Law",
    size: "145 KB",
  },
  {
    icon: Users,
    label: "Gram Sabha Implementation Playbook",
    meta: "Field Guide & Forest Rights Committee Verification Manual · Verified PDF",
    fileUrl: "/documents/Gram_Sabha_Implementation_Playbook.pdf",
    fileName: "Gram_Sabha_Implementation_Playbook.pdf",
    externalUrl: "https://tribal.nic.in/FRA.aspx",
    category: "Field Operations",
    size: "128 KB",
  },
  {
    icon: ShieldCheck,
    label: "Title Verification Policy Brief",
    meta: "DLC Approval Guidelines & Bottleneck Directives · Verified PDF",
    fileUrl: "/documents/Title_Verification_Policy_Brief.pdf",
    fileName: "Title_Verification_Policy_Brief.pdf",
    externalUrl: "https://tribal.nic.in/FRA.aspx",
    category: "Policy Directives",
    size: "132 KB",
  },
];

const statutorySteps = [
  {
    num: "01",
    id: "gram-sabha",
    title: "Gram Sabha & FRC",
    tagline: "Community Verification & FRC Resolution",
    authority: "Gram Sabha (Village Assembly) & Forest Rights Committee (FRC)",
    overview: "The foundational village-level democratic body responsible for receiving, investigating, physically verifying, and passing formal resolutions on forest rights claims.",
    composition: "Forest Rights Committee (10–15 elected members, minimum 1/3 ST & 1/3 women members).",
    icon: Users,
    workflow: [
      {
        title: "Claim Submission",
        desc: "Forest dwellers submit Form A (Individual Rights) or Form B (Community Rights) along with supporting evidence (elder testimonies, boundary markers, receipts)."
      },
      {
        title: "Joint Field Verification",
        desc: "FRC conducts physical ground inspections alongside Forest and Revenue department officials using GPS boundary mapping to verify continuous occupation."
      },
      {
        title: "Public Hearing & Objections",
        desc: "FRC presents field verification findings in open Gram Sabha to hear and resolve public boundary disputes or conflicting land claims."
      },
      {
        title: "Gram Sabha Resolution",
        desc: "The Gram Sabha votes and passes a formal resolution approving or rejecting claims, then forwards sanctioned records to the Sub-Divisional Committee."
      }
    ],
    rules: [
      "Quorum of at least 50% village members (with 33% women) required for valid Gram Sabha meeting.",
      "Gram Sabha holds exclusive statutory authority to initiate the claim recognition process."
    ],
    documents: ["Form A (Individual Claim)", "Form B (Community Rights)", "GPS Boundary Coordinates", "Elder Testimonies & Historical Receipts"]
  },
  {
    num: "02",
    id: "sdlc",
    title: "SDLC Scrutiny",
    tagline: "Sub-Divisional Committee Review & Scrutiny",
    authority: "Sub-Divisional Level Committee (Chaired by Sub-Divisional Magistrate - SDM)",
    overview: "Sub-divisional committee that audits Gram Sabha resolutions, verifies statutory eligibility criteria under FRA 2006, and processes initial appeals.",
    composition: "Sub-Divisional Magistrate (Chair), Sub-Divisional Forest Officer, Block Revenue Officer, Tribal Welfare Officer, and 3 Panchayati Raj representatives.",
    icon: Scale,
    workflow: [
      {
        title: "Resolution & Map Scrutiny",
        desc: "SDLC audits Gram Sabha resolutions for legal completeness and checks claims against statutory eligibility criteria."
      },
      {
        title: "Spatial Map Aggregation",
        desc: "Consolidates individual village maps into block and sub-divisional master spatial boundaries."
      },
      {
        title: "60-Day Appeal Hearings",
        desc: "Processes appeals from any claimant or community aggrieved by a Gram Sabha resolution within the statutory 60-day window."
      },
      {
        title: "Draft Record Submission",
        desc: "Prepares draft Record of Rights (RoR) and transmits approved recommendations to the District Level Committee for final sanction."
      }
    ],
    rules: [
      "Mandatory 60-day window for filing appeals against Gram Sabha resolutions.",
      "Verifies 3-generation (75-year) residence rule for Other Traditional Forest Dwellers (OTFD)."
    ],
    documents: ["Gram Sabha Resolution Copy", "Block Boundary Overlay Map", "Appeals Petition (if applicable)", "SDLC Scrutiny Sheet"]
  },
  {
    num: "03",
    id: "dlc",
    title: "DLC Approval",
    tagline: "District Level Committee Approval & Sanction",
    authority: "District Level Committee (Chaired by District Collector / Magistrate - DM)",
    overview: "The statutory final approving authority under FRA 2006. The DLC's decision to grant or reject a title is legally binding.",
    composition: "District Collector/DM (Chair), Divisional Forest Officer (DFO), District Tribal Welfare Officer, and 3 Panchayati Raj representatives.",
    icon: Landmark,
    workflow: [
      {
        title: "Final Administrative Review",
        desc: "DLC evaluates SDLC recommendations and resolves inter-departmental conflicts between Forest and Revenue department maps."
      },
      {
        title: "Disposal of Final Appeals",
        desc: "Hears and disposes of final administrative appeals filed against SDLC orders within 60 days."
      },
      {
        title: "Formal Title Sanction",
        desc: "Grants final sanction and orders the issuance of land title certificates for Individual (IFR) and Community (CFR/CFRR) rights."
      },
      {
        title: "Direction for Record Mutation",
        desc: "Directs state Revenue and Forest departments to officially mutate government land registers and Khasra records."
      }
    ],
    rules: [
      "DLC decision is final and binding under Section 6(6) of FRA 2006.",
      "No land claim can be rejected without providing written reasons and giving a hearing opportunity."
    ],
    documents: ["SDLC Recommendation File", "District Collector Approval Order", "Final Title Certificate Draft", "Joint Verification Boundary Map"]
  },
  {
    num: "04",
    id: "title",
    title: "Title & Mutation",
    tagline: "Recognition & Record of Rights Entry",
    authority: "District Revenue Administration & State Forest Department",
    overview: "The final execution stage where formal title certificates (Patta) are handed over and revenue/forest records are permanently updated.",
    composition: "District Revenue Officials, Tehsildar, and Range Forest Officers.",
    icon: ShieldCheck,
    workflow: [
      {
        title: "Joint Title Registration",
        desc: "Issues official Title (Patta) registered jointly in the names of both spouses (or sole head of household)."
      },
      {
        title: "Record of Rights (RoR) Mutation",
        desc: "State revenue registers (Khasra/Khatauni) and forest compartment registers are mutated to reflect legal rights."
      },
      {
        title: "Inalienable Protection",
        desc: "Rights are legally recognized as heritable, non-transferable, and non-alienable (cannot be sold or mortgaged)."
      },
      {
        title: "Scheme Convergence",
        desc: "Integrates title holders into PM-KISAN, MGNREGA land development, housing subsidies, and MSP for Minor Forest Produce."
      }
    ],
    rules: [
      "Mandatory joint ownership in the name of husband and wife.",
      "Forest land cannot be transferred, sold, or diverted for non-forest commercial use."
    ],
    documents: ["Official Title Certificate (Patta)", "Mutated Khasra/Khatauni Entry", "Forest Compartment Register Record", "Beneficiary ID Card"]
  }
];

export default function Knowledge() {
  const [theme, setTheme] = useState<"morning" | "dusk">("dusk");
  const [query, setQuery] = useState("");
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const shownResources = pdfResources.filter((item) =>
    `${item.label} ${item.meta} ${item.category}`.toLowerCase().includes(query.toLowerCase())
  );

  const currentStep = statutorySteps[activeStepIndex];

  return (
    <div className={`site-shell page-shell ${theme === "dusk" ? "theme-dusk" : "theme-morning"}`}>
      <SiteHeader theme={theme} onToggleTheme={() => setTheme(theme === "morning" ? "dusk" : "morning")} />
      
      <main className="inner-page knowledge-section">
        <div className="container max-w-6xl mx-auto py-8">
          <div className="page-intro mb-8">
            <span className="eyebrow">03 / Forest Rights Act · Official Repository</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Know the <em>framework.</em></h1>
            <p className="text-base md:text-lg text-white mt-2 max-w-3xl font-medium opacity-95">
              Access and download official statutory legislation, Gram Sabha field guide manuals, and District Committee policy briefs in verified PDF format.
            </p>
          </div>

          {/* Prominent Expanded Downloadable Files & Briefings Repository Section */}
          <div className="w-full bg-card/90 backdrop-blur-md rounded-2xl border border-border p-6 md:p-10 shadow-2xl mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border mb-8">
              <div>
                <span className="eyebrow text-primary text-xs uppercase tracking-widest font-bold block mb-1">
                  OFFICIAL DOCUMENT REPOSITORY
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
                  Downloadable Files & Briefings
                </h2>
                <p className="text-xs md:text-sm text-white/90 mt-1 font-medium">
                  Verified PDF publications ready for administrative review, field verification, and statutory guidance.
                </p>
              </div>

              {/* Enhanced Search Input */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Search PDF documents & statutory files..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background/80 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                />
              </div>
            </div>

            {/* Expanded Document Grid List */}
            <div className="space-y-4">
              {shownResources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <div
                    key={resource.label}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-border/80 bg-background/60 hover:bg-background hover:border-primary/50 transition-all shadow-sm"
                  >
                    <div className="flex items-start md:items-center gap-4">
                      <div className="p-3.5 rounded-xl bg-primary/15 text-primary shrink-0">
                        <Icon size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                            {resource.category}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-semibold">
                            PDF ({resource.size})
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground">{resource.label}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{resource.meta}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center pt-2 md:pt-0">
                      <a
                        href={resource.fileUrl}
                        download={resource.fileName}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md hover:scale-[1.02] cursor-pointer"
                        title={`Download ${resource.fileName}`}
                      >
                        <Download size={16} /> Download PDF
                      </a>
                      <a
                        href={resource.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary transition-all"
                        title="View on official MoTA Portal"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Repository Footer Link */}
            <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground flex items-center gap-2">
                <FileCheck size={16} className="text-emerald-500" /> All documents verified against official Ministry of Tribal Affairs gazette notices.
              </span>
              <a
                href="https://tribal.nic.in/FRA.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity"
              >
                Visit Official MoTA FRA Portal <ArrowUpRight size={16} />
              </a>
            </div>
          </div>

          {/* Statutory Process Journey Interactive Section */}
          <div className="w-full bg-card/90 backdrop-blur-md rounded-2xl border border-border p-6 md:p-10 shadow-2xl mt-12">
            <div className="timeline-head flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
              <div>
                <span className="eyebrow text-primary text-xs uppercase tracking-widest font-bold block mb-1">
                  A CLAIM'S STATUTORY JOURNEY
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
                  Procedural Workflow Breakdown
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Click on any step below to explore its statutory authority, step-by-step verification procedure, and required compliance rules.
                </p>
              </div>
              <span className="mono-label text-xs text-primary font-bold px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 self-start md:self-auto">
                04 STATUTORY STEPS
              </span>
            </div>

            {/* Interactive Timeline Track */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {statutorySteps.map((step, idx) => {
                const isActive = idx === activeStepIndex;
                const Icon = step.icon;
                return (
                  <button
                    key={step.num}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`text-left p-5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                      isActive
                        ? "bg-primary/15 border-primary shadow-lg ring-1 ring-primary/50"
                        : "bg-background/50 border-border/70 hover:bg-background hover:border-primary/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs transition-all ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-md scale-110"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step.num}
                        </span>
                        <Icon size={18} className={isActive ? "text-primary" : "text-muted-foreground"} />
                      </div>
                      <h3 className={`text-base font-bold mb-1 ${isActive ? "text-primary" : "text-foreground"}`}>
                        {step.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{step.tagline}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px]">
                      <span className={isActive ? "font-bold text-primary" : "text-muted-foreground"}>
                        {isActive ? "Viewing Details" : "Click to view"}
                      </span>
                      <ChevronRight size={14} className={isActive ? "text-primary" : "text-muted-foreground"} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Focused Step Detailed Panel */}
            <div className="bg-background/80 rounded-xl border border-primary/30 p-6 md:p-8 shadow-inner">
              {/* Step Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-primary text-primary-foreground text-xs font-bold">
                      STEP {currentStep.num}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      Statutory Tier {activeStepIndex + 1} of 4
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-foreground">{currentStep.title}</h3>
                  <p className="text-sm text-primary font-semibold mt-1">{currentStep.tagline}</p>
                </div>

                {/* Step Navigation Controls */}
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <button
                    onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeStepIndex === 0}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border bg-card text-xs font-bold text-foreground hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} /> Prev Step
                  </button>
                  <button
                    onClick={() => setActiveStepIndex((prev) => Math.min(statutorySteps.length - 1, prev + 1))}
                    disabled={activeStepIndex === statutorySteps.length - 1}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border bg-card text-xs font-bold text-foreground hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next Step <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Step Summary & Authority */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2 p-4 rounded-xl bg-card border border-border">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                    OVERVIEW & SCOPE
                  </span>
                  <p className="text-sm text-foreground leading-relaxed">{currentStep.overview}</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                    KEY STATUTORY BODY & COMPOSITION
                  </span>
                  <p className="text-xs font-semibold text-foreground mb-1">{currentStep.authority}</p>
                  <p className="text-xs text-muted-foreground leading-normal">{currentStep.composition}</p>
                </div>
              </div>

              {/* Step Procedure & Rules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Detailed Workflow Steps */}
                <div>
                  <h4 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                    <BookOpen size={18} className="text-primary" /> Step-by-Step Statutory Procedure
                  </h4>
                  <div className="space-y-3">
                    {currentStep.workflow.map((item, idx) => (
                      <div
                        key={item.title}
                        className="p-4 rounded-xl bg-card border border-border/80 flex items-start gap-3.5 hover:border-primary/40 transition-colors"
                      >
                        <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <h5 className="text-sm font-bold text-foreground">{item.title}</h5>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rules & Document Requirements */}
                <div className="space-y-6">
                  {/* Statutory Rules */}
                  <div>
                    <h4 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                      <ShieldCheck size={18} className="text-primary" /> Statutory Rules & Compliance Guidelines
                    </h4>
                    <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                      {currentStep.rules.map((rule) => (
                        <div key={rule} className="flex items-start gap-2.5 text-xs text-foreground">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Required Documents */}
                  <div>
                    <h4 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                      <FileSpreadsheet size={18} className="text-primary" /> Required Forms & Evidentiary Records
                    </h4>
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <div className="flex flex-wrap gap-2">
                        {currentStep.documents.map((doc) => (
                          <span
                            key={doc}
                            className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary flex items-center gap-1.5"
                          >
                            <FileText size={14} /> {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
