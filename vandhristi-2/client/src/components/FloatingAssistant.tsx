import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Minus,
  Maximize2,
  Minimize2,
  Send,
  Mic,
  MicOff,
  RotateCcw,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Sparkles,
  Bot,
  User,
  Trees,
  Info,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  sources?: string[];
  suggestions?: string[];
  timestamp: string;
}

// Built-in comprehensive domain knowledge base for instant client-side fallback
const CLIENT_KNOWLEDGE_BASE = [
  {
    keywords: ["what is fra", "about fra", "fra 2006", "forest rights act 2006", "forest right act 2006", "scheduled tribes act", "van adhikar kanoon", "fra overview", "explain fra", "what is the forest rights act"],
    reply: `### What is the Forest Rights Act (FRA), 2006?

The **Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006** (*Act No. 2 of 2007*) was enacted to undo the **historical injustice** done to forest-dwelling Scheduled Tribes (FDST) and Other Traditional Forest Dwellers (OTFD).

---

### Core Provisions & Rights Recognized (Section 3):
1. **Individual Forest Rights (IFR) [Sec 3(1)(a)]:** Right to hold and occupy forest land up to **4 hectares (10 acres)** for dwelling and self-cultivation. Registered jointly in the names of both spouses.
2. **Community Forest Rights (CFR) [Sec 3(1)(b)-(m)]:** Collective rights to minor forest produce (MFP), fishing, grazing, and customary water bodies.
3. **Community Forest Resource (CFR) Management [Sec 3(1)(i)]:** Powers vested in the **Gram Sabha** to protect, regenerate, and manage customary forest resources against destructive exploitation.

> **Statutory Protection:** Section 4(5) guarantees that no forest dweller shall be evicted until the verification and vesting process is fully complete.`,
    suggestions: [
      "What is the difference between IFR and CFR?",
      "How does the 3-tier Gram Sabha to DLC process work?",
      "What evidence is required to prove an FRA claim?"
    ]
  },
  {
    keywords: ["difference between ifr and cfr", "ifr and cfr", "ifr vs cfr", "individual forest rights", "community forest rights"],
    reply: `### Difference Between IFR and CFR

Under Section 3 of FRA 2006, forest rights are bifurcated into two vital categories:

| Parameter | Individual Forest Rights (IFR) | Community Forest Rights (CFR) |
| :--- | :--- | :--- |
| **Section** | **Section 3(1)(a)** | **Section 3(1)(b) to 3(1)(m)** |
| **Claim Form** | **Form A** | **Form B** (use rights) & **Form C** (management under 3(1)(i)) |
| **Beneficiary** | Individual household / family | Gram Sabha / entire village community |
| **Ceiling** | Max **4 hectares (10 acres)** | Entire customary village boundary |
| **Title Name** | Jointly in names of **both spouses** | Issued in the name of the **Gram Sabha** |
| **Transferability**| Heritable, but strictly inalienable | Non-transferable community asset |
| **Primary Scope** | Habitation and self-cultivation | Grazing, MFP collection (mahua, tendu), water rights, and conservation |

---

**Section 3(1)(i)** empowers the Gram Sabha to preserve and protect surrounding forests from illegal diversion or deforestation.`,
    suggestions: [
      "How do Gram Sabhas file CFR claims?",
      "What Minor Forest Produce is covered?",
      "What is the 3-tier verification procedure for claims?"
    ]
  },
  {
    keywords: ["deforestation", "causes of deforestation", "deforestation awareness", "forest loss", "why deforestation", "jungle katai", "tree cutting"],
    reply: `### Deforestation Awareness: Causes, Ecological Fallout & Solutions

**Deforestation** refers to the large-scale removal of forest cover for non-forest industrial or agricultural activities.

---

### 1. Major Causes in India:
* **Industrial Mining:** Opencast mining for coal, bauxite, and iron ore in dense forest corridors (e.g., Jharkhand, Odisha, Chhattisgarh).
* **Linear Infrastructure:** Expressways, wide railway lines, transmission grids, and canals cutting through tiger and elephant corridors.
* **Commercial Monocultures:** Conversion of biodiverse forests into monoculture plantations (rubber, eucalyptus, palm).
* **Hydroelectric Reservoirs:** Submergence of pristine riverine ecosystems.
* **Forest Fires:** Summer heatwaves combined with dry ground litter spark severe canopy damage.

---

### 2. Critical Impacts:
* **Climate Change:** Accounts for **10–15% of global carbon emissions**; weakens India's carbon sink capacity.
* **Water Scarcity:** Eliminates the natural sponge effect, drying up hill springs and inducing monsoon flash floods.
* **Severe Soil Erosion:** Destabilizes mountain slopes (Western Ghats, Himalayas) and silts river basins.
* **Human-Wildlife Conflict:** Forces endangered wildlife (elephants, leopards, tigers) into rural farmlands.

---

### 3. Key Solutions:
* **FRA Community Forest Rights [Sec 3(1)(i)]:** Vests legal conservation powers in local Gram Sabhas to stop illicit logging.
* **VanRakshak GIS Platform:** Leverages AI anomaly detection to identify high-risk forest zones and backlog spikes.
* **Compensatory Afforestation (CAMPA):** Ensuring genuine indigenous species restoration rather than monocultures.`,
    suggestions: [
      "What are the best solutions to prevent deforestation?",
      "How does the Forest Conservation Act (FCA 1980/2023) work?",
      "What is the current forest cover target in India?"
    ]
  },
  {
    keywords: ["process", "claim process", "step by step", "how to apply", "procedure", "verification", "gram sabha", "sdlc", "dlc", "stages", "tier", "how to file", "file a claim", "file an fra claim", "filing"],
    reply: `### The 3-Tier Statutory Process for FRA Claims

Claims under the Forest Rights Act follow a decentralized 3-tier statutory ladder:

1. **Tier 1: Gram Sabha & Forest Rights Committee (FRC)**
   - Minimum **50% quorum** of all adult residents; at least **33% participation of women**.
   - FRC (10–15 members) receives **Form A** (IFR), **Form B** (CFR), or **Form C** (CFR rights).
   - Conducts joint physical on-ground verification with Revenue and Forest department personnel.
   - Passes resolution in the open Gram Sabha assembly.

2. **Tier 2: Sub-Divisional Level Committee (SDLC)**
   - Chaired by the Sub-Divisional Magistrate (SDM).
   - Consolidates resolutions and hears appeals within **60 days**.
   - Forwards compiled draft recommendations to the DLC.

3. **Tier 3: District Level Committee (DLC)**
   - Chaired by the **District Collector / District Magistrate (DM)**.
   - Final statutory approving authority under Section 6(5).
   - Approves claims, issues title deeds (**Pattas**), and directs mutation in the **Record of Rights (RoR)** within 30 days.

> **VanRakshak ML Alert:** VanRakshak's Isolation Forest model automatically flags states where claims experience severe SDLC-to-DLC bottleneck drop-offs.`,
    suggestions: [
      "What documents count as admissible evidence under FRA?",
      "What is the criterion for Other Traditional Forest Dwellers (OTFD)?",
      "How does VanRakshak detect implementation anomalies?"
    ]
  },
  {
    keywords: ["evidence", "proof", "documents required", "forms", "form a", "form b", "form c", "evidence needed", "documents needed", "what evidence"],
    reply: `### Admissible Evidence for FRA Claims (Rule 13)

Under Rule 13 of the Forest Rights Rules, at least **two pieces of evidence** from the following 14 acceptable categories are required:

1. **Government & Public Records:** Census rolls, electoral voter lists, ration cards prior to Dec 13, 2005.
2. **Forest Department Records:** Forest Offence Records (POR), penalty receipts, encroachment notices showing occupation before Dec 13, 2005.
3. **Physical Indicators:** Dwelling houses, stone boundary walls, leveled terraces, perennial fruit trees (mango, mahua, tamarind), wells, sacred burial grounds (*Jaher/Sarna*).
4. **Community Testimonies:** Sworn oral statements by village village elders and traditional headmen.

---

### Statutory Forms:
- **Form A:** Individual Forest Rights (IFR) claim.
- **Form B:** Community Forest Rights (CFR) claim.
- **Form C:** Community Forest Resource (CFR) Management claim under Sec 3(1)(i).`,
    suggestions: [
      "What is the criterion for Other Traditional Forest Dwellers (OTFD)?",
      "What is the difference between IFR and CFR?",
      "What are the statutory guidelines for Gram Sabha claim verification?"
    ]
  },
  {
    keywords: ["otfd", "other traditional forest dwellers", "75 years", "3 generations"],
    reply: `### Criteria for Other Traditional Forest Dwellers (OTFD)

Under Section 2(o) of the Forest Rights Act, non-ST forest residents must satisfy:

1. **Three Generations (75 Years) Rule:** Must prove that their family/ancestors have resided in and depended on the forest for at least **75 years** prior to **December 13, 2005** (dating back to December 13, 1930).
2. **Definition of Generation:** One generation equals 25 years.
3. **Bona Fide Livelihood:** Must depend on forest land for self-cultivation or minor forest produce.

> **MoTA Clarification:** Claimants do NOT need individual land tax receipts from 1930. Proving community or family presence in the village vicinity through elder testimonies, historical census, or settlement records is legally sufficient.`,
    suggestions: [
      "What evidence can an OTFD provide?",
      "What is the 3-tier verification procedure for claims?",
      "What is the Forest Rights Act (FRA 2006) overview?"
    ]
  },
  {
    keywords: ["forest cover", "isfr", "forest statistics", "how much forest", "tree cover"],
    reply: `### Forest Cover in India: ISFR Statistics & National Goal

According to the latest **India State of Forest Report (ISFR)**:

* **Total Forest Cover:** **713,789 sq km** (~**21.71%** of India's geographical area).
* **Tree Cover:** **95,748 sq km** (~**2.91%**).
* **Total Green Cover:** **809,537 sq km** (~**24.62%**).

---

### National Target:
* **National Forest Policy (1988):** Mandates a target of **33%** of national geographical area under forest and tree cover (and **66% in mountainous regions**).
* **Current Deficit:** India faces an approx **8.38% deficit** to reach this ecological threshold, underscoring the vital role of afforestation, agroforestry, and FRA community protection.`,
    suggestions: [
      "What are the main causes and effects of deforestation?",
      "How does the Forest Rights Act protect forest cover?",
      "How does VanRakshak monitor state forest rights implementation?"
    ]
  },
  {
    keywords: ["vanrakshak", "vandrishti", "techhunters", "dss", "decision support system", "anomaly", "machine learning", "risk score"],
    reply: `### VanRakshak: FRA Decision Support System (DSS)

**VanRakshak** was developed by **Team TechHunters** as an intelligence platform to monitor the implementation of the Forest Rights Act (FRA 2006) across India.

---

### Key Capabilities:
* **Machine Learning Anomaly Detection:** An unsupervised **Isolation Forest model** analyzes Monthly Progress Reports (MPR) to identify abnormal state-level trends.
* **Core Indicators:**
  - **Pending Rate:** Volume of claims stuck without administrative review.
  - **Rejection Spikes:** Abrupt surge in rejected claims without statutory explanation.
  - **Workflow Bottlenecks:** Attrition and delay between SDLC approval and DLC final title issuance.
  - **Backlog Growth:** Month-over-month rate of pending claim accumulation.
* **Risk Classification:** Classifies states into **Normal 🟢**, **Attention 🟡**, and **High Risk 🔴**.
* **Interactive GIS Map:** Real-time geospatial visualization of state-level boundaries and performance metrics.`,
    suggestions: [
      "What is the Forest Rights Act (FRA 2006)?",
      "What is the difference between IFR and CFR?",
      "What are the main causes and effects of deforestation?"
    ]
  }
];

function findClientResponse(query: string) {
  const q = query.toLowerCase().trim();
  let best = null;
  let maxScore = 0;

  for (const item of CLIENT_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (q.includes(kw)) {
        score += 4 + kw.split(" ").length * 2;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      best = item;
    }
  }

  if (maxScore >= 4 && best) {
    return {
      reply: best.reply,
      suggestions: best.suggestions,
      sources: ["FRA 2006 Statute", "Ministry of Tribal Affairs", "ISFR Report"]
    };
  }

  // Simulation / Policy Lever Scenario Handler
  if (q.includes("simulation") || q.includes("scenario") || q.includes("policy lever") || q.includes("clearance target") || q.includes("what-if") || q.includes("interventions")) {
    return {
      reply: `### VanRakshak AI: Policy Scenario Evaluation & Tactical Guidance 🌿

Thank you for running the administrative simulation. Here is your structured policy analysis under the **Forest Rights Act (FRA) 2006**:

---

### 1. Statutory Feasibility Analysis (FRA Rules 12A & 14):
* **SDLC Backlog Clearance:** Accelerating Sub-Divisional Committee resolution velocity requires deploying **Dedicated SDLC Mobile Camps** (Rule 12A) with co-opted Revenue and Forest Department surveyors. This clears the bottleneck before reaching the District Collector.
* **Appellate Reconsideration (Section 6(2)):** Rejections overturned through administrative review must be accompanied by written recordings of reasons. Blanket rejections without physical ground inquiry violate Section 4(5) safeguards.
* **Gram Sabha CFR Mobilization (Section 3(1)(i)):** Expanding Community Forest Resource titles vests legal conservation authority directly in local Gram Sabhas, significantly reducing illicit logging and deforestation risk.

---

### 2. Projected Administrative Impact:
* **ML Risk Trajectory:** Shifting the state out of **Attention/High Risk** into **Normal Equilibrium** stabilizes the state's national governance ranking.
* **Title Vesting Velocity:** Faster SDLC transit ensures title deeds (Pattas) reach eligible Forest Dwelling Scheduled Tribes (FDST) and OTFDs without Multi-Year judicial delays.

---

### 3. Immediate Recommended Executive Circulars:
1. Issue directive to District Collectors (DLC Chairs) to schedule weekly review of SDLC-pending claim rosters.
2. Mandate joint GIS boundary mapping with Gram Sabha Forest Rights Committees (FRC).
3. Ensure unrecorded rejections are returned to Gram Sabhas for cure and re-submission within 30 days.`,
      suggestions: [
        "What are the statutory duties of SDLC under Rule 12A?",
        "How can Gram Sabhas appeal an unfair rejection?",
        "How does CFR tenure security prevent deforestation?"
      ],
      sources: ["FRA 2006 Rules 12A & 14", "MoTA Guidelines", "VanRakshak Policy Simulation Engine"]
    };
  }

  // Greeting
  if (/^(hi|hello|hey|namaste|greetings)/i.test(q)) {
    return {
      reply: `**Namaste! I am VanRakshak AI.** 🌿

I am your dedicated intelligence assistant for:
* 🌲 **Forest Rights Act (FRA) 2006:** Individual (IFR) & Community (CFR) titles, Gram Sabha verification, and statutory appeals.
* 🍃 **Deforestation Awareness:** Drivers of canopy loss, ecological fallout, biodiversity conservation, and policy solutions.
* 📜 **Forestry Laws:** Forest Conservation Act (FCA 1980/2023), PESA 1996, and ISFR statistics.
* 🗺️ **VanRakshak DSS:** Machine learning anomaly detection and state implementation risk monitoring.

How can I help you today?`,
      suggestions: [
        "What is the Forest Rights Act (FRA 2006)?",
        "What are the main causes and effects of deforestation?",
        "What is the difference between IFR and CFR?",
        "How does VanRakshak detect implementation anomalies?"
      ],
      sources: ["VanRakshak Knowledge Hub"]
    };
  }

  // Default synthesis
  return {
    reply: `### VanRakshak AI Domain Intelligence

Regarding **"${query}"**:

Under Indian forest governance and the **Forest Rights Act (FRA) 2006**:
1. **Statutory Framework:** Forest protection in India is governed through the harmonious implementation of the **Forest Rights Act 2006**, **Forest Conservation Act 1980 (amended 2023)**, and **PESA 1996**.
2. **Deforestation Prevention:** Active community stewardship via **Community Forest Resource (CFR) rights [Sec 3(1)(i)]** has demonstrated up to a 60% reduction in illicit tree felling compared to exclusively state-controlled perimeters.
3. **Decentralized Decision Making:** The **Gram Sabha** serves as the primary custodian of both forest titles and sustainable harvesting of Minor Forest Produce (MFP).
4. **VanRakshak Decision Support:** Our machine learning models detect anomalous rejection patterns, workflow delays at the SDLC/DLC tier, and backlog growth to keep district and state administrations accountable.

Choose a topic below or ask any question on forestry and rights!`,
      suggestions: [
        "What is the Forest Rights Act (FRA 2006)?",
        "What are the main causes and effects of deforestation?",
        "What is the difference between IFR and CFR?",
        "How does the 3-tier Gram Sabha to DLC process work?"
      ],
      sources: ["Forest Rights Act (FRA) 2006", "VanRakshak DSS"]
  };
}

// Markdown Formatter for Assistant Text
function FormattedText({ text }: { text: string }) {
  const renderFormatted = (raw: string) => {
    // Process markdown headers, bold, bullet points, blockquotes, tables
    const lines = raw.split("\n");
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = (key: string) => {
      if (tableRows.length > 0) {
        const headers = tableRows[0];
        const rows = tableRows.slice(1).filter((r) => !r.every((c) => c.trim().startsWith("---") || c.trim().startsWith(":--")));
        elements.push(
          <div key={key} className="overflow-x-auto my-3 rounded-lg border border-[#B7E64B]/20 bg-[#06120E]/70 p-2">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#B7E64B]/30 text-[#B7E64B] font-semibold">
                  {headers.map((h, i) => (
                    <th key={i} className="p-2 font-mono">
                      {h.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-[#B7E64B]/10 hover:bg-[#B7E64B]/5 transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className="p-2 text-[#E4EDE7]">
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Check table row
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        inTable = true;
        const cells = trimmed.slice(1, -1).split("|");
        tableRows.push(cells);
        return;
      } else if (inTable) {
        flushTable(`tbl-${idx}`);
      }

      // Headers
      if (trimmed.startsWith("### ")) {
        elements.push(
          <h4 key={idx} className="text-sm font-bold text-[#B7E64B] mt-3 mb-1.5 flex items-center gap-1.5 font-mono">
            <Trees size={14} className="text-[#B7E64B]" />
            {trimmed.replace("### ", "")}
          </h4>
        );
        return;
      }

      // Horizontal Rule
      if (trimmed === "---") {
        elements.push(<hr key={idx} className="my-2 border-[#B7E64B]/20" />);
        return;
      }

      // Blockquotes
      if (trimmed.startsWith("> ")) {
        elements.push(
          <div
            key={idx}
            className="my-2 p-2.5 rounded-lg border-l-4 border-[#B7E64B] bg-[#B7E64B]/10 text-xs text-[#E4EDE7] italic font-sans"
          >
            {trimmed.replace("> ", "")}
          </div>
        );
        return;
      }

      // Bullet points
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        const bulletText = trimmed.replace(/^(\*|-)\s+/, "");
        // Format bold inside bullet
        const parts = bulletText.split(/(\*\*.*?\*\*)/g);
        elements.push(
          <div key={idx} className="flex items-start gap-2 my-1 text-xs text-[#E4EDE7] pl-1.5">
            <span className="text-[#B7E64B] font-bold mt-0.5">•</span>
            <div>
              {parts.map((part, pi) =>
                part.startsWith("**") && part.endsWith("**") ? (
                  <strong key={pi} className="font-semibold text-[#F2F3E9]">
                    {part.slice(2, -2)}
                  </strong>
                ) : (
                  part
                )
              )}
            </div>
          </div>
        );
        return;
      }

      // Numbered items
      if (/^\d+\.\s/.test(trimmed)) {
        const parts = trimmed.split(/(\*\*.*?\*\*)/g);
        elements.push(
          <div key={idx} className="my-1.5 text-xs text-[#E4EDE7] pl-1.5">
            {parts.map((part, pi) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={pi} className="font-semibold text-[#B7E64B]">
                  {part.slice(2, -2)}
                </strong>
              ) : (
                part
              )
            )}
          </div>
        );
        return;
      }

      // Empty line
      if (!trimmed) {
        elements.push(<div key={idx} className="h-1.5" />);
        return;
      }

      // Regular paragraph with bold support
      const parts = trimmed.split(/(\*\*.*?\*\*)/g);
      elements.push(
        <p key={idx} className="text-xs text-[#E4EDE7] leading-relaxed my-1">
          {parts.map((part, pi) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={pi} className="font-semibold text-[#B7E64B]">
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    });

    if (inTable) {
      flushTable(`tbl-end`);
    }

    return elements;
  };

  return <div className="space-y-1">{renderFormatted(text)}</div>;
}

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-init",
      sender: "bot",
      text: `**Namaste! I am VanRakshak AI.** 🌿

I am your dedicated intelligence assistant for **Forests**, **Deforestation Awareness**, the **Forest Rights Act (FRA 2006)**, and **VanRakshak DSS**.

How can I help you today? Ask any question or click a starter topic below!`,
      suggestions: [
        "What is the Forest Rights Act (FRA 2006)?",
        "What is the difference between IFR and CFR?",
        "What are the main causes and effects of deforestation?",
        "How does the 3-tier Gram Sabha to DLC process work?"
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  // Voice Recognition (Speech-to-Text)
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please type your query.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      handleSendMessage(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  // Text-to-Speech (Audio Readout)
  const toggleSpeech = (id: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean text of markdown formatting for cleaner speech
    const cleanText = text
      .replace(/#{1,6}\s+/g, "")
      .replace(/\*\*/g, "")
      .replace(/\|/g, " ")
      .replace(/>/g, "")
      .replace(/---/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-IN";
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Copy to clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Reset conversation
  const handleReset = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingId(null);
    setMessages([
      {
        id: "msg-init",
        sender: "bot",
        text: `**Conversation reset.** 🌿 How can I help you explore forests, deforestation awareness, or the Forest Rights Act?`,
        suggestions: [
          "What is the Forest Rights Act (FRA 2006)?",
          "What is the difference between IFR and CFR?",
          "What are the main causes and effects of deforestation?",
          "How does VanRakshak detect implementation anomalies?"
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Send message handler
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // First attempt backend API
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-4).map((m) => ({ role: m.sender, content: m.text })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: data.reply || "I am ready with your forest rights information.",
          suggestions: data.suggestions || [],
          sources: data.sources || [],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error("Backend API unavailable");
      }
    } catch {
      // Automatic client-side fallback
      const fallback = findClientResponse(query);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: fallback.reply,
        suggestions: fallback.suggestions,
        sources: fallback.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Listen for custom trigger events from other components (e.g. What-If Simulator, Risk Card)
  useEffect(() => {
    const handleTrigger = (e: any) => {
      const q = e.detail?.query;
      if (q) {
        setIsOpen(true);
        setTimeout(() => {
          handleSendMessage(q);
        }, 150);
      }
    };
    window.addEventListener("vanrakshak:trigger-assistant", handleTrigger);
    window.addEventListener("vandrishti:trigger-assistant", handleTrigger);
    return () => {
      window.removeEventListener("vanrakshak:trigger-assistant", handleTrigger);
      window.removeEventListener("vandrishti:trigger-assistant", handleTrigger);
    };
  }, []);

  return (
    <div className="vanrakshak-floating-assistant-wrapper">
      {/* 1. The Floating Circular Logo Button (Fixed at bottom right) */}
      {!isOpen && (
        <button
          className="fixed bottom-6 right-6 z-[9999] group flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#12B981]/50 border-2 border-[#12B981]"
          onClick={() => setIsOpen(true)}
          aria-label="Open VanRakshak AI Assistant"
          title="Open VanRakshak AI Assistant"
        >
          {/* Exact Uploaded Circular Logo Image */}
          <img
            src="/assistant-logo.png"
            alt="VanRakshak AI"
            className="w-full h-full object-contain rounded-full p-1 drop-shadow-sm transition-transform duration-300 group-hover:rotate-6"
            onError={(e) => {
              // Fallback to static path if needed
              (e.target as HTMLImageElement).src = "/static/images/assistant-logo.png";
            }}
          />
          {/* Subtle pulsating green glow badge */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#10B981] border-2 border-[#0A1612]"></span>
          </span>
          {/* Tooltip on hover */}
          <span className="absolute right-16 px-3 py-1.5 rounded-lg bg-[#0C1A15] border border-[#B7E64B]/30 text-[#F2F3E9] text-xs font-mono font-medium shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Ask VanRakshak AI
          </span>
        </button>
      )}

      {/* 2. Floating AI Assistant Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-[9999] transition-all duration-300 flex flex-col rounded-2xl shadow-2xl border border-[#B7E64B]/30 bg-[#0C1713]/95 backdrop-blur-xl text-[#F2F3E9] overflow-hidden ${
            isExpanded
              ? "bottom-4 right-4 w-[calc(100vw-32px)] sm:w-[680px] h-[85vh]"
              : "bottom-6 right-6 w-[calc(100vw-48px)] sm:w-[420px] h-[600px] max-h-[85vh]"
          }`}
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 35px rgba(18, 185, 129, 0.2)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#B7E64B]/20 bg-[#122A20]/80">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-white border-2 border-[#12B981] flex items-center justify-center overflow-hidden p-0.5 shadow-md">
                <img
                  src="/assistant-logo.png"
                  alt="VanRakshak AI"
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/static/images/assistant-logo.png";
                  }}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] border border-white"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-wide text-[#F2F3E9]">VanRakshak AI</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#B7E64B]/20 text-[#B7E64B] font-semibold">
                    DSS 2.0
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#8FB5A2] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                  Forest & FRA Intelligence
                </div>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-1.5 text-[#8FB5A2] hover:text-[#B7E64B] hover:bg-[#1A382C] rounded-lg transition-colors"
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:inline-flex p-1.5 text-[#8FB5A2] hover:text-[#B7E64B] hover:bg-[#1A382C] rounded-lg transition-colors"
                title={isExpanded ? "Restore size" : "Expand window"}
                aria-label={isExpanded ? "Restore size" : "Expand window"}
              >
                {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#8FB5A2] hover:text-[#F87171] hover:bg-[#1A382C] rounded-lg transition-colors"
                title="Close chat"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs scrollbar-thin scrollbar-thumb-[#173F35] scrollbar-track-transparent">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} space-y-1`}
              >
                <div className="flex items-center gap-1 text-[10px] text-[#789883] px-1 font-mono">
                  {msg.sender === "user" ? (
                    <span>You · {msg.timestamp}</span>
                  ) : (
                    <span>VanRakshak AI · {msg.timestamp}</span>
                  )}
                </div>

                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 shadow-md ${
                    msg.sender === "user"
                      ? "bg-[#185338] text-white rounded-br-none border border-[#B7E64B]/30"
                      : "bg-[#0E231B]/90 text-[#F2F3E9] rounded-bl-none border border-[#B7E64B]/15"
                  }`}
                >
                  <FormattedText text={msg.text} />

                  {/* Actions on AI response (Audio read, copy) */}
                  {msg.sender === "bot" && (
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#B7E64B]/10 text-[10px] text-[#8FB5A2]">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleSpeech(msg.id, msg.text)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                            speakingId === msg.id
                              ? "bg-[#B7E64B] text-[#0C1613] font-semibold"
                              : "hover:bg-[#173F35] hover:text-[#B7E64B]"
                          }`}
                          title="Read aloud"
                        >
                          {speakingId === msg.id ? <VolumeX size={12} /> : <Volume2 size={12} />}
                          <span>{speakingId === msg.id ? "Stop" : "Listen"}</span>
                        </button>
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[#173F35] hover:text-[#B7E64B] transition-colors"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? <Check size={12} className="text-[#B7E64B]" /> : <Copy size={12} />}
                          <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                        </button>
                      </div>

                      {msg.sources && msg.sources.length > 0 && (
                        <span className="font-mono text-[9px] text-[#789883] truncate max-w-[140px]">
                          Ref: {msg.sources[0]}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Follow-up question chips */}
                {msg.sender === "bot" && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 pl-1">
                    {msg.suggestions.map((sug, si) => (
                      <button
                        key={si}
                        onClick={() => handleSendMessage(sug)}
                        className="text-[11px] font-sans px-2.5 py-1 rounded-full bg-[#122A20] hover:bg-[#1A3D2F] border border-[#B7E64B]/30 hover:border-[#B7E64B] text-[#B7E64B] transition-all duration-200 text-left flex items-center gap-1 shadow-sm"
                      >
                        <Sparkles size={11} className="text-[#B7E64B] flex-shrink-0" />
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Loading / Typing indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#B7E64B] p-2 bg-[#0E231B] rounded-xl border border-[#B7E64B]/20 w-fit">
                <span className="flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-[#B7E64B] rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#B7E64B] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#B7E64B] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </span>
                <span className="font-mono text-[11px]">Consulting FRA statutes & forest data…</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Pills (visible when at initial prompt) */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-[#0C1A15]/60 border-t border-[#B7E64B]/10">
              <span className="text-[10px] font-mono text-[#789883] uppercase tracking-wider block mb-1.5">
                Suggested questions:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  "What is the Forest Rights Act?",
                  "Causes of deforestation",
                  "Difference: IFR vs CFR",
                  "Gram Sabha verification process",
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    className="p-1.5 text-left rounded-lg bg-[#122A20]/80 border border-[#B7E64B]/20 hover:border-[#B7E64B]/60 text-[11px] text-[#E4EDE7] hover:text-[#B7E64B] transition-colors truncate"
                  >
                    • {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input Compose Box */}
          <div className="p-3 border-t border-[#B7E64B]/20 bg-[#10241B]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-xl border transition-all ${
                  isListening
                    ? "bg-[#DA5A5A] text-white border-red-400 animate-pulse"
                    : "bg-[#0A1813] text-[#8FB5A2] border-[#B7E64B]/20 hover:text-[#B7E64B] hover:border-[#B7E64B]/50"
                }`}
                title={isListening ? "Listening... click to stop" : "Voice input (English/Hindi)"}
                aria-label="Toggle voice input"
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening to your voice…" : "Ask about forests, deforestation, FRA 2006..."}
                className="flex-1 bg-[#0A1813] border border-[#B7E64B]/25 focus:border-[#B7E64B] focus:ring-1 focus:ring-[#B7E64B] rounded-xl px-3.5 py-2 text-xs text-[#F2F3E9] placeholder-[#5A7364] focus:outline-none transition-colors"
                disabled={loading}
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className={`p-2 rounded-xl transition-all ${
                  input.trim() && !loading
                    ? "bg-[#B7E64B] text-[#0C1613] hover:bg-[#c9f55c] active:scale-95 shadow-lg shadow-[#B7E64B]/20 font-bold"
                    : "bg-[#173F35]/40 text-[#5A7364] cursor-not-allowed"
                }`}
                aria-label="Send query"
              >
                <Send size={16} />
              </button>
            </form>
            <div className="flex items-center justify-between mt-2 px-1 text-[9px] text-[#5A7364] font-mono">
              <span>VanRakshak Decision Support System</span>
              <span>Team TechHunters</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
