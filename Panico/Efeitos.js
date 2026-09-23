// =====================================================================
// EFEITOS: som sintetizado, transições de escolha, CRT/VHS dinâmico e
// moldura vermelha reativa. Usado por Jogo.js através do objeto global FX.
//
// Nada aqui usa arquivos de áudio: todos os sons são gerados na hora
// com Web Audio (ruído filtrado + osciladores), então não há assets novos.
// Os efeitos sonoros respeitam o botão 🔊/🔇 (mesmo mudo da trilha).
//
// Campos opcionais que uma cena/opção pode ter na história (Jogo.js):
//   option.transition / scene.transition:
//        'soft' | 'dip' | 'vhs' | 'danger' | 'flash' | 'call' | 'blackout'
//   option.sfx: 'door' | 'metal' | 'steps' | 'run' | 'phone' | 'window'
//               | 'rustle' | 'hit' | 'heartbeat' | 'none'
//   scene.frame: 'normal' | 'tension' | 'danger'  (força o estado da moldura)
// =====================================================================
const FX = (() => {
    'use strict';

    const $ = (id) => document.getElementById(id);
    const container = $('game-container');
    const optionsBox = $('options-container');
    const content = $('content-area');
    const scenery = $('scenery');
    const scan = $('scanlines');
    const dim = $('fx-dim');
    const noiseEl = $('fx-noise');
    const tear = $('fx-tear');
    const flash = $('fx-flash');
    const roll = $('fx-roll');
    const rgbR = $('f-rgb-r');
    const rgbB = $('f-rgb-b');
    const music = $('bg-music');

    const rnd = (a, b) => a + Math.random() * (b - a);
    const sign = () => (Math.random() < 0.5 ? -1 : 1);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const HOLD_MS = 100;    // tempo mínimo do botão pressionado
    const FRAME_MS = 55;    // duração de um "frame" de glitch (~3 frames de 60fps)

    // =================================================================
    // ÁUDIO
    // =================================================================
    let ctx = null, master = null, noiseBuf = null, lastHover = 0;

    function initAudio() {
        if (ctx) return;
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.6;
        master.connect(ctx.destination);
        noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 1.5), ctx.sampleRate);
        const d = noiseBuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }

    // Só toca se o contexto existe (já houve clique) e o jogador não silenciou.
    function ready() {
        if (!ctx || music.muted) return false;
        if (ctx.state === 'suspended') ctx.resume();
        return true;
    }

    function noise(t, dur, o = {}) {
        const { type = 'bandpass', f = 1000, f2 = null, q = 1, g = 0.1, a = 0.002 } = o;
        const s = ctx.createBufferSource();
        s.buffer = noiseBuf;
        s.loop = true;
        const flt = ctx.createBiquadFilter();
        flt.type = type;
        flt.frequency.setValueAtTime(f, t);
        if (f2) flt.frequency.exponentialRampToValueAtTime(f2, t + dur);
        flt.Q.value = q;
        const env = ctx.createGain();
        env.gain.setValueAtTime(0.0001, t);
        env.gain.linearRampToValueAtTime(g, t + a);
        env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        s.connect(flt); flt.connect(env); env.connect(master);
        s.start(t, Math.random());
        s.stop(t + dur + 0.03);
    }

    function tone(t, dur, o = {}) {
        const { type = 'sine', f = 100, f2 = null, g = 0.2, a = 0.003 } = o;
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(f, t);
        if (f2) osc.frequency.exponentialRampToValueAtTime(f2, t + dur);
        const env = ctx.createGain();
        env.gain.setValueAtTime(0.0001, t);
        env.gain.linearRampToValueAtTime(g, t + a);
        env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(env); env.connect(master);
        osc.start(t);
        osc.stop(t + dur + 0.03);
    }

    // Cada som recebe o instante inicial t (segundos do AudioContext).
    const SOUNDS = {
        // botão "clac": pressiona e solta
        clickDown(t) {
            noise(t, 0.014, { type: 'highpass', f: 2200, g: 0.22, a: 0.001 });
            tone(t, 0.035, { type: 'square', f: 170, f2: 80, g: 0.08, a: 0.001 });
        },
        clickUp(t) {
            noise(t, 0.010, { type: 'highpass', f: 3800, g: 0.14, a: 0.001 });
            tone(t, 0.02, { type: 'square', f: 260, f2: 200, g: 0.04, a: 0.001 });
        },
        // hover: chiado curtíssimo e baixíssimo
        hover(t) {
            noise(t, 0.045, { f: 1400, f2: 700, q: 0.9, g: 0.018 });
            tone(t, 0.05, { f: 70, g: 0.012 });
        },
        // ruído de fita VHS (str = intensidade)
        vhs(t, str = 1) {
            noise(t, 0.28, { f: 3500, f2: 500, q: 0.5, g: 0.07 * str });
            for (let i = 0; i < 6; i++) {
                noise(t + i * 0.035 + rnd(0, 0.02), rnd(0.02, 0.05),
                      { f: rnd(800, 3800), q: 0.7, g: 0.10 * str, a: 0.001 });
            }
            tone(t, 0.12, { f: 55, f2: 40, g: 0.18 * str });
        },
        // microfalha ambiente (bem baixa)
        crackle(t) {
            for (let i = 0; i < 3; i++) {
                noise(t + i * 0.03, 0.03, { f: rnd(1500, 4000), q: 0.8, g: 0.03, a: 0.001 });
            }
        },
        door(t) {
            tone(t, 0.22, { f: 95, f2: 38, g: 0.5 });
            noise(t, 0.09, { type: 'lowpass', f: 500, g: 0.35 });
            tone(t + 0.1, 0.45, { type: 'triangle', f: 150, f2: 230, g: 0.03 });
        },
        metal(t) {
            [820, 1310, 2140, 3070].forEach((f, i) => tone(t, 0.36 - i * 0.05, { f, g: 0.06 / (i + 1) + 0.01 }));
            noise(t, 0.03, { type: 'highpass', f: 5000, g: 0.10 });
        },
        steps(t, n = 2, gap = 0.17) {
            for (let i = 0; i < n; i++) {
                noise(t + i * gap, 0.09, { type: 'lowpass', f: 380, g: 0.30 });
                tone(t + i * gap, 0.10, { f: 70, f2: 45, g: 0.25 });
            }
        },
        run(t) { SOUNDS.steps(t, 5, 0.10); },
        phone(t) {
            noise(t, 0.012, { type: 'highpass', f: 3000, g: 0.14, a: 0.001 });
            tone(t + 0.10, 0.10, { type: 'square', f: 440, g: 0.025 });
            tone(t + 0.10, 0.10, { type: 'square', f: 480, g: 0.025 });
        },
        ring(t) {
            for (let grp = 0; grp < 2; grp++) {
                for (let i = 0; i < 8; i++) {
                    tone(t + grp * 0.7 + i * 0.045, 0.035, { type: 'square', f: 1480, g: 0.03, a: 0.001 });
                }
            }
        },
        window(t) {
            noise(t, 0.28, { f: 400, f2: 1100, q: 1.2, g: 0.07 });
            noise(t + 0.26, 0.02, { type: 'highpass', f: 3000, g: 0.15, a: 0.001 });
        },
        rustle(t) {
            for (let i = 0; i < 5; i++) {
                noise(t + i * 0.04 + rnd(0, 0.02), 0.05, { f: rnd(2500, 4500), q: 0.6, g: 0.05 });
            }
        },
        hit(t) {
            tone(t, 0.16, { f: 120, f2: 40, g: 0.55 });
            noise(t, 0.07, { f: 900, q: 0.5, g: 0.30 });
        },
        heartbeat(t) {
            tone(t, 0.14, { f: 62, f2: 42, g: 0.45 });
            tone(t + 0.19, 0.16, { f: 55, f2: 38, g: 0.40 });
        },
        // evento sobrenatural: queda grave + chiado que "sobe"
        sting(t) {
            tone(t, 0.9, { type: 'triangle', f: 180, f2: 28, g: 0.25 });
            noise(t, 0.5, { f: 2500, f2: 6000, q: 0.4, g: 0.06, a: 0.35 });
        },
        drop(t) {
            tone(t, 0.7, { f: 70, f2: 26, g: 0.5 });
            noise(t, 0.4, { type: 'lowpass', f: 300, f2: 80, g: 0.20 });
        },
        dice(t) {
            let at = t;
            for (let i = 0; i < 7; i++) {
                noise(at, 0.03, { f: rnd(1800, 3300), q: 2, g: 0.12, a: 0.001 });
                tone(at, 0.03, { type: 'square', f: rnd(300, 600), g: 0.03, a: 0.001 });
                at += 0.045 + i * 0.01;
            }
        },
        dieWin(t) {
            tone(t, 0.08, { type: 'triangle', f: 520, g: 0.06 });
            tone(t + 0.09, 0.16, { type: 'triangle', f: 780, g: 0.06 });
        },
        dieFail(t) { SOUNDS.drop(t); }
    };

    function play(name, delay = 0, ...args) {
        if (!ready() || !SOUNDS[name]) return;
        SOUNDS[name](ctx.currentTime + delay, ...args);
    }

    // Descobre "o som da ação" pelo texto do botão (ou pelo ícone do destino).
    const ACTION_RULES = [
        [/lutar|golpe|ataca|enfrent|confront|acert|revidar/, 'hit'],
        [/correr|fugir|fuga|escapar|a pe\b|ir ate|seguir|sair correndo/, 'run'],
        [/faca|taco|chave|garagem|carro|arma|pegar a |ferramenta/, 'metal'],
        [/janela|quintal|vidro|cortina/, 'window'],
        [/atender|telefone|celular|ligar|ligacao|desligar|policia|chamar|mensagem/, 'phone'],
        [/porta|entrar|abrir|sair|fechar|trancar|escada|descer|subir|porao|casa do/, 'door'],
        [/esconder|silencio|quiet|esperar|ouvir|escutar|respirar/, 'heartbeat'],
        [/kit|lanterna|guardar|procurar|revistar|examinar|ler |bilhete|olhar|verificar|voltar|passar/, 'rustle'],
        [/andar|caminhar|ir para|ir ate|avancar/, 'steps']
    ];
    const ICON_SOUND = {
        door: 'door', phone: 'phone', window: 'window', stairs: 'steps',
        knife: 'metal', bat: 'metal', carkey: 'metal', note: 'rustle', flashlight: 'rustle', bandage: 'rustle'
    };
    const norm = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    function pickAction(option, destScene) {
        if (option.sfx) return option.sfx === 'none' ? null : option.sfx;
        const txt = norm(option.text);
        for (const [re, name] of ACTION_RULES) if (re.test(txt)) return name;
        if (destScene && destScene.icon && ICON_SOUND[destScene.icon]) return ICON_SOUND[destScene.icon];
        return null;
    }

    // =================================================================
    // VISUAL: glitch, escurecer, ruído
    // =================================================================
    function setDim(level, ms, full = false) {
        dim.classList.toggle('full', full);
        dim.style.transitionDuration = ms + 'ms';
        dim.style.opacity = level;
    }

    function setNoise(level) { noiseEl.style.opacity = level; }

    // Um "frame" de glitch: imagem deslocada, canais de cor separados,
    // e (opcionalmente) uma faixa de estática cruzando a tela.
    function glitchFrame(str = 1, withTear = false) {
        const dx = sign() * rnd(2, 2 + 4 * str);
        content.style.transform = `translateX(${dx}px)`;
        scenery.style.transform = `translateX(${-dx * 0.5}px)`;
        content.classList.add('glitch');
        scenery.classList.add('glitch');
        rgbR.setAttribute('dx', (dx * 0.9).toFixed(1));
        rgbB.setAttribute('dx', (-dx * 0.6).toFixed(1));
        if (withTear) {
            tear.style.top = rnd(5, 88) + '%';
            tear.style.height = rnd(8, 34) + 'px';
            tear.style.transform = `translateX(${sign() * rnd(4, 24)}px)`;
            tear.style.opacity = rnd(0.55, 0.9);
        }
    }

    function clearGlitch() {
        content.style.transform = '';
        scenery.style.transform = '';
        content.classList.remove('glitch');
        scenery.classList.remove('glitch');
        tear.style.opacity = 0;
    }

    // =================================================================
    // TRANSIÇÕES ENTRE CENAS (cada escolha pode ter um "sabor" diferente)
    // =================================================================
    const KINDS = {
        // dim: força do escurecimento · dimMs: quanto demora · frames: nº de frames
        // de glitch · str: intensidade · noise: opacidade da estática · hold: tempo
        // parado no escuro · out: tempo para voltar
        soft:     { dim: 0.55, dimMs: 120, frames: 2, str: 0.5, noise: 0.10, tear: false, hold: 0,   out: 240 },
        dip:      { dim: 0.92, dimMs: 200, frames: 2, str: 0.5, noise: 0.10, tear: false, hold: 140, out: 360 },
        vhs:      { dim: 0.70, dimMs: 140, frames: 4, str: 1.0, noise: 0.32, tear: true,  hold: 0,   out: 300, post: true },
        danger:   { dim: 0.85, dimMs: 120, frames: 4, str: 1.6, noise: 0.45, tear: true,  hold: 60,  out: 380, post: true, shake: true },
        flash:    { dim: 0.90, dimMs: 130, frames: 3, str: 1.4, noise: 0.40, tear: true,  hold: 180, out: 420, flash: true, shake: true },
        call:     { dim: 0.60, dimMs: 110, frames: 3, str: 0.8, noise: 0.50, tear: true,  hold: 0,   out: 300 },
        blackout: { dim: 1.00, dimMs: 220, frames: 1, str: 0.6, noise: 0.15, tear: false, hold: 420, out: 600, full: true }
    };

    const MOOD_RANK = { calm: 0, good: 0, bittersweet: 0, bad: 0, tense: 1, danger: 2 };

    function pickKind({ option, srcScene, destScene, sameLoc, prevMood }) {
        if (option.transition && KINDS[option.transition]) return option.transition;
        if (destScene.transition && KINDS[destScene.transition]) return destScene.transition;

        let kind;
        if (destScene.isEnding || destScene.mood === 'bad' || (srcScene && srcScene.isEnding)) kind = 'blackout';
        else if (destScene.event === 'danger') kind = 'flash';
        else if (destScene.event === 'call') kind = 'call';
        else if (destScene.mood === 'danger') kind = 'danger';
        else if (destScene.mood === 'tense') kind = 'vhs';
        else kind = sameLoc ? 'soft' : 'dip';

        // Não deixe o glitch pesado virar rotina: se o clima é o mesmo da
        // cena anterior, rebaixa um nível. O forte fica para mudanças.
        if (prevMood && prevMood === destScene.mood) {
            if (kind === 'danger') kind = 'vhs';
            else if (kind === 'vhs') kind = 'soft';
        }
        // Diálogo corrido (botão "continuar") nunca ganha o glitch cheio.
        if (option.type === 'continue' && kind === 'vhs') kind = 'soft';
        return kind;
    }

    let busy = false;
    let queuedEntry = null;
    let currentMood = 'calm';
    let currentEvent = null;

    // Botão pressionado: começa no pointerdown, dura no mínimo HOLD_MS.
    function press(btn) {
        return new Promise((resolve) => {
            if (!btn) { resolve(); return; }
            let wait = HOLD_MS;
            const started = Number(btn.dataset.down) || 0;
            if (started) {
                wait = Math.max(0, HOLD_MS - (performance.now() - started));
            } else {          // teclado (Enter/Espaço): sem pointerdown antes
                btn.classList.add('pressed');
                play('clickDown');
            }
            setTimeout(() => {
                btn.classList.remove('pressed');
                btn.classList.add('btn-blink');
                delete btn.dataset.down;
                play('clickUp');
                resolve();
            }, wait);
        });
    }

    function lockOptions(btn) {
        optionsBox.classList.add('locked');
        if (btn) btn.classList.add('chosen');
    }

    async function go({ btn, option = {}, srcScene, destScene, sameLoc, swap }) {
        if (busy) { swap(); return; }
        busy = true;
        lockOptions(btn);

        const kind = pickKind({ option, srcScene, destScene, sameLoc, prevMood: currentMood });
        const noMotion = reduced();
        const cfg = KINDS[kind];
        const k = option.type === 'continue' ? 0.75 : 1;
        const frames = noMotion ? 0 : cfg.frames;

        // 1) botão pressionado ~100ms + "clac"
        await press(btn);

        // 2) som correspondente à ação
        const act = pickAction(option, destScene);
        if (act) play(act);

        // 3) tela escurece / vinheta fecha
        setDim(cfg.dim, cfg.dimMs * k, !!cfg.full);
        if (kind === 'blackout') play('drop');
        await sleep(cfg.dimMs * k);

        // 4) glitch de 2–4 frames + ruído de fita
        if (frames) {
            play('vhs', 0, cfg.str);
            setNoise(cfg.noise);
            if (cfg.shake) container.classList.add('event-danger');
            for (let i = 0; i < frames; i++) {
                glitchFrame(cfg.str, cfg.tear);
                await sleep(FRAME_MS);
            }
            clearGlitch();
        }
        if (cfg.flash && !noMotion) {          // flash vermelho de 2 frames
            flash.style.opacity = 1;
            play('sting');
            await sleep(FRAME_MS);
            flash.style.opacity = 0;
        }
        if (cfg.hold) await sleep(cfg.hold * k);

        // 5) troca de cena (escondida atrás do escuro)
        container.classList.remove('event-danger');
        swap();
        if (kind === 'call') play('ring');

        // 6) volta da imagem: um último frame torto e o escuro se dissolve
        if (cfg.post && !noMotion) glitchFrame(cfg.str * 0.6, false);
        setDim(0, cfg.out * k);
        setNoise(0);
        const q = queuedEntry; queuedEntry = null;
        if (q) q();                                    // efeitos de entrada da nova cena
        await sleep(FRAME_MS);
        clearGlitch();
        await sleep(Math.max(0, cfg.out * k - FRAME_MS));
        busy = false;
    }

    // Rolagem de dado: botão + rattle. Resolve quando o resultado pode aparecer.
    async function rollChoice(btn, option = {}) {
        lockOptions(btn);
        await press(btn);
        play('dice');
        setDim(0.45, 160);
        await sleep(400);
        setDim(0, 120);
    }

    function dieResult(success) {
        play(success ? 'dieWin' : 'dieFail');
    }

    // =================================================================
    // CRT/VHS DINÂMICO: existe em silêncio e só "fala" nos momentos-chave
    // =================================================================
    async function burst({ pattern = [1], str = 1, noise = 0.2, tearOn = true, ms = 500 }) {
        if (reduced()) return;
        scan.classList.add('hot');
        roll.classList.remove('go'); void roll.offsetWidth; roll.classList.add('go');
        setNoise(noise);
        for (const step of pattern) {
            if (step === 1) { glitchFrame(str, tearOn); await sleep(FRAME_MS); clearGlitch(); }
            else { await sleep(step); }          // números > 1 = pausa em ms
        }
        clearGlitch();
        setNoise(0);
        await sleep(Math.max(0, ms - pattern.length * FRAME_MS));
        scan.classList.remove('hot');
    }

    // Microfalha rara em cenas tensas/perigosas, sem nunca virar constante.
    let ambientTimer = null;
    function scheduleAmbient() {
        clearTimeout(ambientTimer);
        let delay;
        if (currentMood === 'danger') delay = rnd(6000, 14000);
        else if (currentMood === 'tense') delay = rnd(16000, 32000);
        else return;
        ambientTimer = setTimeout(async () => {
            const overlayOpen = document.querySelector('.overlay:not(.hidden)');
            if (!busy && !overlayOpen && !reduced()) {
                play('crackle');
                await burst({ pattern: [1, 40, 1], str: 0.3, noise: 0.06, tearOn: false, ms: 200 });
            }
            scheduleAmbient();
        }, delay);
    }

    // Moldura: classes que o CSS usa para pulsar/tremer/apagar.
    function frameClasses(scene) {
        const c = [];
        let base = scene.frame;
        if (!base) {
            if (scene.mood === 'danger') base = 'danger';
            else if (scene.mood === 'tense' || scene.event === 'call') base = 'tension';
            else base = 'normal';
        }
        c.push('frame-' + base);
        if (scene.event === 'danger' && scene.frame !== 'normal') c.push('frame-super');
        return c;
    }

    // Chamado por showScene() quando a nova cena já está montada.
    function enterScene(sceneKey, scene) {
        const prevMood = currentMood;
        const prevEvent = currentEvent;
        currentMood = scene.mood || 'calm';
        currentEvent = scene.event || null;

        const entry = () => {
            const escalated = (MOOD_RANK[currentMood] || 0) > (MOOD_RANK[prevMood] || 0);
            if (scene.event === 'danger' && prevEvent !== 'danger') {
                // evento sobrenatural: o glitch mais forte do jogo, e é raro
                play('sting', 0.05);
                burst({ pattern: [1, 80, 1, 40, 1], str: 1.2, noise: 0.25, ms: 520 });
            } else if (currentMood === 'danger' && escalated) {
                play('heartbeat', 0.05);
                burst({ pattern: [1, 90, 1], str: 0.8, noise: 0.15, ms: 380 });
            }
        };

        if (busy) queuedEntry = entry; else entry();
        scheduleAmbient();
    }

    // =================================================================
    // Ligações de eventos (hover, pressionar, desbloqueio do áudio)
    // =================================================================
    const HOVERABLE = '.option-button, .continue-button, .corner-tab, .close-overlay, #dado-ok-btn';
    const PRESSABLE = '.option-button, .continue-button';

    function unlock() {
        initAudio();
        if (ctx && ctx.state === 'suspended') ctx.resume();
    }
    document.addEventListener('pointerdown', unlock);
    document.addEventListener('keydown', unlock);

    container.addEventListener('mouseover', (e) => {
        const el = e.target.closest(HOVERABLE);
        if (!el || el.contains(e.relatedTarget)) return;
        if (optionsBox.classList.contains('locked')) return;
        const now = performance.now();
        if (now - lastHover < 70) return;
        lastHover = now;
        play('hover');
    });

    optionsBox.addEventListener('pointerdown', (e) => {
        const btn = e.target.closest(PRESSABLE);
        if (!btn || e.button !== 0 || optionsBox.classList.contains('locked')) return;
        btn.classList.add('pressed');
        btn.dataset.down = performance.now();
        unlock();
        play('clickDown');
    });

    // Arrastou para fora sem soltar: o botão "desafunda" e nada acontece.
    optionsBox.addEventListener('pointerout', (e) => {
        const btn = e.target.closest(PRESSABLE);
        if (!btn || btn.contains(e.relatedTarget) || optionsBox.classList.contains('locked')) return;
        btn.classList.remove('pressed');
        delete btn.dataset.down;
    });

    return { go, press, rollChoice, dieResult, enterScene, frameClasses, play };
})();
