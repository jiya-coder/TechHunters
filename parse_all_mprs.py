import fitz
import os
import subprocess
import re
import pandas as pd
import numpy as np

# Month mapping
MONTH_MAP = {
    "(A) MPR Dec 2024.pdf": "2024-12",
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

def clean_num(val):
    if not val: return 0
    s = re.sub(r'[^\d]', '', str(val))
    return int(s) if s else 0

def get_page_items(pdf_path, p_idx):
    doc = fitz.open(pdf_path)
    page = doc[p_idx]
    img_name = f"temp_p{p_idx}.png"
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

def group_items_by_row(items, y_thresh=0.015):
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

print("Helper script ready")
