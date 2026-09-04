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
    img_name = "temp_render_v2.png"
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

def extract_state_rows(pdf_path):
    doc = fitz.open(pdf_path)
    
    # Page 4 (Annexure-I) & Page 8/9 (Annexure-II B)
    p4_idx = 3 # default Page 4
    p8_idx = 8 if len(doc) == 10 else 7
    
    for idx, p in enumerate(doc):
        txt = p.get_text().lower()
        if 'statement showing state-wise status' in txt:
            p4_idx = idx
        if 'statement of claims and distribution' in txt or 'disposed' in txt:
            if 'annexure-iii' not in txt:
                p8_idx = idx

    # Parse Page 4
    items_p4 = get_ocr_items(doc[p4_idx])
    items_p8 = get_ocr_items(doc[p8_idx])
    
    # Sort items by Y descending
    def group_by_y(items, tol=0.014):
        sorted_items = sorted(items, key=lambda i: i['y'], reverse=True)
        rows = []
        for item in sorted_items:
            placed = False
            for r in rows:
                avg_y = sum(i['y'] for i in r) / len(r)
                if abs(item['y'] - avg_y) <= tol:
                    r.append(item)
                    placed = True
                    break
            if not placed:
                rows.append([item])
        for r in rows:
            r.sort(key=lambda i: i['x'])
        return rows

    rows_p4 = group_by_y(items_p4)
    rows_p8 = group_by_y(items_p8)

    # Map Page 8 state rows (Annexure II-B)
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

    # Map Page 4 state rows (Annexure I)
    data_p4 = {}
    for r in rows_p4:
        tokens = [i['text'] for i in r]
        matched_st = None
        for st in STANDARD_STATES:
            if any(st.lower() in t.lower() for t in tokens) or (st == "J&K" and any("j&k" in t.lower() or "jammu" in t.lower() for t in tokens)):
                matched_st = st
                break
        if matched_st:
            # Get numerical tokens with x coordinates
            num_tokens = [i for i in r if re.search(r'\d', i['text']) or 'NA' in i['text'] or 'NR' in i['text']]
            data_p4[matched_st] = num_tokens

    results = {}
    for st in STANDARD_STATES:
        p8_nums = data_p8.get(st, [])
        p4_items = data_p4.get(st, [])
        
        # P8 layout: Ind Claims, Com Claims, Tot Claims, Ind Titles, Com Titles, Tot Titles, Rejected, Disposed
        ind_claims = p8_nums[0] if len(p8_nums) > 0 else 0
        com_claims = p8_nums[1] if len(p8_nums) > 1 else 0
        tot_claims = p8_nums[2] if len(p8_nums) > 2 else ind_claims + com_claims
        
        ind_titles = p8_nums[3] if len(p8_nums) > 3 else 0
        com_titles = p8_nums[4] if len(p8_nums) > 4 else 0
        tot_titles = p8_nums[5] if len(p8_nums) > 5 else ind_titles + com_titles
        
        rejected_claims = p8_nums[6] if len(p8_nums) > 6 else 0
        disposed_claims = p8_nums[7] if len(p8_nums) > 7 else tot_titles + rejected_claims

        # Extract P4 metrics (SDLC Recomm, DLC Recomm, DLC Approved)
        # On Page 4, each metric has Ind, Com, Total (groups of 3 numbers)
        # Let's extract values based on numerical items sorted by X
        p4_vals = [parse_num(i['text']) for i in p4_items]
        # Ignore leading S.No if present
        if len(p4_vals) > 0 and p4_vals[0] <= 30:
            p4_vals = p4_vals[1:]
            
        # The structure of triples on Page 4 for a state row:
        # Triple 1: Claims filed GS (Ind, Com, Total) -> p4_vals[0:3]
        # Triple 2: Claims Recomm SDLC (Ind, Com, Total) -> p4_vals[3:6]
        # Triple 3: Claims Recomm DLC (Ind, Com, Total) -> p4_vals[6:9]
        # Triple 4: DLC Approved Claims (Ind, Com, Total) -> p4_vals[9:12]
        # Triple 5: Titles Distributed (Ind, Com, Total) -> p4_vals[12:15]
        # Triple 6: Extent of Land (Ind, Com, Total) -> p4_vals[15:18]
        # Triple 7: Claims Rejected (Ind, Com, Total) -> p4_vals[18:21]

        sdlc_recomm = p4_vals[5] if len(p4_vals) >= 6 else (tot_claims if tot_claims > 0 else 0)
        dlc_recomm = p4_vals[8] if len(p4_vals) >= 9 else (sdlc_recomm if sdlc_recomm > 0 else 0)
        approved_claims = p4_vals[11] if len(p4_vals) >= 12 else tot_titles

        # Sanity checks
        if approved_claims == 0 and tot_titles > 0:
            approved_claims = tot_titles
        if sdlc_recomm > tot_claims and tot_claims > 0:
            sdlc_recomm = min(sdlc_recomm, tot_claims)
        if dlc_recomm > sdlc_recomm and sdlc_recomm > 0:
            dlc_recomm = min(dlc_recomm, sdlc_recomm)
        if approved_claims > dlc_recomm and dlc_recomm > 0:
            approved_claims = min(approved_claims, dlc_recomm)

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

res = extract_state_rows('(A) MPR June 2026.pdf')
df_test = pd.DataFrame.from_dict(res, orient='index')
print(df_test.to_string())

