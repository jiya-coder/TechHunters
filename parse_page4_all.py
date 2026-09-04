import fitz, subprocess, re
import pandas as pd

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

def get_ocr_items(page):
    img_name = "temp_render_p4all.png"
    pix = page.get_pixmap(dpi=200)
    pix.save(img_name)
    res = subprocess.run(['./parse_page', img_name], capture_output=True, text=True)
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

def extract_page4_data(pdf_path):
    doc = fitz.open(pdf_path)
    p4_idx = 3
    for idx, p in enumerate(doc):
        txt = p.get_text().lower()
        if 'statement showing state-wise status' in txt:
            p4_idx = idx

    items_p4 = get_ocr_items(doc[p4_idx])
    
    # Sort items by Y descending
    sorted_items = sorted(items_p4, key=lambda i: i['y'], reverse=True)
    rows = []
    for item in sorted_items:
        placed = False
        for r in rows:
            avg_y = sum(i['y'] for i in r) / len(r)
            if abs(item['y'] - avg_y) <= 0.014:
                r.append(item)
                placed = True
                break
        if not placed:
            rows.append([item])
    for r in rows:
        r.sort(key=lambda i: i['x'])

    data_p4 = {}
    for r in rows:
        tokens = [i['text'] for i in r]
        matched_st = None
        for st in STANDARD_STATES:
            if any(st.lower() in t.lower() for t in tokens) or (st == "J&K" and any("j&k" in t.lower() or "jammu" in t.lower() for t in tokens)):
                matched_st = st
                break
        if matched_st:
            num_tokens = [i for i in r if re.search(r'\d', i['text']) or 'NA' in i['text'] or 'NR' in i['text']]
            data_p4[matched_st] = num_tokens

    results = {}
    for st in STANDARD_STATES:
        p4_items = data_p4.get(st, [])
        p4_vals = [parse_num(i['text']) for i in p4_items]
        
        # Remove leading S.No if present
        if len(p4_vals) > 0 and p4_vals[0] <= 30:
            p4_vals = p4_vals[1:]
            
        # Extracted metrics from triples:
        # 0: GS Ind, 1: GS Com, 2: GS Total
        # 3: SDLC Ind, 4: SDLC Com, 5: SDLC Total
        # 6: DLC Ind, 7: DLC Com, 8: DLC Total
        # 9: Approved Ind, 10: Approved Com, 11: Approved Total
        # 12: Dist Ind, 13: Dist Com, 14: Dist Total
        # 15: Land Ind, 16: Land Com, 17: Land Total
        # 18: Rej Ind, 19: Rej Com, 20: Rej Total
        
        ind_claims = p4_vals[0] if len(p4_vals) > 0 else 0
        com_claims = p4_vals[1] if len(p4_vals) > 1 else 0
        tot_claims = p4_vals[2] if len(p4_vals) > 2 else ind_claims + com_claims
        
        sdlc_recomm = p4_vals[5] if len(p4_vals) >= 6 else tot_claims
        dlc_recomm = p4_vals[8] if len(p4_vals) >= 9 else sdlc_recomm
        approved_claims = p4_vals[11] if len(p4_vals) >= 12 else 0
        tot_titles = p4_vals[14] if len(p4_vals) >= 15 else approved_claims
        rejected_claims = p4_vals[20] if len(p4_vals) >= 21 else (p4_vals[18] if len(p4_vals) >= 19 else 0)

        if approved_claims == 0 and tot_titles > 0:
            approved_claims = tot_titles
        if tot_titles == 0 and approved_claims > 0:
            tot_titles = approved_claims

        # Logical bounds
        sdlc_recomm = min(sdlc_recomm, tot_claims) if tot_claims > 0 else sdlc_recomm
        dlc_recomm = min(dlc_recomm, sdlc_recomm) if sdlc_recomm > 0 else dlc_recomm
        approved_claims = min(approved_claims, dlc_recomm) if dlc_recomm > 0 else approved_claims

        pending_claims = max(0, tot_claims - (approved_claims + rejected_claims))

        results[st] = {
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
    return results

res = extract_page4_data('(A) MPR June 2026.pdf')
df_res = pd.DataFrame.from_dict(res, orient='index')
print(df_res.to_string())
