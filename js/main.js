/* ============================================================
   YS — Game Music Portfolio
   Sonic Interface
   ============================================================ */
(function(){
'use strict';

// ========== STATE ==========
let lang = 'zh';
let audioEl = null;
let audioCtx = null;
let audioAnalyser = null;
let audioSource = null;
let vizAnimId = null;
let currentPlaylist = [];
let currentIdx = -1;
let isPlaying = false;

// ========== HELPERS ==========
const $ = (s, p) => (p||document).querySelector(s);
const $$ = (s, p) => [...(p||document).querySelectorAll(s)];
const t = (zh, en) => lang==='zh'?zh:en;
const fmt = s => {const m=Math.floor(s/60),sec=Math.floor(s%60);return `${m}:${sec.toString().padStart(2,'0')}`};

// ========== DATA ==========
function getData(){return window.PORTFOLIO_DATA||null}

// ========== LANGUAGE ==========
function setupLang(){
    const btn = $('#langSwitch');
    if(!btn)return;
    btn.onclick = () => {
        lang = lang==='zh'?'en':'zh';
        btn.querySelectorAll('.lang-opt').forEach(o=>o.classList.toggle('active',o.dataset.l===lang));
        updateTexts();
        renderAll();
    };
}
function updateTexts(){
    $$('[data-zh][data-en]').forEach(el=>{el.textContent=t(el.dataset.zh,el.dataset.en)});
}

// ========== BACKGROUND GRID ==========
function setupBgGrid(){
    const c = $('#bgGrid');if(!c)return;
    const ctx = c.getContext('2d');
    function resize(){
        const dpr = Math.min(window.devicePixelRatio||1,2);
        c.width = window.innerWidth*dpr;c.height = window.innerHeight*dpr;
        c.style.width = window.innerWidth+'px';c.style.height = window.innerHeight+'px';
        ctx.setTransform(1,0,0,1,0,0);ctx.scale(dpr,dpr);
    }
    resize();window.addEventListener('resize',resize);

    function draw(){
        const W=window.innerWidth,H=window.innerHeight,step=50;
        ctx.clearRect(0,0,W,H);
        // Dots
        for(let x=step;x<W;x+=step){
            for(let y=step;y<H;y+=step){
                const dx=x-W/2,dy=y-H/2,dist=Math.sqrt(dx*dx+dy*dy);
                const alpha=Math.max(0,.15-dist/(Math.max(W,H)*.8));
                ctx.fillStyle=`rgba(0,229,255,${alpha.toFixed(3)})`;
                ctx.beginPath();ctx.arc(x,y,.6,0,Math.PI*2);ctx.fill();
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
}

// ========== HERO VISUALIZATION ==========
function setupHeroViz(){
    const c = $('#heroViz');if(!c)return;
    const ctx = c.getContext('2d');
    let bars=[],time=0;

    function resize(){
        const dpr = Math.min(window.devicePixelRatio||1,2);
        c.width = window.innerWidth*dpr;c.height = window.innerHeight*dpr;
        c.style.width = window.innerWidth+'px';c.style.height = window.innerHeight+'px';
        ctx.setTransform(1,0,0,1,0,0);ctx.scale(dpr,dpr);
        const W=window.innerWidth,H=window.innerHeight,count=Math.floor(W/12);
        bars=Array.from({length:count},(_,i)=>({
            h:20+Math.random()*H*.5,
            phase:Math.random()*Math.PI*2,
            speed:.008+Math.random()*.02,
            hue:.5+Math.random()*.1
        }));
    }
    resize();window.addEventListener('resize',resize);

    function draw(){
        const W=window.innerWidth,H=window.innerHeight;
        ctx.clearRect(0,0,W,H);time+=.016;

        bars.forEach((b,i)=>{
            const x=(i/bars.length)*W;
            const h=b.h+Math.sin(time*b.speed+b.phase)*b.h*.3;
            const y=H/2-h/2;
            const alpha=.08+Math.abs(Math.sin(time*b.speed+b.phase))*.08;

            // Glow
            const grad=ctx.createLinearGradient(x,0,x,W);
            grad.addColorStop(0,`rgba(0,229,255,0)`);
            grad.addColorStop(.45,`rgba(0,229,255,${alpha})`);
            grad.addColorStop(.5,`rgba(124,77,255,${alpha*1.3})`);
            grad.addColorStop(.55,`rgba(0,229,255,${alpha})`);
            grad.addColorStop(1,`rgba(0,229,255,0)`);
            ctx.fillStyle=grad;
            ctx.fillRect(x-1.5,y,3,h);

            // Center line
            ctx.strokeStyle=`rgba(0,229,255,${alpha*.3})`;
            ctx.lineWidth=.5;
            ctx.beginPath();
            ctx.moveTo(x-2,H/2);ctx.lineTo(x+2,H/2);
            ctx.stroke();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

// ========== RENDER WORKS ==========
function renderAll(){
    const data=getData();if(!data?.works)return;
    const container=$('#worksContainer');if(!container)return;

    let idx=0;
    const audioWorks=data.works.audio||[];
    const videoWorks=data.works.video||[];
    const all=[...audioWorks.map(w=>({...w,type:'audio'})),...videoWorks.map(w=>({...w,type:'video'}))];

    container.innerHTML=all.map((w,i)=>{
        const isAudio=w.type==='audio';
        const desc=t(w.description_zh||'',w.description_en||'');
        const cat=t(w.category_zh||'',w.category||'');
        const tech=t(w.tech_zh||'',w.tech||'');
        const title=t(w.title_zh||'',w.title||'');
        const tags=tech.split('·').map(s=>s.trim()).filter(Boolean);

        return `
        <section class="work-section" data-idx="${i}" data-type="${w.type}" data-id="${w.id}">
            <div class="work-visual" data-action="play" data-idx="${i}" data-type="${w.type}">
                ${w.poster?`<img src="${w.poster}" alt="${title}" loading="${i<2?'eager':'lazy'}">`:''}
                <div class="play-ring"><div class="play-ring-inner">▶</div></div>
                <span class="work-duration-tag">${w.duration||''}</span>
            </div>
            <div class="work-info">
                <span class="work-idx">${String(i+1).padStart(2,'0')}</span>
                <span class="work-cat">${cat}</span>
                <h2 class="work-title">${title}</h2>
                <p class="work-desc">${desc}</p>
                <div class="work-tech-tags">${tags.map(tg=>`<span class="work-tech-tag">${tg}</span>`).join('')}</div>
            </div>
        </section>`;
    }).join('');

    // Click handlers for play buttons
    container.querySelectorAll('[data-action="play"]').forEach(el=>{
        el.addEventListener('click',()=>{
            const idx=parseInt(el.dataset.idx);
            const type=el.dataset.type;
            if(type==='audio'){
                const audioWorks=data.works.audio;
                const audioIdx=all.filter((_,i)=>i<=idx&&all[i].type==='audio').length-1;
                openAudio(audioWorks,audioIdx);
            }else{
                const videoWorks=data.works.video;
                const videoIdx=all.filter((_,i)=>i<=idx&&all[i].type==='video').length-1;
                openVideo(videoWorks,videoIdx);
            }
        });
    });
}

// ========== AUDIO PLAYER ==========
function openAudio(playlist,idx){
    currentPlaylist=playlist;currentIdx=idx;loadTrack(idx);
    $('#audioModal').classList.add('open');document.body.style.overflow='hidden';
}
function closeAudio(){
    stopAudio();$('#audioModal').classList.remove('open');document.body.style.overflow='';
}
function loadTrack(idx){
    const track=currentPlaylist[idx];if(!track)return;
    stopAudio();
    audioEl=new Audio(track.file);audioEl.preload='auto';

    // UI
    $('#audioCat').textContent=t(track.category_zh,track.category);
    $('#audioTitle').textContent=t(track.title_zh,track.title);
    $('#audioDesc').textContent=t(track.description_zh,track.description_en);
    $('#audioTech').textContent=t(track.tech_zh,track.tech);

    setupAudioCtx();

    audioEl.addEventListener('loadedmetadata',()=>{$('#apDur').textContent=fmt(audioEl.duration)});
    audioEl.addEventListener('timeupdate',()=>{
        if(!audioEl)return;
        const pct=(audioEl.currentTime/audioEl.duration)*100||0;
        $('#apFill').style.width=pct+'%';$('#apCur').textContent=fmt(audioEl.currentTime);
    });
    audioEl.addEventListener('play',()=>{isPlaying=true;$('#apPlay').textContent='⏸';startViz()});
    audioEl.addEventListener('pause',()=>{isPlaying=false;$('#apPlay').textContent='▶';stopViz()});
    audioEl.addEventListener('ended',()=>{
        isPlaying=false;$('#apPlay').textContent='▶';$('#apFill').style.width='0%';$('#apCur').textContent='0:00';
        stopViz();
        if(currentIdx<currentPlaylist.length-1){currentIdx++;loadTrack(currentIdx);audioEl.play();}
    });
}

function setupAudioCtx(){
    try{
        if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();
        if(audioSource){audioSource.disconnect();audioSource=null;}
        audioSource=audioCtx.createMediaElementSource(audioEl);
        audioAnalyser=audioCtx.createAnalyser();audioAnalyser.fftSize=256;
        audioSource.connect(audioAnalyser);audioAnalyser.connect(audioCtx.destination);
    }catch(e){audioAnalyser=null}
}

function startViz(){
    if(!audioAnalyser)return;
    const c=$('#audioVizCanvas');if(!c)return;
    const ctx=c.getContext('2d');
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const rect=c.parentElement.getBoundingClientRect();
    c.width=rect.width*dpr;c.height=200;
    c.style.width=rect.width+'px';c.style.height='100px';
    ctx.setTransform(1,0,0,1,0,0);ctx.scale(dpr,1);

    const bufLen=audioAnalyser.frequencyBinCount;
    const data=new Uint8Array(bufLen);

    function draw(){
        vizAnimId=requestAnimationFrame(draw);
        audioAnalyser.getByteFrequencyData(data);
        const W=c.width/dpr,H=200,barW=(W/bufLen)*2.5;

        ctx.clearRect(0,0,W,H);

        // Glow gradient
        const g=ctx.createLinearGradient(0,H,0,0);
        g.addColorStop(0,'rgba(0,229,255,.08)');
        g.addColorStop(.5,'rgba(0,229,255,.4)');
        g.addColorStop(1,'rgba(124,77,255,.5)');
        ctx.fillStyle=g;

        for(let i=0;i<bufLen;i++){
            const bh=(data[i]/255)*H*.85;
            ctx.fillRect(i*barW,(H-bh)/2,barW-1,bh);
        }
    }
    draw();
}
function stopViz(){
    if(vizAnimId){cancelAnimationFrame(vizAnimId);vizAnimId=null}
    const c=$('#audioVizCanvas');if(c){const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height)}
}
function stopAudio(){
    stopViz();
    if(audioEl){audioEl.pause();audioEl.src='';audioEl=null}
    if(audioSource){audioSource.disconnect();audioSource=null}
    isPlaying=false;
}
function playPause(){
    if(!audioEl)return;
    if(isPlaying)audioEl.pause();else audioEl.play().catch(()=>{});
}
function prevTrack(){
    if(currentIdx>0){currentIdx--;loadTrack(currentIdx);if(isPlaying)audioEl.play();}
}
function nextTrack(){
    if(currentIdx<currentPlaylist.length-1){currentIdx++;loadTrack(currentIdx);if(isPlaying)audioEl.play();}
}

function setupAudioUI(){
    $('#apPlay')?.addEventListener('click',playPause);
    $('#apPrev')?.addEventListener('click',prevTrack);
    $('#apNext')?.addEventListener('click',nextTrack);
    $('#apBar')?.addEventListener('click',e=>{
        if(!audioEl)return;const r=e.target.getBoundingClientRect();
        audioEl.currentTime=(e.clientX-r.left)/r.width*audioEl.duration;
    });
    $('#apVol')?.addEventListener('input',e=>{if(audioEl)audioEl.volume=e.target.value/100});
    $('#audioClose')?.addEventListener('click',closeAudio);
    $('#audioBackdrop')?.addEventListener('click',closeAudio);
    document.addEventListener('keydown',e=>{
        if(!$('#audioModal').classList.contains('open'))return;
        if(e.key==='Escape')closeAudio();
        if(e.key===' '){e.preventDefault();playPause();}
    });
}

// ========== VIDEO PLAYER ==========
function openVideo(playlist,idx){
    const w=playlist[idx];if(!w)return;
    $('#videoCat').textContent=t(w.category_zh,w.category);
    $('#videoTitle').textContent=t(w.title_zh,w.title);
    $('#videoDesc').textContent=t(w.description_zh,w.description_en);
    $('#videoTech').textContent=t(w.tech_zh,w.tech);
    const v=$('#videoEl');v.innerHTML=`<source src="${w.file}" type="video/mp4">`;
    v.load();
    $('#videoModal').classList.add('open');document.body.style.overflow='hidden';
    v.play().catch(()=>{});
}
function closeVideo(){
    const v=$('#videoEl');v.pause();v.innerHTML='';
    $('#videoModal').classList.remove('open');document.body.style.overflow='';
}
function setupVideoUI(){
    $('#videoClose')?.addEventListener('click',closeVideo);
    $('#videoBackdrop')?.addEventListener('click',closeVideo);
    document.addEventListener('keydown',e=>{
        if(!$('#videoModal').classList.contains('open'))return;
        if(e.key==='Escape')closeVideo();
    });
}

// ========== INIT ==========
function init(){
    setupBgGrid();
    setupHeroViz();
    setupLang();
    setupAudioUI();
    setupVideoUI();
    renderAll();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
