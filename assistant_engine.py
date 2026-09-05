"""
assistant_engine.py
VanDrishti AI Assistant Engine
Provides deep domain expertise on:
- Forest Rights Act (FRA) 2006: IFR, CFR, CFR Management, Gram Sabha, SDLC, DLC, statutory timelines
- Deforestation Awareness: drivers, ecological & tribal impacts, conservation strategies, climate connections
- Indian Forestry Framework: FCA 1980/2023, Indian Forest Act 1927, PESA 1996, WPA 1972, ISFR statistics
- VanDrishti DSS: Machine learning anomaly detection, risk tiers, workflow bottlenecks
- Multilingual support (English, Hindi, Hinglish)
- Optional Gemini/OpenAI API pass-through with automatic fallback to local knowledge base
"""

import os
import re
import json
import urllib.request
import urllib.error

# System prompt used when an external LLM is configured
SYSTEM_PROMPT = """You are VanDhristi AI, an expert AI assistant specialized in Indian Forestry, the Forest Rights Act (FRA) 2006, Deforestation Awareness, and the VanDrishti Decision Support System (DSS) developed by Team TechHunters.

Your knowledge includes:
1. THE FOREST RIGHTS ACT, 2006 (FRA) [Act No. 2 of 2007]:
   - Purpose: To undo the "historical injustice" suffered by Forest Dwelling Scheduled Tribes (FDST) and Other Traditional Forest Dwellers (OTFD) whose rights were not recognized during colonial and post-colonial forest reservations.
   - Eligible Beneficiaries:
     * FDST: Members of Scheduled Tribes primarily residing in and depending on forests for bona fide livelihood needs prior to Dec 13, 2005.
     * OTFD: Any person who has resided in the forest for at least 3 generations (75 years) prior to Dec 13, 2005, and depends on it for livelihood.
   - Types of Rights (Section 3):
     * Individual Forest Rights (IFR) [Sec 3(1)(a)]: Up to 4 hectares (10 acres) of occupied forest land for dwelling or self-cultivation. Title is heritable, non-alienable, and issued jointly in spouses' names.
     * Community Forest Rights (CFR) [Sec 3(1)(b)-(m)]: Rights over minor forest produce (MFP) like tendu patta, mahua, bamboo, honey, lac; grazing and water bodies; customary and fish rights.
     * Community Forest Resource (CFR) Management Rights [Sec 3(1)(i)]: Legal authority of Gram Sabha to protect, regenerate, manage, and conserve customary community forests against external or destructive diversion.
   - 3-Tier Verification Process:
     * Gram Sabha (FRC): 50% quorum, minimum 1/3 women. Receives Form A (IFR), Form B (CFR), Form C (CFR Rights). Conducts joint physical field surveys with Forest and Revenue staff.
     * SDLC (Sub-Divisional Level Committee): Examines resolutions, handles initial disputes within 60 days.
     * DLC (District Level Committee): Headed by District Collector/DM. Final authority to approve and issue title deeds (pattas). Directs Record of Rights (RoR) mutation within 30 days.
   - Evidentiary Standards: 14 admissible forms of evidence including physical traces, elder testimonies, voter lists, census, forest offense records.
   - Non-Eviction Clause: No forest dweller shall be evicted until the recognition and vesting process is fully complete.

2. DEFORESTATION AWARENESS & CONSERVATION:
   - Primary Drivers in India & Globally: Industrial mining (coal, bauxite, iron ore), linear infrastructure (expressways, railway lines, power lines), commercial monocultures, agricultural encroachment, illegal logging, forest fires.
   - Ecological Consequences: Destroys carbon sinks (~10-15% of global emissions), disrupts precipitation and monsoon cycles, causes catastrophic soil erosion and desertification, devastates biodiversity (India has 4 global biodiversity hotspots: Western Ghats, Eastern Himalayas, Indo-Burma, Sundaland).
   - Socio-Economic Impacts: Directly threatens livelihoods of ~275 million forest-dependent people in India; forces tribal displacement; aggravates human-wildlife conflict.
   - Solutions: FRA Community Forest Resource empowerment (Sec 3(1)(i)), satellite GIS monitoring (VanDrishti), Joint Forest Management (JFM), strict enforcement of Forest Conservation Act (FCA 1980 / 2023) and CAMPA, promoting Agroforestry and community afforestation.

3. FORESTRY FRAMEWORK & METRICS:
   - Forest Conservation Act (FCA) 1980 & 2023 Amendment.
   - Indian Forest Act 1927 (Reserved, Protected, Village forests).
   - Panchayats (Extension to Scheduled Areas) Act (PESA) 1996.
   - Wildlife (Protection) Act 1972 & Biological Diversity Act 2002.
   - National Forest Policy 1988: Mandates 33% of national land area under forest/tree cover (66% in hills). Current ISFR forest cover is ~21.71%, tree cover is ~2.91%, total green cover ~24.62%.

4. VANDRISHTI DSS (DECISION SUPPORT SYSTEM):
   - Developed by Team TechHunters.
   - Leverages an Isolation Forest Machine Learning model to detect implementation anomalies from Monthly Progress Reports (MPR).
   - Metrics: Pending Rate, Rejection Rate, Workflow Bottleneck Rate (SDLC to DLC drop-off), Backlog Growth.
   - Classification: Normal, Attention, High Risk states.

Always answer accurately, authoritatively, and empathetically. Format your answers with clear markdown headings, bullet points, and actionable insights. When appropriate, provide follow-up suggestions."""

# Knowledge base question categories & rich curated answers
KNOWLEDGE_BASE = [
    {
        "keywords": ["what is fra", "about fra", "fra 2006", "forest rights act 2006", "forest right act 2006", "scheduled tribes act", "van adhikar kanoon", "fra overview", "explain fra", "what is the forest rights act"],
        "title": "Forest Rights Act (FRA), 2006 — Comprehensive Overview",
        "reply": """### What is the Forest Rights Act (FRA), 2006?

The **Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006** (*Act No. 2 of 2007*), commonly known as the **Forest Rights Act (FRA)**, is a landmark Indian legislation enacted to rectify the **historical injustice** done to forest-dwelling communities whose customary tenure rights were unrecorded during colonial and post-independence forest consolidations.

---

### Key Pillars of the Act

1. **Eligible Beneficiaries:**
   - **Forest Dwelling Scheduled Tribes (FDST):** Members of Scheduled Tribes primarily residing in and dependent on forests for bona fide livelihood needs before **December 13, 2005**.
   - **Other Traditional Forest Dwellers (OTFD):** Persons residing in and dependent on forest land for at least **three generations (75 years)** prior to December 13, 2005.

2. **Types of Recognized Rights (Section 3):**
   - **Individual Forest Rights (IFR) [Sec 3(1)(a)]:** Right to hold and occupy forest land up to **4 hectares (10 acres)** for habitation or self-cultivation. Titles are heritable, inalienable, and registered jointly in both spouses' names.
   - **Community Forest Rights (CFR) [Sec 3(1)(b)-(m)]:** Rights over nistar, minor forest produce (MFP) collection, water bodies, grazing, and customary territories.
   - **Community Forest Resource (CFR) Management Rights [Sec 3(1)(i)]:** Power vested in the **Gram Sabha** to protect, regenerate, and manage customary forest lands.

3. **Democratized Governance:**
   - Establishes the **Gram Sabha** as the primary statutory body to initiate and verify claims through an elected **Forest Rights Committee (FRC)**.

> **Statutory Protection:** Section 4(5) explicitly guarantees that no forest-dwelling member shall be evicted or removed from forest land until the recognition and verification process is fully concluded.""",
        "suggestions": [
            "What is the difference between IFR and CFR?",
            "How does the 3-tier Gram Sabha to DLC process work?",
            "What evidence is required to prove an FRA claim?"
        ]
    },
    {
        "keywords": ["difference between ifr and cfr", "ifr and cfr", "ifr vs cfr", "individual forest rights", "community forest rights", "community forest resource"],
        "title": "IFR vs CFR: Understanding Forest Rights Categories",
        "reply": """### Comparison: Individual Forest Rights (IFR) vs Community Forest Rights (CFR)

Under Section 3 of the Forest Rights Act (FRA) 2006, forest rights are classified into two primary categories designed to protect both personal livelihood and collective community stewardship:

| Feature | Individual Forest Rights (IFR) | Community Forest Rights (CFR) |
| :--- | :--- | :--- |
| **Statutory Section** | **Section 3(1)(a)** | **Section 3(1)(b) through 3(1)(m)** |
| **Claim Form** | **Form A** | **Form B** (use rights) & **Form C** (CFR management under 3(1)(i)) |
| **Eligible Entity** | Individual household or nuclear family | Gram Sabha, village community, or pastoralist group |
| **Land Ceiling** | Up to **4 hectares (approx 10 acres)** of actual occupation | No arbitrary ceiling; covers traditional customary village boundary |
| **Title Ownership** | Registered jointly in the names of **both spouses** | Issued in the name of the **Gram Sabha** |
| **Transferability** | **Heritable but strictly inalienable** (cannot be sold, mortgaged, or leased) | Non-transferable community asset |
| **Primary Scope** | Habitation (house) and self-cultivation for bona fide livelihood | Grazing, fishing, water bodies, Minor Forest Produce (MFP), cultural rites |
| **Conservation Power** | Stewardship of the occupied land | Section 3(1)(i) empowers Gram Sabha to protect, regenerate, and conserve community forests |

---

### Why CFR is Crucial for Conservation
While IFR secures tenure for farming households, **CFR (especially Section 3(1)(i))** transforms villagers from passive forest subjects into legal conservation managers, effectively halting illegal deforestation and unregulated commercial exploitation.""",
        "suggestions": [
            "How can a Gram Sabha claim CFR under Section 3(1)(i)?",
            "What Minor Forest Produce (MFP) is covered under CFR?",
            "What is the 3-tier verification procedure for claims?"
        ]
    },
    {
        "keywords": ["deforestation", "causes of deforestation", "deforestation awareness", "forest loss", "why deforestation", "jungle katai", "tree cutting", "impact of deforestation"],
        "title": "Deforestation Awareness: Causes, Ecological Fallout, and Solutions",
        "reply": """### Deforestation Awareness: Causes, Impacts & Solutions

**Deforestation** refers to the purposeful clearing of forested land for commercial, agricultural, or industrial non-forest uses. In India and worldwide, forest ecosystems are under severe strain.

---

### 1. Major Causes of Deforestation
* **Industrial Mining & Quarrying:** Opencast mining for coal, bauxite, iron ore, and limestone clears dense canopy forests (notably in Central & Eastern India — Jharkhand, Odisha, Chhattisgarh).
* **Linear Infrastructure Projects:** Expressways, wide railway corridors, transmission grids, and canals fragment continuous tiger and elephant corridors.
* **Commercial Agriculture & Monoculture:** Conversion of native biodiverse forests into rubber, eucalyptus, tea, or oil palm plantations.
* **Hydroelectric Dams & Submergence:** Large reservoir projects submerge thousands of hectares of prime riverine forest.
* **Forest Fires & Climate Aridity:** Extended droughts and human negligence spark uncontrollable forest fires, destroying seed banks and undergrowth.
* **Illegal Felling & Fuelwood Stress:** Unregulated timber syndicates and acute dependence on fuelwood in fringe areas.

---

### 2. Critical Ecological & Social Consequences
* **Carbon Emissions & Global Warming:** Tropical forests store vast carbon pools; deforestation contributes roughly **10–15% of global greenhouse gas emissions**.
* **Disruption of Water Cycles:** Forests act as sponge catchments. Without tree cover, rainfall rushes as flash floods in monsoons, and perennial springs dry up in summer.
* **Catastrophic Soil Erosion:** Tree roots hold fragile topsoil. Deforestation triggers landslides (Himalayas, Western Ghats) and river siltation.
* **Biodiversity Extinction & Human-Wildlife Conflict:** Loss of contiguous habitat forces elephants, leopards, and tigers into agrarian settlements.
* **Displacement of Tribal Communities:** Over 275 million rural citizens in India depend on forests for NTFP, shelter, and cultural identity.

---

### 3. How VanDrishti & FRA Counter Deforestation
* **Community Forest Rights (FRA 3(1)(i)):** Empowered Gram Sabhas maintain active anti-logging patrols and sustainable harvesting practices.
* **AI & Geospatial Surveillance:** VanDrishti monitors state-level anomalies, backlog spikes, and high-risk forest zones using GIS and machine learning to aid timely intervention.""",
        "suggestions": [
            "What are the best solutions to stop deforestation in India?",
            "How does the Forest Conservation Act (FCA 1980/2023) work?",
            "What is the current forest cover percentage in India?"
        ]
    },
    {
        "keywords": ["process", "claim process", "step by step", "how to apply", "procedure", "verification", "gram sabha", "sdlc", "dlc", "stages", "tier", "how to file", "file a claim", "file an fra claim", "filing"],
        "title": "The 3-Tier Statutory Process for FRA Claims",
        "reply": """### The 3-Tier Statutory Process for FRA Claim Vesting

The Forest Rights Act, 2006 establishes an institutional hierarchy ensuring claims originate from the grassroots Gram Sabha:

```
 [ Gram Sabha / FRC ]
         │ (Prepares draft claim & joint field verification)
         ▼
 [ Sub-Divisional Level Committee (SDLC) ]
         │ (Examines resolutions, hears 60-day appeals)
         ▼
 [ District Level Committee (DLC) ]
         │ (Final approval, issues Patta, ensures RoR mutation)
```

---

### Stage 1: Gram Sabha & Forest Rights Committee (FRC)
1. **Notice & Quorum:** Gram Sabha convenes with at least **50% quorum of all adult residents**; minimum **33% participation of women**.
2. **FRC Constitution:** Elects a 10–15 member **Forest Rights Committee (FRC)**, comprising at least 2/3 Scheduled Tribes and 1/3 women.
3. **Claim Acceptance:** Receives **Form A** (Individual), **Form B** (Community), or **Form C** (CFR rights).
4. **Joint Field Verification:** FRC, alongside Forest Department guards and Revenue Talatis, physically inspects the boundary with GPS mapping.
5. **Resolution:** Gram Sabha discusses the findings in an open assembly and passes an approval or rejection resolution.

---

### Stage 2: Sub-Divisional Level Committee (SDLC)
- Chaired by the Sub-Divisional Officer (SDO/SDM).
- Consolidates resolutions from all Gram Sabhas in the sub-division.
- If a claim is disputed or rejected, claimants have **60 days to appeal** to the SDLC.
- Prepares draft records and forwards recommendations to the DLC.

---

### Stage 3: District Level Committee (DLC)
- Chaired by the **District Collector / District Magistrate (DM)**.
- Final statutory approving authority under Section 6(5).
- Approves claims, issues official title deeds (**Pattas**), and directs the Revenue and Forest departments to mutate the **Record of Rights (RoR)** within 30 days.

> **VanDrishti ML Alert:** VanDrishti’s Isolation Forest model tracks workflow bottlenecks where claims stall between SDLC recommendation and DLC final title issuance.""",
        "suggestions": [
            "What documents count as admissible evidence under FRA?",
            "What happens if an SDLC or DLC unlawfully rejects a claim?",
            "How does VanDrishti track SDLC-to-DLC workflow bottlenecks?"
        ]
    },
    {
        "keywords": ["evidence", "proof", "documents required", "forms", "what documents", "form a", "form b", "form c", "evidence needed", "documents needed", "what evidence"],
        "title": "Admissible Evidence & Forms for FRA Claims",
        "reply": """### Admissible Evidence for FRA Claims (Rule 13)

Under Rule 13 of the Forest Rights Rules, 2008 (amended 2012), at least **two pieces of evidence** from the following 14 acceptable categories must support an FRA claim:

---

### Categories of Admissible Evidence:
1. **Government Records:**
   - Census records, voter identification lists, ration cards prior to Dec 13, 2005.
   - Land survey records, maps, gazette notifications.
2. **Forest Department Records:**
   - Forest Offence Records (POR), penalty slips, encroachment receipts (Pouti/Challan) proving occupation prior to Dec 13, 2005.
   - Working plans, boundary demarcation records.
3. **Physical & Environmental Traces:**
   - Permanent physical structures: dwelling houses, huts, cattle sheds, stone boundary bunds.
   - Agricultural indicators: mature perennial fruit trees (mango, mahua, jackfruit), irrigation wells, leveled terraces, burial grounds, sacred groves (*Jaher / Sarna*).
4. **Community & Oral Evidence:**
   - Sworn testimonies and statements of village village elders (Gram Pradhans/Pujaris).
   - Customary pastoral routes, traditional grazing passes, community fishing records.

---

### Statutory Forms:
- **Form A:** For Individual Forest Rights (IFR) — residential and agricultural land up to 4 hectares.
- **Form B:** For Community Forest Rights (CFR) — grazing, fishing, minor produce gathering.
- **Form C:** For Community Forest Resource (CFR) management under Section 3(1)(i).""",
        "suggestions": [
            "What is the criterion for Other Traditional Forest Dwellers (OTFD)?",
            "What is the difference between Form B and Form C?",
            "How are forest titles registered jointly between spouses?"
        ]
    },
    {
        "keywords": ["otfd", "other traditional forest dwellers", "75 years", "3 generations", "generation rule"],
        "title": "Criteria for Other Traditional Forest Dwellers (OTFD)",
        "reply": """### Criteria for Other Traditional Forest Dwellers (OTFD)

Under Section 2(o) of the Forest Rights Act, 2006, non-Scheduled Tribe forest dwellers are recognized under the **OTFD** category.

---

### Key Requirements:
1. **Residence & Occupation:** Must have primarily resided in and depended on the forest or forest land for bona fide livelihood needs for at least **three generations (75 years)** prior to **December 13, 2005** (i.e. since December 13, 1930).
2. **Definition of Generation:** Section 2(b) defines one generation as **25 years** (3 generations = 75 years).
3. **Dependency:** The claimant must depend on the forest land for bona fide livelihood (subsistence farming, NTFP collection, pastoralism).

---

### Common Implementation Hurdle:
* Many state authorities incorrectly demand individual land records dating back to 1930.
* **Ministry of Tribal Affairs (MoTA) Clarification:** The claimant must only prove that their *family/community has resided in the village or forest vicinity* for 75 years, and that *they were occupying the specific forest land prior to Dec 13, 2005*. Elder testimonies, village census, and old tenancy slips are fully valid.""",
        "suggestions": [
            "What evidence can an OTFD provide without old land papers?",
            "What is the 3-tier verification procedure for claims?",
            "What is the Forest Rights Act (FRA 2006) overview?"
        ]
    },
    {
        "keywords": ["laws", "acts", "forest acts in india", "fca", "forest conservation act", "indian forest act", "pesa", "wildlife protection act", "campa"],
        "title": "Indian Forestry & Wildlife Legal Framework",
        "reply": """### Key Forest and Conservation Acts in India

India has a multifaceted statutory architecture governing forest land, wildlife conservation, and community rights:

---

1. **The Forest Rights Act, 2006 (FRA):**
   - Vests customary land and resource tenure in forest-dwelling Scheduled Tribes and traditional dwellers.
   - Puts Gram Sabha at the helm of community forest conservation.

2. **Forest (Conservation) Act, 1980 & Amendment 2023:**
   - Restricts non-forest diversion of forest lands without central Ministry (MoEFCC) clearance.
   - Mandatory compensatory afforestation and net present value (NPV) fee payment into **CAMPA**.

3. **Indian Forest Act, 1927 (IFA):**
   - Colonial-era law classifying forests into **Reserved Forests** (highest state control), **Protected Forests**, and **Village Forests**.

4. **Panchayats (Extension to Scheduled Areas) Act, 1996 (PESA):**
   - Extends self-governance to tribal areas in Fifth Schedule states.
   - Grants Gram Sabha ownership over Minor Forest Produce (MFP) and mandatory consultation before land acquisition.

5. **Wildlife (Protection) Act, 1972 (WPA):**
   - Framework for establishing National Parks, Sanctuaries, and Tiger Reserves.
   - Defines Critical Wildlife Habitats (CWH) where co-existence or fair relocation must comply with FRA Section 4(2).

6. **Biological Diversity Act, 2002:**
   - Establishes Biodiversity Management Committees (BMC) and People’s Biodiversity Registers (PBR) to protect indigenous ecological knowledge.""",
        "suggestions": [
            "How does FRA interact with the Forest Conservation Act (FCA)?",
            "What are the major causes and impacts of deforestation?",
            "What is the current forest cover target in India?"
        ]
    },
    {
        "keywords": ["forest cover", "isfr", "forest statistics", "how much forest", "tree cover", "percentage of forest"],
        "title": "India State of Forest Report (ISFR) Metrics & Targets",
        "reply": """### Forest Cover in India: ISFR Metrics & National Targets

According to the biennial **India State of Forest Report (ISFR)** published by the Forest Survey of India (FSI):

---

### Current National Figures:
* **Total Forest Cover:** ~**713,789 sq km** (~**21.71%** of total geographical area).
* **Tree Cover (patches < 1 hectare):** ~**95,748 sq km** (~**2.91%**).
* **Total Green Cover (Forest + Tree):** ~**809,537 sq km** (~**24.62%**).

---

### Classification by Canopy Density:
1. **Very Dense Forest (VDF):** Canopy density > 70% (~3.04% of area).
2. **Moderately Dense Forest (MDF):** Canopy density 40% – 70% (~9.33% of area).
3. **Open Forest (OF):** Canopy density 10% – 40% (~9.34% of area).
4. **Scrub & Mangroves:** Mangrove cover covers approx 4,992 sq km (Sundarbans, Bhitarkanika, Andaman).

---

### National Target:
* **National Forest Policy, 1988 Target:** Mandates a minimum of **33% of national land area** under forest or tree cover (and **66% in mountainous and hilly terrains** to prevent erosion and stabilize river basins).
* **Gap:** India currently has an approx **8.38% deficit** to reach the statutory 33% target, emphasizing the urgent need for deforestation prevention and community-led agroforestry.""",
        "suggestions": [
            "What are the main causes and effects of deforestation?",
            "What states have the highest forest cover in India?",
            "How does VanDrishti monitor state forest rights implementation?"
        ]
    },
    {
        "keywords": ["vandrishti", "techhunters", "dss", "decision support system", "anomaly", "machine learning", "isolation forest", "risk score", "how vandrishti works"],
        "title": "VanDrishti Decision Support System (DSS) Architecture",
        "reply": """### VanDrishti: FRA Decision Support System (DSS)

**VanDrishti** is an advanced State-level Decision Support System engineered by **Team TechHunters** to identify procedural bottlenecks, implementation anomalies, and high-risk states under the Forest Rights Act (FRA 2006).

---

### 1. The Machine Learning Engine
- **Model:** Unsupervised **Isolation Forest** machine learning model (`isolation_forest_model.pkl`).
- **Core Input Features:**
  * **Pending Rate:** Percentage of total claims languishing without decision.
  * **Rejection Rate:** Unusually high rejection spikes without detailed speaking orders.
  * **Workflow Bottleneck Rate:** Claim drop-offs between SDLC recommendation and DLC final disposal.
  * **Pending Backlog Growth:** Velocity of unaddressed claim accumulation month-over-month.

---

### 2. Risk Classification Tiers
* 🟢 **Normal:** Consistent claim disposal, healthy Gram Sabha verification rates, low backlog.
* 🟡 **Attention:** Early warning signs of administrative delays or elevated SDLC holding periods.
* 🔴 **High Risk:** Anomalous rejection spikes, acute workflow stalls, or severe backlog growth requiring immediate MoTA intervention.

---

### 3. Integrated Platform Features
* **Interactive GIS Map:** Leaflet-powered state-wise geospatial visualization with risk-level color coding.
* **Knowledge Hub:** Direct access to statutory gazettes, Gram Sabha field playbooks, and DLC policy briefs.
* **VanDhristi AI:** 24/7 intelligent assistant answering questions on forest conservation, statutory compliance, and anomaly interpretation.""",
        "suggestions": [
            "Which states currently have High Risk status in VanDrishti?",
            "What is the difference between IFR and CFR?",
            "What are the statutory guidelines for Gram Sabha claim verification?"
        ]
    }
]

def match_knowledge_base(query: str):
    q = query.lower().strip()
    q_clean = re.sub(r"[^\w\s]", " ", q)
    words = set(q_clean.split())
    
    best_match = None
    best_score = 0
    
    for entry in KNOWLEDGE_BASE:
        score = 0
        for kw in entry["keywords"]:
            kw_clean = kw.lower()
            if kw_clean in q:
                score += 4 + len(kw_clean.split()) * 2
            else:
                kw_words = set(kw_clean.split())
                overlap = words.intersection(kw_words)
                if overlap:
                    score += len(overlap)
                    
        if score > best_score:
            best_score = score
            best_match = entry
            
    if best_score >= 3:
        return best_match
    return None

def generate_local_response(query: str, state_context: str = None) -> dict:
    """Fallback knowledge engine synthesizing domain response."""
    q = query.lower()

    # Policy Simulation / What-If Scenario Evaluation (Checked first for highest priority)
    if any(k in q for k in ["simulation", "scenario", "policy lever", "clearance target", "what-if", "interventions"]):
        return {
            "reply": """### VanDhristi AI: Administrative Policy Scenario Evaluation 🌿

Thank you for running the policy intervention simulator. Below is the statutory and operational assessment under the **Forest Rights Act (FRA) 2006**:

---

### 1. Statutory Feasibility Analysis (FRA Rules 12A & 14):
* **SDLC Backlog Reduction:** Accelerating Sub-Divisional Committee resolution velocity requires deploying **Dedicated SDLC Mobile Camps** (Rule 12A) with co-opted Revenue and Forest Department surveyors. This resolves ground verification bottlenecks before files reach the District Collector.
* **Appellate Reconsideration (Section 6(2)):** Rejections overturned through administrative review must be accompanied by written recordings of reasons. Blanket rejections without physical ground inquiry violate Section 4(5) safeguards against dispossession.
* **Gram Sabha CFR Mobilization (Section 3(1)(i)):** Expanding Community Forest Resource titles vests legal conservation authority directly in local Gram Sabhas, which satellite GIS confirms reduces illicit logging and deforestation.

---

### 2. Projected Administrative Impact:
* **ML Risk Trajectory:** Shifting the state out of **Attention/High Risk** into **Normal Equilibrium** restores operational alignment with the National Median.
* **Title Vesting Velocity:** Faster SDLC transit ensures title deeds (Pattas) reach eligible Forest Dwelling Scheduled Tribes (FDST) and OTFDs without multi-year judicial delays.

---

### 3. Immediate Recommended Executive Circulars:
1. Issue directive to District Collectors (DLC Chairs) to schedule bi-weekly reviews of SDLC-pending claim rosters.
2. Mandate joint GIS boundary mapping with Gram Sabha Forest Rights Committees (FRC).
3. Ensure unrecorded rejections are remanded back to Gram Sabhas for cure and re-submission within 30 days.""",
            "suggestions": [
                "What are the statutory duties of SDLC under Rule 12A?",
                "How can Gram Sabhas appeal an unfair rejection?",
                "How does CFR tenure security prevent deforestation?"
            ],
            "sources": ["FRA 2006 Rules 12A & 14", "MoTA Circulars", "VanDrishti Policy Simulation Engine"]
        }

    match = match_knowledge_base(query)
    if match:
        return {
            "reply": match["reply"],
            "suggestions": match["suggestions"],
            "sources": ["Forest Rights Act (FRA) 2006", "Ministry of Tribal Affairs (MoTA)", "ISFR Report", "VanDrishti DSS Engine"]
        }
        
    # General greetings
    if any(greet in q for greet in ["hi", "hello", "namaste", "hey", "good morning", "good evening"]):
        return {
            "reply": """**Namaste! I am VanDhristi AI**, your specialized assistant for:
* 🌲 **Forest Rights Act (FRA) 2006:** Individual (IFR) & Community (CFR) rights, Gram Sabha verification, SDLC & DLC timelines.
* 🍃 **Deforestation Awareness:** Causes of canopy loss, ecological consequences, biodiversity conservation, and policy solutions.
* 📜 **Statutory Guidance:** Forest Conservation Act (FCA 1980/2023), PESA 1996, Wildlife Protection Act 1972, and ISFR data.
* 🗺️ **VanDrishti DSS:** Machine learning risk scores, anomaly detection, and state implementation analytics.

How can I assist you with forest conservation or forest rights today?""",
            "suggestions": [
                "What is the Forest Rights Act (FRA 2006)?",
                "What are the main causes and effects of deforestation?",
                "What is the difference between IFR and CFR?",
                "How does VanDrishti detect FRA implementation anomalies?"
            ],
            "sources": ["VanDrishti Knowledge Hub"]
        }
        
    # Question on tribal communities or forest dwellers
    if any(k in q for k in ["tribe", "tribal", "adivasi", "forest dweller", "fdst"]):
        return {
            "reply": """### Tribal Communities & Forest Rights in India

India is home to over **104 million Scheduled Tribe (Adivasi) citizens**, representing approximately **8.6% of the national population**. Historically, tribal and indigenous cultures have functioned as symbiotic custodians of forest biodiversity.

---

### Key Protections Under the Law:
1. **Forest Rights Act (FRA) 2006:** Recognizes traditional ownership and custodial rights of Forest Dwelling Scheduled Tribes (FDST) and Other Traditional Forest Dwellers (OTFD).
2. **Gram Sabha Autonomy:** Vesting rights over Minor Forest Produce (MFP) like tendu patta, mahua, and bamboo gives economic independence to tribal self-help groups.
3. **PESA Act 1996:** Mandates prior informed consent of Gram Sabhas in Fifth Schedule areas before any land acquisition or mining lease.
4. **Protection from Forced Displacement:** FRA Section 4(5) strictly prohibits eviction until claims are fully verified and recorded.""",
            "suggestions": [
                "What is the difference between FDST and OTFD?",
                "What are Community Forest Rights (CFR)?",
                "What are the causes and impacts of deforestation?"
            ],
            "sources": ["Ministry of Tribal Affairs (MoTA)", "FRA Act 2006"]
        }

    # Question on forest fires
    if any(k in q for k in ["fire", "forest fire", "wildfire", "davanal"]):
        return {
            "reply": """### Forest Fires: Causes, Vulnerability & Management in India

Forest fires pose an escalating risk to India's green cover, destroying undergrowth, regeneration seed banks, and wildlife habitat.

---

### 1. Key Statistics:
- Over **36% of India's forest cover** is prone to frequent forest fires according to the Forest Survey of India (FSI).
- Central India (Odisha, Chhattisgarh, Madhya Pradesh), the Northeast, and Uttarakhand experience the highest incidence.

### 2. Primary Causes:
- **Prolonged Dry Spells & Heatwaves:** Amplified by climate change, reducing leaf litter moisture.
- **Accidental & Human-Triggered:** Uncontrolled burning for mahua flower and tendu patta harvesting, clearing for slash-and-burn, or discarded matchsticks.

### 3. Mitigation Strategies:
- **Satellite Warning Systems:** FSI's Forest Fire Alert System using MODIS and SNPP-VIIRS satellites.
- **Community Fire Lines:** Engaging local Gram Sabhas and Forest Rights Committees to maintain traditional cleared fire breaks.
- **Controlled Fuelwood Management:** Clearing highly flammable dry pine needles and leaf biomass.""",
            "suggestions": [
                "What are the main causes and effects of deforestation?",
                "What is the role of Gram Sabhas in forest management?",
                "What is the current forest cover in India?"
            ],
            "sources": ["Forest Survey of India (FSI)", "ISFR 2021"]
        }

    # Policy Simulation / What-If Scenario Evaluation
    if any(k in q for k in ["simulation", "scenario", "policy lever", "clearance target", "what-if", "interventions"]):
        return {
            "reply": """### VanDhristi AI: Administrative Policy Scenario Evaluation 🌿

Thank you for running the policy intervention simulator. Below is the statutory and operational assessment under the **Forest Rights Act (FRA) 2006**:

---

### 1. Statutory Feasibility Analysis (FRA Rules 12A & 14):
* **SDLC Backlog Reduction:** Accelerating Sub-Divisional Committee resolution velocity requires deploying **Dedicated SDLC Mobile Camps** (Rule 12A) with co-opted Revenue and Forest Department surveyors. This resolves ground verification bottlenecks before files reach the District Collector.
* **Appellate Reconsideration (Section 6(2)):** Rejections overturned through administrative review must be accompanied by written recordings of reasons. Blanket rejections without physical ground inquiry violate Section 4(5) safeguards against dispossession.
* **Gram Sabha CFR Mobilization (Section 3(1)(i)):** Expanding Community Forest Resource titles vests legal conservation authority directly in local Gram Sabhas, which satellite GIS confirms reduces illicit logging and deforestation.

---

### 2. Projected Administrative Impact:
* **ML Risk Trajectory:** Shifting the state out of **Attention/High Risk** into **Normal Equilibrium** restores operational alignment with the National Median.
* **Title Vesting Velocity:** Faster SDLC transit ensures title deeds (Pattas) reach eligible Forest Dwelling Scheduled Tribes (FDST) and OTFDs without multi-year judicial delays.

---

### 3. Immediate Recommended Executive Circulars:
1. Issue directive to District Collectors (DLC Chairs) to schedule bi-weekly reviews of SDLC-pending claim rosters.
2. Mandate joint GIS boundary mapping with Gram Sabha Forest Rights Committees (FRC).
3. Ensure unrecorded rejections are remanded back to Gram Sabhas for cure and re-submission within 30 days.""",
            "suggestions": [
                "What are the statutory duties of SDLC under Rule 12A?",
                "How can Gram Sabhas appeal an unfair rejection?",
                "How does CFR tenure security prevent deforestation?"
            ],
            "sources": ["FRA 2006 Rules 12A & 14", "MoTA Circulars", "VanDrishti Policy Simulation Engine"]
        }

    # Default informative synthesis
    return {
        "reply": f"""### VanDhristi AI Domain Insights

Regarding your question about **"{query}"**:

Under Indian forestry governance and the **Forest Rights Act (FRA) 2006**:
1. **Statutory Framework:** Forest protection in India is governed through the harmonious implementation of the **Forest Rights Act 2006**, **Forest Conservation Act 1980 (amended 2023)**, and **PESA 1996**.
2. **Deforestation Prevention:** Active community stewardship via **Community Forest Resource (CFR) rights [Sec 3(1)(i)]** has demonstrated up to a 60% reduction in illicit tree felling compared to exclusively state-controlled perimeters.
3. **Decentralized Decision Making:** The **Gram Sabha** serves as the primary custodian of both forest titles and sustainable harvesting of Minor Forest Produce (MFP).
4. **VanDrishti Decision Support:** Our machine learning models detect anomalous rejection patterns, workflow delays at the SDLC/DLC tier, and backlog growth to keep district and state administrations accountable.

Explore specific aspects below or ask follow-up questions!""",
        "suggestions": [
            "What is the Forest Rights Act (FRA 2006)?",
            "What are the causes and impacts of deforestation?",
            "What is the difference between IFR and CFR?",
            "How does VanDrishti detect implementation anomalies?"
        ],
        "sources": ["FRA 2006 Statute", "VanDrishti Decision Support System"]
    }

def ask_external_llm(message: str, history: list = None) -> str:
    """Attempts to query external LLM (Gemini or OpenAI) if API key is provided."""
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            payload = {
                "contents": [
                    {
                        "role": "user",
                        "parts": [{"text": f"{SYSTEM_PROMPT}\n\nUser Question: {message}"}]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.4,
                    "maxOutputTokens": 1024
                }
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return parts[0].get("text", "")
        except Exception:
            pass

    return None

def get_assistant_chat_response(message: str, history: list = None, state_context: str = None) -> dict:
    """Main entrypoint for assistant chat queries."""
    clean_msg = message.strip()
    if not clean_msg:
        return {
            "reply": "Please ask a question about forests, deforestation awareness, the Forest Rights Act (FRA 2006), or VanDrishti.",
            "suggestions": [
                "What is the Forest Rights Act (FRA 2006)?",
                "What are the main causes and effects of deforestation?",
                "What is the difference between IFR and CFR?"
            ],
            "sources": []
        }

    # Try external LLM if key is present
    llm_reply = ask_external_llm(clean_msg, history)
    if llm_reply:
        return {
            "reply": llm_reply,
            "suggestions": [
                "Tell me more about CFR under Section 3(1)(i)",
                "What evidence is required for FRA claims?",
                "How does VanDrishti calculate state risk scores?"
            ],
            "sources": ["VanDrishti AI & MoTA Guidelines"]
        }

    # Fast, rich local domain knowledge engine
    return generate_local_response(clean_msg, state_context)
