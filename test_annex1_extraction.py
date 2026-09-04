import subprocess, re, fitz

def parse_annex1(img_path):
    res = subprocess.run(['./parse_page', img_path], capture_output=True, text=True)
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
    
    items_sorted = sorted(items, key=lambda i: i['y'], reverse=True)
    rows = []
    for item in items_sorted:
        placed = False
        for row in rows:
            avg_y = sum(i['y'] for i in row) / len(row)
            if abs(item['y'] - avg_y) <= 0.014:
                row.append(item)
                placed = True
                break
        if not placed:
            rows.append([item])
    
    records = []
    for row in rows:
        row.sort(key=lambda i: i['x'])
        tokens = [i['text'] for i in row]
        state_found = None
        for st in ["Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
                   "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
                   "Maharashtra", "Odisha", "Rajasthan", "Tamil Nadu", "Telangana", "Tripura", 
                   "Uttar Pradesh", "Uttarakhand", "West Bengal", "J&K"]:
            if any(st.lower() in t.lower() for t in tokens) or (st == "J&K" and any("j&k" in t.lower() or "jammu" in t.lower() for t in tokens)):
                state_found = st
                break
        if state_found:
            records.append((state_found, row))
    return records

doc = fitz.open("(A) MPR Dec 2024.pdf")
pix = doc[3].get_pixmap(dpi=200) # page 4
pix.save("page4_dec2024.png")
recs = parse_annex1("page4_dec2024.png")
for st, r in recs:
    print(f"\nState: {st}")
    for item in r:
        if re.search(r'\d', item['text']) or 'NA' in item['text'] or 'NR' in item['text']:
            print(f"  X={item['x']:.3f} W={item['w']:.3f} | {item['text']}")

