import subprocess

def map_headers(img_path):
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
    
    print(f"=== Headers for {img_path} (Y > 0.65) ===")
    headers = [i for i in items if i['y'] > 0.65]
    headers.sort(key=lambda i: (round(i['y'], 2), i['x']), reverse=True)
    for h in headers:
        print(f"Y:{h['y']:.3f} X:{h['x']:.3f} W:{h['w']:.3f} H:{h['h']:.3f} | {h['text']}")

map_headers('page_4.png')
map_headers('page_8.png')

