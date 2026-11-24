/* ============================================================================
   SHUFFLED — Spotify RNG | Oyun Motoru (57.500+ Gerçek Yabancı Şarkı Havuzu)
   ============================================================================ */
(() => {
    'use strict';

    // ------------------------------------------------------------------------
    // 1. SABİTLER: NADİRLİK KATMANLARI, MUTASYONLAR, BİYOMLAR, MAĞAZA, EKİPMAN
    // ------------------------------------------------------------------------
    const TIERS = [
        { id: 0, key: 'common',       name: 'Common',       tr: 'Yaygın',      odds: 2,      minStreams: 0,             color: '#94a3b8', glow: 'rgba(148,163,184,0.28)', badge: 'bg-slate-600/40 text-slate-200 border-slate-400/30', baseValue: 12 },
        { id: 1, key: 'uncommon',     name: 'Uncommon',     tr: 'Sıra Dışı',   odds: 4,      minStreams: 150000,        color: '#22c55e', glow: 'rgba(34,197,94,0.32)',   badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40', baseValue: 28 },
        { id: 2, key: 'rare',         name: 'Rare',         tr: 'Nadir',       odds: 12,     minStreams: 1000000,       color: '#38bdf8', glow: 'rgba(56,189,248,0.36)',  badge: 'bg-sky-500/20 text-sky-300 border-sky-400/40', baseValue: 75 },
        { id: 3, key: 'epic',         name: 'Epic',         tr: 'Epik',        odds: 40,     minStreams: 15000000,      color: '#a855f7', glow: 'rgba(168,85,247,0.42)',  badge: 'bg-purple-500/25 text-purple-200 border-purple-400/50', baseValue: 220 },
        { id: 4, key: 'legendary',    name: 'Legendary',    tr: 'Efsanevi',    odds: 160,    minStreams: 80000000,      color: '#f59e0b', glow: 'rgba(245,158,11,0.46)',  badge: 'bg-amber-500/25 text-amber-200 border-amber-400/55', baseValue: 750 },
        { id: 5, key: 'mythic',       name: 'Mythic',       tr: 'Mitik',       odds: 750,    minStreams: 350000000,     color: '#f43f5e', glow: 'rgba(244,63,94,0.52)',   badge: 'bg-rose-500/25 text-rose-200 border-rose-400/60', baseValue: 2800 },
        { id: 6, key: 'divine',       name: 'Divine',       tr: 'İlahi',       odds: 3500,   minStreams: 900000000,     color: '#22d3ee', glow: 'rgba(34,211,238,0.56)',  badge: 'bg-cyan-500/25 text-cyan-200 border-cyan-300/60', baseValue: 11000 },
        { id: 7, key: 'cosmic',       name: 'Cosmic',       tr: 'Kozmik',      odds: 15000,  minStreams: 1800000000,    color: '#fde047', glow: 'rgba(253,224,71,0.58)',  badge: 'bg-yellow-400/25 text-yellow-200 border-yellow-300/70', baseValue: 45000 },
        { id: 8, key: 'transcendent', name: 'Transcendent', tr: 'Aşkın',       odds: 60000,  minStreams: 2800000000,    color: '#ff2e93', glow: 'rgba(255,46,147,0.62)',  badge: 'badge-rainbow border-white/50', baseValue: 180000 }
    ];

    const MUTATIONS = [
        { id: 0, key: 'normal',  name: 'Normal',       odds: 1,     valMult: 1,   vinylClass: 'vinyl-normal',  badgeClass: '', textClass: '' },
        { id: 1, key: 'shiny',   name: 'Shiny',        odds: 15,    valMult: 2.5, vinylClass: 'vinyl-shiny',   badgeClass: 'bg-slate-200/20 text-white border border-white/40', textClass: '' },
        { id: 2, key: 'gold',    name: 'Gold',         odds: 50,    valMult: 5,   vinylClass: 'vinyl-gold',    badgeClass: 'bg-amber-400/25 text-amber-200 border border-amber-300/60', textClass: '' },
        { id: 3, key: 'diamond', name: 'Diamond',      odds: 200,   valMult: 12,  vinylClass: 'vinyl-diamond', badgeClass: 'bg-cyan-400/25 text-cyan-100 border border-cyan-300/60', textClass: '' },
        { id: 4, key: 'rainbow', name: 'Rainbow',      odds: 750,   valMult: 30,  vinylClass: 'vinyl-rainbow', badgeClass: 'badge-rainbow border border-white/50', textClass: 'text-rainbow' },
        { id: 5, key: 'void',    name: 'Void',         odds: 2500,  valMult: 75,  vinylClass: 'vinyl-void',    badgeClass: 'bg-purple-950/90 text-purple-200 border border-purple-400/70', textClass: '' },
        { id: 6, key: 'glitch',  name: 'Glitch',       odds: 8000,  valMult: 180, vinylClass: 'vinyl-glitch',  badgeClass: 'bg-black text-cyan-300 border border-pink-500/80', textClass: 'text-glitch' },
        { id: 7, key: 'cosmic',  name: 'Cosmic Holo',  odds: 25000, valMult: 500, vinylClass: 'vinyl-cosmic',  badgeClass: 'bg-indigo-950/90 text-yellow-200 border border-yellow-300/80', textClass: 'text-cosmic' }
    ];

    const BIOMES = [
        { id: 'studio',  name: 'Stüdyo Modu',     icon: '🎧', desc: 'Dengeli standart RNG oranları',           luckMult: 1.0, mutMult: 1.0, coinMult: 1.0, color: '#1db954' },
        { id: 'neon',    name: 'Neon Gece',       icon: '🌃', desc: '+45% Şans • 1.8x Mutasyon Olasılığı',     luckMult: 1.45, mutMult: 1.8, coinMult: 1.15, color: '#38bdf8' },
        { id: 'golden',  name: 'Altın Plak Çağı', icon: '🏆', desc: '+80% Şans • 1.5x SC Kazancı',             luckMult: 1.8, mutMult: 1.4, coinMult: 1.5, color: '#f59e0b' },
        { id: 'eclipse', name: 'Void Tutulması',  icon: '🌑', desc: '+110% Şans • 3.0x Void/Glitch Mutasyon',  luckMult: 2.1, mutMult: 3.0, coinMult: 1.35, color: '#a855f7' },
        { id: 'grammy',  name: 'Grammy Galası',   icon: '✨', desc: '+160% Genel Şans • 2.2x SC Kazancı',      luckMult: 2.6, mutMult: 2.2, coinMult: 2.2, color: '#ff2e93' }
    ];

    const UPGRADES = [
        { id: 'luck',      name: 'Şans Amplifikatörü', icon: 'fa-clover',         color: 'text-emerald-400', desc: 'Her seviyede +0.35x kalıcı taban şans ekler.',        max: 25, baseCost: 120,  growth: 1.65, effectText: lvl => `+${(lvl * 0.35).toFixed(2)}x Şans` },
        { id: 'speed',     name: 'Turbo Pikap Motoru', icon: 'fa-bolt',           color: 'text-sky-400',     desc: 'Çekim animasyon süresini ve oto-çekim hızını artırır.', max: 12, baseCost: 150,  growth: 1.75, effectText: lvl => `${Math.max(160, 760 - lvl * 50)}ms` },
        { id: 'mutation',  name: 'Mutasyon Mıknatısı', icon: 'fa-wand-sparkles',  color: 'text-purple-400',  desc: 'Shiny, Gold, Rainbow, Void ve Glitch şansını artırır.', max: 15, baseCost: 300,  growth: 1.8,  effectText: lvl => `${(1 + lvl * 0.3).toFixed(1)}x Mutasyon` },
        { id: 'multiroll', name: 'Çoklu Plak Çekici',  icon: 'fa-layer-group',    color: 'text-pink-400',    desc: 'Tek tıkta birden fazla plak çek (x1 → x2 → x4 → x6 → x8 → x12).', max: 5, baseCost: 600, growth: 3.2, effectText: lvl => `x${MULTI_STEPS[lvl]} Çekim` },
        { id: 'capacity',  name: 'Plak Arşiv Kasası',  icon: 'fa-box-archive',    color: 'text-amber-400',   desc: 'Envanter kapasitesini her seviyede +25 artırır.',      max: 20, baseCost: 200,  growth: 1.55, effectText: lvl => `${50 + lvl * 25} Slot` },
        { id: 'coins',     name: 'Telif Geliri Artışı',icon: 'fa-coins',          color: 'text-yellow-400',  desc: 'Çekim ve satışlardan kazanılan Stream Coin’i artırır.', max: 15, baseCost: 250,  growth: 1.7,  effectText: lvl => `+${lvl * 25}% SC` }
    ];
    const MULTI_STEPS = [1, 2, 4, 6, 8, 12];

    const POTIONS = [
        { id: 'lucky_vinyl',    name: 'Şanslı Vinil İksiri',  icon: '🍀', color: 'border-emerald-500/40 bg-emerald-500/10', desc: '3 dakika boyunca +2.5x Şans verir.',        cost: 450,   type: 'duration', durationSec: 180, luckAdd: 2.5,  mutMult: 1 },
        { id: 'neon_surge',     name: 'Neon Stüdyo Dalgaları',icon: '⚡', color: 'border-sky-500/40 bg-sky-500/10',         desc: '2 dakika boyunca +6.0x Şans verir.',        cost: 1600,  type: 'duration', durationSec: 120, luckAdd: 6.0,  mutMult: 1.4 },
        { id: 'mutation_elixir',name: 'Mutasyon İksiri',      icon: '🧪', color: 'border-purple-500/40 bg-purple-500/10',   desc: '3 dakika boyunca 4x Mutasyon şansı verir.', cost: 1400,  type: 'duration', durationSec: 180, luckAdd: 0.5,  mutMult: 4.0 },
        { id: 'heavenly_tape',  name: 'Heavenly Mixtape',     icon: '👑', color: 'border-amber-400/50 bg-amber-500/15',     desc: 'Sıradaki 1 çekimde +45x DEV ŞANS! (En az Epic+)', cost: 5500, type: 'rolls', rollsLeft: 1, luckAdd: 45.0, mutMult: 3.0, minTier: 3 }
    ];

    const GEARS = [
        { id: 'gold_needle',   name: 'Altın Pikap İğnesi',     icon: '🪙', desc: 'Kalıcı +1.0x Şans ve +15% SC kazancı.',               luckAdd: 1.0, mutAdd: 0.2, coinAdd: 0.15, costSC: 800,   reqTier: 2, reqCount: 8,  reqLabel: '8x Rare+ Çekim' },
        { id: 'neon_mixer',    name: 'Neon DJ Mikseri',        icon: '🎛️', desc: 'Kalıcı +2.2x Şans ve +0.6x Mutasyon çarpanı.',        luckAdd: 2.2, mutAdd: 0.6, coinAdd: 0.25, costSC: 3500,  reqTier: 3, reqCount: 10, reqLabel: '10x Epic+ Çekim' },
        { id: 'crystal_amp',   name: 'Kristal Stüdyo Amfisi',  icon: '💎', desc: 'Kalıcı +4.5x Şans ve +1.2x Mutasyon çarpanı.',        luckAdd: 4.5, mutAdd: 1.2, coinAdd: 0.45, costSC: 14000, reqTier: 4, reqCount: 8,  reqLabel: '8x Legendary+ Çekim' },
        { id: 'void_deck',     name: 'Void Plakçalar',         icon: '🌌', desc: 'Kalıcı +10.0x Şans ve +2.5x Mutasyon çarpanı.',       luckAdd: 10.0, mutAdd: 2.5, coinAdd: 0.8,  costSC: 55000, reqTier: 5, reqCount: 4,  reqLabel: '4x Mythic+ Çekim' },
        { id: 'cosmic_master', name: 'Kozmik Mastering Masası',icon: '🌠', desc: 'Kalıcı +25.0x Şans, +5x Mutasyon ve +150% SC!',       luckAdd: 25.0, mutAdd: 5.0, coinAdd: 1.5,  costSC: 220000,reqTier: 6, reqCount: 2,  reqLabel: '2x Divine+ Çekim' }
    ];

    const QUESTS = [
        { id: 'q_roll_1',     title: 'İlk Plak Çekimi',         desc: 'Toplam 1 kez Shuffle çek.',                  target: 1,   metric: s => s.totalRolls, rewardSC: 100, rewardPotion: null },
        { id: 'q_roll_50',    title: 'Ritim Yakalandı',         desc: 'Toplam 50 kez çekim yap.',                   target: 50,  metric: s => s.totalRolls, rewardSC: 450, rewardPotion: 'lucky_vinyl' },
        { id: 'q_roll_250',   title: 'Stüdyo Bağımlısı',        desc: 'Toplam 250 kez çekim yap.',                  target: 250, metric: s => s.totalRolls, rewardSC: 1800, rewardPotion: 'neon_surge' },
        { id: 'q_roll_1000',  title: 'Binlik Koleksiyoner',     desc: 'Toplam 1.000 kez çekim yap.',                target: 1000,metric: s => s.totalRolls, rewardSC: 7500, rewardPotion: 'heavenly_tape' },
        { id: 'q_disc_25',    title: 'Müzik Kaşifi',            desc: '25 farklı yabancı şarkı keşfet.',            target: 25,  metric: s => s.discovered.length, rewardSC: 400, rewardPotion: 'lucky_vinyl' },
        { id: 'q_disc_150',   title: 'Global Kütüphane',        desc: '150 farklı yabancı şarkı keşfet.',           target: 150, metric: s => s.discovered.length, rewardSC: 2200, rewardPotion: 'mutation_elixir' },
        { id: 'q_disc_500',   title: 'Arşiv Üstadı',            desc: '500 farklı yabancı şarkı keşfet.',           target: 500, metric: s => s.discovered.length, rewardSC: 12000, rewardPotion: 'heavenly_tape' },
        { id: 'q_epic',       title: 'Liste Başarısı (Epic)',   desc: 'İlk kez Epic (15M+) bir şarkı çek.',         target: 1,   metric: s => countTierOrAbove(s, 3), rewardSC: 500, rewardPotion: 'lucky_vinyl' },
        { id: 'q_legendary',  title: 'Dünya Yıldızı',           desc: 'İlk kez Legendary (80M+) bir şarkı çek.',    target: 1,   metric: s => countTierOrAbove(s, 4), rewardSC: 2000, rewardPotion: 'neon_surge' },
        { id: 'q_mythic',     title: 'Mitik Efsane',            desc: 'İlk kez Mythic (350M+) bir hit yakala.',     target: 1,   metric: s => countTierOrAbove(s, 5), rewardSC: 9000, rewardPotion: 'heavenly_tape' },
        { id: 'q_billion',    title: 'Milyarlık Kulüp',         desc: 'Divine+ (900M+ dinlenme) bir şarkı yakala.', target: 1,   metric: s => countTierOrAbove(s, 6), rewardSC: 30000, rewardPotion: 'heavenly_tape' },
        { id: 'q_mutation',   title: 'Nadir Baskı',             desc: 'Herhangi bir Mutasyonlu plak yakala.',       target: 1,   metric: s => s.totalMutations, rewardSC: 700, rewardPotion: 'mutation_elixir' }
    ];

    const AUTOSELL_MODES = [
        { maxTier: -1, label: 'YOK' },
        { maxTier: 0,  label: 'Common' },
        { maxTier: 1,  label: 'Uncommon-' },
        { maxTier: 2,  label: 'Rare-' },
        { maxTier: 3,  label: 'Epic-' }
    ];

    // ------------------------------------------------------------------------
    // 2. VERİTABANI YAPILARI (57.531 ŞARKI)
    // ------------------------------------------------------------------------
    let ALL_SONGS = [];
    let SONGS_BY_TIER = [[], [], [], [], [], [], [], [], []];
    let ALL_GENRES = [];
    let SONG_BY_ID = new Map();

    // iTunes Kapak & 30sn Önizleme Önbelleği
    const mediaCache = new Map();
    let mediaRequestToken = 0;

    // ------------------------------------------------------------------------
    // 3. OYUN DURUMU (STATE) & KAYIT
    // ------------------------------------------------------------------------
    const SAVE_KEY = 'shuffled_spotify_rng_v2';

    function createDefaultState() {
        return {
            coins: 100,
            totalCoinsEarned: 100,
            totalRolls: 0,
            pityCount: 0,
            megaPityCount: 0,
            totalMutations: 0,
            tierRollCounts: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            discovered: [],          // Benzersiz şarkı indexleri (compact)
            inventory: [],           // { uid, songIdx, mutId, rolledAt, locked }
            equippedUid: null,
            bestOdds: 0,
            bestLabel: '',
            upgrades: { luck: 0, speed: 0, mutation: 0, multiroll: 0, capacity: 0, coins: 0 },
            potions: { lucky_vinyl: 1, neon_surge: 0, mutation_elixir: 0, heavenly_tape: 0 },
            activeBuffs: [],         // { id, name, icon, type, endsAt, rollsLeft, luckAdd, mutMult, minTier }
            craftedGears: [],        // gear ID list
            claimedQuests: [],       // quest ID list
            recentRolls: [],         // Son 25 çekim özeti
            settings: {
                sfx: true,
                cutscene: true,
                autoplay: true,
                volume: 65,
                quickRoll: false,
                autoSellIdx: 0
            }
        };
    }

    let state = createDefaultState();
    let discoveredSet = new Set();

    // Çalışma zamanı bayrakları
    let isRolling = false;
    let isAutoRolling = false;
    let autoRollTimer = null;
    let currentBiomeIdx = 0;
    let biomeEndTime = Date.now() + 180000;
    let currentStageEntry = null; // { song, mutId, uid, isNew }
    let audioCtx = null;
    let isPreviewPlaying = false;
    let embedVisible = false;

    // Katalog (Codex) Filtre Durumu
    let codexFiltered = [];
    let codexPage = 1;
    const CODEX_PAGE_SIZE = 60;
    let codexDebounce = null;

    // ------------------------------------------------------------------------
    // 4. YARDIMCI FONKSİYONLAR
    // ------------------------------------------------------------------------
    function countTierOrAbove(s, minTier) {
        let total = 0;
        for (let t = minTier; t < 9; t++) total += (s.tierRollCounts[t] || 0);
        return total;
    }

    function formatStreams(n) {
        if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
        if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
        if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
        return String(n);
    }

    function formatNumber(n) {
        return Math.floor(n).toLocaleString('tr-TR');
    }

    function formatCoins(n) {
        if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B SC';
        if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M SC';
        if (n >= 1e4) return (n / 1e3).toFixed(1) + 'K SC';
        return Math.floor(n).toLocaleString('tr-TR') + ' SC';
    }

    function formatOdds(n) {
        return '1 / ' + Math.round(n).toLocaleString('tr-TR');
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function streamsToTier(streams) {
        for (let i = TIERS.length - 1; i >= 0; i--) {
            if (streams >= TIERS[i].minStreams) return i;
        }
        return 0;
    }

    function getUpgradeCost(upg) {
        const lvl = state.upgrades[upg.id] || 0;
        return Math.floor(upg.baseCost * Math.pow(upg.growth, lvl));
    }

    function getMaxInventory() {
        return 50 + (state.upgrades.capacity || 0) * 25;
    }

    function getMultiRollCount() {
        return MULTI_STEPS[state.upgrades.multiroll || 0] || 1;
    }

    function getRollDurationMs() {
        if (state.settings.quickRoll) return 110;
        return Math.max(160, 760 - (state.upgrades.speed || 0) * 50);
    }

    function pruneExpiredBuffs() {
        const now = Date.now();
        state.activeBuffs = state.activeBuffs.filter(b => {
            if (b.type === 'duration') return b.endsAt > now;
            if (b.type === 'rolls') return b.rollsLeft > 0;
            return false;
        });
    }

    function getStatsMultipliers() {
        pruneExpiredBuffs();
        const biome = BIOMES[currentBiomeIdx];
        let baseLuck = 1.0 + (state.upgrades.luck || 0) * 0.35;
        let mutMult = 1.0 + (state.upgrades.mutation || 0) * 0.3;
        let coinMult = 1.0 + (state.upgrades.coins || 0) * 0.25;
        let minTier = 0;

        for (const gid of state.craftedGears) {
            const g = GEARS.find(x => x.id === gid);
            if (g) {
                baseLuck += g.luckAdd;
                mutMult += g.mutAdd;
                coinMult += g.coinAdd;
            }
        }

        let buffLuckAdd = 0;
        let buffMutMult = 1.0;
        for (const b of state.activeBuffs) {
            buffLuckAdd += (b.luckAdd || 0);
            buffMutMult *= (b.mutMult || 1.0);
            if (b.minTier && b.minTier > minTier) minTier = b.minTier;
        }

        const totalLuck = (baseLuck + buffLuckAdd) * biome.luckMult;
        const totalMut = mutMult * buffMutMult * biome.mutMult;
        const totalCoin = coinMult * biome.coinMult;

        return { totalLuck, totalMut, totalCoin, minTier };
    }

    function getSongValueSC(song, mutId) {
        const tier = TIERS[song.tier];
        const mut = MUTATIONS[mutId];
        const { totalCoin } = getStatsMultipliers();
        // Düşük dinlenmeli şarkılar bile küçük SC verir; dev hitler + mutasyonlar servet kazandırır
        const streamBonus = Math.sqrt(Math.max(1000, song.streams)) / 42;
        return Math.max(5, Math.round((tier.baseValue + streamBonus) * mut.valMult * totalCoin));
    }

    // ------------------------------------------------------------------------
    // 5. WEB AUDIO SENTEZLEYİCİ SES EFEKTLERİ
    // ------------------------------------------------------------------------
    function ensureAudioCtx() {
        if (!state.settings.sfx) return null;
        if (!audioCtx) {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (Ctx) audioCtx = new Ctx();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }
        return audioCtx;
    }

    function playTone(freq, dur, type = 'sine', vol = 0.08, delay = 0) {
        const ctx = ensureAudioCtx();
        if (!ctx) return;
        const t = ctx.currentTime + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(vol, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.02);
    }

    function playRollSfx() {
        playTone(220, 0.06, 'triangle', 0.05, 0);
        playTone(330, 0.05, 'sine', 0.04, 0.04);
    }

    function playResultSfx(tierId, mutId) {
        if (!state.settings.sfx) return;
        if (tierId >= 5 || mutId >= 4) {
            // Epik sinematik arpej + bas darbesi
            playTone(65, 0.7, 'sawtooth', 0.14, 0);
            const notes = [261.6, 329.6, 392.0, 523.2, 659.2, 783.9, 1046.5];
            notes.forEach((n, i) => playTone(n, 0.45, 'triangle', 0.09, i * 0.065));
        } else if (tierId >= 3 || mutId >= 2) {
            playTone(392, 0.18, 'triangle', 0.08, 0);
            playTone(523.2, 0.22, 'triangle', 0.09, 0.08);
            playTone(659.2, 0.3, 'sine', 0.09, 0.16);
        } else if (tierId >= 1 || mutId >= 1) {
            playTone(440, 0.12, 'sine', 0.06, 0);
            playTone(554.4, 0.16, 'sine', 0.06, 0.06);
        } else {
            playTone(293.6, 0.09, 'sine', 0.04, 0);
        }
    }

    // ------------------------------------------------------------------------
    // 6. VERİTABANI BAŞLATMA (57.531 ŞARKI)
    // ------------------------------------------------------------------------
    function initDatabase() {
        const raw = window.SHUFFLED_RAW_DB;
        if (!raw || !raw.tracks) {
            throw new Error('Şarkı veritabanı (data/songs-db.js) yüklenemedi!');
        }
        ALL_GENRES = raw.genres;
        const artists = raw.artists;
        const lines = raw.tracks.split('\n');
        ALL_SONGS = new Array(lines.length);

        for (let i = 0; i < lines.length; i++) {
            const parts = lines[i].split('|');
            const id = parts[0];
            const title = parts[1];
            const artist = artists[parseInt(parts[2], 36)] || 'Unknown Artist';
            const streams = parseInt(parts[3], 36) || 5000;
            const genre = ALL_GENRES[parseInt(parts[4], 36)] || 'Pop';
            const tier = streamsToTier(streams);

            const song = {
                idx: i,
                id,
                title,
                artist,
                streams,
                genre,
                tier,
                searchKey: (title + ' ' + artist + ' ' + genre).toLowerCase()
            };
            ALL_SONGS[i] = song;
            SONGS_BY_TIER[tier].push(i);
            SONG_BY_ID.set(id, song);
        }

        // Katalog tür filtresini doldur
        const genreSel = document.getElementById('codex-genre-filter');
        const sortedGenres = [...ALL_GENRES].sort();
        const frag = document.createDocumentFragment();
        for (const g of sortedGenres) {
            const opt = document.createElement('option');
            opt.value = g;
            opt.textContent = g;
            frag.appendChild(opt);
        }
        genreSel.appendChild(frag);

        // Header havuz rozeti
        document.getElementById('pool-badge').innerHTML =
            `<i class="fa-solid fa-database mr-1"></i>${formatNumber(ALL_SONGS.length)} Şarkı`;
    }

    // ------------------------------------------------------------------------
    // 7. KAYIT SİSTEMİ (LOCALSTORAGE)
    // ------------------------------------------------------------------------
    function saveState() {
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('Kayıt hatası:', e);
        }
    }

    function loadState() {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            const def = createDefaultState();
            state = Object.assign(def, parsed);
            state.upgrades = Object.assign(def.upgrades, parsed.upgrades || {});
            state.potions = Object.assign(def.potions, parsed.potions || {});
            state.settings = Object.assign(def.settings, parsed.settings || {});
            if (!Array.isArray(state.tierRollCounts) || state.tierRollCounts.length !== 9) {
                state.tierRollCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            }
            // Geçersiz songIdx temizle
            state.inventory = (state.inventory || []).filter(item => ALL_SONGS[item.songIdx]);
            state.discovered = (state.discovered || []).filter(idx => ALL_SONGS[idx]);
            discoveredSet = new Set(state.discovered);
        } catch (e) {
            console.warn('Kayıt okunamadı, sıfırlandı:', e);
            state = createDefaultState();
            discoveredSet = new Set();
        }
    }

    // ------------------------------------------------------------------------
    // 8. ÇEKİM (RNG) MOTORU
    // ------------------------------------------------------------------------
    function rollSingleSong() {
        const { totalLuck, totalMut, minTier } = getStatsMultipliers();

        state.totalRolls++;
        state.pityCount++;
        state.megaPityCount++;

        let effectiveLuck = totalLuck;
        let guaranteedMinTier = minTier;

        // 10. çekimde 2x Pity Bonus
        if (state.pityCount >= 10) {
            effectiveLuck *= 2.0;
            state.pityCount = 0;
        }
        // 100. çekimde Mega Pity (8x Şans + Garanti Epic+)
        if (state.megaPityCount >= 100) {
            effectiveLuck *= 8.0;
            guaranteedMinTier = Math.max(guaranteedMinTier, 3);
            state.megaPityCount = 0;
        }

        // Nadirlik Katmanı Seçimi (Yüksekten Düşüğe)
        let chosenTier = 0;
        for (let t = TIERS.length - 1; t >= 1; t--) {
            const prob = Math.min(0.65, effectiveLuck / TIERS[t].odds);
            if (Math.random() < prob) {
                chosenTier = t;
                break;
            }
        }
        if (chosenTier < guaranteedMinTier) chosenTier = guaranteedMinTier;

        // O katmandan rastgele gerçek bir yabancı şarkı seç
        const pool = SONGS_BY_TIER[chosenTier];
        const songIdx = pool[Math.floor(Math.random() * pool.length)];
        const song = ALL_SONGS[songIdx];

        // Mutasyon Seçimi (Bağımsız katman)
        let chosenMut = 0;
        for (let m = MUTATIONS.length - 1; m >= 1; m--) {
            const mProb = Math.min(0.45, totalMut / MUTATIONS[m].odds);
            if (Math.random() < mProb) {
                chosenMut = m;
                break;
            }
        }

        // Çekim bazlı iksirleri azalt (Heavenly Mixtape vb.)
        for (const b of state.activeBuffs) {
            if (b.type === 'rolls' && b.rollsLeft > 0) {
                b.rollsLeft--;
            }
        }
        pruneExpiredBuffs();

        // İstatistik & Keşif Kaydı
        state.tierRollCounts[chosenTier] = (state.tierRollCounts[chosenTier] || 0) + 1;
        if (chosenMut > 0) state.totalMutations++;

        const isNew = !discoveredSet.has(songIdx);
        if (isNew) {
            discoveredSet.add(songIdx);
            state.discovered.push(songIdx);
        }

        const combinedOdds = TIERS[chosenTier].odds * MUTATIONS[chosenMut].odds;
        if (combinedOdds > state.bestOdds) {
            state.bestOdds = combinedOdds;
            state.bestLabel = `${chosenMut > 0 ? '[' + MUTATIONS[chosenMut].name + '] ' : ''}${song.title}`;
        }

        const valueSC = getSongValueSC(song, chosenMut);
        const rollRewardSC = Math.max(3, Math.round(valueSC * 0.25));
        state.coins += rollRewardSC;
        state.totalCoinsEarned += rollRewardSC;

        // Otomatik Satış veya Envantere Ekleme
        const autoSellMaxTier = AUTOSELL_MODES[state.settings.autoSellIdx || 0].maxTier;
        const shouldAutoSell = (chosenMut === 0 && chosenTier <= autoSellMaxTier);
        let kept = false;
        let autoSold = false;
        let uid = null;

        if (shouldAutoSell) {
            state.coins += valueSC;
            state.totalCoinsEarned += valueSC;
            autoSold = true;
        } else if (state.inventory.length < getMaxInventory()) {
            uid = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
            state.inventory.unshift({
                uid,
                songIdx,
                mutId: chosenMut,
                rolledAt: Date.now(),
                locked: chosenTier >= 5 || chosenMut >= 4 // Mitik+ ve Rainbow+ otomatik kilitlenir
            });
            kept = true;
        } else {
            // Envanter doluysa otomatik sat
            state.coins += valueSC;
            state.totalCoinsEarned += valueSC;
            autoSold = true;
        }

        // Son çekimler listesine ekle
        state.recentRolls.unshift({
            songIdx,
            mutId: chosenMut,
            isNew,
            autoSold,
            combinedOdds,
            ts: Date.now()
        });
        if (state.recentRolls.length > 30) state.recentRolls.length = 30;

        return { song, mutId: chosenMut, combinedOdds, valueSC, rollRewardSC, isNew, kept, autoSold, uid };
    }

    async function performRoll(count = 1) {
        if (isRolling) return;
        isRolling = true;
        updateRollButtonsUI();

        const vinyl = document.getElementById('vinyl-disc');
        const tonearm = document.getElementById('tonearm');
        vinyl.classList.add('rolling-fast');
        tonearm.classList.remove('engaged');
        playRollSfx();

        const dur = getRollDurationMs();

        // Hızlı görsel şölen (dönüş sırasında rastgele isimler akar)
        let flickerTimer = null;
        if (!state.settings.quickRoll) {
            const stageTitle = document.getElementById('stage-title');
            const stageArtist = document.getElementById('stage-artist');
            flickerTimer = setInterval(() => {
                const rSong = ALL_SONGS[Math.floor(Math.random() * ALL_SONGS.length)];
                stageTitle.textContent = rSong.title;
                stageArtist.textContent = rSong.artist;
            }, 65);
        }

        await new Promise(res => setTimeout(res, dur));
        if (flickerTimer) clearInterval(flickerTimer);

        // Çekimleri gerçekleştir
        const results = [];
        for (let i = 0; i < count; i++) {
            results.push(rollSingleSong());
        }

        // En nadir sonucu sahneye çıkar
        results.sort((a, b) => (b.combinedOdds - a.combinedOdds) || (b.song.streams - a.song.streams));
        const best = results[0];

        vinyl.classList.remove('rolling-fast');
        tonearm.classList.add('engaged');

        displayOnStage(best.song, best.mutId, best.isNew, true);
        playResultSfx(best.song.tier, best.mutId);

        // Nadir ekran sarsıntısı & Sinematik Cutscene
        const isCutsceneWorthy = (best.song.tier >= 5 || best.mutId >= 4);
        if (best.song.tier >= 4 || best.mutId >= 3) {
            const card = document.getElementById('stage-card');
            card.classList.remove('shake-anim');
            void card.offsetWidth;
            card.classList.add('shake-anim');
        }

        if (isCutsceneWorthy && state.settings.cutscene) {
            // Oto-çekimi geçici durdur ki oyuncu efsanevi çekimi kaçırmasın
            if (isAutoRolling) toggleAutoRoll(false);
            showCutscene(best);
        } else if (count > 1) {
            const rareHits = results.filter(r => r.song.tier >= 3 || r.mutId >= 2).length;
            if (rareHits > 0) {
                showToast(`x${count} Çekim Tamamlandı! ${rareHits} nadir/mutasyonlu plak yakalandı.`, 'success');
            }
        }

        if (best.autoSold && state.inventory.length >= getMaxInventory() && AUTOSELL_MODES[state.settings.autoSellIdx].maxTier < best.song.tier) {
            showToast('Envanter dolu! Yeni plak otomatik satıldı.', 'warn');
        }

        saveState();
        renderAllDynamicUI();

        isRolling = false;
        updateRollButtonsUI();

        if (isAutoRolling) {
            autoRollTimer = setTimeout(() => {
                if (isAutoRolling) performRoll(getMultiRollCount());
            }, state.settings.quickRoll ? 160 : 420);
        }
    }

    // ------------------------------------------------------------------------
    // 9. SAHNE & MEDYA (ALBÜM KAPAĞI + 30SN ÖNİZLEME + SPOTIFY EMBED)
    // ------------------------------------------------------------------------
    function displayOnStage(song, mutId = 0, isNew = false, autoFetchMedia = true) {
        const tier = TIERS[song.tier];
        const mut = MUTATIONS[mutId];
        const combinedOdds = tier.odds * mut.odds;
        const valSC = getSongValueSC(song, mutId);

        currentStageEntry = { song, mutId, isNew };

        // Tema aura rengini güncelle
        document.documentElement.style.setProperty('--aura-color', tier.color);
        document.documentElement.style.setProperty('--aura-glow', tier.glow);

        const auraRing = document.getElementById('stage-aura-ring');
        auraRing.style.background = `radial-gradient(circle, ${tier.color}, transparent 70%)`;

        // Plak mutasyon görünümü
        const vinyl = document.getElementById('vinyl-disc');
        vinyl.className = `vinyl-disc ${mut.vinylClass} relative w-52 h-52 sm:w-60 sm:h-60 rounded-full flex items-center justify-center border border-white/15`;
        if (isPreviewPlaying) vinyl.classList.add('playing');

        // Rozetler
        const tierBadge = document.getElementById('stage-tier-badge');
        tierBadge.className = `px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold uppercase tracking-wider border ${tier.badge}`;
        tierBadge.textContent = `${tier.name} • ${tier.tr}`;

        const mutBadge = document.getElementById('stage-mutation-badge');
        if (mutId > 0) {
            mutBadge.className = `px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold uppercase tracking-wider ${mut.badgeClass}`;
            mutBadge.textContent = `✦ ${mut.name}`;
            mutBadge.classList.remove('hidden');
        } else {
            mutBadge.classList.add('hidden');
        }

        document.getElementById('stage-odds-badge').textContent = formatOdds(combinedOdds);

        // Başlık & Sanatçı
        const titleEl = document.getElementById('stage-title');
        titleEl.className = `font-display font-black text-xl sm:text-2xl truncate max-w-[340px] ${mut.textClass || (song.tier === 8 ? 'text-rainbow' : 'text-white')}`;
        titleEl.textContent = song.title;
        titleEl.title = song.title;

        const newTag = document.getElementById('stage-new-tag');
        newTag.classList.toggle('hidden', !isNew);

        const artistEl = document.getElementById('stage-artist');
        artistEl.textContent = song.artist;
        artistEl.title = song.artist;

        document.getElementById('stage-streams').innerHTML =
            `<i class="fa-solid fa-headphones text-emerald-400 mr-1"></i>${formatStreams(song.streams)} dinlenme`;
        document.getElementById('stage-genre').innerHTML =
            `<i class="fa-solid fa-music text-purple-400 mr-1"></i>${escapeHtml(song.genre)}`;
        document.getElementById('stage-value').innerHTML =
            `<i class="fa-solid fa-coins mr-1"></i>${formatCoins(valSC)}`;

        // Spotify Link & Embed
        const isValidSpotifyId = /^[A-Za-z0-9]{22}$/.test(song.id);
        const spotifyUrl = isValidSpotifyId
            ? `https://open.spotify.com/track/${song.id}`
            : `https://open.spotify.com/search/${encodeURIComponent(song.artist + ' ' + song.title)}`;
        const openBtn = document.getElementById('btn-open-spotify');
        openBtn.href = spotifyUrl;
        openBtn.classList.remove('pointer-events-none', 'opacity-40');

        const embedBtn = document.getElementById('btn-embed-toggle');
        embedBtn.disabled = !isValidSpotifyId;
        if (embedVisible && isValidSpotifyId) {
            document.getElementById('spotify-embed-frame').src =
                `https://open.spotify.com/embed/track/${song.id}?utm_source=generator&theme=0`;
        } else if (!isValidSpotifyId) {
            embedVisible = false;
            document.getElementById('spotify-embed-wrap').classList.add('hidden');
        }

        // Önce mevcut önizlemeyi durdur
        stopPreviewAudio();

        // Kapağı sıfırla ve iTunes API'den çek
        const coverImg = document.getElementById('stage-cover');
        const coverFallback = document.getElementById('stage-cover-fallback');
        coverImg.classList.add('hidden');
        coverFallback.classList.remove('hidden');

        if (autoFetchMedia) {
            fetchTrackMedia(song, song.tier >= 5 && state.settings.autoplay);
        }
    }

    async function fetchTrackMedia(song, autoPlay = false) {
        const token = ++mediaRequestToken;
        const playBtn = document.getElementById('btn-play-preview');
        const playLabel = document.getElementById('play-label');
        playBtn.disabled = true;
        playLabel.textContent = 'Aranıyor...';

        const cacheKey = song.id;
        let media = mediaCache.get(cacheKey);

        if (!media) {
            try {
                const primaryArtist = song.artist.split(',')[0].trim();
                const term = encodeURIComponent(`${primaryArtist} ${song.title}`);
                const res = await fetch(`https://itunes.apple.com/search?term=${term}&media=music&entity=song&limit=1`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.results && data.results.length > 0) {
                        const hit = data.results[0];
                        media = {
                            cover: hit.artworkUrl100 ? hit.artworkUrl100.replace('100x100bb', '600x600bb') : null,
                            previewUrl: hit.previewUrl || null
                        };
                    }
                }
            } catch (_) {
                // Ağ yoksa sessizce devam et
            }
            if (!media) media = { cover: null, previewUrl: null };
            mediaCache.set(cacheKey, media);
        }

        if (token !== mediaRequestToken) return; // Daha yeni şarkı seçildi

        const coverImg = document.getElementById('stage-cover');
        const coverFallback = document.getElementById('stage-cover-fallback');
        if (media.cover) {
            coverImg.src = media.cover;
            coverImg.classList.remove('hidden');
            coverFallback.classList.add('hidden');
            // Cutscene açıksa onun kapağını da güncelle
            const cutCover = document.getElementById('cutscene-cover');
            const cutIcon = document.getElementById('cutscene-cover-icon');
            if (!document.getElementById('cutscene-overlay').classList.contains('hidden')) {
                cutCover.src = media.cover;
                cutCover.classList.remove('hidden');
                cutIcon.classList.add('hidden');
            }
        }

        const audio = document.getElementById('preview-audio');
        if (media.previewUrl) {
            audio.src = media.previewUrl;
            audio.volume = (state.settings.volume || 65) / 100;
            playBtn.disabled = false;
            playLabel.textContent = '30sn Dinle';
            if (autoPlay) {
                togglePreviewAudio();
            }
        } else {
            audio.removeAttribute('src');
            playBtn.disabled = true;
            playLabel.textContent = 'Önizleme Yok';
        }
    }

    function togglePreviewAudio() {
        const audio = document.getElementById('preview-audio');
        if (!audio.src) return;
        if (isPreviewPlaying) {
            stopPreviewAudio();
        } else {
            audio.volume = (state.settings.volume || 65) / 100;
            audio.play().then(() => {
                isPreviewPlaying = true;
                document.getElementById('play-icon').className = 'fa-solid fa-pause text-emerald-400';
                document.getElementById('play-label').textContent = 'Duraklat';
                document.getElementById('vinyl-disc').classList.add('playing');
                document.getElementById('tonearm').classList.add('engaged');
                document.getElementById('eq-bars').classList.add('eq-active');
            }).catch(() => {});
        }
    }

    function stopPreviewAudio() {
        const audio = document.getElementById('preview-audio');
        audio.pause();
        isPreviewPlaying = false;
        document.getElementById('play-icon').className = 'fa-solid fa-play text-emerald-400';
        const lbl = document.getElementById('play-label');
        if (lbl.textContent === 'Duraklat') lbl.textContent = '30sn Dinle';
        document.getElementById('vinyl-disc').classList.remove('playing');
        document.getElementById('eq-bars').classList.remove('eq-active');
    }

    // ------------------------------------------------------------------------
    // 10. SİNEMATİK CUTSCENE
    // ------------------------------------------------------------------------
    function showCutscene(result) {
        const { song, mutId, combinedOdds } = result;
        const tier = TIERS[song.tier];
        const mut = MUTATIONS[mutId];

        const overlay = document.getElementById('cutscene-overlay');
        document.getElementById('cutscene-bg-glow').style.background =
            `radial-gradient(circle at center, ${tier.color}66 0%, transparent 65%)`;
        document.getElementById('cutscene-star').style.background =
            `conic-gradient(from 0deg, transparent, ${tier.color}, transparent, #ffffff, transparent)`;

        const label = document.getElementById('cutscene-tier-label');
        label.className = `font-mono font-black text-sm tracking-[0.28em] uppercase mb-4 px-4 py-1.5 rounded-full border ${tier.badge}`;
        label.textContent = `${mutId > 0 ? mut.name.toUpperCase() + ' ' : ''}${tier.name.toUpperCase()} ÇEKİM!`;

        const vinyl = document.getElementById('cutscene-vinyl');
        vinyl.className = `w-44 h-44 rounded-full vinyl-disc playing flex items-center justify-center mb-5 border-2 border-white/30 ${mut.vinylClass}`;

        const cached = mediaCache.get(song.id);
        const cutCover = document.getElementById('cutscene-cover');
        const cutIcon = document.getElementById('cutscene-cover-icon');
        if (cached && cached.cover) {
            cutCover.src = cached.cover;
            cutCover.classList.remove('hidden');
            cutIcon.classList.add('hidden');
        } else {
            cutCover.classList.add('hidden');
            cutIcon.classList.remove('hidden');
        }

        const titleEl = document.getElementById('cutscene-title');
        titleEl.className = `font-display font-black text-3xl sm:text-5xl tracking-tight mb-1 ${mut.textClass || (song.tier === 8 ? 'text-rainbow' : 'text-white')}`;
        titleEl.textContent = song.title;

        document.getElementById('cutscene-artist').textContent = song.artist;
        document.getElementById('cutscene-streams').textContent = `🎧 ${formatStreams(song.streams)} dinlenme`;
        document.getElementById('cutscene-odds').textContent = `🎲 ${formatOdds(combinedOdds)}`;

        overlay.classList.remove('hidden');
    }

    // ------------------------------------------------------------------------
    // 11. BİYOM / STÜDYO MODU ZAMANLAYICI
    // ------------------------------------------------------------------------
    function updateBiomeLoop() {
        const now = Date.now();
        if (now >= biomeEndTime) {
            // Yeni rastgele biyom seç (ağırlıklı)
            const r = Math.random();
            if (r < 0.35) currentBiomeIdx = 0;
            else if (r < 0.62) currentBiomeIdx = 1;
            else if (r < 0.80) currentBiomeIdx = 2;
            else if (r < 0.92) currentBiomeIdx = 3;
            else currentBiomeIdx = 4;

            biomeEndTime = now + 180000;
            const b = BIOMES[currentBiomeIdx];
            showToast(`${b.icon} Yeni Stüdyo Modu: ${b.name} (${b.desc})`, 'info');
            renderHeaderStats();
        }

        const b = BIOMES[currentBiomeIdx];
        const rem = Math.max(0, Math.floor((biomeEndTime - now) / 1000));
        const mm = String(Math.floor(rem / 60)).padStart(2, '0');
        const ss = String(rem % 60).padStart(2, '0');
        document.getElementById('biome-icon').textContent = b.icon;
        document.getElementById('biome-name').textContent = b.name;
        document.getElementById('biome-name').style.color = b.color;
        document.getElementById('biome-desc').textContent = b.desc;
        document.getElementById('biome-timer').textContent = `${mm}:${ss}`;

        // Aktif iksir sayaçlarını güncelle
        const prevCount = state.activeBuffs.length;
        pruneExpiredBuffs();
        if (prevCount > 0) {
            renderActiveBuffs();
            if (state.activeBuffs.length !== prevCount) renderHeaderStats();
        }
    }

    // ------------------------------------------------------------------------
    // 12. ARAYÜZ RENDER FONKSİYONLARI
    // ------------------------------------------------------------------------
    function renderAllDynamicUI() {
        renderHeaderStats();
        renderPityAndControls();
        renderActiveBuffs();
        renderRecentRolls();
        renderInventory();
        renderShop();
        renderCraftAndPotions();
        renderQuestsAndStats();
        updateCodexHeader();
    }

    function renderHeaderStats() {
        const { totalLuck } = getStatsMultipliers();
        document.getElementById('stat-coins').textContent = formatCoins(state.coins);
        document.getElementById('stat-luck').textContent = `${totalLuck.toFixed(2)}x`;
        document.getElementById('stat-rolls').textContent = formatNumber(state.totalRolls);
        document.getElementById('stat-discovered').textContent = formatNumber(discoveredSet.size);
        document.getElementById('tab-inv-count').textContent = `${state.inventory.length}/${getMaxInventory()}`;

        const bestEl = document.getElementById('best-roll-pill');
        bestEl.textContent = state.bestOdds > 0
            ? `En İyi: ${state.bestLabel} (${formatOdds(state.bestOdds)})`
            : 'En İyi: —';
    }

    function renderPityAndControls() {
        document.getElementById('pity-badge').textContent = `${state.pityCount}/10`;
        document.getElementById('mega-pity-text').textContent = `Mega Pity: ${state.megaPityCount}/100`;
        document.getElementById('pity-bar').style.width = `${(state.pityCount / 10) * 100}%`;

        const multi = getMultiRollCount();
        document.getElementById('multi-roll-label').textContent = `x${multi} Çekim`;
        document.getElementById('multi-roll-sub').textContent = multi > 1 ? 'Toplu Çek' : 'Mağazadan Aç';

        document.getElementById('autoroll-label').textContent = `Oto: ${isAutoRolling ? 'AÇIK' : 'KAPALI'}`;
        const autoBtn = document.getElementById('btn-autoroll');
        autoBtn.classList.toggle('border-emerald-500/60', isAutoRolling);
        autoBtn.classList.toggle('bg-emerald-500/15', isAutoRolling);

        document.getElementById('quickroll-label').textContent = `Hızlı: ${state.settings.quickRoll ? 'AÇIK' : 'KAPALI'}`;
        const quickBtn = document.getElementById('btn-quickroll');
        quickBtn.classList.toggle('border-sky-500/60', state.settings.quickRoll);
        quickBtn.classList.toggle('bg-sky-500/15', state.settings.quickRoll);

        const autoSell = AUTOSELL_MODES[state.settings.autoSellIdx || 0];
        document.getElementById('autosell-label').textContent = `OtoSat: ${autoSell.label}`;
    }

    function updateRollButtonsUI() {
        const rollBtn = document.getElementById('btn-roll');
        const multiBtn = document.getElementById('btn-multi-roll');
        rollBtn.disabled = isRolling;
        multiBtn.disabled = isRolling;
        document.getElementById('roll-btn-text').textContent = isRolling ? 'ÇEKİLİYOR...' : 'SHUFFLE ÇEK';
    }

    function renderActiveBuffs() {
        const wrap = document.getElementById('active-buffs-bar');
        pruneExpiredBuffs();
        if (state.activeBuffs.length === 0) {
            wrap.classList.add('hidden');
            wrap.innerHTML = '';
            return;
        }
        wrap.classList.remove('hidden');
        const now = Date.now();
        wrap.innerHTML = state.activeBuffs.map(b => {
            const remText = b.type === 'duration'
                ? `${Math.max(0, Math.ceil((b.endsAt - now) / 1000))}sn`
                : `${b.rollsLeft} çekim`;
            return `<span class="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/35 text-[11px] font-mono text-emerald-200 flex items-center gap-1.5">
                <span>${b.icon}</span>
                <span class="font-bold">${escapeHtml(b.name)}</span>
                <span class="text-emerald-400">${remText}</span>
            </span>`;
        }).join('');
    }

    function renderRecentRolls() {
        const list = document.getElementById('recent-rolls-list');
        if (!state.recentRolls.length) return;
        list.innerHTML = state.recentRolls.slice(0, 15).map(r => {
            const song = ALL_SONGS[r.songIdx];
            if (!song) return '';
            const tier = TIERS[song.tier];
            const mut = MUTATIONS[r.mutId];
            return `
            <div data-preview-idx="${song.idx}" data-preview-mut="${r.mutId}" class="recent-item cursor-pointer flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] transition text-xs">
                <div class="flex items-center gap-2 min-w-0">
                    <span class="w-2 h-2 rounded-full shrink-0" style="background:${tier.color}; box-shadow: 0 0 8px ${tier.color};"></span>
                    <div class="truncate">
                        ${r.mutId > 0 ? `<span class="font-mono font-bold text-[10px] px-1 rounded ${mut.badgeClass} mr-1">${mut.name}</span>` : ''}
                        <span class="font-semibold text-white">${escapeHtml(song.title)}</span>
                        <span class="text-slate-400"> — ${escapeHtml(song.artist)}</span>
                    </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                    ${r.isNew ? '<span class="px-1 rounded bg-emerald-500/25 text-emerald-300 font-bold">YENİ</span>' : ''}
                    ${r.autoSold ? '<span class="text-amber-400/80" title="Otomatik satıldı">SC+</span>' : ''}
                    <span class="text-slate-400">${formatStreams(song.streams)}</span>
                </div>
            </div>`;
        }).join('');
    }

    function renderInventory() {
        const grid = document.getElementById('inventory-grid');
        const q = (document.getElementById('inv-search').value || '').trim().toLowerCase();
        const sortBy = document.getElementById('inv-sort').value;

        let items = state.inventory.map(item => {
            const song = ALL_SONGS[item.songIdx];
            const odds = TIERS[song.tier].odds * MUTATIONS[item.mutId].odds;
            const value = getSongValueSC(song, item.mutId);
            return { item, song, odds, value };
        });

        if (q) {
            items = items.filter(x => x.song.searchKey.includes(q) || MUTATIONS[x.item.mutId].name.toLowerCase().includes(q));
        }

        if (sortBy === 'rarity') items.sort((a, b) => b.odds - a.odds || b.song.streams - a.song.streams);
        else if (sortBy === 'streams') items.sort((a, b) => b.song.streams - a.song.streams);
        else if (sortBy === 'value') items.sort((a, b) => b.value - a.value);
        else items.sort((a, b) => b.item.rolledAt - a.item.rolledAt);

        if (items.length === 0) {
            grid.innerHTML = `<div class="col-span-full text-center py-12 text-slate-500 text-sm">
                <i class="fa-solid fa-record-vinyl text-3xl mb-2 opacity-40 block"></i>
                ${q ? 'Aramana uygun plak bulunamadı.' : 'Envanterin boş. Plak çekmeye başla!'}
            </div>`;
            return;
        }

        grid.innerHTML = items.slice(0, 160).map(({ item, song, odds, value }) => {
            const tier = TIERS[song.tier];
            const mut = MUTATIONS[item.mutId];
            const isEquipped = state.equippedUid === item.uid;
            return `
            <div class="glass-sub rounded-xl p-3 flex flex-col gap-2 hover:border-white/20 transition ${item.mutId >= 4 || song.tier >= 6 ? 'card-sheen' : ''}" style="border-left: 3px solid ${tier.color};">
                <div class="flex items-start justify-between gap-2">
                    <div class="flex items-center gap-2.5 min-w-0 cursor-pointer inv-preview-btn" data-uid="${item.uid}">
                        <div class="w-10 h-10 rounded-full shrink-0 ${mut.vinylClass} border border-white/20 flex items-center justify-center">
                            <div class="w-3.5 h-3.5 rounded-full bg-[#090b10] border border-white/30"></div>
                        </div>
                        <div class="min-w-0">
                            <div class="font-bold text-sm truncate ${mut.textClass || (song.tier === 8 ? 'text-rainbow' : 'text-white')}">${escapeHtml(song.title)}</div>
                            <div class="text-xs text-slate-400 truncate">${escapeHtml(song.artist)}</div>
                        </div>
                    </div>
                    <button class="inv-lock-btn w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs shrink-0 ${item.locked ? 'text-amber-400' : 'text-slate-500'}" data-uid="${item.uid}" title="Kilitle / Kilidi Aç">
                        <i class="fa-solid ${item.locked ? 'fa-lock' : 'fa-lock-open'}"></i>
                    </button>
                </div>

                <div class="flex items-center justify-between gap-1 flex-wrap text-[11px] font-mono">
                    <div class="flex items-center gap-1 flex-wrap">
                        <span class="px-1.5 py-0.5 rounded border ${tier.badge}">${tier.name}</span>
                        ${item.mutId > 0 ? `<span class="px-1.5 py-0.5 rounded ${mut.badgeClass}">✦ ${mut.name}</span>` : ''}
                    </div>
                    <span class="text-slate-400">${formatStreams(song.streams)} • ${formatOdds(odds)}</span>
                </div>

                <div class="flex items-center justify-between gap-1.5 pt-1 border-t border-white/5">
                    <button class="inv-equip-btn flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition ${isEquipped ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40' : 'bg-white/5 hover:bg-white/10 text-slate-300'}" data-uid="${item.uid}">
                        <i class="fa-solid ${isEquipped ? 'fa-check' : 'fa-headphones'} mr-1"></i>${isEquipped ? 'Sahnede' : 'Sahneye Al'}
                    </button>
                    <button class="inv-sell-btn px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 disabled:opacity-35 border border-amber-500/30 text-[11px] font-mono font-bold text-amber-300 transition" data-uid="${item.uid}" ${item.locked ? 'disabled title="Kilitli plak satılamaz"' : ''}>
                        Sat (+${formatCoins(value).replace(' SC', '')})
                    </button>
                </div>
            </div>`;
        }).join('');
    }

    function renderShop() {
        const upgGrid = document.getElementById('shop-upgrades-grid');
        upgGrid.innerHTML = UPGRADES.map(upg => {
            const lvl = state.upgrades[upg.id] || 0;
            const isMax = lvl >= upg.max;
            const cost = getUpgradeCost(upg);
            const canAfford = !isMax && state.coins >= cost;
            return `
            <div class="glass-sub rounded-xl p-3.5 flex flex-col justify-between gap-3">
                <div>
                    <div class="flex items-center justify-between mb-1">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${upg.color}">
                                <i class="fa-solid ${upg.icon}"></i>
                            </div>
                            <h4 class="font-bold text-sm text-white">${upg.name}</h4>
                        </div>
                        <span class="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300">Sv. ${lvl}/${upg.max}</span>
                    </div>
                    <p class="text-xs text-slate-400 mt-1">${upg.desc}</p>
                    <div class="text-xs font-mono text-emerald-300 mt-2">Mevcut: ${upg.effectText(lvl)}</div>
                </div>
                <button class="shop-upg-btn w-full py-2 rounded-xl text-xs font-bold font-mono transition ${isMax ? 'bg-white/5 text-slate-500 cursor-default' : canAfford ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' : 'bg-white/5 text-slate-400 opacity-60 cursor-not-allowed'}" data-upg="${upg.id}" ${!canAfford ? 'disabled' : ''}>
                    ${isMax ? 'MAKSİMUM SEVİYE' : `Yükselt • ${formatCoins(cost)}`}
                </button>
            </div>`;
        }).join('');

        const potGrid = document.getElementById('shop-potions-grid');
        potGrid.innerHTML = POTIONS.map(p => {
            const owned = state.potions[p.id] || 0;
            const canAfford = state.coins >= p.cost;
            return `
            <div class="rounded-xl p-3.5 border ${p.color} flex flex-col justify-between gap-3">
                <div>
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-sm text-white">${p.icon} ${p.name}</span>
                        <span class="text-xs font-mono px-2 py-0.5 rounded bg-black/40 text-slate-200">Çanta: ${owned}</span>
                    </div>
                    <p class="text-xs text-slate-300/80 mt-1.5">${p.desc}</p>
                </div>
                <div class="flex gap-2">
                    <button class="buy-potion-btn flex-1 py-2 rounded-xl text-xs font-bold font-mono transition ${canAfford ? 'bg-white/15 hover:bg-white/25 text-white' : 'bg-white/5 text-slate-500 cursor-not-allowed'}" data-potion="${p.id}" ${!canAfford ? 'disabled' : ''}>
                        Satın Al • ${formatCoins(p.cost)}
                    </button>
                    ${owned > 0 ? `<button class="use-potion-btn px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold" data-potion="${p.id}">Kullan</button>` : ''}
                </div>
            </div>`;
        }).join('');
    }

    function renderCraftAndPotions() {
        const bag = document.getElementById('potion-bag-grid');
        bag.innerHTML = POTIONS.map(p => {
            const owned = state.potions[p.id] || 0;
            return `
            <div class="rounded-xl p-3 border ${p.color} flex flex-col justify-between gap-2">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-bold text-white">${p.icon} ${p.name}</span>
                    <span class="font-mono text-xs font-extrabold text-emerald-300">x${owned}</span>
                </div>
                <p class="text-[11px] text-slate-300/80">${p.desc}</p>
                <button class="use-potion-btn w-full py-1.5 rounded-lg text-xs font-bold transition ${owned > 0 ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' : 'bg-white/5 text-slate-500 cursor-not-allowed'}" data-potion="${p.id}" ${owned <= 0 ? 'disabled' : ''}>
                    ${owned > 0 ? 'Aktif Et' : 'Stokta Yok'}
                </button>
            </div>`;
        }).join('');

        const gearGrid = document.getElementById('gear-craft-grid');
        gearGrid.innerHTML = GEARS.map(g => {
            const owned = state.craftedGears.includes(g.id);
            const haveRolls = countTierOrAbove(state, g.reqTier);
            const metRolls = haveRolls >= g.reqCount;
            const metCoins = state.coins >= g.costSC;
            const canCraft = !owned && metRolls && metCoins;
            return `
            <div class="glass-sub rounded-xl p-3.5 flex flex-col justify-between gap-3 ${owned ? 'border-emerald-500/40 bg-emerald-500/5' : ''}">
                <div>
                    <div class="flex items-center justify-between">
                        <h4 class="font-bold text-sm text-white">${g.icon} ${g.name}</h4>
                        ${owned ? '<span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">AKTİF</span>' : ''}
                    </div>
                    <p class="text-xs text-slate-400 mt-1">${g.desc}</p>
                    ${!owned ? `
                    <div class="mt-2.5 space-y-1 text-[11px] font-mono">
                        <div class="${metRolls ? 'text-emerald-400' : 'text-slate-400'}">
                            <i class="fa-solid ${metRolls ? 'fa-check' : 'fa-circle-dot'} mr-1"></i>${g.reqLabel}: ${Math.min(haveRolls, g.reqCount)}/${g.reqCount}
                        </div>
                        <div class="${metCoins ? 'text-amber-300' : 'text-slate-400'}">
                            <i class="fa-solid fa-coins mr-1"></i>Üretim Bedeli: ${formatCoins(g.costSC)}
                        </div>
                    </div>` : ''}
                </div>
                <button class="craft-gear-btn w-full py-2 rounded-xl text-xs font-bold font-mono transition ${owned ? 'bg-emerald-500/15 text-emerald-300 cursor-default' : canCraft ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-white/5 text-slate-500 cursor-not-allowed'}" data-gear="${g.id}" ${!canCraft ? 'disabled' : ''}>
                    ${owned ? 'ÜRETİLDİ & KUŞANILDI' : 'EKİPMANI ÜRET'}
                </button>
            </div>`;
        }).join('');
    }

    function renderQuestsAndStats() {
        let claimableCount = 0;
        const qList = document.getElementById('quests-list');
        qList.innerHTML = QUESTS.map(q => {
            const claimed = state.claimedQuests.includes(q.id);
            const val = Math.min(q.target, q.metric(state));
            const pct = Math.min(100, Math.round((val / q.target) * 100));
            const done = val >= q.target;
            if (done && !claimed) claimableCount++;

            const potObj = q.rewardPotion ? POTIONS.find(p => p.id === q.rewardPotion) : null;
            return `
            <div class="glass-sub rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${done && !claimed ? 'border-amber-400/50 bg-amber-500/5' : ''}">
                <div class="flex-1">
                    <div class="flex items-center gap-2">
                        <span class="font-bold text-sm text-white">${q.title}</span>
                        <span class="text-[11px] font-mono text-slate-400">${formatNumber(val)} / ${formatNumber(q.target)}</span>
                    </div>
                    <p class="text-xs text-slate-400 mt-0.5">${q.desc}</p>
                    <div class="w-full h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-emerald-400 to-amber-400" style="width:${pct}%"></div>
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <div class="text-right text-[11px] font-mono text-amber-300">
                        <div>+${formatCoins(q.rewardSC)}</div>
                        ${potObj ? `<div class="text-emerald-300">+1 ${potObj.icon} ${potObj.name.split(' ')[0]}</div>` : ''}
                    </div>
                    <button class="claim-quest-btn px-3 py-2 rounded-xl text-xs font-bold transition ${claimed ? 'bg-white/5 text-slate-500 cursor-default' : done ? 'bg-amber-400 hover:bg-amber-300 text-slate-950' : 'bg-white/5 text-slate-500 cursor-not-allowed'}" data-quest="${q.id}" ${(!done || claimed) ? 'disabled' : ''}>
                        ${claimed ? 'Alındı' : done ? 'Ödülü Al' : `%${pct}`}
                    </button>
                </div>
            </div>`;
        }).join('');

        document.getElementById('tab-quest-dot').classList.toggle('hidden', claimableCount === 0);

        // Detaylı İstatistikler
        const statsGrid = document.getElementById('detailed-stats-grid');
        const discoveryPct = ((discoveredSet.size / ALL_SONGS.length) * 100).toFixed(2);
        const statCards = [
            { label: 'Toplam Şarkı Havuzu', val: formatNumber(ALL_SONGS.length), color: 'text-emerald-300' },
            { label: 'Keşfedilen Şarkı', val: `${formatNumber(discoveredSet.size)} (%${discoveryPct})`, color: 'text-purple-300' },
            { label: 'Toplam Çekim', val: formatNumber(state.totalRolls), color: 'text-sky-300' },
            { label: 'Toplam Mutasyon', val: formatNumber(state.totalMutations), color: 'text-pink-300' },
            { label: 'Kazanılan Toplam SC', val: formatCoins(state.totalCoinsEarned), color: 'text-amber-300' },
            { label: 'En Nadir Çekim', val: state.bestOdds > 0 ? formatOdds(state.bestOdds) : '—', color: 'text-yellow-300' }
        ];
        statsGrid.innerHTML = statCards.map(c => `
            <div class="glass-sub rounded-xl p-3">
                <div class="text-[11px] text-slate-400">${c.label}</div>
                <div class="font-mono font-extrabold text-sm mt-1 ${c.color}">${c.val}</div>
            </div>
        `).join('');

        // Oran Tablosu
        const oddsWrap = document.getElementById('odds-table-wrap');
        oddsWrap.innerHTML = `
            <div class="glass-sub rounded-xl p-3 space-y-1.5">
                <div class="text-xs font-bold text-slate-300 mb-2">Şarkı Nadirlik Katmanları</div>
                ${TIERS.map(t => `
                    <div class="flex items-center justify-between text-xs font-mono">
                        <span class="flex items-center gap-1.5">
                            <span class="w-2 h-2 rounded-full" style="background:${t.color}"></span>
                            <span style="color:${t.color}">${t.name}</span>
                            <span class="text-slate-500">(${formatNumber(SONGS_BY_TIER[t.id].length)})</span>
                        </span>
                        <span class="text-slate-300">${formatOdds(t.odds)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="glass-sub rounded-xl p-3 space-y-1.5">
                <div class="text-xs font-bold text-slate-300 mb-2">Plak Mutasyonları</div>
                ${MUTATIONS.slice(1).map(m => `
                    <div class="flex items-center justify-between text-xs font-mono">
                        <span class="px-1.5 py-0.5 rounded ${m.badgeClass}">✦ ${m.name}</span>
                        <span class="text-slate-300">${formatOdds(m.odds)} <span class="text-amber-300">(${m.valMult}x SC)</span></span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ------------------------------------------------------------------------
    // 13. 57.531 ŞARKILIK KATALOG (CODEX) — ANINDA ARAMA & SAYFALAMA
    // ------------------------------------------------------------------------
    function updateCodexHeader() {
        document.getElementById('codex-progress-badge').textContent =
            `${formatNumber(discoveredSet.size)} / ${formatNumber(ALL_SONGS.length)}`;

        const pills = document.getElementById('codex-tier-pills');
        const activeTier = document.getElementById('codex-tier-filter').value;
        pills.innerHTML = TIERS.slice().reverse().map(t => {
            const count = SONGS_BY_TIER[t.id].length;
            const isActive = activeTier === String(t.id);
            return `<button class="codex-tier-pill shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-mono border transition ${isActive ? 'ring-1 ring-white ' + t.badge : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}" data-tier="${t.id}">
                <span class="inline-block w-2 h-2 rounded-full mr-1" style="background:${t.color}"></span>${t.name}: ${formatNumber(count)}
            </button>`;
        }).join('');
    }

    function applyCodexFilters(resetPage = true) {
        const q = (document.getElementById('codex-search').value || '').trim().toLowerCase();
        const tierVal = document.getElementById('codex-tier-filter').value;
        const genreVal = document.getElementById('codex-genre-filter').value;
        const statusVal = document.getElementById('codex-status-filter').value;

        let sourceIndices;
        if (tierVal !== 'all') {
            sourceIndices = SONGS_BY_TIER[Number(tierVal)];
        } else {
            sourceIndices = null; // Tümü
        }

        const matched = [];
        const len = sourceIndices ? sourceIndices.length : ALL_SONGS.length;
        for (let i = 0; i < len; i++) {
            const song = sourceIndices ? ALL_SONGS[sourceIndices[i]] : ALL_SONGS[i];
            if (genreVal !== 'all' && song.genre !== genreVal) continue;
            if (statusVal === 'discovered' && !discoveredSet.has(song.idx)) continue;
            if (statusVal === 'undiscovered' && discoveredSet.has(song.idx)) continue;
            if (q && !song.searchKey.includes(q)) continue;
            matched.push(song.idx);
        }

        codexFiltered = matched;
        if (resetPage) codexPage = 1;
        renderCodexPage();
        updateCodexHeader();
    }

    function renderCodexPage() {
        const list = document.getElementById('codex-list');
        const total = codexFiltered.length;
        const totalPages = Math.max(1, Math.ceil(total / CODEX_PAGE_SIZE));
        if (codexPage > totalPages) codexPage = totalPages;

        const start = (codexPage - 1) * CODEX_PAGE_SIZE;
        const end = Math.min(total, start + CODEX_PAGE_SIZE);

        document.getElementById('codex-result-info').textContent = `${formatNumber(total)} şarkı listeleniyor`;
        document.getElementById('codex-page-info').textContent = `${codexPage} / ${formatNumber(totalPages)}`;
        document.getElementById('codex-prev').disabled = codexPage <= 1;
        document.getElementById('codex-next').disabled = codexPage >= totalPages;

        if (total === 0) {
            list.innerHTML = `<div class="text-center py-12 text-slate-500 text-sm">Filtrene uygun şarkı bulunamadı.</div>`;
            return;
        }

        let html = '';
        for (let i = start; i < end; i++) {
            const song = ALL_SONGS[codexFiltered[i]];
            const tier = TIERS[song.tier];
            const isDisc = discoveredSet.has(song.idx);
            html += `
            <div class="codex-row cursor-pointer flex items-center justify-between gap-2 px-3 py-2 rounded-xl border transition ${isDisc ? 'bg-emerald-500/[0.06] border-emerald-500/25 hover:bg-emerald-500/[0.12]' : 'bg-white/[0.025] border-white/[0.06] hover:bg-white/[0.06]'}" data-codex-idx="${song.idx}">
                <div class="flex items-center gap-2.5 min-w-0">
                    <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background:${tier.color}; box-shadow:0 0 8px ${tier.color};"></span>
                    <div class="min-w-0">
                        <div class="flex items-center gap-1.5">
                            <span class="font-semibold text-xs sm:text-sm text-white truncate">${escapeHtml(song.title)}</span>
                            ${isDisc ? '<i class="fa-solid fa-circle-check text-emerald-400 text-[11px] shrink-0" title="Keşfedildi"></i>' : ''}
                        </div>
                        <div class="text-[11px] text-slate-400 truncate">${escapeHtml(song.artist)} • <span class="text-slate-500">${escapeHtml(song.genre)}</span></div>
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                    <span class="hidden sm:inline px-1.5 py-0.5 rounded border ${tier.badge}">${tier.name}</span>
                    <span class="text-slate-300 w-16 text-right">${formatStreams(song.streams)}</span>
                    <i class="fa-solid fa-play text-emerald-400/70 text-[10px]"></i>
                </div>
            </div>`;
        }
        list.innerHTML = html;
        list.scrollTop = 0;
    }

    // ------------------------------------------------------------------------
    // 14. OTO-ÇEKİM & TOAST BİLDİRİMLERİ
    // ------------------------------------------------------------------------
    function toggleAutoRoll(forceState = null) {
        isAutoRolling = forceState !== null ? forceState : !isAutoRolling;
        if (autoRollTimer) {
            clearTimeout(autoRollTimer);
            autoRollTimer = null;
        }
        renderPityAndControls();
        if (isAutoRolling && !isRolling) {
            performRoll(getMultiRollCount());
        }
    }

    function showToast(msg, type = 'info') {
        const container = document.getElementById('toast-container');
        const colors = {
            info: 'border-sky-400/40 bg-[#0f172a]/95 text-sky-200',
            success: 'border-emerald-400/50 bg-[#071c15]/95 text-emerald-200',
            warn: 'border-amber-400/50 bg-[#1f1606]/95 text-amber-200',
            error: 'border-rose-400/50 bg-[#20090f]/95 text-rose-200'
        };
        const el = document.createElement('div');
        el.className = `toast-item px-3.5 py-2.5 rounded-xl border shadow-xl text-xs font-semibold max-w-xs ${colors[type] || colors.info}`;
        el.textContent = msg;
        container.appendChild(el);
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.3s ease';
            setTimeout(() => el.remove(), 320);
        }, 3200);
    }

    // ------------------------------------------------------------------------
    // 15. ARKA PLAN PARTİKÜL KANVASI
    // ------------------------------------------------------------------------
    function initBgCanvas() {
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        let w = 0, h = 0;
        const particles = [];

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        for (let i = 0; i < 42; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: 1 + Math.random() * 2.2,
                vx: (Math.random() - 0.5) * 0.28,
                vy: -0.15 - Math.random() * 0.35,
                a: 0.12 + Math.random() * 0.35
            });
        }

        function tick() {
            ctx.clearRect(0, 0, w, h);
            const aura = getComputedStyle(document.documentElement).getPropertyValue('--aura-color').trim() || '#1db954';
            ctx.fillStyle = aura;
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
                if (p.x < -10) p.x = w + 10;
                if (p.x > w + 10) p.x = -10;
                ctx.globalAlpha = p.a;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    // ------------------------------------------------------------------------
    // 16. OLAY DİNLEYİCİLERİ (EVENT BINDINGS)
    // ------------------------------------------------------------------------
    function bindEvents() {
        // Ana Çekim Butonları
        document.getElementById('btn-roll').addEventListener('click', () => performRoll(1));
        document.getElementById('btn-multi-roll').addEventListener('click', () => {
            const m = getMultiRollCount();
            if (m <= 1) {
                switchTab('shop');
                showToast('Çoklu çekim için Mağaza’dan "Çoklu Plak Çekici" yükseltmesini aç!', 'info');
            } else {
                performRoll(m);
            }
        });

        // Klavye kısayolu (Space)
        window.addEventListener('keydown', e => {
            if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
                e.preventDefault();
                const cutscene = document.getElementById('cutscene-overlay');
                if (!cutscene.classList.contains('hidden')) {
                    cutscene.classList.add('hidden');
                    return;
                }
                performRoll(1);
            }
        });

        // Yardımcı Togglelar
        document.getElementById('btn-autoroll').addEventListener('click', () => toggleAutoRoll());
        document.getElementById('btn-quickroll').addEventListener('click', () => {
            state.settings.quickRoll = !state.settings.quickRoll;
            saveState();
            renderPityAndControls();
        });
        document.getElementById('btn-autosell-cycle').addEventListener('click', () => {
            state.settings.autoSellIdx = ((state.settings.autoSellIdx || 0) + 1) % AUTOSELL_MODES.length;
            saveState();
            renderPityAndControls();
            showToast(`Oto-Satış Filtresi: ${AUTOSELL_MODES[state.settings.autoSellIdx].label} (Mutasyonlular korunur)`, 'info');
        });

        // Önizleme & Spotify Embed
        document.getElementById('btn-play-preview').addEventListener('click', togglePreviewAudio);
        document.getElementById('preview-audio').addEventListener('ended', stopPreviewAudio);
        document.getElementById('btn-embed-toggle').addEventListener('click', () => {
            if (!currentStageEntry) return;
            const song = currentStageEntry.song;
            embedVisible = !embedVisible;
            const wrap = document.getElementById('spotify-embed-wrap');
            if (embedVisible) {
                document.getElementById('spotify-embed-frame').src =
                    `https://open.spotify.com/embed/track/${song.id}?utm_source=generator&theme=0`;
                wrap.classList.remove('hidden');
            } else {
                wrap.classList.add('hidden');
                document.getElementById('spotify-embed-frame').src = '';
            }
        });

        // Cutscene kapatma
        document.getElementById('cutscene-overlay').addEventListener('click', () => {
            document.getElementById('cutscene-overlay').classList.add('hidden');
        });

        // Sekmeler
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        // Son Çekimler tıklayınca sahnede göster
        document.getElementById('recent-rolls-list').addEventListener('click', e => {
            const row = e.target.closest('.recent-item');
            if (!row) return;
            const idx = Number(row.dataset.previewIdx);
            const mut = Number(row.dataset.previewMut || 0);
            if (ALL_SONGS[idx]) displayOnStage(ALL_SONGS[idx], mut, false, true);
        });

        // Envanter Arama, Sıralama & Toplu Satış
        document.getElementById('inv-search').addEventListener('input', renderInventory);
        document.getElementById('inv-sort').addEventListener('change', renderInventory);

        document.getElementById('btn-sell-dupes').addEventListener('click', () => {
            const seen = new Set();
            let soldCount = 0;
            let earned = 0;
            // En nadir / kilitli olanları koru
            const sorted = [...state.inventory].sort((a, b) => (b.locked ? 1 : 0) - (a.locked ? 1 : 0) || b.mutId - a.mutId);
            const kept = [];
            for (const item of sorted) {
                const key = `${item.songIdx}_${item.mutId}`;
                if (seen.has(key) && !item.locked && item.uid !== state.equippedUid) {
                    const val = getSongValueSC(ALL_SONGS[item.songIdx], item.mutId);
                    earned += val;
                    soldCount++;
                } else {
                    seen.add(key);
                    kept.push(item);
                }
            }
            if (soldCount === 0) {
                showToast('Satılacak kilitlenmemiş kopya plak yok.', 'info');
                return;
            }
            state.inventory = kept;
            state.coins += earned;
            state.totalCoinsEarned += earned;
            saveState();
            renderAllDynamicUI();
            showToast(`${soldCount} kopya plak satıldı (+${formatCoins(earned)})`, 'success');
        });

        document.getElementById('btn-sell-commons').addEventListener('click', () => {
            let soldCount = 0;
            let earned = 0;
            state.inventory = state.inventory.filter(item => {
                const song = ALL_SONGS[item.songIdx];
                if (!item.locked && item.mutId === 0 && song.tier <= 1 && item.uid !== state.equippedUid) {
                    earned += getSongValueSC(song, item.mutId);
                    soldCount++;
                    return false;
                }
                return true;
            });
            if (soldCount === 0) {
                showToast('Satılacak normal Common/Uncommon plak yok.', 'info');
                return;
            }
            state.coins += earned;
            state.totalCoinsEarned += earned;
            saveState();
            renderAllDynamicUI();
            showToast(`${soldCount} Common/Uncommon plak satıldı (+${formatCoins(earned)})`, 'success');
        });

        // Envanter Kartı Aksiyonları (Delegation)
        document.getElementById('inventory-grid').addEventListener('click', e => {
            const lockBtn = e.target.closest('.inv-lock-btn');
            if (lockBtn) {
                const item = state.inventory.find(x => x.uid === lockBtn.dataset.uid);
                if (item) {
                    item.locked = !item.locked;
                    saveState();
                    renderInventory();
                }
                return;
            }
            const equipBtn = e.target.closest('.inv-equip-btn') || e.target.closest('.inv-preview-btn');
            if (equipBtn) {
                const item = state.inventory.find(x => x.uid === equipBtn.dataset.uid);
                if (item) {
                    state.equippedUid = item.uid;
                    saveState();
                    displayOnStage(ALL_SONGS[item.songIdx], item.mutId, false, true);
                    renderInventory();
                }
                return;
            }
            const sellBtn = e.target.closest('.inv-sell-btn');
            if (sellBtn) {
                const idx = state.inventory.findIndex(x => x.uid === sellBtn.dataset.uid);
                if (idx !== -1 && !state.inventory[idx].locked) {
                    const item = state.inventory[idx];
                    const val = getSongValueSC(ALL_SONGS[item.songIdx], item.mutId);
                    if (state.equippedUid === item.uid) state.equippedUid = null;
                    state.inventory.splice(idx, 1);
                    state.coins += val;
                    state.totalCoinsEarned += val;
                    saveState();
                    renderAllDynamicUI();
                    showToast(`Plak satıldı (+${formatCoins(val)})`, 'success');
                }
            }
        });

        // Mağaza Aksiyonları
        document.getElementById('panel-shop').addEventListener('click', e => {
            const upgBtn = e.target.closest('.shop-upg-btn');
            if (upgBtn) {
                const upg = UPGRADES.find(u => u.id === upgBtn.dataset.upg);
                if (!upg) return;
                const lvl = state.upgrades[upg.id] || 0;
                const cost = getUpgradeCost(upg);
                if (lvl < upg.max && state.coins >= cost) {
                    state.coins -= cost;
                    state.upgrades[upg.id] = lvl + 1;
                    playTone(523.2, 0.14, 'triangle', 0.08, 0);
                    playTone(659.2, 0.18, 'triangle', 0.08, 0.07);
                    saveState();
                    renderAllDynamicUI();
                    showToast(`${upg.name} Sv. ${lvl + 1} oldu!`, 'success');
                }
                return;
            }

            const buyPot = e.target.closest('.buy-potion-btn');
            if (buyPot) {
                const p = POTIONS.find(x => x.id === buyPot.dataset.potion);
                if (p && state.coins >= p.cost) {
                    state.coins -= p.cost;
                    state.potions[p.id] = (state.potions[p.id] || 0) + 1;
                    saveState();
                    renderAllDynamicUI();
                    showToast(`${p.icon} ${p.name} satın alındı!`, 'success');
                }
                return;
            }

            const usePot = e.target.closest('.use-potion-btn');
            if (usePot) activatePotion(usePot.dataset.potion);
        });

        // Üretim & İksir Çantası Aksiyonları
        document.getElementById('panel-craft').addEventListener('click', e => {
            const usePot = e.target.closest('.use-potion-btn');
            if (usePot) {
                activatePotion(usePot.dataset.potion);
                return;
            }
            const craftBtn = e.target.closest('.craft-gear-btn');
            if (craftBtn) {
                const g = GEARS.find(x => x.id === craftBtn.dataset.gear);
                if (!g || state.craftedGears.includes(g.id)) return;
                if (state.coins >= g.costSC && countTierOrAbove(state, g.reqTier) >= g.reqCount) {
                    state.coins -= g.costSC;
                    state.craftedGears.push(g.id);
                    playResultSfx(5, 2);
                    saveState();
                    renderAllDynamicUI();
                    showToast(`${g.icon} ${g.name} üretildi ve kalıcı olarak kuşanıldı!`, 'success');
                }
            }
        });

        // Görev Ödülü Alma
        document.getElementById('quests-list').addEventListener('click', e => {
            const btn = e.target.closest('.claim-quest-btn');
            if (!btn) return;
            const q = QUESTS.find(x => x.id === btn.dataset.quest);
            if (!q || state.claimedQuests.includes(q.id)) return;
            if (q.metric(state) >= q.target) {
                state.claimedQuests.push(q.id);
                state.coins += q.rewardSC;
                state.totalCoinsEarned += q.rewardSC;
                if (q.rewardPotion) {
                    state.potions[q.rewardPotion] = (state.potions[q.rewardPotion] || 0) + 1;
                }
                playResultSfx(4, 1);
                saveState();
                renderAllDynamicUI();
                showToast(`🏆 Görev Tamamlandı: +${formatCoins(q.rewardSC)}!`, 'success');
            }
        });

        // 57.500+ Katalog (Codex) Filtreleri
        document.getElementById('codex-search').addEventListener('input', () => {
            clearTimeout(codexDebounce);
            codexDebounce = setTimeout(() => applyCodexFilters(true), 160);
        });
        document.getElementById('codex-tier-filter').addEventListener('change', () => applyCodexFilters(true));
        document.getElementById('codex-genre-filter').addEventListener('change', () => applyCodexFilters(true));
        document.getElementById('codex-status-filter').addEventListener('change', () => applyCodexFilters(true));

        document.getElementById('codex-tier-pills').addEventListener('click', e => {
            const pill = e.target.closest('.codex-tier-pill');
            if (!pill) return;
            const sel = document.getElementById('codex-tier-filter');
            sel.value = sel.value === pill.dataset.tier ? 'all' : pill.dataset.tier;
            applyCodexFilters(true);
        });

        document.getElementById('codex-prev').addEventListener('click', () => {
            if (codexPage > 1) { codexPage--; renderCodexPage(); }
        });
        document.getElementById('codex-next').addEventListener('click', () => {
            codexPage++; renderCodexPage();
        });

        document.getElementById('codex-list').addEventListener('click', e => {
            const row = e.target.closest('.codex-row');
            if (!row) return;
            const song = ALL_SONGS[Number(row.dataset.codexIdx)];
            if (song) {
                displayOnStage(song, 0, false, true);
                showToast(`Sahnede önizleniyor: ${song.title} — ${song.artist}`, 'info');
            }
        });

        // Header SFX & Ayarlar Modalı
        const sfxBtn = document.getElementById('btn-sfx-toggle');
        function syncSfxBtn() {
            sfxBtn.innerHTML = state.settings.sfx
                ? '<i class="fa-solid fa-volume-high text-emerald-400"></i>'
                : '<i class="fa-solid fa-volume-xmark text-slate-500"></i>';
        }
        syncSfxBtn();
        sfxBtn.addEventListener('click', () => {
            state.settings.sfx = !state.settings.sfx;
            saveState();
            syncSfxBtn();
        });

        const settingsModal = document.getElementById('settings-modal');
        document.getElementById('btn-settings').addEventListener('click', () => {
            document.getElementById('opt-cutscene').checked = !!state.settings.cutscene;
            document.getElementById('opt-autoplay').checked = !!state.settings.autoplay;
            document.getElementById('opt-volume').value = state.settings.volume ?? 65;
            document.getElementById('opt-vol-val').textContent = `${state.settings.volume ?? 65}%`;
            settingsModal.classList.remove('hidden');
        });
        document.getElementById('btn-close-settings').addEventListener('click', () => settingsModal.classList.add('hidden'));
        settingsModal.addEventListener('click', e => { if (e.target === settingsModal) settingsModal.classList.add('hidden'); });

        document.getElementById('opt-cutscene').addEventListener('change', e => { state.settings.cutscene = e.target.checked; saveState(); });
        document.getElementById('opt-autoplay').addEventListener('change', e => { state.settings.autoplay = e.target.checked; saveState(); });
        document.getElementById('opt-volume').addEventListener('input', e => {
            const v = Number(e.target.value);
            state.settings.volume = v;
            document.getElementById('opt-vol-val').textContent = `${v}%`;
            document.getElementById('preview-audio').volume = v / 100;
            saveState();
        });

        // Kayıt Dışa / İçe Aktar & Sıfırla
        document.getElementById('btn-export-save').addEventListener('click', () => {
            const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `shuffled-rng-save-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('Kayıt dosyası indirildi!', 'success');
        });

        document.getElementById('btn-import-save').addEventListener('click', () => {
            document.getElementById('import-file-input').click();
        });
        document.getElementById('import-file-input').addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const parsed = JSON.parse(reader.result);
                    if (typeof parsed.totalRolls !== 'number') throw new Error('Geçersiz dosya');
                    localStorage.setItem(SAVE_KEY, JSON.stringify(parsed));
                    loadState();
                    renderAllDynamicUI();
                    applyCodexFilters(true);
                    settingsModal.classList.add('hidden');
                    showToast('Kayıt başarıyla yüklendi!', 'success');
                } catch (_) {
                    showToast('Geçersiz kayıt dosyası!', 'error');
                }
            };
            reader.readAsText(file);
            e.target.value = '';
        });

        document.getElementById('btn-reset-save').addEventListener('click', () => {
            if (!confirm('Tüm ilerlemen, envanterin ve Stream Coinlerin sıfırlanacak. Emin misin?')) return;
            toggleAutoRoll(false);
            localStorage.removeItem(SAVE_KEY);
            state = createDefaultState();
            discoveredSet = new Set();
            saveState();
            renderAllDynamicUI();
            applyCodexFilters(true);
            settingsModal.classList.add('hidden');
            showToast('Oyun ilerlemesi sıfırlandı.', 'warn');
        });
    }

    function activatePotion(potionId) {
        const p = POTIONS.find(x => x.id === potionId);
        if (!p || (state.potions[p.id] || 0) <= 0) return;

        state.potions[p.id]--;
        if (p.type === 'duration') {
            const existing = state.activeBuffs.find(b => b.id === p.id && b.type === 'duration');
            if (existing) {
                existing.endsAt += p.durationSec * 1000;
            } else {
                state.activeBuffs.push({
                    id: p.id, name: p.name, icon: p.icon, type: 'duration',
                    endsAt: Date.now() + p.durationSec * 1000,
                    luckAdd: p.luckAdd, mutMult: p.mutMult, minTier: p.minTier || 0
                });
            }
        } else {
            const existing = state.activeBuffs.find(b => b.id === p.id && b.type === 'rolls');
            if (existing) {
                existing.rollsLeft += p.rollsLeft;
            } else {
                state.activeBuffs.push({
                    id: p.id, name: p.name, icon: p.icon, type: 'rolls',
                    rollsLeft: p.rollsLeft,
                    luckAdd: p.luckAdd, mutMult: p.mutMult, minTier: p.minTier || 0
                });
            }
        }
        playTone(660, 0.16, 'triangle', 0.08, 0);
        playTone(880, 0.24, 'sine', 0.09, 0.08);
        saveState();
        renderAllDynamicUI();
        showToast(`${p.icon} ${p.name} aktif edildi!`, 'success');
    }

    function switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('hidden', p.id !== `panel-${tabName}`));
        if (tabName === 'codex' && codexFiltered.length === 0) {
            applyCodexFilters(true);
        }
    }

    // ------------------------------------------------------------------------
    // 17. UYGULAMA BAŞLATMA (BOOTSTRAP)
    // ------------------------------------------------------------------------
    function bootstrap() {
        const statusEl = document.getElementById('boot-status');
        try {
            const t0 = performance.now();
            initDatabase();
            loadState();
            initBgCanvas();
            bindEvents();
            renderAllDynamicUI();
            applyCodexFilters(true);

            // Eğer kuşanılmış plak varsa sahnede göster
            if (state.equippedUid) {
                const eq = state.inventory.find(x => x.uid === state.equippedUid);
                if (eq) displayOnStage(ALL_SONGS[eq.songIdx], eq.mutId, false, true);
            }

            setInterval(updateBiomeLoop, 1000);
            updateBiomeLoop();

            const dt = Math.round(performance.now() - t0);
            statusEl.textContent = `${formatNumber(ALL_SONGS.length)} yabancı şarkı ${dt}ms içinde yüklendi!`;
            setTimeout(() => {
                const boot = document.getElementById('boot-screen');
                boot.style.opacity = '0';
                setTimeout(() => boot.remove(), 480);
            }, 320);
        } catch (err) {
            console.error(err);
            statusEl.textContent = 'Hata: ' + err.message;
            statusEl.classList.add('text-rose-400');
        }
    }

    window.addEventListener('DOMContentLoaded', bootstrap);
})();
