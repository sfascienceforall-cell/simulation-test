import sys, asyncio, json
from playwright.sync_api import sync_playwright
# usage: check.py file.html [file2...] -> ouvre chaque simulation, rapporte les erreurs JS
res={}
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
    for f in sys.argv[1:]:
        pg=b.new_page(viewport={"width":1200,"height":900}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        pg.on("console",lambda m: errs.append("console:"+m.text) if m.type=="error" and "fonts" not in m.text and "ERR_" not in m.text else None)
        pg.route("**/fonts.googleapis.com/**",lambda r: r.abort()); pg.route("**/fonts.gstatic.com/**",lambda r: r.abort())
        pg.goto("file://"+f); pg.wait_for_timeout(300)
        ids=pg.evaluate("SFA.sims.map(s=>s.id)")
        bad=[]
        for i in ids:
            n0=len(errs)
            pg.evaluate("id=>SFA.openSim(id)",i); pg.wait_for_timeout(120)
            # bouger tous les curseurs et selects
            pg.evaluate("""()=>{var p=document.querySelector('.sim');if(!p)return;p.querySelectorAll('input[type=range]').forEach(r=>{for(const v of [r.min,r.max,(+r.min+ +r.max)/2]){r.value=v;r.dispatchEvent(new Event('input'))}});
            p.querySelectorAll('select').forEach(s=>{for(const o of s.options){s.value=o.value;s.dispatchEvent(new Event('change'))}});
            p.querySelectorAll('.seg button,.btn').forEach(b=>b.click());}""")
            pg.wait_for_timeout(200)
            note=pg.evaluate("()=>{var n=document.querySelector('.sim .note.bad');return n?n.textContent:''}")
            if len(errs)>n0 or note: bad.append({"id":i,"err":(errs[n0:]+[note])[:3]})
        nex=pg.evaluate("document.querySelectorAll('.exo').length")
        res[f]={"sims":len(ids),"exos":nex,"bad":bad,"pageErrors":errs[:5] if not ids else []}
        pg.close()
    b.close()
print(json.dumps(res,ensure_ascii=False,indent=1))
