window.PORTFOLIO_DATA = {
  "site": {
    "title": "YS — Game Music Designer",
    "description": "Game Music Portfolio"
  },
  "works": {
    "audio": [
      {
        "id": "deep-space-pulse",
        "title": "Deep Space Pulse",
        "title_zh": "Deep Space Pulse",
        "category": "Interactive Game Music · Wwise",
        "category_zh": "游戏交互音乐设计 · Wwise",
        "file": "assets/audio/deep-space-pulse.mp3",
        "poster": "assets/images/poster-deep-space.jpg",
        "duration": "3:01",
        "description_zh": "给一个科幻游戏做的交互音乐demo。整个音乐拆成了四条轨道：一层铺底pad，一层节奏，一层旋律，还有一层强化用的装饰轨。每条轨道都挂在了Wwise的RTPC上，音量、滤波和混响发送量跟着游戏参数实时变——比如血量低了低通就收窄，战斗强度上来了强化轨就推大。BPM大概140左右，低音区用了些sub-bass的脉冲来模拟飞船引擎那种闷响，高音区加了些FM合成器的金属碎片音色。三种状态（溜达、警觉、开打）之间的切换是连续的，不会有那种硬切的段落感。算是近几年对Wwise交互框架的一个比较完整的尝试。",
        "description_en": "An interactive music demo built for a sci-fi game concept. The track is split into four stems — a pad, a rhythm layer, a melody, and an intensity ornament layer — all routed through Wwise RTPCs so volume, filter cutoff, and reverb send shift in real time based on game parameters. Player HP drops, the low-pass narrows; combat intensity rises, the intensity layer pushes forward. BPM sits around 140. The low end uses sub-bass pulses to get that spaceship-engine rumble, and the top end has some FM metallic fragments for texture. Three states — exploring, alert, combat — bleed into each other continuously, no hard cuts. It's probably my most thorough attempt at a full Wwise interactive framework so far.",
        "tech": "48kHz/24bit · Wwise RTPC · State Switching · Vertical Layering",
        "tech_zh": "48kHz/24bit · Wwise RTPC · 状态切换 · 垂直叠加"
      },
      {
        "id": "experimental-ups-downs",
        "title": "沉浮",
        "title_zh": "沉浮",
        "category": "Experimental Electronic · Sound Art",
        "category_zh": "实验电子音乐 · 声音艺术",
        "file": "assets/audio/experimental-ups-downs.mp3",
        "poster": "assets/images/poster-experimental.jpg",
        "duration": "8:12",
        "description_zh": "这首做了八分钟，算是我对长结构电子乐的一次尝试。名字叫「沉浮」，其实就是想表达那种沉下去又浮上来的感觉。低频部分用了一些持续音，大概在30到80赫兹之间慢慢晃，听起来有点闷闷的压迫感。中高频那边我把一些钢琴和弦乐的采样切成了很小的粒子，然后随机打乱顺序、调一下音高，出来的效果有点像水底往上冒的气泡。节奏上我没有用一个固定的loop从头跑到尾——差不多在131 BPM附近晃，有些段落是很规整的工业感四四拍，有些地方直接散掉了，没有拍子。动态上也拉得比较开，安静的时候很轻，密集的时候用了几层失真和压缩把响度推满。整体结构其实是变奏的思路，一个核心音高集合在不同的音色和密度下面反复出现。",
        "description_en": "This one ran eight minutes — it's my attempt at a longer-form electronic piece. The title is about sinking and surfacing, and that's basically what's happening sonically. The low end has these drones slowly drifting between 30 and 80 Hz, giving it a kind of muffled, weighty feeling. In the mid-to-high range, I took some piano and string samples and ran them through granular processing — slicing them into tiny grains, randomizing the order, shifting pitches around — so they come out sounding like bubbles rising from underwater. Rhythm-wise I didn't lock it to one loop. It hovers around 131 BPM, but some sections are straight industrial four-on-the-floor, and others just dissolve into meterless texture. Dynamics are pretty wide — the quiet parts are barely there, and the dense parts stack distortion and compression to push loudness. Structurally it's variations on a core set of pitches, reworked across different timbres and densities.",
        "tech": "48kHz/24bit · Granular Processing · Drone · Variation Form",
        "tech_zh": "48kHz/24bit · 颗粒处理 · 持续音 · 变奏曲式"
      },
      {
        "id": "electronic-beat",
        "title": "Electronic Beat",
        "title_zh": "Electronic Beat",
        "category": "Electronic Production · Synthwave / Pop",
        "category_zh": "电子音乐制作 · Synthwave 流行电子",
        "file": "assets/audio/electronic-beat.mp3",
        "poster": "assets/images/poster-electronic.jpg",
        "duration": "1:28",
        "description_zh": "一首不到一分半的电子小曲，偏流行电子方向。BPM 100，不快不慢，groove还算舒服。底鼓捏了一下瞬态，起音比较顶，拍手加了点短混响和高频提升，听起来比较脆。主旋律合成器在1k到4k这块游走，用了osc sync和filter envelope让音色随时间有变化，不会从头到尾一个味道。副歌段加了双层和声、filter慢慢打开，然后侧链压出那种一吸一放的节奏感。混音上就是常规操作，底鼓和贝斯分了低频，pad占中低，旋律和人声sample在中高，各个频段基本上都分得开。风格往Synthwave方向靠了一点，加了一些K-pop电子的处理习惯。",
        "description_en": "A short electronic track, under a minute and a half, leaning pop-electronic. BPM 100 — not too fast, not too slow, the groove sits pretty comfortably. The kick was transient-shaped for attack, the clap got some short reverb and air EQ so it's crisp without getting in the way. The lead synth hangs out in the 1-4k range, with osc sync and filter envelope modulation so the timbre shifts over time instead of staying static. The chorus adds double-layer harmonies, opens up the filter gradually, and sidechain compression gives it that rhythmic pump. Mix-wise it's pretty standard — kick and bass split the low end, pads take the low-mids, melody and vocal samples sit in the upper mids. Stylistically it's somewhere between Synthwave and the kind of processing you hear in K-pop electronic production.",
        "tech": "48kHz/24bit · Serum 2 · Omnisphere 2 · Sidechain · Transient Shaping",
        "tech_zh": "48kHz/24bit · Serum 2 · Omnisphere 2 · 侧链压缩 · 瞬态塑形"
      }
    ],
    "video": [
      {
        "id": "stranded",
        "title": "Stranded",
        "title_zh": "Stranded",
        "category": "Orchestral Composition · Cinematic Narrative",
        "category_zh": "传统管弦乐作品 · 电影化叙事",
        "file": "assets/video/stranded.mp4",
        "poster": "assets/images/poster-stranded.jpg",
        "duration": "6:15",
        "description_zh": "一首六分钟的管弦乐，大概讲的是一个搁浅、挣扎、最后获救的故事。开篇用低音弦乐堆了一些音簇，铜管加了些减七和弦和半音化的线条把不安感拉起来，木管在上面偶尔点几个不协和小动机。中间段圆号带出一个五音的上行主题，然后交给弦乐声部来回传递发展，和声也从一开始那种不太明确调性的状态慢慢往D大调靠。最后一段是全乐队齐奏的主题再现，弦乐和铜管走对位线条，力度推到ff，最后落在D大调主和弦上收住。这首比较体现我管弦乐写作的基本功，和声对位这些东西在学院里打下的底子。",
        "description_en": "A six-minute orchestral piece, roughly telling a story of being stranded, struggling, and eventually being rescued. The opening stacks low string clusters with brass diminished sevenths and chromatic lines to build tension, while woodwinds sprinkle short dissonant motifs above. The middle section brings in a five-note ascending theme on horn, which then gets passed around and developed through the strings — the harmony gradually clarifies from tonal ambiguity toward D major. The final section is a full-orchestra restatement of the theme, strings and brass in counterpoint, ff dynamics, resolving on a D major tonic. This piece is a decent showcase of my orchestral writing chops — the harmony and counterpoint foundations I built during conservatory training.",
        "tech": "4K · Symphonic Orchestra · Theme Development · Counterpoint",
        "tech_zh": "4K · 交响乐团编制 · 主题发展 · 对位技法"
      },
      {
        "id": "racheltjie",
        "title": "Racheltjie De Beer",
        "title_zh": "Racheltjie De Beer",
        "category": "Film Scoring · Audio-Visual Synchronization",
        "category_zh": "影视配乐 · 音画同步",
        "file": "assets/video/racheltjie.mp4",
        "poster": "assets/images/poster-racheltjie.jpg",
        "duration": "1:42",
        "description_zh": "给一个南非历史题材的短片片段做的配乐，一分多钟。配乐的主心骨是一个钢琴的四音下行动机，从头到尾都在，像一条线把整段串起来。弦乐四重奏用了分部写法和声铺底，和声一直在关系大小调之间晃——画面情绪往内收的时候用小调，角色之间产生情感连接的时候切到大调。打击乐只用在几个关键剪辑点上，定音鼓敲一下、镲滚一下，给人声和画面转场加点分量。整体配乐思路偏情感对位，就是音乐不完全跟着画面的动作走，而是在画面上面叠一层独立的情绪线，有时候和画面一致，有时候对着来。hit point对齐只做了几个关键位置，没有满屏卡点。",
        "description_en": "A score I wrote for a short South African historical film sequence, about a minute forty. The backbone is a four-note descending piano motif that runs through the whole thing like a thread. The string quartet provides harmonic support with divisi writing, and the harmony keeps shifting between relative major and minor — minor when the emotion turns inward, major when characters connect. Percussion only comes in at a few key cut points — a timpani hit here, a cymbal roll there — just to add weight to the transitions. The overall approach leans toward emotional counterpoint rather than strict Mickey-Mousing: the music doesn't chase every on-screen action but instead runs an independent emotional line parallel to the picture, sometimes agreeing with it, sometimes pushing against it. Hit points are aligned only at a handful of critical moments, not wall-to-wall.",
        "tech": "4K · Film Scoring · Emotional Counterpoint · String Quartet",
        "tech_zh": "4K · 影视配乐 · 情感对位 · 弦乐四重奏"
      },
      {
        "id": "guimi-pv",
        "title": "诡秘之主 PV",
        "title_zh": "诡秘之主 PV",
        "category": "Game Music PV · Atmospheric Sound Design",
        "category_zh": "游戏音乐 PV · 氛围声音设计",
        "file": "assets/video/guimi-pv.mp4",
        "poster": "assets/images/poster-guimi.mp4.jpg",
        "duration": "0:43",
        "description_zh": "给《诡秘之主》做的一个43秒音乐PV。这么短的时间做不了太多铺垫，所以就搞了一个很简单的弧线：开头氛围铺一铺，中间紧张感往上推，最后一下释放。声音素材上，低频用减法合成器搓了一个sub-bass的drone，提供那种不太舒服的身体震动感；中频把钢琴采样倒放然后做了频谱拉伸，原来的音头完全没了，变成一个有点像弦乐但又不太像的陌生化音色；高频上散了一些不规则的金属敲击声和颗粒合成的小点，制造那种不确定的威胁信号。画面和音乐的对位是精确到帧的，低频突然抽掉、高频瞬态砸进来，都是卡着画面剪辑点来的。短视频嘛，就追求一个快进快出、氛围到位。",
        "description_en": "A 43-second music PV I did for 'Lord of the Mysteries'. Can't do much setup in that amount of time, so I went with a simple arc: establish atmosphere at the start, push tension through the middle, release at the end. Sound materials: low end uses a subtractive-synth sub-bass drone for that uncomfortable physical rumble; midrange takes reversed piano samples with spectral stretching so the transients are gone and it becomes this defamiliarized, almost-string-like texture; high end scatters irregular metallic hits and granular dots to carry uncertain threat signals. Picture sync is frame-precise — low-end spectral drops and high-end transient slams all land on the cut points. Short-form stuff, the goal is just in and out fast with the vibe in place.",
        "tech": "1080p · Frame-precise Sync · Spectral Processing · Short-form Arc",
        "tech_zh": "1080p · 帧级同步 · 频谱处理 · 短视频叙事"
      },
      {
        "id": "pinocchio-wwise",
        "title": "Lies of P — Wwise Interactive Design",
        "title_zh": "匹诺曹的谎言 — Wwise 交互设计",
        "category": "Game Audio Middleware · Interactive Music System",
        "category_zh": "游戏音频中间件 · 交互音乐系统",
        "file": "assets/video/pinocchio-wwise.mp4",
        "poster": "assets/images/poster-pinocchio.jpg",
        "duration": "5:17",
        "description_zh": "用《匹诺曹的谎言》当例子做的一个Wwise交互音乐demo，从头到尾走了一遍流程。视频里能看到我先把DAW里的音乐资源按轨导出，然后在Wwise里搭事件和状态组，再把血量啊、距离啊、战斗强度这些游戏参数映射到RTPC上，最后扔进Unity里跑实际效果。重点在垂直叠加那个部分——音乐拆了四条轨：环境层、节奏层、旋律层、强化层，每条轨的音量、低通截止频率和混响发送量都单独受RTPC控制。比如说玩家血越低低通收得越窄、离敌人越近节奏层越往前顶、进了Boss战强化层直接推满。这样探索到战斗的过渡是连续的，你不会听到一个明显的切换点。视频里还演示了Switch容器里面的随机播放和Transition片段时间的微调。",
        "description_en": "A Wwise interactive music walkthrough using Lies of P as the example, showing the full process end to end. The video covers exporting layered stems from the DAW, setting up events and state groups in Wwise, mapping game parameters like HP, distance, and combat intensity to RTPCs, then dropping it into Unity to see it run for real. The main focus is the vertical layering — the music is split into four stems (ambient, rhythm, melody, intensity), and each stem's volume, low-pass cutoff, and reverb send get independent RTPC control. So when the player's HP drops, the low-pass narrows; when they get closer to an enemy, the rhythm layer pushes forward; when the boss fight kicks in, the intensity layer goes all the way up. The transition from exploring to fighting is continuous — you don't hear an obvious switch point. The video also shows randomized playback inside Switch Containers and fine-tuning Transition segment timing.",
        "tech": "Wwise · Vertical Layering · RTPC · State Groups · Switch Containers · Unity",
        "tech_zh": "Wwise · 垂直叠加 · RTPC · 状态组 · Switch 容器 · Unity"
      }
    ]
  },
  "contact": {
    "email": "15706778301@163.com",
    "phone": "15706778301",
    "location": "Shenzhen / Global Remote",
    "location_zh": "深圳 / 全球远程"
  }
};