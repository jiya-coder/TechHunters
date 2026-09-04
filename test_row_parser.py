import subprocess, re

def get_page_boxes(img_path):
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
    return items

def group_into_rows(items, y_thresh=0.014):
    # Sort items top-to-bottom
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
    
    # Sort items within each row left-to-right
    for row in rows:
        row.sort(key=lambda i: i['x'])
    return rows

items = get_page_boxes('page_4.png')
rows = group_into_rows(items)

print(f"Total rows grouped on Page 4: {len(rows)}")
for r in rows:
    row_txt = " | ".join([i['text'] for i in r])
    if any(st in row_txt.lower() for st in ['andhra', 'assam', 'bihar', 'chhattisgarh', 'goa', 'gujarat', 'kerala', 'odisha', 'madhya']):
        print(f"Y={r[0]['y']:.3f}: {row_txt}")

