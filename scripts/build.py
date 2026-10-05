"""Build public/wireframe.html + public/prototype.html.

Edit the page HTML in src/*.html; this script packs it back into the original offline bundles
(which carry the JS/CSS/fonts) and adds the Figma-style zoom to the wireframe.
Run:  npm run build:html
"""
import json, re
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
<script>
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


def build(name, bundle, zoom=False):
    html = (ROOT / bundle).read_text(encoding='utf-8')
    m = TPL.search(html)
    tpl = (ROOT / 'src' / name).read_text(encoding='utf-8')
    left = sorted(set(THAI.findall(tpl)))
    assert not left, f'src/{name}: Thai text left'
    if zoom:
        tpl = tpl.replace('</body>', ZOOM + '</body>', 1)
    enc = json.dumps(tpl, ensure_ascii=False).replace('</', '<\\/')  # keep "</script>" from closing the tag
    html = html[:m.start(2)] + enc + html[m.end(2):]
    html = html.replace('<title>Bundled Page</title>', f'<title>9Lab {name.split(".")[0].title()}</title>', 1)
    (ROOT / 'public').mkdir(exist_ok=True)
    (ROOT / 'public' / name).write_text(html, encoding='utf-8')
    print(f'public/{name}: ok')


build('wireframe.html', '9Lab Wireframe (offline).html', zoom=True)
build('prototype.html', '9Lab Prototype (offline).html')
