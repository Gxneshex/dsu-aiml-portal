/* ═══════════════════════════════════════════════
   DSU AI&ML Portal — shared.js
   ═══════════════════════════════════════════════ */

const API = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : '/api';

/* ── PARTICLES ──────────────────────────────────────────── */
(function(){
  const c=document.getElementById('particles');
  if(!c)return;
  const ctx=c.getContext('2d');
  let W,H,pts;
  function resize(){W=c.width=innerWidth;H=c.height=innerHeight}
  function mk(){return{x:Math.random()*W,y:Math.random()*H,
    r:Math.random()*1.4+.3,dx:(Math.random()-.5)*.22,dy:(Math.random()-.5)*.22,
    a:Math.random()*.45+.08}}
  function init(){resize();pts=Array.from({length:110},mk)}
  function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(56,189,248,${p.a})`;ctx.fill();
      p.x+=p.dx;p.y+=p.dy;
      if(p.x<0||p.x>W)p.dx*=-1;if(p.y<0||p.y>H)p.dy*=-1;
    });
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
      const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
      if(d<105){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);
        ctx.lineTo(pts[j].x,pts[j].y);
        ctx.strokeStyle=`rgba(56,189,248,${.065*(1-d/105)})`;
        ctx.lineWidth=.5;ctx.stroke()}
    }
    requestAnimationFrame(draw);
  }
  addEventListener('resize',init);init();draw();
})();

/* ── NAVBAR HAMBURGER ───────────────────────────────────── */
const _ham=document.getElementById('hamburger');
const _nl=document.getElementById('navLinks');
_ham?.addEventListener('click',()=>_nl?.classList.toggle('open'));

/* ── ACTIVE NAV LINK ────────────────────────────────────── */
(function(){
  const page=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href=a.getAttribute('href');
    if(href===page||(page===''&&href==='index.html'))a.classList.add('active');
    else a.classList.remove('active');
  });
})();

/* ── SCROLL REVEAL ──────────────────────────────────────── */
const _ro=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');_ro.unobserve(e.target)}});
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>_ro.observe(el));

/* ── COUNTER ANIMATION ──────────────────────────────────── */
function animCount(el,target,dur=1800){
  let s=null;
  (function step(ts){
    if(!s)s=ts;
    const p=Math.min((ts-s)/dur,1),e=1-Math.pow(1-p,3);
    el.textContent=Math.floor(e*target);
    if(p<1)requestAnimationFrame(step);else el.textContent=target;
  })(performance.now());
}
const _so=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.stat-num').forEach(n=>animCount(n,+n.dataset.target));
      _so.unobserve(e.target);
    }
  });
},{threshold:.4});
document.querySelectorAll('.stats-strip').forEach(el=>_so.observe(el));

/* ── TOAST ──────────────────────────────────────────────── */
function showToast(msg,type='info'){
  const t=document.getElementById('toast');if(!t)return;
  const icons={success:'✅',error:'❌',info:'ℹ️',warn:'⚠️'};
  t.textContent=`${icons[type]||'ℹ️'} ${msg}`;
  t.classList.add('show');
  clearTimeout(t._tid);t._tid=setTimeout(()=>t.classList.remove('show'),3500);
}

/* ── RENDER STUDENT CARD ────────────────────────────────── */
function renderStudentCard(s,container){
  const init=(s.name||'?').split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
  const att=s.attendance||0;
  const attColor=att>=75?'linear-gradient(90deg,#34d399,#38bdf8)':att>=60?'linear-gradient(90deg,#fbbf24,#fb923c)':'linear-gradient(90deg,#f87171,#ef4444)';
  const active=(s.status||'').toLowerCase()==='active';
  container.innerHTML=`
  <div class="stu-result">
    <div class="sr-head">
      <div class="sr-avatar-ring"><div class="sr-avatar">${init}</div></div>
      <div class="sr-id" style="flex:1">
        <h3>${s.name}</h3>
        <div class="flex-gap">
          <span class="badge badge-blue">${s.reg_no}</span>
          <span class="${active?'sr-status-active':'sr-status-inactive'}">${active?'● Active':'● Inactive'}</span>
        </div>
      </div>
    </div>
    <div class="sr-grid">
      <div class="sr-item"><div class="sr-label">Programme</div><div class="sr-val">${s.programme||'B.Tech AI & ML'}</div></div>
      <div class="sr-item"><div class="sr-label">Year / Sem</div><div class="sr-val">${s.year||'–'} Year · Sem ${s.semester||'–'}</div></div>
      <div class="sr-item"><div class="sr-label">Section</div><div class="sr-val">${s.section||'–'}</div></div>
      <div class="sr-item"><div class="sr-label">Date of Birth</div><div class="sr-val">${fmtDate(s.dob)}</div></div>
      <div class="sr-item"><div class="sr-label">Email</div><div class="sr-val" style="word-break:break-all">${s.email||'–'}</div></div>
      <div class="sr-item"><div class="sr-label">Phone</div><div class="sr-val">${s.phone||'–'}</div></div>
      <div class="sr-item"><div class="sr-label">CGPA</div><div class="sr-val big">${s.cgpa||'–'} / 10</div></div>
      <div class="sr-item"><div class="sr-label">Mentor</div><div class="sr-val">${s.mentor||'–'}</div></div>
      <div class="sr-item"><div class="sr-label">Blood Group</div><div class="sr-val">${s.blood_group||'–'}</div></div>
      <div class="sr-item"><div class="sr-label">Attendance</div><div class="sr-val">${att}%</div></div>
    </div>
    <div class="att-bar-wrap">
      <div class="att-bar-lbl">Attendance</div>
      <div class="att-bar"><div class="att-fill" id="attFill" style="background:${attColor}"></div></div>
      <div class="att-pct">${att}%</div>
    </div>
  </div>`;
  setTimeout(()=>{const f=document.getElementById('attFill');if(f)f.style.width=att+'%';},80);
}

function fmtDate(d){if(!d)return'–';const dt=new Date(d);return isNaN(dt)?d:dt.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});}

/* ── API HELPERS ────────────────────────────────────────── */
async function apiFetch(path,opts={}){
  const res=await fetch(API+path,{headers:{'Content-Type':'application/json'},...opts});
  return res.json();
}
