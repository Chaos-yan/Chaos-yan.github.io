/* ============================================================
   PORTFOLIO SITE — Main JavaScript
   颜孙恒 Yan Sunheng | Game Music Designer & Composer
   ============================================================ */

(function() {
    'use strict';

    // ==========================================
    // STATE
    // ==========================================
    let currentLang = 'zh';
    let audioPlayer = null;
    let audioContext = null;
    let audioAnalyser = null;
    let audioSource = null;
    let visualizerAnimationId = null;
    let currentPlaylist = [];
    let currentTrackIndex = -1;
    let isPlaying = false;
    let videoPlayer = null;

    // ==========================================
    // CONTENT LOADING
    // ==========================================
    async function loadContent() {
        // Use embedded data first (works on both local and server)
        if (window.PORTFOLIO_DATA) {
            return window.PORTFOLIO_DATA;
        }
        // Fallback: try fetch (works on server)
        try {
            const resp = await fetch('data/content.json');
            const data = await resp.json();
            return data;
        } catch (e) {
            console.warn('Failed to load content data');
            return null;
        }
    }

    // ==========================================
    // LANGUAGE SWITCHING
    // ==========================================
    function isZh() { return currentLang === 'zh'; }

    function t(zhText, enText) {
        return isZh() ? zhText : enText;
    }

    function setupLanguageToggle(content) {
        const toggle = document.getElementById('langToggle');
        const zhOpt = toggle?.querySelector('[data-lang="zh"]');
        const enOpt = toggle?.querySelector('[data-lang="en"]');
        const mobileBtns = document.querySelectorAll('.lang-switch-mobile');

        function switchLang(lang) {
            currentLang = lang;
            // Desktop toggle
            if (zhOpt && enOpt) {
                zhOpt.classList.toggle('active', lang === 'zh');
                enOpt.classList.toggle('active', lang === 'en');
            }
            // Mobile toggle
            mobileBtns.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
            // Update all data-zh/data-en elements
            updateAllTexts();
            // Re-render dynamic content
            renderAll(content);
            // Update audio player info if open
            updateAudioPlayerInfo();
            // Update video player info if open
            updateVideoPlayerInfo();
        }

        toggle?.addEventListener('click', () => {
            switchLang(currentLang === 'zh' ? 'en' : 'zh');
        });

        mobileBtns.forEach(btn => {
            btn.addEventListener('click', () => switchLang(btn.dataset.lang));
        });
    }

    function updateAllTexts() {
        document.querySelectorAll('[data-zh][data-en]').forEach(el => {
            const zh = el.dataset.zh;
            const en = el.dataset.en;
            el.textContent = isZh() ? zh : en;
        });
    }

    // ==========================================
    // RENDER WORKS
    // ==========================================
    function renderWorks(content) {
        if (!content?.works) return;

        // Audio works
        const audioGrid = document.getElementById('audioWorks');
        if (audioGrid && content.works.audio) {
            audioGrid.innerHTML = content.works.audio.map(work => `
                <article class="work-card" data-work-id="${work.id}" data-work-type="audio" data-work-index="${content.works.audio.indexOf(work)}" role="button" tabindex="0" aria-label="${t(work.title_zh, work.title)}">
                    <div class="work-card-media">
                        ${work.poster
                            ? `<img src="${work.poster}" alt="${t(work.title_zh, work.title)}" loading="lazy">`
                            : `<div class="work-card-placeholder">
                                <div class="audio-wave-icon" aria-hidden="true">
                                    <span></span><span></span><span></span><span></span><span></span>
                                </div>
                               </div>`
                        }
                        <div class="play-overlay" aria-hidden="true">
                            <div class="play-icon">▶</div>
                        </div>
                        <span class="work-card-duration">${work.duration}</span>
                    </div>
                    <div class="work-card-body">
                        <div class="work-card-category">${t(work.category_zh, work.category)}</div>
                        <h3 class="work-card-title">${t(work.title_zh, work.title)}</h3>
                        <p class="work-card-desc">${t(work.description_zh, work.description_en)}</p>
                        <div class="work-card-tech">${t(work.tech_notes_zh, work.tech_notes)}</div>
                    </div>
                </article>
            `).join('');

            // Click handlers
            audioGrid.querySelectorAll('.work-card').forEach(card => {
                card.addEventListener('click', () => {
                    const index = parseInt(card.dataset.workIndex);
                    const works = content.works.audio;
                    openAudioPlayer(works, index);
                });
            });
        }

        // Video works
        const videoGrid = document.getElementById('videoWorks');
        if (videoGrid && content.works.video) {
            videoGrid.innerHTML = content.works.video.map(work => `
                <article class="work-card" data-work-id="${work.id}" data-work-type="video" data-work-index="${content.works.video.indexOf(work)}" role="button" tabindex="0" aria-label="${t(work.title_zh, work.title)}">
                    <div class="work-card-media">
                        <img src="${work.poster}" alt="${t(work.title_zh, work.title)}" loading="lazy">
                        <div class="play-overlay" aria-hidden="true">
                            <div class="play-icon">▶</div>
                        </div>
                        <span class="work-card-duration">${work.duration}</span>
                    </div>
                    <div class="work-card-body">
                        <div class="work-card-category">${t(work.category_zh, work.category)}</div>
                        <h3 class="work-card-title">${t(work.title_zh, work.title)}</h3>
                        <p class="work-card-desc">${t(work.description_zh, work.description_en)}</p>
                        <div class="work-card-tech">${t(work.tech_notes_zh, work.tech_notes)}</div>
                    </div>
                </article>
            `).join('');

            videoGrid.querySelectorAll('.work-card').forEach(card => {
                card.addEventListener('click', () => {
                    const index = parseInt(card.dataset.workIndex);
                    const works = content.works.video;
                    openVideoPlayer(works, index);
                });
            });
        }
    }

    // ==========================================
    // AUDIO PLAYER
    // ==========================================
    function openAudioPlayer(playlist, index) {
        currentPlaylist = playlist;
        currentTrackIndex = index;
        loadTrack(index);
        document.getElementById('audioModal').classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeAudioPlayer() {
        stopAudio();
        document.getElementById('audioModal').classList.remove('open');
        document.body.style.overflow = '';
    }

    function loadTrack(index) {
        const track = currentPlaylist[index];
        if (!track) return;

        // Update UI
        document.getElementById('audioModalTitle').textContent = t(track.title_zh, track.title);
        document.getElementById('audioModalCategory').textContent = t(track.category_zh, track.category);
        document.getElementById('audioModalDesc').textContent = t(track.description_zh, track.description_en);

        // Load audio
        if (audioPlayer) {
            stopAudio();
        }
        audioPlayer = new Audio(track.file);
        audioPlayer.preload = 'auto';

        // Setup audio context for visualization
        setupAudioContext();

        // Update duration display when loaded
        audioPlayer.addEventListener('loadedmetadata', () => {
            document.getElementById('apDuration').textContent = formatTime(audioPlayer.duration);
        });

        // Update progress
        audioPlayer.addEventListener('timeupdate', () => {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            document.getElementById('apProgressFill').style.width = progress + '%';
            document.getElementById('apCurrentTime').textContent = formatTime(audioPlayer.currentTime);
        });

        // Play/pause toggle
        audioPlayer.addEventListener('play', () => {
            isPlaying = true;
            const playBtn = document.getElementById('apPlay');
            playBtn.textContent = '⏸';
            playBtn.classList.add('playing');
            startVisualizer();
        });

        audioPlayer.addEventListener('pause', () => {
            isPlaying = false;
            const playBtn = document.getElementById('apPlay');
            playBtn.textContent = '▶';
            playBtn.classList.remove('playing');
            stopVisualizer();
        });

        audioPlayer.addEventListener('ended', () => {
            isPlaying = false;
            document.getElementById('apPlay').textContent = '▶';
            document.getElementById('apPlay').classList.remove('playing');
            document.getElementById('apProgressFill').style.width = '0%';
            document.getElementById('apCurrentTime').textContent = '0:00';
            stopVisualizer();
            // Auto-advance
            if (currentTrackIndex < currentPlaylist.length - 1) {
                currentTrackIndex++;
                loadTrack(currentTrackIndex);
                audioPlayer.play();
            }
        });

        audioPlayer.addEventListener('error', () => {
            console.error('Failed to load audio:', track.file);
        });
    }

    function playAudio() {
        if (!audioPlayer) return;
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play().catch(e => console.warn('Playback failed:', e));
        }
    }

    function prevTrack() {
        if (currentTrackIndex > 0) {
            currentTrackIndex--;
            loadTrack(currentTrackIndex);
            if (isPlaying) audioPlayer.play();
        }
    }

    function nextTrack() {
        if (currentTrackIndex < currentPlaylist.length - 1) {
            currentTrackIndex++;
            loadTrack(currentTrackIndex);
            if (isPlaying) audioPlayer.play();
        }
    }

    function stopAudio() {
        stopVisualizer();
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.src = '';
            audioPlayer = null;
        }
        if (audioSource) {
            audioSource.disconnect();
            audioSource = null;
        }
        isPlaying = false;
    }

    function updateAudioPlayerInfo() {
        if (!audioPlayer || currentTrackIndex < 0 || !currentPlaylist[currentTrackIndex]) return;
        const track = currentPlaylist[currentTrackIndex];
        document.getElementById('audioModalTitle').textContent = t(track.title_zh, track.title);
        document.getElementById('audioModalCategory').textContent = t(track.category_zh, track.category);
        document.getElementById('audioModalDesc').textContent = t(track.description_zh, track.description_en);
    }

    function setupAudioContext() {
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioSource) {
                audioSource.disconnect();
            }
            audioSource = audioContext.createMediaElementSource(audioPlayer);
            audioAnalyser = audioContext.createAnalyser();
            audioAnalyser.fftSize = 256;
            audioSource.connect(audioAnalyser);
            audioAnalyser.connect(audioContext.destination);
        } catch (e) {
            // If already connected or CORS issues, skip
            audioAnalyser = null;
        }
    }

    function startVisualizer() {
        if (!audioAnalyser) return;
        const canvas = document.getElementById('visualizerCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const bufferLength = audioAnalyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function draw() {
            visualizerAnimationId = requestAnimationFrame(draw);
            audioAnalyser.getByteFrequencyData(dataArray);

            const W = canvas.width;
            const H = canvas.height;
            ctx.clearRect(0, 0, W, H);

            // Draw waveform-like bars
            const barWidth = (W / bufferLength) * 2.5;
            let x = 0;

            // Gradient
            const gradient = ctx.createLinearGradient(0, H, 0, 0);
            gradient.addColorStop(0, 'rgba(201, 168, 76, 0.15)');
            gradient.addColorStop(0.5, 'rgba(201, 168, 76, 0.5)');
            gradient.addColorStop(1, 'rgba(224, 200, 120, 0.7)');

            ctx.fillStyle = gradient;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * H * 0.9;
                const y = (H - barHeight) / 2;
                ctx.fillRect(x, y, barWidth - 1, barHeight);
                x += barWidth;
            }

            // Mirror for symmetry
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = gradient;
            x = 0;
            for (let i = bufferLength - 1; i >= 0; i--) {
                const barHeight = (dataArray[i] / 255) * H * 0.9;
                const y = (H - barHeight) / 2;
                ctx.fillRect(W - x - barWidth, y, barWidth - 1, barHeight);
                x += barWidth;
            }
            ctx.globalAlpha = 1;
        }

        draw();
    }

    function stopVisualizer() {
        if (visualizerAnimationId) {
            cancelAnimationFrame(visualizerAnimationId);
            visualizerAnimationId = null;
        }
        const canvas = document.getElementById('visualizerCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    function setupAudioControls() {
        // Play/Pause
        document.getElementById('apPlay')?.addEventListener('click', playAudio);
        document.getElementById('apPrev')?.addEventListener('click', prevTrack);
        document.getElementById('apNext')?.addEventListener('click', nextTrack);

        // Progress bar click
        document.getElementById('apProgress')?.addEventListener('click', (e) => {
            if (!audioPlayer) return;
            const rect = e.target.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            audioPlayer.currentTime = ratio * audioPlayer.duration;
        });

        // Volume
        const volumeSlider = document.getElementById('apVolume');
        volumeSlider?.addEventListener('input', () => {
            if (audioPlayer) {
                audioPlayer.volume = volumeSlider.value / 100;
            }
        });

        // Close
        document.getElementById('audioModalClose')?.addEventListener('click', closeAudioPlayer);
        document.getElementById('audioModalBackdrop')?.addEventListener('click', closeAudioPlayer);

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (!document.getElementById('audioModal').classList.contains('open')) return;
            if (e.key === 'Escape') closeAudioPlayer();
            if (e.key === ' ') { e.preventDefault(); playAudio(); }
            if (e.key === 'ArrowLeft') prevTrack();
            if (e.key === 'ArrowRight') nextTrack();
        });

        // Create visualizer canvas
        const vizContainer = document.getElementById('audioVisualizer');
        if (vizContainer) {
            const canvas = document.createElement('canvas');
            canvas.id = 'visualizerCanvas';
            canvas.width = vizContainer.clientWidth * 2 || 960;
            canvas.height = 240;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            vizContainer.appendChild(canvas);
        }
    }

    // ==========================================
    // VIDEO PLAYER
    // ==========================================
    function openVideoPlayer(playlist, index) {
        const work = playlist[index];
        if (!work) return;

        videoPlayer = document.getElementById('videoPlayer');
        document.getElementById('videoModalTitle').textContent = t(work.title_zh, work.title);
        document.getElementById('videoModalCategory').textContent = t(work.category_zh, work.category);
        document.getElementById('videoModalDesc').textContent = t(work.description_zh, work.description_en);

        videoPlayer.innerHTML = '';
        const source = document.createElement('source');
        source.src = work.file;
        source.type = 'video/mp4';
        videoPlayer.appendChild(source);
        videoPlayer.load();

        document.getElementById('videoModal').classList.add('open');
        document.body.style.overflow = 'hidden';
        videoPlayer.play().catch(() => {});
    }

    function closeVideoPlayer() {
        const videoPlayer = document.getElementById('videoPlayer');
        if (videoPlayer) {
            videoPlayer.pause();
            videoPlayer.innerHTML = '';
        }
        document.getElementById('videoModal').classList.remove('open');
        document.body.style.overflow = '';
    }

    function updateVideoPlayerInfo() {
        const videoModal = document.getElementById('videoModal');
        if (!videoModal?.classList.contains('open')) return;
        // Info updated via current video source
    }

    function setupVideoControls() {
        document.getElementById('videoModalClose')?.addEventListener('click', closeVideoPlayer);
        document.getElementById('videoModalBackdrop')?.addEventListener('click', closeVideoPlayer);

        document.addEventListener('keydown', (e) => {
            if (!document.getElementById('videoModal').classList.contains('open')) return;
            if (e.key === 'Escape') closeVideoPlayer();
        });
    }

    // ==========================================
    // RENDER ABOUT
    // ==========================================
    function renderAbout(content) {
        if (!content?.about?.highlights) return;
        const container = document.getElementById('aboutHighlights');
        if (!container) return;

        container.innerHTML = content.about.highlights.map(h => `
            <div class="about-highlight-item">
                <span class="dot" aria-hidden="true"></span>
                <span>${t(h.label, h.label_en)}</span>
            </div>
        `).join('');
    }

    // ==========================================
    // RENDER SKILLS
    // ==========================================
    function renderSkills(content) {
        if (!content?.skills) return;
        const grid = document.getElementById('skillsGrid');
        if (!grid) return;

        const categories = [
            { key: 'daws', title: 'DAW / 宿主软件', title_en: 'DAWs', emoji: '🎛️' },
            { key: 'audio_middleware', title: '音频中间件 / 引擎', title_en: 'Audio Middleware & Engines', emoji: '🔊' },
            { key: 'plugins_synths', title: '插件 / 合成器', title_en: 'Plugins & Synthesizers', emoji: '⚡' },
            { key: 'ai_tools', title: 'AI 音频工具', title_en: 'AI Audio Tools', emoji: '🤖' },
            { key: 'other', title: '其他技能', title_en: 'Other Skills', emoji: '🔧' }
        ];

        grid.innerHTML = categories.map(cat => {
            const items = content.skills[cat.key];
            if (!items || items.length === 0) return '';
            return `
                <div class="skill-category">
                    <div class="skill-category-header">
                        <span class="skill-cat-icon">${cat.emoji}</span>
                        <span>${t(cat.title, cat.title_en)}</span>
                    </div>
                    <div class="skill-tags">
                        ${items.map(item => `
                            <span class="skill-tag">${item.icon || ''} ${t(item.name, item.name_en || item.name)}</span>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    // ==========================================
    // RENDER EXPERIENCE TIMELINE
    // ==========================================
    function renderExperience(content) {
        if (!content?.experience) return;
        const timeline = document.getElementById('timeline');
        if (!timeline) return;

        timeline.innerHTML = content.experience.map(exp => `
            <div class="timeline-item">
                <div class="timeline-dot" aria-hidden="true"></div>
                <div class="timeline-date">${exp.period}</div>
                <div class="timeline-role">${t(exp.role, exp.role_en)}</div>
                <div class="timeline-company">${t(exp.company, exp.company_en)}</div>
                <div class="timeline-project">${exp.project}</div>
                <ul class="timeline-details">
                    ${(isZh() ? exp.details : exp.details_en).map(d => `<li>${d}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    // ==========================================
    // RENDER EDUCATION
    // ==========================================
    function renderEducation(content) {
        if (!content?.education) return;
        const grid = document.getElementById('eduGrid');
        if (!grid) return;

        grid.innerHTML = content.education.map(edu => `
            <div class="edu-card">
                <div class="edu-school">${t(edu.school, edu.school_en)}</div>
                <div class="edu-degree">${t(edu.degree, edu.degree_en)}</div>
                <div class="edu-period">${edu.period}</div>
                <ul class="edu-details">
                    ${(isZh() ? edu.details : edu.details_en).map(d => `<li>${d}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    // ==========================================
    // RENDER GAMING
    // ==========================================
    function renderGaming(content) {
        if (!content?.gaming?.games) return;
        const grid = document.getElementById('gamingGrid');
        if (!grid) return;

        grid.innerHTML = content.gaming.games.map(game => `
            <div class="game-card">
                <div class="game-name">${t(game.name, game.name_en)}</div>
                <div class="game-hours">${game.hours}</div>
                <div class="game-rank">${game.rank || ''}</div>
            </div>
        `).join('');
    }

    // ==========================================
    // RENDER CONTACT
    // ==========================================
    function renderContact(content) {
        if (!content?.contact) return;
        const grid = document.getElementById('contactGrid');
        if (!grid) return;

        const items = [
            {
                icon: '📧',
                label: 'Email',
                value: content.contact.email,
                href: `mailto:${content.contact.email}`
            },
            {
                icon: '📱',
                label_zh: '电话',
                label_en: 'Phone',
                value: content.contact.phone,
                href: `tel:${content.contact.phone}`
            },
            {
                icon: '📍',
                label_zh: '所在地',
                label_en: 'Location',
                value: t(content.contact.location, content.contact.location_en),
                href: null
            }
        ];

        grid.innerHTML = items.map(item => {
            const label = item.label || t(item.label_zh, item.label_en);
            const inner = `
                <div class="contact-icon" aria-hidden="true">${item.icon}</div>
                <div class="contact-info">
                    <div class="contact-label">${label}</div>
                    <div class="contact-value">${item.value}</div>
                </div>
            `;
            if (item.href) {
                return `<a href="${item.href}" class="contact-item" target="_blank" rel="noopener">${inner}</a>`;
            }
            return `<div class="contact-item">${inner}</div>`;
        }).join('');
    }

    // ==========================================
    // RENDER ALL
    // ==========================================
    function renderAll(content) {
        renderWorks(content);
        renderAbout(content);
        renderSkills(content);
        renderExperience(content);
        renderEducation(content);
        renderGaming(content);
        renderContact(content);
    }

    // ==========================================
    // CUSTOM CURSOR
    // ==========================================
    function setupCursor() {
        const cursor = document.getElementById('cursor');
        const follower = document.getElementById('cursorFollower');
        if (!cursor || !follower) return;

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        function animate() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            follower.style.left = cursorX + 'px';
            follower.style.top = cursorY + 'px';
            requestAnimationFrame(animate);
        }
        animate();

        // Enlarge on interactive elements
        const interactiveSelectors = 'a, button, .work-card, .contact-item, .skill-tag, input[type="range"], .ap-progress';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveSelectors)) {
                follower.classList.add('hover');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveSelectors)) {
                follower.classList.remove('hover');
            }
        });
    }

    // ==========================================
    // NAVIGATION
    // ==========================================
    function setupNavigation() {
        const nav = document.getElementById('nav');
        const mobileToggle = document.getElementById('mobileToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileLinks = mobileMenu?.querySelectorAll('.mobile-link');

        // Scroll effect
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            // Active section detection
            const sections = document.querySelectorAll('section[id]');
            let current = '';
            sections.forEach(section => {
                const top = section.offsetTop - 150;
                if (currentScroll >= top) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + current);
            });

            lastScroll = currentScroll;
        });

        // Mobile menu
        mobileToggle?.addEventListener('click', () => {
            const expanded = mobileToggle.classList.toggle('active');
            mobileMenu?.classList.toggle('open', expanded);
            document.body.style.overflow = expanded ? 'hidden' : '';
        });

        mobileLinks?.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ==========================================
    // SCROLL OBSERVER (Animation on scroll)
    // ==========================================
    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.work-card, .skill-category, .edu-card, .game-card, .stat-item, .timeline-item, .contact-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.observe(el);

            // Trigger after observation
            const triggerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        triggerObserver.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            triggerObserver.observe(el);
        });
    }

    // ==========================================
    // PARTICLES BACKGROUND
    // ==========================================
    function setupParticles() {
        const container = document.getElementById('particles');
        if (!container) return;

        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];
        const maxParticles = 40;

        function resize() {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.opacitySpeed = (Math.random() - 0.5) * 0.005;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity += this.opacitySpeed;

                if (this.opacity <= 0.05 || this.opacity >= 0.5) {
                    this.opacitySpeed *= -1;
                }

                if (this.x < -10 || this.x > canvas.width + 10 ||
                    this.y < -10 || this.y > canvas.height + 10) {
                    this.reset();
                    this.opacity = 0;
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity})`;
                ctx.fill();
            }
        }

        function init() {
            resize();
            particles = Array.from({ length: maxParticles }, () => new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw connection lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(201, 168, 76, ${0.04 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        init();
        window.addEventListener('resize', resize);
        animate();
    }

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // ==========================================
    // INITIALIZATION
    // ==========================================
    async function init() {
        // Setup UI components
        setupCursor();
        setupNavigation();
        setupAudioControls();
        setupVideoControls();
        setupParticles();

        // Load content
        const content = await loadContent();

        // Setup language
        setupLanguageToggle(content);

        // Initial render
        if (content) {
            renderAll(content);
        }

        // Scroll animations
        setTimeout(setupScrollAnimations, 100);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
