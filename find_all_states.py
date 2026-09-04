import fitz, subprocess, re

def find_states_on_pages(pdf_path):
    doc = fitz.open(pdf_path)
    print(f"\n==================== {pdf_path} ====================")
    for p_idx in [3, 4, 7, 8]: # Page 4, 5, 8, 9
        if p_idx >= len(doc): continue
        page = doc[p_idx]
        img_name = f'temp_p{p_idx+1}_find.png'
        pix = page.get_pixmap(dpi=200)
        pix.save(img_name)
        res = subprocess.run(['./parse_page', img_name], capture_output=True, text=True)
        lines = res.stdout.strip().split('\n')
        
        # Group into rows
        items = []
        for line in lines:
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
            for r in rows:
                avg_y = sum(i['y'] for i in r) / len(r)
                if abs(item['y'] - avg_y) <= 0.014:
                    r.append(item)
                    placed = True
                    break
            if not placed:
                rows.append([item])
                
        states_found = []
        for row in rows:
            tokens = [i['text'] for i in row]
            for st in ["Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
                       "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
                       "Maharashtra", "Odisha", "Rajasthan", "Tamil Nadu", "Telangana", "Tripura", 
                       "Uttar Pradesh", "Uttarakhand", "West Bengal", "J&K"]:
                if any(st.lower() in t.lower() for t in tokens) or (st == "J&K" and any("j&k" in t.lower() or "jammu" in t.lower() for t in tokens)):
                    states_found.append(st)
        print(f"Page {p_idx+1}: Found {len(states_found)} states -> {states_found}")

find_states_on_pages('(A) MPR June 2026.pdf')
find_states_on_pages('(A) MPR Dec 2025.pdf')
find_states_on_pages('(L) MPR Jan 2025.pdf')
