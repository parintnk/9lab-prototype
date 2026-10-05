"""Build public/{wireframe,prototype}.<lang>.html for en, th, zh-Hant, zh-Hans.

Edit the page HTML (English) in src/*.html; this script packs it back into the original offline
bundles (which carry the JS/CSS/fonts), adds the Figma-style zoom to the wireframe, and translates
every visible string with i18n/<lang>.json (English → translation). Strings that should stay English
(product names, codes, sample people) are listed in i18n/keep.json.
If a string has no translation the build stops and writes i18n/missing.json.
Run:  npm run build:html   (zh-Hans.json is generated from zh-Hant.json first)
"""
import base64, gzip, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
THAI = re.compile('[\u0e00-\u0e7f]')
TPL = re.compile(r'(<script type="__bundler/template">)(.*?)(</script>)', re.S)

ZOOM = """
<style>
html{overflow:hidden;height:100%;background:#ebebeb;touch-action:none}
body{transform-origin:0 0;will-change:transform;cursor:grab;user-select:none;-webkit-user-select:none}
html.wfz-drag body{cursor:grabbing}
#wfz{position:fixed;right:16px;bottom:16px;z-index:99999;display:flex;gap:4px;align-items:center;background:#111;color:#fff;
padding:6px;border-radius:10px;font:500 13px -apple-system,BlinkMacSystemFont,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.25)}
#wfz button{all:unset;cursor:pointer;min-width:32px;height:32px;padding:0 8px;box-sizing:border-box;text-align:center;line-height:32px;border-radius:6px}
#wfz button:hover{background:#333}#wfz span{min-width:48px;text-align:center}
#wfzh{position:fixed;left:16px;bottom:16px;z-index:99999;font:12px -apple-system,BlinkMacSystemFont,sans-serif;color:#666;background:rgba(255,255,255,.9);padding:6px 10px;border-radius:8px}
@media (max-width:600px){#wfzh{display:none}}
</style>
<div id="wfz" role="toolbar" aria-label="Zoom">
<button data-z="out" aria-label="Zoom out">−</button><span id="wfzv">100%</span><button data-z="in" aria-label="Zoom in">+</button>
<button data-z="fit">Fit</button><button data-z="reset">100%</button>
</div>
<div id="wfzh">Drag to move · Scroll to pan · Ctrl/⌘ + scroll or pinch to zoom · 0 = fit</div>
<script data-noi18n>
(function(){
  // Figma-style camera: body is the canvas, moved with transform (GPU, no relayout)
  var html=document.documentElement, body=document.body, label=document.getElementById('wfzv');
  html.appendChild(document.getElementById('wfz')); html.appendChild(document.getElementById('wfzh'));  // outside transformed body
  var cur={x:0,y:0,s:1}, tgt={x:0,y:0,s:1}, raf=0, MIN=0.05, MAX=4;
  function draw(){ body.style.transform='translate('+cur.x+'px,'+cur.y+'px) scale('+cur.s+')'; label.textContent=Math.round(cur.s*100)+'%'; }
  function tick(){
    raf=0; var k=0.22;  // easing per frame
    cur.x+=(tgt.x-cur.x)*k; cur.y+=(tgt.y-cur.y)*k; cur.s+=(tgt.s-cur.s)*k;
    if(Math.abs(tgt.s-cur.s)<1e-4&&Math.abs(tgt.x-cur.x)<.3&&Math.abs(tgt.y-cur.y)<.3){cur.x=tgt.x;cur.y=tgt.y;cur.s=tgt.s;}
    else raf=requestAnimationFrame(tick);
    draw();
  }
  function go(){ if(!raf) raf=requestAnimationFrame(tick); }
  function jump(){ cur.x=tgt.x; cur.y=tgt.y; cur.s=tgt.s; draw(); }
  function zoomAt(f,cx,cy){  // keep canvas point under (cx,cy) fixed
    var ns=Math.min(MAX,Math.max(MIN,tgt.s*f)); f=ns/tgt.s;
    cx=cx==null?innerWidth/2:cx; cy=cy==null?innerHeight/2:cy;
    tgt.x=cx-(cx-tgt.x)*f; tgt.y=cy-(cy-tgt.y)*f; tgt.s=ns;
  }
  function size(){ return {w:body.scrollWidth, h:body.scrollHeight}; }
  function fit(){ var z=size(), s=Math.min(innerWidth/z.w, innerHeight/z.h)*0.98; tgt.s=s; tgt.x=(innerWidth-z.w*s)/2; tgt.y=0; go(); }
  function fitWidth(){ var z=size(); tgt.s=innerWidth/z.w; tgt.x=0; tgt.y=0; }
  function focus(el){  // fly to an element (anchor links)
    var r=el.getBoundingClientRect(), bx=(r.left-cur.x)/cur.s, by=(r.top-cur.y)/cur.s, s=Math.max(tgt.s,0.6);
    tgt.s=s; tgt.x=innerWidth/2-(bx+r.width/cur.s/2)*s; tgt.y=80-by*s; go();
  }

  document.getElementById('wfz').addEventListener('click',function(e){
    var a=e.target.dataset.z; if(!a) return;
    if(a==='in') zoomAt(1.5); else if(a==='out') zoomAt(1/1.5); else if(a==='fit') return fit(); else zoomAt(1/tgt.s);
    go();
  });

  addEventListener('wheel',function(e){
    e.preventDefault();
    var d=e.deltaMode===1?16:e.deltaMode===2?innerHeight:1;
    if(e.ctrlKey||e.metaKey){ zoomAt(Math.exp(-e.deltaY*d*0.0025),e.clientX,e.clientY); go(); }  // ctrl+wheel and trackpad pinch
    else { var dx=e.shiftKey&&!e.deltaX?e.deltaY:e.deltaX, dy=e.shiftKey&&!e.deltaX?0:e.deltaY;
      tgt.x-=dx*d; tgt.y-=dy*d; cur.x=tgt.x; cur.y=tgt.y; cur.s=tgt.s; draw(); }  // pan follows finger directly
  },{passive:false});

  // drag to pan (mouse / pen / one finger), pinch with two fingers
  var pts=new Map(), moved=false, pinch=null;
  addEventListener('pointerdown',function(e){
    if(e.target.closest('#wfz')) return;
    pts.set(e.pointerId,{x:e.clientX,y:e.clientY}); moved=false; tgt.x=cur.x; tgt.y=cur.y; tgt.s=cur.s;
    if(pts.size===2){ var a=[...pts.values()]; pinch={d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)}; }
  });
  addEventListener('pointermove',function(e){
    var p=pts.get(e.pointerId); if(!p) return;
    var dx=e.clientX-p.x, dy=e.clientY-p.y; p.x=e.clientX; p.y=e.clientY;
    if(!moved&&Math.abs(dx)+Math.abs(dy)<3) return;
    if(!moved){ moved=true; html.classList.add('wfz-drag'); try{html.setPointerCapture(e.pointerId);}catch(_){} }
    if(pts.size===2&&pinch){
      var a=[...pts.values()], d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);
      zoomAt(d/pinch.d,(a[0].x+a[1].x)/2,(a[0].y+a[1].y)/2); pinch.d=d;
      tgt.x+=dx/2; tgt.y+=dy/2;
    } else { tgt.x+=dx; tgt.y+=dy; }
    jump();
  });
  function up(e){ pts.delete(e.pointerId); if(pts.size<2) pinch=null; if(!pts.size) html.classList.remove('wfz-drag'); }
  addEventListener('pointerup',up); addEventListener('pointercancel',up);
  addEventListener('click',function(e){
    if(moved){ e.preventDefault(); e.stopPropagation(); moved=false; return; }  // a drag is not a click
    var a=e.target.closest&&e.target.closest('a[href^="#"]'); if(!a) return;
    var el=document.getElementById(a.getAttribute('href').slice(1)); if(el){ e.preventDefault(); focus(el); }
  },true);
  addEventListener('dragstart',function(e){ e.preventDefault(); });

  addEventListener('keydown',function(e){
    if(e.target.closest&&e.target.closest('input,textarea')) return;
    var k=e.key, step=120;
    if(k==='+'||k==='=') zoomAt(1.5); else if(k==='-') zoomAt(1/1.5); else if(k==='0') return fit(), e.preventDefault();
    else if(k==='1') zoomAt(1/tgt.s);
    else if(k==='ArrowLeft') tgt.x+=step; else if(k==='ArrowRight') tgt.x-=step;
    else if(k==='ArrowUp') tgt.y+=step; else if(k==='ArrowDown') tgt.y-=step; else return;
    e.preventDefault(); go();
  });
  scrollTo(0,0); fitWidth(); jump();
  function start(){ scrollTo(0,0); fitWidth(); jump();  // undo the browser's native jump-to-anchor first
    var el=location.hash&&document.getElementById(location.hash.slice(1)); if(el) focus(el); }
  addEventListener('load',function(){ setTimeout(start,300); });  // ponytail: wait for canvas layout
  addEventListener('hashchange',start);
})();
</script>
"""


LANGS = ['en', 'th', 'zh-Hant', 'zh-Hans']
I18N = ROOT / 'i18n'
KEEP = set(json.loads((I18N / 'keep.json').read_text(encoding='utf-8')))
MAN = re.compile(r'(<script type="__bundler/manifest">)(.*?)(</script>)', re.S)
BLOCK = re.compile(r'(<(script|style)\b[^>]*>)(.*?)(</\2>)', re.S)
LIT = re.compile(r"""'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\$]|\\.)*`""")
ATTR = re.compile(r'\b(placeholder|aria-label|title)="([^"]*)"')
CSS_JS = re.compile(r'\d(px|deg|ms|s)\b|solid|transparent|rgba?\(|inset|^#|^[a-z][a-zA-Z0-9_-]*$|^[\W\d_]*$')


def is_text(x):  # visible text worth translating
    # "{{ it.name }}" alone is data, "NT$1,280" is a price: neither needs translating
    return bool(re.search(r'[A-Za-z]{2}', re.sub(r'\{\{.*?\}\}|NT\$', '', x)))


def js_text(x):  # JS string literal that reads like UI text (identifiers / css / colours are skipped)
    return is_text(x) and not CSS_JS.search(x.strip())


def translate(html, d, miss):
    def tx(x):
        k = x.strip()
        if not is_text(k) or k in KEEP:
            return x
        if k not in d:
            miss.add(k); return x
        return x.replace(k, d[k], 1)

    def js(code):
        def lit(m):
            q, inner = m.group(0)[0], m.group(0)[1:-1]
            if not js_text(inner) or inner in KEEP:
                return m.group(0)
            if inner not in d:
                miss.add(inner); return m.group(0)
            return q + d[inner].replace('\\', '\\\\').replace(q, '\\' + q) + q
        return LIT.sub(lit, code)

    parts, last = [], 0
    for m in BLOCK.finditer(html):  # markup text outside blocks; string literals inside app scripts; css untouched
        parts.append(re.sub(r'>([^<>]+)<', lambda t: '>' + tx(t.group(1)) + '<', html[last:m.start()]))
        inner = m.group(3) if m.group(2) == 'style' or 'data-noi18n' in m.group(1) else js(m.group(3))
        parts.append(m.group(1) + inner + m.group(4)); last = m.end()
    parts.append(re.sub(r'>([^<>]+)<', lambda t: '>' + tx(t.group(1)) + '<', html[last:]))
    out = ''.join(parts)
    return ATTR.sub(lambda m: f'{m.group(1)}="{tx(m.group(2))}"', out)


def build(name, bundle, lang, d, miss, zoom=False):
    html = (ROOT / bundle).read_text(encoding='utf-8')
    tpl = (ROOT / 'src' / name).read_text(encoding='utf-8')
    assert not THAI.search(tpl), f'src/{name}: keep src in English, translations go in i18n/'
    if zoom:
        tpl = tpl.replace('</body>', ZOOM + '</body>', 1)
    tpl = translate(tpl, d, miss).replace('<html lang="en">', f'<html lang="{lang}">', 1)
    # shared components (header, product card) live as html assets in the manifest
    mm = MAN.search(html); man = json.loads(mm.group(2))
    for e in man.values():
        if e.get('mime') == 'text/html':
            raw = base64.b64decode(e['data']); raw = gzip.decompress(raw) if e.get('compressed') else raw
            raw = translate(raw.decode('utf-8'), d, miss).encode('utf-8')
            e['data'] = base64.b64encode(gzip.compress(raw, mtime=0) if e.get('compressed') else raw).decode()
    html = html[:mm.start(2)] + json.dumps(man) + html[mm.end(2):]
    m = TPL.search(html)
    enc = json.dumps(tpl, ensure_ascii=False).replace('</', '<\\/')  # keep "</script>" from closing the tag
    html = html[:m.start(2)] + enc + html[m.end(2):]
    title = d.get(name.split('.')[0].title(), name.split('.')[0].title())
    html = html.replace('<title>Bundled Page</title>', f'<title>9Lab {title}</title>', 1)
    out = ROOT / 'public' / name.replace('.html', f'.{lang}.html')
    out.parent.mkdir(exist_ok=True)
    out.write_text(html, encoding='utf-8')


def site_strings():  # every English string the Next.js pages show (content in app/data.ts, labels via t('…'))
    out = set()
    for f in [ROOT / 'app' / 'data.ts', *(ROOT / 'app').rglob('*.tsx')]:
        code = f.read_text(encoding='utf-8')
        out |= {x.replace("\\'", "'") for x in re.findall(r"\bt\('((?:[^'\\]|\\.)*)'\)", code)}  # t('…') is always UI text
        for m in LIT.finditer(code):
            x = m.group(0)[1:-1]
            if (x.startswith('http') or x in KEEP or x.startswith('9Lab · ')  # urls, kept words, browser-tab titles
                    or re.fullmatch(r's\d-\d+|use client|_\w+|[\w.@-]*/[\w./@-]*|\.[\w./-]+|[a-z-]+(?: [a-z-]+)+', x)):
                continue
            if js_text(x) and not re.search(r'\$\{|=>|className|\(\)', x):
                out.add(x.replace("\\'", "'"))
    return out


SITE = site_strings()
missing = {}
for lang in LANGS:
    d = {} if lang == 'en' else json.loads((I18N / f'{lang}.json').read_text(encoding='utf-8'))
    miss = set()
    for name, bundle, zoom in [('wireframe.html', '9Lab Wireframe (offline).html', True), ('prototype.html', '9Lab Prototype (offline).html', False)]:
        build(name, bundle, lang, d, miss if lang != 'en' else set(), zoom)
    miss |= {x for x in SITE if x not in d} if lang != 'en' else set()
    if miss:
        missing[lang] = sorted(miss)
    print(f'{lang}: {"ok" if not miss else str(len(miss)) + " missing"}')
if missing:
    (I18N / 'missing.json').write_text(json.dumps(missing, ensure_ascii=False, indent=1), encoding='utf-8')
    sys.exit('untranslated strings → i18n/missing.json (add them to i18n/<lang>.json or i18n/keep.json)')
(I18N / 'missing.json').unlink(missing_ok=True)
