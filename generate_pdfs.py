import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

out_dirs = [
    os.path.join("vandhristi-2", "client", "public", "documents"),
    os.path.join("static", "documents")
]

for d in out_dirs:
    os.makedirs(d, exist_ok=True)

def build_pdf(filename, title, subtitle, sections):
    for d in out_dirs:
        filepath = os.path.join(d, filename)
        doc = SimpleDocTemplate(
            filepath,
            pagesize=letter,
            rightMargin=54,
            leftMargin=54,
            topMargin=54,
            bottomMargin=54
        )
        
        styles = getSampleStyleSheet()
        
        title_style = ParagraphStyle(
            'DocTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=20,
            leading=24,
            textColor=colors.HexColor('#173F35'),
            spaceAfter=6
        )
        
        subtitle_style = ParagraphStyle(
            'DocSubTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=11,
            leading=14,
            textColor=colors.HexColor('#D6A84F'),
            spaceAfter=14
        )
        
        h2_style = ParagraphStyle(
            'SectionH2',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=13,
            leading=16,
            textColor=colors.HexColor('#173F35'),
            spaceBefore=12,
            spaceAfter=6
        )
        
        body_style = ParagraphStyle(
            'BodyDark',
            parent=styles['BodyText'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#2A3632'),
            spaceAfter=8
        )
        
        story = []
        story.append(Paragraph(title, title_style))
        story.append(Paragraph(subtitle, subtitle_style))
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#173F35'), spaceAfter=14))
        
        for sec_title, p_texts in sections:
            story.append(Paragraph(sec_title, h2_style))
            for p in p_texts:
                story.append(Paragraph(p, body_style))
            story.append(Spacer(1, 8))
            
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#C4CEBA'), spaceBefore=14, spaceAfter=10))
        footer_text = "Official Publication · Ministry of Tribal Affairs & VanDrishti Decision Support Platform"
        story.append(Paragraph(footer_text, ParagraphStyle('Footer', fontName='Helvetica-Oblique', fontSize=8, textColor=colors.HexColor('#5B6B65'))))
        
        doc.build(story)
        print(f"Generated PDF: {filepath}")

# 1. FRA Act 2006 Statute PDF
fra_sections = [
    ("CHAPTER I — PRELIMINARY & STATUTORY JURISDICTION", [
        "<b>1. Short title and commencement:</b> This Act may be called the Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006. It extends to the whole of India.",
        "<b>2. Definitions & Vested Rights:</b> <i>'Community Forest Resource'</i> means customary forest land within traditional boundaries of villages. <i>'Forest Dwelling Scheduled Tribes'</i> means members or communities who primarily reside in and depend on forests for bona fide livelihood needs."
    ]),
    ("CHAPTER II — RECOGNIZED FOREST RIGHTS FRAMEWORK", [
        "<b>Section 3(1)(a) — Individual Forest Rights (IFR):</b> Right to hold and live in the forest land under individual or common occupation for habitation or self-cultivation.",
        "<b>Section 3(1)(b) — Community Forest Rights (CFR):</b> Community rights such as nistar, right of access to minor forest produce (MFP), grazing grounds, and seasonal water bodies.",
        "<b>Section 3(1)(i) — Conservation Authority:</b> Right to protect, regenerate, conserve, or manage any community forest resource traditionally protected for sustainable use."
    ]),
    ("CHAPTER III — THREE-TIER STATUTORY VERIFICATION PROCESS", [
        "<b>Gram Sabha (Village Level):</b> Primary statutory authority to initiate the process for determining the nature and extent of individual and community forest rights.",
        "<b>Sub-Divisional Level Committee (SDLC):</b> Reviews Gram Sabha resolutions and prepares draft records of forest rights.",
        "<b>District Level Committee (DLC):</b> Final approving authority chaired by District Collector to grant and issue final Titles."
    ])
]
build_pdf(
    "FRA_Act_2006_Statute.pdf",
    "THE FOREST RIGHTS ACT, 2006 (STATUTE)",
    "Government of India · Act No. 2 of 2007 · Statutory Gazette Reference",
    fra_sections
)

# 2. Gram Sabha Playbook PDF
playbook_sections = [
    ("1. MANDATORY QUORUM & COMMITTEE FORMATION", [
        "<b>Quorum Requirement:</b> Every Gram Sabha meeting convened for Forest Rights verification must maintain at least 50% attendance of all adult members.",
        "<b>Gender Representation:</b> Forest Rights Committees (FRC) must contain at least 33% mandatory women representatives."
    ]),
    ("2. STEP-BY-STEP CLAIM VERIFICATION WORKFLOW", [
        "<b>Step 1 — Claim Submission:</b> Accept Form A for Individual Forest Rights and Form B for Community Forest Rights.",
        "<b>Step 2 — Field Verification:</b> FRC conducts joint physical inspection with Forest & Revenue officials and maps boundaries via GPS.",
        "<b>Step 3 — Evidence Appraisal:</b> Evaluate government records prior to Dec 13, 2005, physical structures, elder testimonies, and customary land use.",
        "<b>Step 4 — Resolution & Transmission:</b> Gram Sabha passes formal resolution and forwards verified package to SDLC."
    ]),
    ("3. BOTTLENECK ESCALATION DIRECTIVES", [
        "Claims pending beyond 60 days at SDLC level automatically trigger alert escalation on the VanDrishti Decision Support Platform."
    ])
]
build_pdf(
    "Gram_Sabha_Implementation_Playbook.pdf",
    "GRAM SABHA IMPLEMENTATION PLAYBOOK",
    "Field Verification & Forest Rights Committee Operational Guide",
    playbook_sections
)

# 3. Title Verification Brief PDF
policy_sections = [
    ("1. DISTRICT LEVEL COMMITTEE (DLC) MANDATE", [
        "The District Level Committee (DLC), chaired by the District Collector, holds final statutory authority to approve forest rights and issue Record of Rights (RoR) entries under Section 6(5) of the Act."
    ]),
    ("2. MANDATORY STATUTORY CHECKLIST", [
        "<b>Clearance Review:</b> Verify SDLC recommendations and joint boundary inspection reports.",
        "<b>Departmental Concurrence:</b> Coordinate with Forest and Revenue departments to ensure zero overlap with existing private leases.",
        "<b>Joint Title Issuance:</b> Ensure titles are issued jointly in the name of both spouses where applicable and mutated in revenue records within 30 days."
    ]),
    ("3. MACHINE LEARNING RISK ANOMALY TRACKING", [
        "VanDrishti ML models detect operational drop-offs, rejection spikes, and backlog growth to ensure transparent district decision-making."
    ])
]
build_pdf(
    "Title_Verification_Policy_Brief.pdf",
    "TITLE VERIFICATION POLICY BRIEF",
    "DLC Guidelines & Operational Bottleneck Directives",
    policy_sections
)
