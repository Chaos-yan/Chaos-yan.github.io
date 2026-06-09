/* ============================================================
   YS — Game Music Portfolio
   ============================================================ */
(function(){
'use strict';

let lang = 'zh';
let audioEl = null, audioCtx = null, audioSrc = null, audioAnalyzer = null;
let vizId = null, playlist = [], idx = -1, playing = false;

const $ = (s,p) => (p||document).querySelector(s);
const t = (zh,en) => lang==='zh'?zh:en;
const fmt = s => {const m=Math.floor(s/60),sec=Math.floor(s%60);return m+':'+sec.toString().padStart(2,'0')};

// ---- Data ----
function data(){return window.PORTFOLIO_DATA||null}

// ---- Language ----
$('#langBtn').onclick = function(){
    lang = lang==='zh'?'en':'zh';
    this.querySelectorAll('.opt').forEach(o=>o.classList.toggle('on',o.dataset.l===lang));
    document.querySelectorAll('[data-zh][data-en]').forEach(el=>{
        if(el.tagName==='P'&&el.querySelector('span'))return; // hero desc handled separately
        el.textContent = t(el.dataset.zh, el.dataset.en);
    });
    // Update hero desc
    const hd = $('.hero-desc');
    if(hd)hd.innerHTML = t(hd.dataset.zh, hd.dataset.en);
    render();
};

// ---- Render Works ----
function render(){
    const d = data();if(!d?.works)return;
    const container = $('#works');if(!container)return;

    const all = [
        ...(d.works.audio||[]).map(w=>({...w,type:'audio'})),
        ...(d.works.video||[]).map(w=>({...w,type:'video'}))
    ];

    container.innerHTML = all.map((w,i)=>{
        const title = t(w.title_zh,w.title);
        const cat = t(w.category_zh,w.category);
        const desc = t(w.description_zh,w.description_en);
        const tech = t(w.tech_zh,w.tech);
        const tags = tech.split('·').map(s=>s.trim()).filter(Boolean);
        return `
        <article class="work">
            <div class="work-media" data-play="${w.type}" data-idx="${i}" data-type="${w.type}">
                ${w.poster?`<img src="${w.poster}" alt="${title}" loading="${i<2?'eager':'lazy'}">`:''}
                <div class="play-btn"><span>▶</span></div>
                <span class="work-dur">${w.duration||''}</span>
            </div>
            <div class="work-body">
                <span class="work-idx">${String(i+1).padStart(2,'0')}</span>
                <span class="work-cat">${cat}</span>
                <h2 class="work-title">${title}</h2>
                <p class="work-desc">${desc}</p>
                <div class="work-tags">${tags.map(tg=>`<span class="work-tag">${tg}</span>`).join('')}</div>
            </div>
        </article>`;
    }).join('');

    // Click handlers
    container.querySelectorAll('[data-play]').forEach(el=>{
        el.onclick = ()=>{
            const i = parseInt(el.dataset.idx);
            const audios = d.works.audio||[];
            const videos = d.works.video||[];
            if(el.dataset.type==='audio'){
                const ai = all.filter((_,j)=>j<=i&&all[j].type==='audio').length-1;
                openAudio(audios,ai);
            }else{
                const vi = all.filter((_,j)=>j<=i&&all[j].type==='video').length-1;
                openVideo(videos,vi);
            }
        };
    });
}

// ---- Audio ----
function openAudio(list,i){playlist=list;idx=i;load(i);$('#audioModal').classList.add('open');document.body.style.overflow='hidden'}
function closeAudio(){stopAudio();$('#audioModal').classList.remove('open');document.body.style.overflow=''}
function load(i){
    const tr = playlist[i];if(!tr)return;
    stopAudio();
    audioEl = new Audio(tr.file);audioEl.preload='auto';
    $('#audioCat').textContent = t(tr.category_zh,tr.category);
    $('#audioTitle').textContent = t(tr.title_zh,tr.title);
    $('#audioDesc').textContent = t(tr.description_zh,tr.description_en);
    $('#audioTech').textContent = t(tr.tech_zh,tr.tech);
    setupCtx();
    audioEl.onloadedmetadata = ()=>$('#apDur').textContent=fmt(audioEl.duration);
    audioEl.ontimeupdate = ()=>{
        if(!audioEl)return;
        const p=(audioEl.currentTime/audioEl.duration)*100||0;
        $('#apFill').style.width=p+'%';$('#apCur').textContent=fmt(audioEl.currentTime);
    };
    audioEl.onplay = ()=>{playing=true;$('#apPlay').textContent='⏸';startViz()};
    audioEl.onpause = ()=>{playing=false;$('#apPlay').textContent='▶';stopViz()};
    audioEl.onended = ()=>{
        playing=false;$('#apPlay').textContent='▶';$('#apFill').style.width='0%';$('#apCur').textContent='0:00';stopViz();
        if(idx<playlist.length-1){idx++;load(idx);audioEl.play();}
    };
}
function setupCtx(){
    try{
        if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();
        if(audioSrc){audioSrc.disconnect();audioSrc=null}
        audioSrc=audioCtx.createMediaElementSource(audioEl);
        audioAnalyzer=audioCtx.createAnalyser();audioAnalyzer.fftSize=256;
        audioSrc.connect(audioAnalyzer);audioAnalyzer.connect(audioCtx.destination);
    }catch(e){audioAnalyzer=null}
}
function startViz(){
    if(!audioAnalyzer)return;
    const c=$('#audioViz');if(!c)return;
    const ctx=c.getContext('2d');
    const r=c.parentElement.getBoundingClientRect();
    c.width=r.width*2;c.height=180;c.style.width=r.width+'px';c.style.height='90px';
    ctx.setTransform(1,0,0,1,0,0);ctx.scale(2,1);
    const buf=audioAnalyzer.frequencyBinCount,d=new Uint8Array(buf);
    function draw(){
        vizId=requestAnimationFrame(draw);
        audioAnalyzer.getByteFrequencyData(d);
        const W=r.width,H=180,bw=(W/buf)*2.5;
        ctx.clearRect(0,0,W,H);
        const g=ctx.createLinearGradient(0,H,0,0);
        g.addColorStop(0,'rgba(232,144,80,.06)');g.addColorStop(.5,'rgba(232,144,80,.35)');g.addColorStop(1,'rgba(232,144,80,.5)');
        ctx.fillStyle=g;
        for(let i=0;i<buf;i++){const bh=(d[i]/255)*H*.85;ctx.fillRect(i*bw,(H-bh)/2,bw-1,bh)}
    }
    draw();
}
function stopViz(){if(vizId){cancelAnimationFrame(vizId);vizId=null};const c=$('#audioViz');if(c)c.getContext('2d').clearRect(0,0,c.width,c.height)}
function stopAudio(){stopViz();if(audioEl){audioEl.pause();audioEl.src='';audioEl=null}if(audioSrc){audioSrc.disconnect();audioSrc=null};playing=false}
function togglePlay(){if(!audioEl)return;if(playing)audioEl.pause();else audioEl.play().catch(()=>{})}
function prev(){if(idx>0){idx--;load(idx);if(playing)audioEl.play()}}
function next(){if(idx<playlist.length-1){idx++;load(idx);if(playing)audioEl.play()}}

$('#apPlay').onclick=togglePlay;
$('#apPrev').onclick=prev;
$('#apNext').onclick=next;
$('#apBar').onclick=function(e){if(!audioEl)return;const r=this.getBoundingClientRect();audioEl.currentTime=(e.clientX-r.left)/r.width*audioEl.duration};
$('#apVol').oninput=function(){if(audioEl)audioEl.volume=this.value/100};
$('#audioX').onclick=closeAudio;
$('#audioBg').onclick=closeAudio;
document.addEventListener('keydown',e=>{if(!$('#audioModal').classList.contains('open'))return;if(e.key==='Escape')closeAudio();if(e.key===' '){e.preventDefault();togglePlay()}});

// ---- Video ----
function openVideo(list,i){
    const w=list[i];if(!w)return;
    $('#videoCat').textContent=t(w.category_zh,w.category);
    $('#videoTitle').textContent=t(w.title_zh,w.title);
    $('#videoDesc').textContent=t(w.description_zh,w.description_en);
    $('#videoTech').textContent=t(w.tech_zh,w.tech);
    const v=$('#videoEl');v.innerHTML=`<source src="${w.file}" type="video/mp4">`;v.load();
    $('#videoModal').classList.add('open');document.body.style.overflow='hidden';
    v.play().catch(()=>{});
}
function closeVideo(){const v=$('#videoEl');v.pause();v.innerHTML='';$('#videoModal').classList.remove('open');document.body.style.overflow=''}
$('#videoX').onclick=closeVideo;
$('#videoBg').onclick=closeVideo;
document.addEventListener('keydown',e=>{if(!$('#videoModal').classList.contains('open'))return;if(e.key==='Escape')closeVideo()});

// ---- Init ----
render();
})();
