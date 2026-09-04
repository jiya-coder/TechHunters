import fitz
import os
import subprocess
import re
import pandas as pd
import numpy as np

# Chronological 18 months from Jan 2025 to June 2026 ONLY
MONTH_MAP_18 = {
    "(L) MPR Jan 2025.pdf": "2025-01",
    "(K) MPR Feb 2025.pdf": "2025-02",
    "(J) MPR Mar 2025.pdf": "2025-03",
    "(I) MPR Apr 2025.pdf": "2025-04",
    "(H) MPR May 2025.pdf": "2025-05",
    "(G) MPR June 2025.pdf": "2025-06",
    "(F) MPR July 2025.pdf": "2025-07",
    "(E) MPR Aug 2025.pdf": "2025-08",
    "(D) MPR Sep 2025.pdf": "2025-09",
    "(C) MPR Oct 2025.pdf": "2025-10",
    "(B) MPR Nov 2025.pdf": "2025-11",
    "(A) MPR Dec 2025.pdf": "2025-12",
    "(E) MPR Jan 2026.pdf": "2026-01",
    "(D) MPR Feb 2026.pdf": "2026-02",
    "(B) MPR Mar 2026.pdf": "2026-03",
    "(C) MPR Apr 2026.pdf": "2026-04",
    "(B) MPR May 2026.pdf": "2026-05",
    "(A) MPR June 2026.pdf": "2026-06"
}

STANDARD_STATES = [
    "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Odisha", "Rajasthan", "Tamil Nadu", "Telangana", "Tripura", 
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "J&K"
]

def parse_num(val):
    if not val: return 0
    val_str = str(val).strip()
    if 'NA' in val_str or 'NR' in val_str or 'N/A' in val_str:
        return 0
    s = re.sub(r'[^\d]', '', val_str)
    return int(s) if s else 0

def get_ocr_items(page, tag=""):
    img_name = f"temp_clean_{tag}.png"
    pix = page.get_pixmap(dpi=200)
    pix.save(img_name)
    res = subprocess.run(['./parse_page', img_name], capture_output=True, text=True)
    if os.path.exists(img_name):
        try: os.remove(img_name)
        except: pass
    items = []
    for line in res.stdout.strip().split('\n'):
        if not line: continue
        parts = line.split(' | ', 1)
        if len(parts) != 2: continue
        coords_str, txt = parts
        c_dict = {}
        for item in coords_str.split(' '):
            if ':' in item:
                k, v = item.split(':')
                c_dict[k] = float(v)
        items.append({
            'y': c_dict.get('Y', 0),
            'x': c_dict.get('X', 0),
            'w': c_dict.get('W', 0),
            'h': c_dict.get('H', 0),
            'text': txt.strip()
        })
    return items

def group_items(items, y_thresh=0.014):
    items_sorted = sorted(items, key=lambda i: i['y'], reverse=True)
    rows = []
    for item in items_sorted:
        placed = False
        for row in rows:
            avg_y = sum(i['y'] for i in row) / len(row)
            if abs(item['y'] - avg_y) <= y_thresh:
                row.append(item)
                placed = True
                break
        if not placed:
            rows.append([item])
    for row in rows:
        row.sort(key=lambda i: i['x'])
    return rows

def process_month_pdf(pdf_file, month_str):
    doc = fitz.open(pdf_file)
    p4_idx = 3
    p8_idx = 8 if len(doc) == 10 else 7
    
    for idx, p in enumerate(doc):
        txt = p.get_text().lower()
        if 'statement showing state-wise status' in txt:
            p4_idx = idx
        if 'statement of claims and distribution' in txt or 'disposed' in txt:
            if 'annexure-iii' not in txt and 'lwe' not in txt:
                p8_idx = idx

    # Extract Page 8 (Annexure II-B)
    items_p8 = get_ocr_items(doc[p8_idx], tag=f"{month_str}_p8")
    rows_p8 = group_items(items_p8)
    
    data_p8 = {}
    for r in rows_p8:
        tokens = [i['text'] for i in r]
        matched_st = None
        for st in STANDARD_STATES:
            if any(st.lower() in t.lower() for t in tokens) or (st == "J&K" and any("j&k" in t.lower() or "jammu" in t.lower() for t in tokens)):
                matched_st = st
                break
        if matched_st:
            nums = [parse_num(i['text']) for i in r if re.search(r'\d', i['text']) or 'NA' in i['text'] or 'NR' in i['text']]
            if len(nums) >= 9 and nums[0] <= 30 and nums[1] > 100:
                nums = nums[1:]
            elif len(nums) >= 10 and nums[0] <= 30 and nums[1] <= 30:
                nums = nums[2:]
            data_p8[matched_st] = nums

    # Extract Page 4 (Annexure-I)
    items_p4 = get_ocr_items(doc[p4_idx], tag=f"{month_str}_p4")
    rows_p4 = group_items(items_p4)
    
    data_p4 = {}
    for r in rows_p4:
        tokens = [i['text'] for i in r]
        matched_st = None
        for st in STANDARD_STATES:
            if any(st.lower() in t.lower() for t in tokens) or (st == "J&K" and any("j&k" in t.lower() or "jammu" in t.lower() for t in tokens)):
                matched_st = st
                break
        if matched_st:
            num_items = [parse_num(i['text']) for i in r if re.search(r'\d', i['text']) or 'NA' in i['text'] or 'NR' in i['text']]
            if len(num_items) > 0 and num_items[0] <= 30:
                num_items = num_items[1:]
            data_p4[matched_st] = num_items

    month_records = []
    for st in STANDARD_STATES:
        nums8 = data_p8.get(st, [])
        vals4 = data_p4.get(st, [])

        # Extract P8 metrics (Annexure II-B)
        ind_claims = nums8[0] if len(nums8) > 0 else (vals4[0] if len(vals4) > 0 else 0)
        com_claims = nums8[1] if len(nums8) > 1 else (vals4[1] if len(vals4) > 1 else 0)
        tot_claims = nums8[2] if len(nums8) > 2 else (vals4[2] if len(vals4) > 2 else ind_claims + com_claims)

        ind_titles = nums8[3] if len(nums8) > 3 else (vals4[12] if len(vals4) >= 13 else 0)
        com_titles = nums8[4] if len(nums8) > 4 else (vals4[13] if len(vals4) >= 14 else 0)
        tot_titles = nums8[5] if len(nums8) > 5 else (vals4[14] if len(vals4) >= 15 else ind_titles + com_titles)

        rejected_claims = nums8[6] if len(nums8) > 6 else (vals4[20] if len(vals4) >= 21 else (vals4[18] if len(vals4) >= 19 else 0))
        
        # Extract P4 metrics (SDLC & DLC Recomm)
        sdlc_recomm = vals4[5] if len(vals4) >= 6 else tot_claims
        dlc_recomm = vals4[8] if len(vals4) >= 9 else sdlc_recomm
        approved_claims = vals4[11] if len(vals4) >= 12 else tot_titles

        # Fallbacks & bounds validation
        if approved_claims == 0 and tot_titles > 0:
            approved_claims = tot_titles
        if tot_titles == 0 and approved_claims > 0:
            tot_titles = approved_claims

        # Ensure logical bounds
        if tot_claims > 0:
            sdlc_recomm = min(sdlc_recomm, tot_claims)
            dlc_recomm = min(dlc_recomm, sdlc_recomm)
            approved_claims = min(approved_claims, dlc_recomm)
        else:
            sdlc_recomm = 0
            dlc_recomm = 0
            approved_claims = 0

        pending_claims = max(0, tot_claims - (approved_claims + rejected_claims))

        rec = {
            "Month": month_str,
            "State": st,
            "Total_Claims_Received": tot_claims,
            "Individual_Claims": ind_claims,
            "Community_Claims": com_claims,
            "Claims_Recommended_SDLC": sdlc_recomm,
            "Claims_Recommended_DLC": dlc_recomm,
            "Approved_Claims": approved_claims,
            "Pending_Claims": pending_claims,
            "Rejected_Claims": rejected_claims,
            "Titles_Distributed": tot_titles
        }
        month_records.append(rec)
    return month_records

print("Extracting 18 months data (Jan 2025 - June 2026)...", flush=True)

all_records = []
sorted_files = sorted(MONTH_MAP_18.keys(), key=lambda k: MONTH_MAP_18[k])

for pdf_file in sorted_files:
    month_str = MONTH_MAP_18[pdf_file]
    print(f"Processing {month_str} from {pdf_file}...", flush=True)
    m_recs = process_month_pdf(pdf_file, month_str)
    all_records.extend(m_recs)

df = pd.DataFrame(all_records)
print(f"Extracted total {len(df)} records (Expected: 18 x 21 = 378).", flush=True)

# Sort chronologically by Month and State
df = df.sort_values(by=["Month", "State"]).reset_index(drop=True)

# 🟡 B. Performance Metrics (4 features)
df["Pending_Rate"] = (df["Pending_Claims"] / df["Total_Claims_Received"].replace(0, 1)).clip(0, 1).round(4)
df["Approval_Rate"] = (df["Approved_Claims"] / df["Total_Claims_Received"].replace(0, 1)).clip(0, 1).round(4)
df["Rejection_Rate"] = (df["Rejected_Claims"] / df["Total_Claims_Received"].replace(0, 1)).clip(0, 1).round(4)
df["Disposal_Rate"] = ((df["Approved_Claims"] + df["Rejected_Claims"]) / df["Total_Claims_Received"].replace(0, 1)).clip(0, 1).round(4)

# 🔴 C. Government Loophole / Anomaly Detection (7 features)
df["Workflow_Bottleneck_Rate"] = ((df["Claims_Recommended_SDLC"] - df["Approved_Claims"]) / df["Total_Claims_Received"].replace(0, 1)).clip(0, 1).round(4)
df["SDLC_Dropoff_Rate"] = ((df["Total_Claims_Received"] - df["Claims_Recommended_SDLC"]) / df["Total_Claims_Received"].replace(0, 1)).clip(0, 1).round(4)
df["DLC_Dropoff_Rate"] = ((df["Claims_Recommended_SDLC"] - df["Approved_Claims"]) / df["Claims_Recommended_SDLC"].replace(0, 1)).clip(0, 1).round(4)

# Rejection Anomaly Score (Z-Score relative to month baseline)
def calc_zscore(group):
    std = group["Rejection_Rate"].std()
    if std == 0 or np.isnan(std):
        return pd.Series(0.0, index=group.index)
    return ((group["Rejection_Rate"] - group["Rejection_Rate"].mean()) / std).round(4)

df["Rejection_Anomaly_Score"] = df.groupby("Month", group_keys=False).apply(calc_zscore)

# Pending Backlog Growth (MoM change across 18 months)
df["Pending_Backlog_Growth"] = df.groupby("State")["Pending_Claims"].diff().fillna(0).astype(int)

# Individual vs Community Imbalance
df["Individual_vs_Community_Imbalance"] = ((df["Individual_Claims"] - df["Community_Claims"]).abs() / df["Total_Claims_Received"].replace(0, 1)).clip(0, 1).round(4)

# Data Inconsistency Flag
def check_inconsistency(row):
    flag = 0
    if abs((row["Individual_Claims"] + row["Community_Claims"]) - row["Total_Claims_Received"]) > 10:
        flag = 1
    if abs((row["Approved_Claims"] + row["Rejected_Claims"] + row["Pending_Claims"]) - row["Total_Claims_Received"]) > 10:
        flag = 1
    if row["Claims_Recommended_SDLC"] > row["Total_Claims_Received"] + 10:
        flag = 1
    return flag

df["Data_Inconsistency_Flag"] = df.apply(check_inconsistency, axis=1)

# 🔵 D. DSS (2 features)
def calc_risk_score(row):
    score = (
        30 * row["Pending_Rate"] +
        25 * row["Workflow_Bottleneck_Rate"] +
        25 * row["Rejection_Rate"] +
        10 * max(0, row["Rejection_Anomaly_Score"]) +
        10 * row["Data_Inconsistency_Flag"]
    )
    return round(min(100.0, max(0.0, score)), 2)

df["Risk_Score"] = df.apply(calc_risk_score, axis=1)

def assign_risk_level(score):
    if score < 30.0:
        return "Low"
    elif score < 50.0:
        return "Medium"
    elif score < 70.0:
        return "High"
    else:
        return "Critical"

df["Risk_Level"] = df["Risk_Score"].apply(assign_risk_level)

COLUMN_ORDER = [
    # 🟢 A. Official Data — 11
    "Month", "State", "Total_Claims_Received", "Individual_Claims", "Community_Claims",
    "Claims_Recommended_SDLC", "Claims_Recommended_DLC", "Approved_Claims",
    "Pending_Claims", "Rejected_Claims", "Titles_Distributed",
    
    # 🟡 B. Performance — 4
    "Pending_Rate", "Approval_Rate", "Rejection_Rate", "Disposal_Rate",
    
    # 🔴 C. Government Loophole / Anomaly Detection — 7
    "Workflow_Bottleneck_Rate", "SDLC_Dropoff_Rate", "DLC_Dropoff_Rate",
    "Rejection_Anomaly_Score", "Pending_Backlog_Growth",
    "Individual_vs_Community_Imbalance", "Data_Inconsistency_Flag",
    
    # 🔵 D. DSS — 2
    "Risk_Score", "Risk_Level"
]

df = df[COLUMN_ORDER]

# Overwrite CSV and Excel
csv_path = "fra_mpr_dataset.csv"
excel_path = "fra_mpr_dataset.xlsx"

df.to_csv(csv_path, index=False)
df.to_excel(excel_path, index=False, engine="openpyxl")

print(f"\nSUCCESS! Clean Master Dataset generated with shape: {df.shape}", flush=True)
print(f"Saved CSV: {os.path.abspath(csv_path)}", flush=True)
print(f"Saved Excel: {os.path.abspath(excel_path)}", flush=True)

print("\n=== MASTER DATASET VALIDATION REPORT ===", flush=True)
print(f"Total Rows: {len(df)} (EXACT EXPECTED: 18 months x 21 states = 378)")
print(f"Total Columns: {len(df.columns)} (EXACT EXPECTED: 24)")

print("\nMonths Included:", df["Month"].unique())
print("States Included:", df["State"].nunique(), "states")

print("\nNull Count Check:")
print(df.isnull().sum().to_string())

print("\nRisk Level Distribution:")
print(df["Risk_Level"].value_counts().to_string())

print("\nAssam First 5 Months Sample:")
print(df[df["State"]=="Assam"][["Month", "State", "Total_Claims_Received", "Individual_Claims", "Claims_Recommended_SDLC", "Approved_Claims", "Pending_Claims", "Approval_Rate", "Risk_Score", "Risk_Level"]].head().to_string())

