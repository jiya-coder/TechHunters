import fitz, os, subprocess

files = sorted([f for f in os.listdir('.') if f.endswith('.pdf')])

for f in files:
    doc = fitz.open(f)
    print(f"\n==================== {f} ({len(doc)} pages) ====================")
    for i, page in enumerate(doc):
        txt = page.get_text()
        # If page has fitz text or image text
        img_name = 'temp_check.png'
        pix = page.get_pixmap(dpi=150)
        pix.save(img_name)
        res = subprocess.run(['./parse_page', img_name], capture_output=True, text=True)
        raw_lines = res.stdout.strip().split('\n')
        
        has_annex1 = any(('annexure' in l.lower() and 'i' in l.lower() and 'ii' not in l.lower()) or 'state-wise status' in l.lower() for l in raw_lines)
        has_annex2b = any(('annexure' in l.lower() and 'ii' in l.lower()) and ('(b)' in l.lower() or 'disposed' in l.lower() or 'rejected' in l.lower()) for l in raw_lines)
        
        headers = [l for l in raw_lines if any(k in l.lower() for k in ['annexure', 'statement', 'claims', 'titles', 'state'])]
        if has_annex1 or has_annex2b or len(headers) > 2:
            tag = "Ann-I" if has_annex1 else ("Ann-IIB" if has_annex2b else "Table")
            print(f"Page {i+1} [{tag}]: {len(raw_lines)} text items. Sample: {headers[:2]}")

