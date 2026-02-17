/* ═══ home.js ═══ */

/* ── NEURAL CANVAS ──────────────────────────────────────── */
(function(){
  const cv=document.getElementById('neuralCanvas');if(!cv)return;
  const ctx=cv.getContext('2d');
  const layers=[[{x:55,y:80},{x:55,y:180},{x:55,y:280}],
    [{x:155,y:55},{x:155,y:135},{x:155,y:215},{x:155,y:295}],
    [{x:265,y:80},{x:265,y:180},{x:265,y:280}],
    [{x:360,y:130},{x:360,y:230}]];
  const cols=['#38bdf8','#818cf8','#34d399','#fbbf24'];
  let t=0;
  function draw(){
    ctx.clearRect(0,0,420,420);
    // edges
    for(let li=0;li<layers.length-1;li++){
      layers[li].forEach(s=>layers[li+1].forEach(d=>{
        const pulse=.5+.5*Math.sin(t*.02+s.y*.04);
        ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(d.x,d.y);
        ctx.strokeStyle=`rgba(56,189,248,${.07+.06*pulse})`;ctx.lineWidth=.9;ctx.stroke();
      }));
    }
    // nodes
    layers.forEach((layer,li)=>layer.forEach((n,ni)=>{
      const r=13+3*Math.sin(t*.025+ni*.8+li);
      const grd=ctx.createRadialGradient(n.x,n.y,2,n.x,n.y,r);
      grd.addColorStop(0,cols[li]+'ee');grd.addColorStop(1,cols[(li+1)%4]+'22');
      ctx.beginPath();ctx.arc(n.x,n.y,r,0,Math.PI*2);
      ctx.fillStyle=grd;ctx.fill();
      ctx.strokeStyle=cols[li]+'88';ctx.lineWidth=1.5;ctx.stroke();
    }));
    // outer ring
    ctx.save();ctx.translate(210,210);ctx.rotate(t*.005);
    ctx.beginPath();ctx.arc(0,0,178,0,Math.PI*2);
    ctx.strokeStyle='rgba(56,189,248,.06)';ctx.lineWidth=1;ctx.stroke();
    ctx.restore();
    t++;requestAnimationFrame(draw);
  }
  draw();
})();

/* ── QUICK LOOKUP ───────────────────────────────────────── */
document.getElementById('regInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')quickLookup()});

async function quickLookup(){
  const reg=document.getElementById('regInput').value.trim().toUpperCase();
  const area=document.getElementById('resultArea');
  const spin=document.getElementById('spin');
  const txt=document.getElementById('btnTxt');
  area.innerHTML='';
  if(!reg){showToast('Enter a registration number','error');return;}
  spin.classList.add('active');txt.textContent='Searching…';
  try{
    const d=await apiFetch(`/student/${reg}`);
    if(!d.success){
      area.innerHTML=`<div class="err-box"><span>⚠️</span><p>${d.message||'Student not found.'}</p></div>`;
    }else{
      renderStudentCard(d.student,area);
      area.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
  }catch{area.innerHTML=`<div class="err-box"><span>⚠️</span><p>Cannot connect to server. Make sure the backend is running.</p></div>`;}
  finally{spin.classList.remove('active');txt.textContent='Search';}
}

/* ── SCROLL REVEAL TRIGGER ──────────────────────────────── */
document.querySelectorAll('.feat-card,.stat').forEach(el=>{
  el.classList.add('reveal');new IntersectionObserver(([e])=>{
    if(e.isIntersecting){e.target.classList.add('visible');e.target._io?.disconnect();}
  },{threshold:.1}).observe(el);
});
