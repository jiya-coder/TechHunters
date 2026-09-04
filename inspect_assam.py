import fitz, subprocess, re

def inspect_state_p4(pdf_path, state_name="Assam"):
    doc = fitz.open(pdf_path)
    page = doc[3] # 0-indexed page 4
    img_name = f'temp_{pdf_path.replace(" ", "_")}.png'
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
        for row in rows:
            avg_y = sum(i['y'] for i in row) / len(row)
            if abs(item['y'] - avg_y) <= 0.014:
                row.append(item)
                placed = True
                break
        if not placed:
            rows.append([item])
            
    print(f"\n=== {pdf_path} (Assam on Page 4) ===")
    for row in rows:
        row.sort(key=lambda i: i['x'])
        row_txt = " | ".join([f"X:{i['x']:.3f}({i['text']})" for i in row])
        if state_name.lower() in row_txt.lower():
            print(f"Y:{row[0]['y']:.3f} | {row_txt}")

inspect_state_p4('(L) MPR Jan 2025.pdf', 'Assam')
inspect_state_p4('(A) MPR Dec 2025.pdf', 'Assam')
inspect_state_p4('(A) MPR June 2026.pdf', 'Assam')
