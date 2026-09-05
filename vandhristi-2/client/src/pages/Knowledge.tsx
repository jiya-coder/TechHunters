import { useState, useMemo } from "react";
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
  FileSpreadsheet,
  Sliders,
  Cpu,
  Sparkles,
  Check,
  X,
  AlertTriangle,
  Info,
  Compass,
  TreePine,
  Calendar,
  Gavel,
  FileWarning,
  ShieldAlert,
  HelpCircle,
  Activity
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

// ==========================================
// 1. OFFICIAL PDF DOWNLOADS REPOSITORY
// ==========================================
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

// ==========================================
// 2. LANDMARK FOREST ACTS COMPARATIVE DATA
// ==========================================
interface ForestAct {
  id: string;
  title: string;
  short: string;
  year: string;
  category: string;
  color: string;
  borderHover: string;
  badgeBg: string;
  badgeText: string;
  paradigm: string;
  keySections: string;
  summary: string;
  fraInterplay: string;
  precedent: string;
  provisions: { sec: string; title: string; desc: string }[];
  tags: string[];
}

const forestActsData: ForestAct[] = [
  {
    id: "fra-2006",
    title: "The Forest Rights Act, 2006",
    short: "FRA 2006",
    year: "2006",
    category: "Statutory Restitution of Historical Injustice",
    color: "emerald",
    borderHover: "hover:border-emerald-400",
    badgeBg: "bg-emerald-500/15",
    badgeText: "text-emerald-400 border-emerald-500/30",
    paradigm: "Restorative Rights & Sovereign Village Assembly Initiation",
    keySections: "Sec 3(1), Sec 4(5) & Sec 6",
    summary: "Recognizes the pre-existing customary rights of Scheduled Tribes and Other Traditional Forest Dwellers over forest land and resources. It statutorily reverses colonial-era tenure alienation and empowers the Gram Sabha as the sole initiating authority.",
    fraInterplay: "Contains an explicit non-obstante supremacy clause (Section 4(1)) overriding conflicting provisions in earlier colonial statutes. Under Section 4(5), no forest dweller can be evicted while the recognition process is ongoing.",
    precedent: "Wildlife First & Ors v. Union of India (2019) — Supreme Court stayed eviction directives across 16 states, mandating all rejected claims to be re-examined through reasoned speaking orders under Rule 12A.",
    provisions: [
      { sec: "Section 3(1)(a-m)", title: "Portfolio of 12 Rights", desc: "Recognizes individual cultivation up to 4 ha, minor forest produce ownership, grazing, seasonal access, and Community Forest Resource (CFR) protection." },
      { sec: "Section 4(5)", title: "Eviction Immunity Shield", desc: "Explicit statutory prohibition: No member of a forest-dwelling ST or OTFD shall be evicted or removed from forest land until verification is completed." },
      { sec: "Section 6", title: "Three-Tier Processing Hierarchy", desc: "Village assembly (Gram Sabha) initiates claims; Sub-Divisional Committee (SDLC) examines appeals; District Committee (DLC) gives final binding sanction." }
    ],
    tags: ["Restorative Justice", "Section 4(5) Immunity", "Gram Sabha Sovereign Veto", "Inalienable Patta"]
  },
  {
    id: "ifa-1927",
    title: "The Indian Forest Act, 1927",
    short: "IFA 1927",
    year: "1927",
    category: "Colonial State Control & Enclosure",
    color: "amber",
    borderHover: "hover:border-amber-400",
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-400 border-amber-500/30",
    paradigm: "State Monopoly & Criminalization of Customary Access",
    keySections: "Sec 4, Sec 26 & Sec 68",
    summary: "Consolidated colonial state ownership over Indian timber and forest tracts. Established Reserved & Protected forests where customary tribal occupation was classified as encroachment and criminal trespass.",
    fraInterplay: "FRA 2006 serves as a direct statutory antidote to IFA 1927. The summary eviction powers exercised by forest rangers under IFA Section 26 and Section 68 are overridden by Section 4(5) of the FRA.",
    precedent: "T.N. Godavarman Thirumulpad v. Union of India (1996) — Supreme Court expanded the legal definition of 'forest' beyond recorded IFA notifications to include all dictionary forests.",
    provisions: [
      { sec: "Section 4", title: "Declaration of Reserved Forest", desc: "Empowers the state government to notify intent to reserve lands, with Forest Settlement Officers summarily extinguishing unsettled customary rights." },
      { sec: "Section 26", title: "Penalties for Customary Acts", desc: "Criminalizes pasturing cattle, clearing land, taking minor produce, or lighting fires in Reserved Forests with up to 6 months imprisonment." },
      { sec: "Section 68", title: "Compounding of Forest Offences", desc: "Authorizes forest rangers to seize produce, confiscate tools, and collect monetary fines without formal magistrate hearings." }
    ],
    tags: ["Colonial Framework", "State Eminent Domain", "Overridden by FRA Sec 4", "Enclosure Model"]
  },
  {
    id: "wlpa-1972",
    title: "The Wildlife (Protection) Act, 1972",
    short: "WLPA 1972",
    year: "1972",
    category: "Wildlife Conservation & Sanctuaries",
    color: "sky",
    borderHover: "hover:border-sky-400",
    badgeBg: "bg-sky-500/15",
    badgeText: "text-sky-400 border-sky-500/30",
    paradigm: "Fortress Conservation & Inviolate Protected Areas",
    keySections: "Sec 18, Sec 35 & Sec 38V",
    summary: "Created the legal architecture for National Parks, Wildlife Sanctuaries, and Tiger Reserves. Focused on inviolate core zones with strict restrictions on human habitation, resource collection, and livestock grazing.",
    fraInterplay: "Under Section 4(2) of FRA 2006, forest rights inside Critical Wildlife Habitats (CWH) cannot be modified or extinguished unless it is scientifically established that coexistence is impossible, and free prior informed consent of the Gram Sabha is secured.",
    precedent: "Centre for Environmental Law, WWF-I v. Union of India (2013) — Supreme Court balanced endangered species conservation against statutory procedures for community rehabilitation packages.",
    provisions: [
      { sec: "Section 24", title: "Acquisition of Rights in Sanctuaries", desc: "District Collector is mandated to inquire into and acquire, extinguish, or allow limited private rights inside sanctuary boundaries." },
      { sec: "Section 35(6)", title: "Strict Prohibition on Habitat Alteration", desc: "Prohibits diverting, stopping water flow, or destroying wildlife habitat within National Parks without National Board approval." },
      { sec: "Section 38V", title: "Critical Tiger Habitats (CTH)", desc: "Mandates prior informed consent of Gram Sabhas and complete resettlement rehabilitation before relocating communities from tiger core zones." }
    ],
    tags: ["National Parks", "Critical Wildlife Habitats", "Prior Gram Sabha Consent", "Buffer Zone Rights"]
  },
  {
    id: "fca-1980",
    title: "Forest (Conservation) Act, 1980 & 2023 Amendment",
    short: "FCA / VBSS 2023",
    year: "1980 / 2023",
    category: "Central Regulation on Forest Diversion",
    color: "orange",
    borderHover: "hover:border-orange-400",
    badgeBg: "bg-orange-500/15",
    badgeText: "text-orange-400 border-orange-500/30",
    paradigm: "Centralized MoEFCC Clearance for Non-Forest Use",
    keySections: "Sec 2 & 2023 Strategic Exemptions",
    summary: "Restricted state governments from de-reserving forests or diverting forest land for non-forest purposes (mining, dams, linear corridors) without prior approval from the Central Government (MoEFCC).",
    fraInterplay: "Under the MoEFCC 30 July 2009 directive, Stage-II FCA diversion clearance is statutorily invalid without written certification that all FRA claims have been settled and the affected Gram Sabha has consented. Sec 3(2) of FRA allows diversion up to 1 ha for 13 basic facilities with Gram Sabha approval alone.",
    precedent: "Orissa Mining Corporation v. MoEF (Niyamgiri Judgement, 2013) — Landmark 3-judge bench ruling affirming that Gram Sabhas of Dongria Kondh tribals possess statutory veto authority over bauxite mining on sacred customary lands.",
    provisions: [
      { sec: "Section 2", title: "Mandatory Prior Central Sanction", desc: "Bar on de-reservation of reserved forest or clearing of forest for non-forest purpose without Central MoEFCC sanction." },
      { sec: "2023 Amendment", title: "Strategic Security Project Exemptions", desc: "Exempts defense, linear infrastructure within 100 km of international borders, and up to 10 ha for security camps from central clearance." },
      { sec: "FRA Sec 3(2)", title: "Decentralized Public Facility Sanction", desc: "Gram Sabha alone is authorized to approve felling of <75 trees/ha for schools, health clinics, roads, and drinking water pipelines up to 1 ha." }
    ],
    tags: ["Stage-II MoEFCC Sanction", "Gram Sabha Veto", "Niyamgiri Landmark", "Sec 3(2) Public Utilities"]
  },
  {
    id: "pesa-1996",
    title: "Panchayats (Extension to Scheduled Areas) Act, 1996",
    short: "PESA 1996",
    year: "1996",
    category: "Fifth Schedule Self-Governance",
    color: "purple",
    borderHover: "hover:border-purple-400",
    badgeBg: "bg-purple-500/15",
    badgeText: "text-purple-400 border-purple-500/30",
    paradigm: "Decentralized Village Assembly Sovereignty",
    keySections: "Sec 4(d), Sec 4(i) & Sec 4(m)",
    summary: "Extended democratic Panchayati Raj governance to Fifth Schedule tribal regions across 10 states. Recognized customary law, traditional dispute resolution, and endowed Gram Sabhas with ownership of Minor Forest Produce.",
    fraInterplay: "PESA served as the constitutional prototype for FRA 2006. While PESA applies exclusively to Fifth Schedule areas, the FRA expanded Gram Sabha sovereign title and minor forest produce ownership across all forested landscapes in India.",
    precedent: "Samatha v. State of Andhra Pradesh (1997) — Supreme Court ruled that tribal land in Scheduled Areas cannot be leased or transferred to private non-tribal corporations for mining.",
    provisions: [
      { sec: "Section 4(d)", title: "Customary Identity & Common Property", desc: "Endows every Gram Sabha with sovereign competence to safeguard traditions, cultural identity, and community natural resources." },
      { sec: "Section 4(m)(ii)", title: "Minor Forest Produce (MFP) Ownership", desc: "Statutorily vests complete economic ownership, processing rights, and marketing powers over minor forest produce in the Gram Sabha." },
      { sec: "Section 4(i)", title: "Mandatory Prior Consultation", desc: "Gram Sabha must be consulted prior to any land acquisition in Scheduled Areas for development projects or community resettlement." }
    ],
    tags: ["Fifth Schedule", "MFP Sovereignty", "Customary Law Recognition", "Direct Village Democracy"]
  },
  {
    id: "bda-2002",
    title: "The Biological Diversity Act, 2002",
    short: "BDA 2002",
    year: "2002",
    category: "Biodiversity & Indigenous Knowledge",
    color: "teal",
    borderHover: "hover:border-teal-400",
    badgeBg: "bg-teal-500/15",
    badgeText: "text-teal-400 border-teal-500/30",
    paradigm: "Equitable Access & Benefit Sharing (ABS)",
    keySections: "Sec 21 & Sec 41",
    summary: "Enacted under the UN Convention on Biological Diversity (CBD) to protect sovereign biological heritage. Mandates creation of local Biodiversity Management Committees (BMCs) and fair benefit-sharing for commercial exploitation of indigenous biological resources.",
    fraInterplay: "Harmonizes with FRA Section 3(1)(k), which guarantees indigenous communities intellectual property and traditional knowledge rights regarding biodiversity and cultural heritage.",
    precedent: "Divya Pharmacy v. Union of India (2018) — Uttarakhand High Court held that both domestic and multinational corporations are legally bound to pay fair equitable benefit-sharing to local BMCs.",
    provisions: [
      { sec: "Section 21", title: "Access & Benefit Sharing (ABS)", desc: "Secures financial royalties and local infrastructure funding from commercial entities utilizing indigenous biological knowledge." },
      { sec: "Section 41", title: "Biodiversity Management Committees (BMC)", desc: "Mandates local bodies to create BMCs to prepare Peoples' Biodiversity Registers (PBRs) documenting indigenous flora and fauna." },
      { sec: "FRA Sec 3(1)(k)", title: "Traditional Knowledge IP Protection", desc: "Statutorily shields generational medicinal, agricultural, and botanical practices developed by forest-dwelling communities." }
    ],
    tags: ["Peoples' Biodiversity Register", "Fair Benefit Sharing", "Indigenous Knowledge", "CBD Harmonization"]
  }
];

// ==========================================
// 3. PHASE 3: 3D STATUTORY PLUG STACK DATA
// ==========================================
interface StatutoryTier {
  id: string;
  tierNum: string;
  name: string;
  subtitle: string;
  authority: string;
  slaDays: string;
  slaDescription: string;
  icon: any;
  color: string;
  rule12ADirectives: string[];
  bottlenecks: { stat: string; label: string; cause: string };
  precedentShield: string;
  inputDocuments: string[];
  outputSanction: string;
}

const statutoryPlugStack: StatutoryTier[] = [
  {
    id: "tier-1",
    tierNum: "01",
    name: "Gram Sabha & FRC Plug",
    subtitle: "Village Democratic Verification & Claim Initiation",
    authority: "Gram Sabha (Village Assembly) & Forest Rights Committee (10-15 elected members, 1/3 ST, 1/3 women)",
    slaDays: "30 - 45 Days",
    slaDescription: "Statutory timeframe for joint on-site physical field verification and open resolution voting.",
    icon: Users,
    color: "emerald",
    rule12ADirectives: [
      "Rule 4(2): Quorum of at least 50% village members with minimum 33% female attendance mandatory for valid resolution.",
      "Rule 11: Joint field verification must be conducted by FRC in physical presence of claimant and Forest/Revenue officials.",
      "Rule 12A(1): Gram Sabha is the sole statutory initiating body; no higher committee can bypass or preempt its resolutions."
    ],
    bottlenecks: {
      stat: "42% Delays",
      label: "Field Inspection Absence",
      cause: "Forest & Revenue department officials repeatedly failing to attend joint field demarcation sessions scheduled by FRC."
    },
    precedentShield: "Supreme Court in Orissa Mining Corp (2013): Gram Sabha is sovereign; executive committees cannot manufacture or reject claims without village assembly verification.",
    inputDocuments: ["Claim Form A (IFR) or Form B (CFR)", "2+ Evidentiary Proofs (Elder testimony, ancestral trees, PORs)", "Boundary Landmarks"],
    outputSanction: "Sanctioned Resolution & Field Verification Map passed to SDLC."
  },
  {
    id: "tier-2",
    tierNum: "02",
    name: "SDLC Scrutiny & Map Aggregation Plug",
    subtitle: "Sub-Divisional Legal Audit & 60-Day Appeal Disposal",
    authority: "Sub-Divisional Level Committee (Chaired by SDM; includes SDO Forest, Block Revenue Officer, 3 Panchayati Raj reps)",
    slaDays: "60 Days",
    slaDescription: "Statutory window to dispose appeals filed by aggrieved claimants under Section 6(2).",
    icon: Scale,
    color: "amber",
    rule12ADirectives: [
      "Rule 12A(3): Speaking order mandatory — SDLC cannot modify or reject a Gram Sabha resolution without recording written reasons.",
      "Rule 12A(4): Rejections require a 30-day notice and a mandatory personal hearing opportunity before passing adverse orders.",
      "Rule 12A(6): Non-availability of satellite imagery alone is not grounds for rejecting a valid claim."
    ],
    bottlenecks: {
      stat: "61% Rejections",
      label: "Illegal Summary Rejections",
      cause: "Arbitrary rejections on grounds of 'incomplete revenue Khasra records' or strict OTFD 75-year documentation barriers."
    },
    precedentShield: "MoTA Directive Ref No. 23011/15/2013-FRA: Executive committees have no statutory jurisdiction to reject claims without issuing a formal speaking order with reasons.",
    inputDocuments: ["Gram Sabha Approved Dossier", "Consolidated Cadastral Overlay Map", "Appeals Petitions (if any)"],
    outputSanction: "Draft Record of Rights (RoR) & Sanction Recommendation to DLC."
  },
  {
    id: "tier-3",
    tierNum: "03",
    name: "DLC Approval & Final Binding Sanction Plug",
    subtitle: "District Level Final Adjudication & Binding Sanction",
    authority: "District Level Committee (Chaired by District Collector / DM; includes DFO, District Tribal Officer, 3 PRI members)",
    slaDays: "60 Days",
    slaDescription: "Section 6(4) timeframe for final adjudication of appeals against SDLC decisions.",
    icon: Landmark,
    color: "sky",
    rule12ADirectives: [
      "Section 6(6): Decision of the District Level Committee on the record of forest rights shall be final and binding.",
      "Rule 12A(5): DLC must ensure joint title registration in the names of both spouses (husband and wife).",
      "Rule 12A(10): DLC cannot reduce the area of land recommended by Gram Sabha without physical joint re-survey."
    ],
    bottlenecks: {
      stat: "38% Backlog",
      label: "Inter-Departmental Friction",
      cause: "Revenue vs Forest boundary conflicts over whether land is unclassed state forest or revenue village wasteland."
    },
    precedentShield: "Supreme Court stay in Wildlife First (2019): Barred summary eviction of rejected claimants and ordered district collectors to personally re-verify compliance.",
    inputDocuments: ["SDLC Scrutiny Sheets", "Khasra Boundary Demarcation Files", "Final Hearing Petitions"],
    outputSanction: "Sanctioned Final Title Deed (Patta) with District Seal."
  },
  {
    id: "tier-4",
    tierNum: "04",
    name: "Revenue Mutation & Title Handover Plug",
    subtitle: "Statutory Record of Rights (RoR) Mutation & Scheme Convergence",
    authority: "District Revenue Administration (Tehsildar) & State Forest Department (Divisional Forest Officer)",
    slaDays: "30 Days Post-Sanction",
    slaDescription: "Immediate mandatory statutory update of government Khasra / Khatauni land records.",
    icon: ShieldCheck,
    color: "purple",
    rule12ADirectives: [
      "Rule 12A(9): State government must formally update revenue and forest records (Khasra & Compartment Registers) within 30 days.",
      "Section 4(4): Forest rights recognized under FRA are heritable but strictly non-alienable and non-transferable.",
      "MoTA Guidelines: All recognized titleholders must be auto-enrolled into PM-KISAN, Jal Jeevan, and MGNREGA land levelling."
    ],
    bottlenecks: {
      stat: "54% Pending",
      label: "Failure to Mutate RoR",
      cause: "Physical Patta paper handed to claimant, but local Patwari fails to update the digital state Khasra land register."
    },
    precedentShield: "National Commission for Scheduled Tribes (NCST) Special Directive 2021: Non-mutation of RoR constitutes a criminal offence under SC/ST Prevention of Atrocities Act.",
    inputDocuments: ["Collector Sanctioned Patta Deed", "Joint Verification GPS Coordinates", "Beneficiary Aadhaar & Bank Details"],
    outputSanction: "Permanent Record of Rights Mutation & PM-KISAN Convergence."
  }
];

// ==========================================
// 4. STATUTORY STEP-BY-STEP WORKFLOW DATA
// ==========================================
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
  const [activeTab, setActiveTab] = useState<"acts" | "simulator" | "plug-stack" | "documents" | "workflow">("acts");
  const [query, setQuery] = useState("");
  const [selectedActId, setSelectedActId] = useState<string>("fra-2006");
  const [activeTierId, setActiveTierId] = useState<string>("tier-1");
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // -------------------------------------------------------------
  // PHASE 2 SIMULATOR STATE: CLAIMANT & EVIDENCE PLUGS
  // -------------------------------------------------------------
  const [claimantType, setClaimantType] = useState<"ST" | "OTFD">("ST");
  const [evidencePlugs, setEvidencePlugs] = useState({
    occupation_pre_2005: true,
    otfd_75_years: false,
    livelihood_dependence: true,
    physical_evidence: true,
    elder_testimony: true,
    departmental_records: false,
    spatial_demarcation: true,
    gram_sabha_quorum: true,
  });

  const toggleEvidence = (key: keyof typeof evidencePlugs) => {
    setEvidencePlugs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Viability Score Calculation Engine
  const simulatorResult = useMemo(() => {
    let score = 0;
    const warnings: string[] = [];
    const legalShields: string[] = [];
    const missingKeys: string[] = [];

    // Critical Statutory Check 1: Occupation prior to 13 Dec 2005 (Mandatory for both)
    if (evidencePlugs.occupation_pre_2005) {
      score += 25;
    } else {
      warnings.push("FATAL STATUTORY DEFECT: Land occupation must pre-date 13 December 2005 cutoff under FRA Sec 4(3).");
      missingKeys.push("Pre-2005 Occupation Proof");
    }

    // Critical Statutory Check 2: OTFD 75-Year / 3-Generation Rule
    if (claimantType === "OTFD") {
      if (evidencePlugs.otfd_75_years) {
        score += 30;
      } else {
        warnings.push("CRITICAL OTFD RULE: Under Section 2(o), Other Traditional Forest Dwellers must prove 3 generations (75 years) continuous occupation prior to 2005.");
        missingKeys.push("75-Year Continuous Residence Records");
      }
    } else {
      // Scheduled Tribe claimant: 75-year rule is waived by statute
      score += 30;
      legalShields.push("ST Status Exemption: As a Scheduled Tribe member, the 75-year rule does not apply (Section 2(c)).");
    }

    // Livelihood Dependence Check
    if (evidencePlugs.livelihood_dependence) {
      score += 15;
    } else {
      warnings.push("Section 2(c)/(o) requires primary dependence on forest land for bona fide livelihood needs (not commercial exploitation).");
      missingKeys.push("Bona Fide Livelihood Statement");
    }

    // Physical Landmarks
    if (evidencePlugs.physical_evidence) {
      score += 10;
    } else {
      missingKeys.push("Physical Evidence (Fruit trees, graves, bunds)");
    }

    // Elder Testimony
    if (evidencePlugs.elder_testimony) {
      score += 10;
    } else {
      missingKeys.push("Village Elder Oral Testimonies");
    }

    // Departmental Records
    if (evidencePlugs.departmental_records) {
      score += 5;
      legalShields.push("Government Seizure/Offence Memo: Serves as official government corroboration of continuous occupation under Rule 13(1)(a).");
    }

    // Spatial Demarcation
    if (evidencePlugs.spatial_demarcation) {
      score += 15;
    } else {
      warnings.push("Section 4(6) Cap: Claim must include GPS boundary mapping within 4 hectares (10 acres).");
      missingKeys.push("GPS Polygon Demarcation");
    }

    // Gram Sabha Quorum
    if (evidencePlugs.gram_sabha_quorum) {
      score += 10;
      legalShields.push("Quorum Compliance: Meeting satisfies Rule 4(2) (>=50% members present, >=33% women participation).");
    } else {
      warnings.push("Gram Sabha Resolution invalid under Rule 4(2) if quorum is below 50% or women representation is below 33%.");
      missingKeys.push("Valid Gram Sabha Quorum Resolution");
    }

    // Eviction Protection
    legalShields.push("Section 4(5) Absolute Immunity: No eviction or removal permitted while this claim is pending before Gram Sabha/SDLC/DLC.");

    // Score capping if fatal flaws exist
    if (!evidencePlugs.occupation_pre_2005) {
      score = Math.min(score, 25);
    }
    if (claimantType === "OTFD" && !evidencePlugs.otfd_75_years) {
      score = Math.min(score, 45);
    }

    const cappedScore = Math.min(100, Math.max(0, score));

    let statusLabel = "High Statutory Compliance";
    let statusColor = "text-emerald-400 bg-emerald-500/15 border-emerald-500/30";
    let statusIcon = CheckCircle2;

    if (cappedScore < 50) {
      statusLabel = "Statutorily Deficient — High Rejection Risk";
      statusColor = "text-red-400 bg-red-500/15 border-red-500/30";
      statusIcon = AlertTriangle;
    } else if (cappedScore < 80) {
      statusLabel = "Conditional Viability — Requires Corroboration";
      statusColor = "text-amber-400 bg-amber-500/15 border-amber-500/30";
      statusIcon = HelpCircle;
    }

    return {
      score: cappedScore,
      statusLabel,
      statusColor,
      statusIcon,
      warnings,
      legalShields,
      missingKeys,
    };
  }, [claimantType, evidencePlugs]);

  const shownResources = pdfResources.filter((item) =>
    `${item.label} ${item.meta} ${item.category}`.toLowerCase().includes(query.toLowerCase())
  );

  const selectedAct = forestActsData.find(a => a.id === selectedActId) || forestActsData[0];
  const activeTier = statutoryPlugStack.find(t => t.id === activeTierId) || statutoryPlugStack[0];
  const currentStep = statutorySteps[activeStepIndex];

  return (
    <div className={`site-shell page-shell ${theme === "dusk" ? "theme-dusk" : "theme-morning"}`}>
      <SiteHeader theme={theme} onToggleTheme={() => setTheme(theme === "morning" ? "dusk" : "morning")} />
      
      <main className="inner-page knowledge-section">
        <div className="container max-w-6xl mx-auto py-8">
          
          {/* Header Intro */}
          <div className="page-intro mb-8">
            <span className="eyebrow">
              <span className="eyebrow-dot"></span>
              03 / Legal Repository & Statutory Intelligence
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mt-1">
              Know the <em>statutory framework.</em>
            </h1>
            <p className="text-base md:text-lg text-white mt-2 max-w-3xl font-medium opacity-90 leading-relaxed">
              Explore India's landmark environmental and tribal land legislation, simulate legal claim viability under FRA Rule 13, and audit the 3D statutory plug stack across village, sub-divisional, and district authorities.
            </p>
          </div>

          {/* Modular Section Tabs ("alag alag krdo") */}
          <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 rounded-2xl bg-card/70 backdrop-blur-md border border-border shadow-xl">
            <button
              onClick={() => setActiveTab("acts")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "acts"
                  ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/60"
              }`}
            >
              <Gavel size={15} className={activeTab === "acts" ? "text-primary-foreground" : "text-primary"} />
              <span>Landmark Forest Acts</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === "acts" ? "bg-black/25 text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>6 Acts</span>
            </button>
            <button
              onClick={() => setActiveTab("simulator")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "simulator"
                  ? "bg-amber-500 text-slate-950 shadow-lg scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/60"
              }`}
            >
              <Sliders size={15} className={activeTab === "simulator" ? "text-slate-950" : "text-amber-400"} />
              <span>Claim Simulator</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === "simulator" ? "bg-black/20 text-slate-950" : "bg-muted text-muted-foreground"
              }`}>Phase 2</span>
            </button>
            <button
              onClick={() => setActiveTab("plug-stack")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "plug-stack"
                  ? "bg-sky-500 text-slate-950 shadow-lg scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/60"
              }`}
            >
              <Cpu size={15} className={activeTab === "plug-stack" ? "text-slate-950" : "text-sky-400"} />
              <span>3D Plug Stack</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === "plug-stack" ? "bg-black/20 text-slate-950" : "bg-muted text-muted-foreground"
              }`}>Phase 3</span>
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "documents"
                  ? "bg-emerald-500 text-slate-950 shadow-lg scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/60"
              }`}
            >
              <Download size={15} className={activeTab === "documents" ? "text-slate-950" : "text-emerald-400"} />
              <span>Official Gazettes</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === "documents" ? "bg-black/20 text-slate-950" : "bg-muted text-muted-foreground"
              }`}>PDFs</span>
            </button>
            <button
              onClick={() => setActiveTab("workflow")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "workflow"
                  ? "bg-purple-500 text-white shadow-lg scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/60"
              }`}
            >
              <Scale size={15} className={activeTab === "workflow" ? "text-white" : "text-purple-400"} />
              <span>Statutory Workflow</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === "workflow" ? "bg-black/25 text-white" : "bg-muted text-muted-foreground"
              }`}>4 Steps</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* MODULE 1: LANDMARK FOREST ACTS CARDS                                      */}
          {/* ========================================================================= */}
          {activeTab === "acts" && (
            <section id="forest-acts" className="mb-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                  <span className="eyebrow text-primary text-xs uppercase tracking-widest font-bold block mb-1">
                    STATUTORY JURISPRUDENCE & EVOLUTION
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
                    Landmark Forest Acts of India
                  </h2>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-2xl">
                    Compare how historical colonial enclosure acts, wildlife conservation laws, and the FRA 2006 interact, establish supremacy, and balance customary rights.
                  </p>
                </div>
                <span className="mono-label text-xs text-primary font-bold px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 self-start md:self-auto">
                  06 STATUTES ANALYZED
                </span>
              </div>

              {/* Acts Selection Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {forestActsData.map((act) => {
                  const isSelected = act.id === selectedActId;
                  return (
                    <div
                      key={act.id}
                      onClick={() => setSelectedActId(act.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-background/90 border-primary shadow-xl ring-2 ring-primary/40 -translate-y-1"
                          : "bg-card/70 border-border/80 hover:bg-background/70 hover:border-primary/40 hover:-translate-y-0.5"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${act.badgeBg} ${act.badgeText}`}>
                            {act.year} · {act.short}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {act.keySections}
                          </span>
                        </div>
                        <h3 className={`text-base font-bold mb-1.5 transition-colors ${isSelected ? "text-primary" : "text-foreground"}`}>
                          {act.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {act.summary}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                          {act.category.split(" ")[0]} Framework
                        </span>
                        <span className={`text-xs font-bold flex items-center gap-1 ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                          {isSelected ? "Active View" : "Explore Act"} <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Act Deep-Dive Interactive Inspection Panel */}
              <div className="w-full bg-card/90 backdrop-blur-md rounded-2xl border border-primary/30 p-6 md:p-8 shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold border ${selectedAct.badgeBg} ${selectedAct.badgeText}`}>
                        {selectedAct.short} ({selectedAct.year})
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {selectedAct.category}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-foreground">{selectedAct.title}</h3>
                    <p className="text-xs md:text-sm text-primary font-semibold mt-1 flex items-center gap-1.5">
                      <Compass size={16} /> Legal Paradigm: {selectedAct.paradigm}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 self-start md:self-auto">
                    {selectedAct.tags.map(t => (
                      <span key={t} className="text-[10px] font-semibold px-2 py-1 rounded-md bg-muted/60 text-foreground/80 border border-border">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Act Core Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Summary & FRA Interplay */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-background/60 border border-border">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                        <BookOpen size={14} /> Legislative Overview & Scope
                      </span>
                      <p className="text-xs md:text-sm text-foreground leading-relaxed">
                        {selectedAct.summary}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                        <Scale size={14} /> Interplay & Legal Impact on FRA 2006
                      </span>
                      <p className="text-xs md:text-sm text-foreground/95 leading-relaxed">
                        {selectedAct.fraInterplay}
                      </p>
                    </div>
                  </div>

                  {/* Key Sections & Case Law Precedent */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-background/60 border border-border">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                        <FileCheck size={14} /> Key Statutory Sections & Provisions
                      </span>
                      <div className="space-y-2.5">
                        {selectedAct.provisions.map(p => (
                          <div key={p.sec} className="text-xs">
                            <span className="font-bold text-primary font-mono">{p.sec}: {p.title}</span>
                            <p className="text-muted-foreground mt-0.5 leading-normal">{p.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-background/80 border border-amber-500/30">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                        <Gavel size={14} /> Landmark Judicial Precedent
                      </span>
                      <p className="text-xs text-foreground leading-relaxed italic">
                        "{selectedAct.precedent}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* MODULE 2: PHASE 2 — CLAIM ELIGIBILITY & EVIDENCE SIMULATOR                 */}
          {/* ========================================================================= */}
          {activeTab === "simulator" && (
            <section id="simulator" className="mb-8">
              <div className="w-full bg-card/90 backdrop-blur-md rounded-2xl border border-border p-6 md:p-8 shadow-2xl">
                
                {/* Simulator Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border mb-8">
                  <div>
                    <span className="eyebrow text-primary text-xs uppercase tracking-widest font-bold block mb-1">
                      PHASE 2 · STATUTORY CLAIM AUDIT
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
                      Claim Eligibility & Evidence Simulator
                    </h2>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      Test real-world claim viability under Rule 13 of FRA Rules. Plug in available evidence pieces to compute legal compliance before submission to the Forest Rights Committee.
                    </p>
                  </div>

                  {/* Claimant Category Toggle */}
                  <div className="flex items-center gap-2 bg-background/80 p-1.5 rounded-xl border border-border self-start md:self-auto">
                    <span className="text-xs font-bold text-muted-foreground px-2">Claimant:</span>
                    <button
                      onClick={() => setClaimantType("ST")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        claimantType === "ST"
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Scheduled Tribe (ST)
                    </button>
                    <button
                      onClick={() => setClaimantType("OTFD")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        claimantType === "OTFD"
                          ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Other Forest Dweller (OTFD)
                    </button>
                  </div>
                </div>

                {/* Simulator Layout: 2 Columns (Evidence Plugs Checklist vs Live Score Gauge) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left Column: Evidence Plugs Selection (7 cols) */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Sliders size={16} className="text-primary" />
                        Available Evidence Plugs (Click to Toggle)
                      </h4>
                      <span className="text-[11px] text-muted-foreground">
                        Governed by Rule 13 of FRA Rules
                      </span>
                    </div>

                    {/* Plug 1: Pre-2005 Occupation */}
                    <div
                      onClick={() => toggleEvidence("occupation_pre_2005")}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        evidencePlugs.occupation_pre_2005
                          ? "bg-background border-primary/70 shadow-sm"
                          : "bg-background/40 border-border/70 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                        evidencePlugs.occupation_pre_2005
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border bg-card"
                      }`}>
                        {evidencePlugs.occupation_pre_2005 && <Check size={14} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">
                            Occupation of Forest Land Prior to 13 Dec 2005
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                            Mandatory Sec 4(3)
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Statutory cutoff deadline. Land must have been under continuous personal cultivation or residential use prior to this date.
                        </p>
                      </div>
                    </div>

                    {/* Plug 2: OTFD 75 Years / 3 Generations Rule */}
                    <div
                      onClick={() => toggleEvidence("otfd_75_years")}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        claimantType === "ST"
                          ? "bg-background/30 border-border/40 opacity-60 cursor-not-allowed"
                          : evidencePlugs.otfd_75_years
                            ? "bg-background border-amber-400/80 shadow-sm"
                            : "bg-background/40 border-border/70 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                        claimantType === "ST"
                          ? "bg-muted text-muted-foreground border-border"
                          : evidencePlugs.otfd_75_years
                            ? "bg-amber-500 text-slate-950 border-amber-500"
                            : "border-border bg-card"
                      }`}>
                        {claimantType === "ST" ? <Check size={14} /> : evidencePlugs.otfd_75_years && <Check size={14} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">
                            Proof of 3 Generations / 75 Years Residence (since 1930)
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            claimantType === "ST"
                              ? "text-emerald-400 bg-emerald-500/10"
                              : "text-amber-400 bg-amber-500/10"
                          }`}>
                            {claimantType === "ST" ? "Waived for ST" : "Mandatory for OTFD"}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Section 2(o) requires non-ST forest dwellers to prove continuous family settlement for at least 75 years preceding 2005.
                        </p>
                      </div>
                    </div>

                    {/* Plug 3: Bona Fide Livelihood Dependence */}
                    <div
                      onClick={() => toggleEvidence("livelihood_dependence")}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        evidencePlugs.livelihood_dependence
                          ? "bg-background border-primary/70 shadow-sm"
                          : "bg-background/40 border-border/70 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                        evidencePlugs.livelihood_dependence
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border bg-card"
                      }`}>
                        {evidencePlugs.livelihood_dependence && <Check size={14} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">
                            Primary Dependence for Bona Fide Livelihood
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            Sec 2(c)/(o)
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Claimant depends directly on forest land for self-cultivation, food, and sustenance rather than commercial ventures.
                        </p>
                      </div>
                    </div>

                    {/* Plug 4: Physical Ancestral Landmarks */}
                    <div
                      onClick={() => toggleEvidence("physical_evidence")}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        evidencePlugs.physical_evidence
                          ? "bg-background border-primary/70 shadow-sm"
                          : "bg-background/40 border-border/70 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                        evidencePlugs.physical_evidence
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border bg-card"
                      }`}>
                        {evidencePlugs.physical_evidence && <Check size={14} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">
                            Physical Ancestral Markers & Structures
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            Rule 13(1)(c)
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Matured fruit trees (Mahua, Mango), traditional bunds, stone cairns, ancestral burial grounds, or irrigation wells.
                        </p>
                      </div>
                    </div>

                    {/* Plug 5: Elder Oral Testimony */}
                    <div
                      onClick={() => toggleEvidence("elder_testimony")}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        evidencePlugs.elder_testimony
                          ? "bg-background border-primary/70 shadow-sm"
                          : "bg-background/40 border-border/70 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                        evidencePlugs.elder_testimony
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border bg-card"
                      }`}>
                        {evidencePlugs.elder_testimony && <Check size={14} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">
                            Elder Oral Testimonies & Genealogy Statements
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            Rule 13(1)(b)
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Written and signed testimonies of non-claimant village elders confirming ancestral presence and community verification.
                        </p>
                      </div>
                    </div>

                    {/* Plug 6: Forest Offence / Fine Receipts */}
                    <div
                      onClick={() => toggleEvidence("departmental_records")}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        evidencePlugs.departmental_records
                          ? "bg-background border-primary/70 shadow-sm"
                          : "bg-background/40 border-border/70 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                        evidencePlugs.departmental_records
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border bg-card"
                      }`}>
                        {evidencePlugs.departmental_records && <Check size={14} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">
                            Forest Department Offence Receipts (PORs / Fines)
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            Strong Legal Proof · Rule 13(1)(a)
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Past eviction notices, confiscation memos, or compounding fine receipts that prove actual government-recorded occupation before 2005.
                        </p>
                      </div>
                    </div>

                    {/* Plug 7: Spatial GPS Demarcation */}
                    <div
                      onClick={() => toggleEvidence("spatial_demarcation")}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        evidencePlugs.spatial_demarcation
                          ? "bg-background border-primary/70 shadow-sm"
                          : "bg-background/40 border-border/70 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                        evidencePlugs.spatial_demarcation
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border bg-card"
                      }`}>
                        {evidencePlugs.spatial_demarcation && <Check size={14} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">
                            GPS Polygon Demarcation within 4 Hectares (10 Acres) Cap
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            Sec 4(6) Limit
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Geotagged ground coordinates verifying parcel boundaries within the statutory ceiling of 4 hectares per family.
                        </p>
                      </div>
                    </div>

                    {/* Plug 8: Gram Sabha Quorum */}
                    <div
                      onClick={() => toggleEvidence("gram_sabha_quorum")}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        evidencePlugs.gram_sabha_quorum
                          ? "bg-background border-primary/70 shadow-sm"
                          : "bg-background/40 border-border/70 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                        evidencePlugs.gram_sabha_quorum
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border bg-card"
                      }`}>
                        {evidencePlugs.gram_sabha_quorum && <Check size={14} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">
                            Gram Sabha Resolution with 50% Quorum & 33% Women
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            Rule 4(2) Quorum
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Passed in an open assembly meeting meeting the statutory quorum requirement and signed by FRC chairperson.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Dynamic Viability Score Gauge & Advisory (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                    
                    {/* Score Card Box */}
                    <div className="p-6 rounded-2xl bg-background/80 border border-border shadow-xl">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                        <Activity size={15} /> Statutory Viability Index
                      </span>

                      {/* Percentage & Progress Bar */}
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-5xl font-black tracking-tight text-foreground font-mono">
                          {simulatorResult.score}%
                        </span>
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${simulatorResult.statusColor} flex items-center gap-1.5`}>
                          <simulatorResult.statusIcon size={14} />
                          {simulatorResult.statusLabel.split("—")[0]}
                        </span>
                      </div>

                      {/* Bar indicator */}
                      <div className="w-full h-3 rounded-full bg-muted overflow-hidden mb-4">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            simulatorResult.score >= 80
                              ? "bg-emerald-400"
                              : simulatorResult.score >= 50
                                ? "bg-amber-400"
                                : "bg-rose-500"
                          }`}
                          style={{ width: `${simulatorResult.score}%` }}
                        />
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {simulatorResult.score >= 80
                          ? "High probability of approval at SDLC & DLC scrutiny. Claim possesses required documentary and oral evidence under Rule 13."
                          : simulatorResult.score >= 50
                            ? "Marginal viability. Sub-Divisional Committee may return claim for additional evidentiary corroboration or re-verification."
                            : "Critical deficiency detected. High risk of summary rejection unless missing statutory criteria are fulfilled."}
                      </p>
                    </div>

                    {/* Warnings / Missing Items */}
                    {simulatorResult.warnings.length > 0 && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25">
                        <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                          <AlertTriangle size={15} /> Statutory Vulnerabilities
                        </span>
                        <div className="space-y-1.5">
                          {simulatorResult.warnings.map(w => (
                            <p key={w} className="text-xs text-red-300 leading-snug flex items-start gap-2">
                              <span className="text-red-400 shrink-0">•</span> {w}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Statutory Protective Shields */}
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                        <ShieldCheck size={15} /> Statutory Protections In Effect
                      </span>
                      <div className="space-y-1.5">
                        {simulatorResult.legalShields.map(s => (
                          <p key={s} className="text-xs text-emerald-300/90 leading-snug flex items-start gap-2">
                            <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                            {s}
                          </p>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* MODULE 3: PHASE 3 — 3D LAYERED STATUTORY PLUG STACK                       */}
          {/* ========================================================================= */}
          {activeTab === "plug-stack" && (
            <section id="plug-stack" className="mb-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                  <span className="eyebrow text-primary text-xs uppercase tracking-widest font-bold block mb-1">
                    PHASE 3 · RULE 12A ADMINISTRATIVE TIER ARCHITECTURE
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
                    3D Statutory Plug Stack & Bottleneck Radar
                  </h2>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-2xl">
                    Inspect the 4-tier administrative hierarchy. Click any plugged layer to explore statutory service level agreements (SLAs), Rule 12A safeguards, and systemic drop-off points.
                  </p>
                </div>
                <span className="mono-label text-xs text-primary font-bold px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 self-start md:self-auto">
                  4 ADMINISTRATIVE PLUGS
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: 3D Layered Isometric Plug Stack (5 cols) */}
                <div className="lg:col-span-5 perspective-stage space-y-4">
                  {statutoryPlugStack.map((tier, idx) => {
                    const isActive = tier.id === activeTierId;
                    const Icon = tier.icon;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setActiveTierId(tier.id)}
                        className={`plug-card-stack plug-layer-tilt p-5 rounded-2xl border cursor-pointer ${
                          isActive
                            ? "is-active bg-background/95 border-primary shadow-2xl ring-2 ring-primary/50"
                            : "bg-card/75 border-border/80 hover:bg-background/80 hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-xs ${
                              isActive
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {tier.tierNum}
                            </span>
                            <div>
                              <h4 className={`text-sm font-extrabold ${isActive ? "text-primary" : "text-foreground"}`}>
                                {tier.name}
                              </h4>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                SLA: {tier.slaDays}
                              </span>
                            </div>
                          </div>

                          {/* Glowing Connection Pin */}
                          <div className="flex items-center gap-2">
                            <span className={`plug-pin-glow ${
                              isActive ? "bg-emerald-400" : "bg-muted-foreground/50"
                            }`} />
                            <Icon size={18} className={isActive ? "text-primary" : "text-muted-foreground"} />
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {tier.subtitle}
                        </p>

                        {/* Connection visual indicator between stacked layers */}
                        {idx < statutoryPlugStack.length - 1 && (
                          <div className="flex justify-center -mb-7 mt-3">
                            <div className="w-0.5 h-4 glow-connector-line rounded-full" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Right: Active Tier Legal Deep-Dive Inspection Panel (7 cols) */}
                <div className="lg:col-span-7 bg-card/90 backdrop-blur-md rounded-2xl border border-primary/30 p-6 md:p-8 shadow-2xl flex flex-col justify-between">
                  <div>
                    {/* Tier Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-md bg-primary text-primary-foreground text-xs font-bold font-mono">
                            PLUG TIER {activeTier.tierNum}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium">
                            Statutory Processing Layer
                          </span>
                        </div>
                        <h3 className="text-2xl font-extrabold text-foreground">{activeTier.name}</h3>
                        <p className="text-xs md:text-sm text-primary font-semibold mt-0.5">{activeTier.subtitle}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-background/80 border border-border text-right self-start md:self-auto">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          STATUTORY SLA LIMIT
                        </span>
                        <span className="text-base font-black text-amber-400 font-mono">
                          {activeTier.slaDays}
                        </span>
                      </div>
                    </div>

                    {/* Authority & Composition */}
                    <div className="p-4 rounded-xl bg-background/60 border border-border mb-6">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                        Statutory Authority & Administrative Composition
                      </span>
                      <p className="text-xs md:text-sm text-foreground leading-relaxed">
                        {activeTier.authority}
                      </p>
                    </div>

                    {/* Rule 12A Mandates & Directives */}
                    <div className="mb-6">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 mb-3">
                        <ShieldAlert size={15} /> Mandatory Rule 12A Directives & Safeguards
                      </h4>
                      <div className="space-y-2">
                        {activeTier.rule12ADirectives.map((r) => (
                          <div key={r} className="p-3 rounded-lg bg-background/60 border border-border/80 flex items-start gap-2.5 text-xs text-foreground leading-relaxed">
                            <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottleneck Radar Metric */}
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-6">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertTriangle size={15} /> Bottleneck Radar: {activeTier.bottlenecks.label}
                        </span>
                        <span className="text-xs font-mono font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                          {activeTier.bottlenecks.stat}
                        </span>
                      </div>
                      <p className="text-xs text-amber-200/90 leading-relaxed">
                        {activeTier.bottlenecks.cause}
                      </p>
                    </div>

                    {/* Judicial Shield Quote */}
                    <div className="p-4 rounded-xl bg-background/80 border border-primary/20">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                        <Gavel size={14} /> Judicial Precedent Protection
                      </span>
                      <p className="text-xs text-foreground/90 italic leading-relaxed">
                        "{activeTier.precedentShield}"
                      </p>
                    </div>
                  </div>

                  {/* Input / Output Specs */}
                  <div className="mt-6 pt-4 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground font-mono block text-[10px] uppercase">Input Evidence</span>
                      <span className="text-foreground font-medium">{activeTier.inputDocuments.join(" · ")}</span>
                    </div>
                    <div className="md:text-right">
                      <span className="text-muted-foreground font-mono block text-[10px] uppercase">Tier Output</span>
                      <span className="text-primary font-bold">{activeTier.outputSanction}</span>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* MODULE 4: DOWNLOADABLE FILES & OFFICIAL PDF REPOSITORY                    */}
          {/* ========================================================================= */}
          {activeTab === "documents" && (
            <section id="documents" className="mb-8">
              <div className="w-full bg-card/90 backdrop-blur-md rounded-2xl border border-border p-6 md:p-10 shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border mb-8">
                  <div>
                    <span className="eyebrow text-primary text-xs uppercase tracking-widest font-bold block mb-1">
                      OFFICIAL DOCUMENT REPOSITORY
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
                      Downloadable Files & Briefings
                    </h2>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1 font-medium">
                      Verified PDF publications ready for administrative review, field verification, and statutory guidance.
                    </p>
                  </div>

                  {/* Search Input */}
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

                {/* Document Grid List */}
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
            </section>
          )}

          {/* ========================================================================= */}
          {/* MODULE 5: STEP-BY-STEP STATUTORY PROCEDURAL WORKFLOW                      */}
          {/* ========================================================================= */}
          {activeTab === "workflow" && (
            <section id="workflow" className="mb-8">
              <div className="w-full bg-card/90 backdrop-blur-md rounded-2xl border border-border p-6 md:p-10 shadow-2xl">
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
            </section>
          )}

        </div>
      </main>
    </div>
  );
}
