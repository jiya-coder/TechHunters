import fitz, subprocess, re

def inspect_page4(pdf_path):
    doc = fitz.open(pdf_path)
    # Find page 4 image
    page = doc[3] # 0-indexed page 4
    img_name = 'temp_p4_inspect.png'
    pix = page.get_pixmap(dpi=200)
    pix.save(img_name)
    res = subprocess.run(['./parse_page', img_name], capture_output=True, text=True)
    lines = res.stdout.strip().split('\n')
    print(f"\n==================== {pdf_path} Page 4 ({len(lines)} items) ====================")
    
    # Print headers at top
    headers = []
    for l in lines:
        if 'Y:0.6' in l or 'Y:0.7' in l or 'Y:0.8' in l or 'Y:0.9' in l:
            if any(k in l.lower() for k in ['annexure', 'statement', 'claims', 'sdlc', 'dlc', 'approved', 'rejected', 'titles', 'gram']):
                headers.append(l)
    for h in headers[:15]:
        print(h)

inspect_page4('(L) MPR Jan 2025.pdf')
inspect_page4('(A) MPR Dec 2025.pdf')
inspect_page4('(A) MPR June 2026.pdf')
