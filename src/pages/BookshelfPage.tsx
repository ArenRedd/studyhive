/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SUBJECTS, SHEETS, preloadAllSheets, getCropCss, SubjectItem } from '../data/subjectsData';
import '../styles/bookshelf.css';

const DECADES = ['ALL / すべて', '19–21', '24–26', '28 AN', 'DEC 2'] as const;

const STORAGE_SUBJECT_KEY = 'studyhive_selected_subject';
const STORAGE_VIEW_KEY = 'studyhive_active_view';

// 7 ink mask blob circles
const INK_BLOBS = [
  { cx: 150, cy: 330, delay: 0 },
  { cx: 340, cy: 600, delay: 120 },
  { cx: 250, cy: 120, delay: 220 },
  { cx: 90, cy: 760, delay: 300 },
  { cx: 400, cy: 250, delay: 360 },
  { cx: 260, cy: 860, delay: 420 },
  { cx: 230, cy: 470, delay: 180 },
];

function getInitialPersistedState(): {
  subjectIdx: number;
  subject: SubjectItem;
} {
  const defaultIdx = 0; // CS3691 EMBEDDED SYSTEMS & IOT
  try {
    const savedRaw = localStorage.getItem(STORAGE_SUBJECT_KEY);
    if (savedRaw) {
      const parsed = JSON.parse(savedRaw) as Partial<SubjectItem>;
      const foundIdx = SUBJECTS.findIndex((s) => s.code === parsed.code);
      if (foundIdx >= 0) {
        return {
          subjectIdx: foundIdx,
          subject: SUBJECTS[foundIdx],
        };
      }
    }
  } catch {
    // Ignore storage access errors
  }
  return {
    subjectIdx: defaultIdx,
    subject: SUBJECTS[defaultIdx],
  };
}

export default function BookshelfPage() {
  const navigate = useNavigate();
  const persisted = useRef(getInitialPersistedState());
  const initialSubjectIdx = persisted.current.subjectIdx;
  const initialScroll = initialSubjectIdx + 18; // middle of 36 virtual tapes (6 copies of 6 subjects)

  // DOM refs
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const tapeElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const spineElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const coverElsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Custom cursor refs
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorLabelRef = useRef<HTMLDivElement>(null);

  // Play ring ref
  const playRingRef = useRef<HTMLButtonElement>(null);

  // Tab refs
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabIndicatorRef = useRef<HTMLDivElement>(null);

  // Caption containers
  const captionTitleMaskRef = useRef<HTMLDivElement>(null);
  const captionSubMaskRef = useRef<HTMLDivElement>(null);
  const captionYearMaskRef = useRef<HTMLDivElement>(null);

  // Detail dialog & SVG ink blobs
  const detailRef = useRef<HTMLDivElement>(null);
  const detailLinesRef = useRef<(HTMLDivElement | null)[]>([]);
  const blobCircleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const detailPosterImageRef = useRef<SVGImageElement>(null);

  // State in refs for high-frequency 60fps rAF loop
  const stateRef = useRef({
    s: initialScroll,
    T: initialScroll,
    activeIdx: initialSubjectIdx,
    lastActiveIdx: initialSubjectIdx,
    hoveredVirtualIdx: -1,
    lifts: new Array(36).fill(0),
    targetLifts: new Array(36).fill(0),
    mx: -500,
    my: -500,
    cx: -500,
    cy: -500,
    tiltX: 0,
    tiltY: 0,
    onCover: false,
    isOverSpine: false,
    isOverBtn: false,
    isOpen: false,
    inDashboard: false,
    isDragging: false,
    dragStartX: 0,
    dragStartT: 0,
    hasMovedDuringDrag: false,
    wheelTimer: null as ReturnType<typeof setTimeout> | null,
    lastTime: 0,
    H: 340,
    ws: 57,
    d: 179,
    gap: 10,
    W: 1440,
    windowH: 900,
    isReducedMotion: false,
  });

  const [activeSubject, setActiveSubject] = useState<SubjectItem>(SUBJECTS[initialSubjectIdx]);
  const [detailSubject, setDetailSubject] = useState<SubjectItem>(SUBJECTS[initialSubjectIdx]);
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem>(persisted.current.subject);
  const [activeView, setActiveView] = useState<'shelf' | 'dashboard'>(persisted.current.view);

  // Minimal web audio synth for tactile paper/mechanical micro-clicks
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playCardSound = useCallback((intensity = 1) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 * intensity, ctx.currentTime);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.04 * intensity, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Audio not permitted or failed; ignore safely
    }
  }, []);

  // Update tab indicator
  const updateTabIndicator = useCallback((groupStr: string) => {
    const tabIdx = DECADES.findIndex((d) => d === groupStr);
    if (tabIdx >= 0 && tabBtnRefs.current[tabIdx] && tabIndicatorRef.current && tabsContainerRef.current) {
      const btn = tabBtnRefs.current[tabIdx]!;
      const w = btn.offsetWidth;
      const left = btn.offsetLeft;
      tabIndicatorRef.current.style.width = `${w}px`;
      tabIndicatorRef.current.style.transform = `translateX(${left}px)`;
    }
  }, []);

  // Caption swap animation (mask sliding)
  const swapCaption = useCallback((subject: SubjectItem, dir: number) => {
    const isReduced = stateRef.current.isReducedMotion;
    const duration = isReduced ? 1 : 650;
    const easing = 'cubic-bezier(.2,.8,.2,1)';

    const rows = [
      { container: captionTitleMaskRef.current, text: subject.shortName, className: 'font-serif-newsreader text-[31px] max-md:text-[24px] leading-[1.12] tracking-[-0.01em]' },
      { container: captionSubMaskRef.current, text: subject.code, className: 'lbl text-[var(--cobalt)] font-[500]' },
      { container: captionYearMaskRef.current, text: `${subject.examDate} · ${subject.session}`, className: 'font-sans-vasari font-[500] text-[11px] tracking-[0.08em] text-[var(--ink)]' },
    ];

    rows.forEach(({ container, text, className }) => {
      if (!container) return;
      const oldNodes = Array.from(container.children) as HTMLElement[];

      const newSpan = document.createElement('div');
      newSpan.className = `w-full text-center ${className}`;
      newSpan.textContent = text;
      newSpan.style.width = '100%';
      newSpan.style.position = oldNodes.length > 0 ? 'absolute' : 'relative';
      newSpan.style.top = '0';
      newSpan.style.left = '0';
      container.appendChild(newSpan);

      if (isReduced) {
        oldNodes.forEach((n) => n.remove());
        newSpan.style.transform = 'translateY(0)';
      } else {
        newSpan.animate(
          [
            { transform: `translateY(${dir * 105}%)` },
            { transform: 'translateY(0)' },
          ],
          { duration, easing, fill: 'both' }
        );

        oldNodes.forEach((old) => {
          old.style.position = 'absolute';
          const anim = old.animate(
            [
              { transform: 'translateY(0)' },
              { transform: `translateY(${-dir * 105}%)` },
            ],
            { duration, easing, fill: 'both' }
          );
          anim.onfinish = () => {
            old.remove();
          };
        });
      }
    });

    updateTabIndicator(subject.tabGroup);
  }, [updateTabIndicator]);

  // Select subject and open Dashboard
  const openDashboardForSubject = useCallback((subjectOverride?: SubjectItem) => {
    const s = stateRef.current;
    const chosen = subjectOverride || SUBJECTS[s.activeIdx];

    if (subjectOverride) {
      const idx = SUBJECTS.findIndex((item) => item.code === subjectOverride.code);
      if (idx >= 0) {
        s.activeIdx = idx;
        s.s = idx + 18;
        s.T = idx + 18;
        setActiveSubject(SUBJECTS[idx]);
        swapCaption(SUBJECTS[idx], 1);
      }
    }

    // Close pop-out detail if open
    if (s.isOpen && detailRef.current) {
      s.isOpen = false;
      detailRef.current.getAnimations().forEach((a) => a.cancel());
      detailRef.current.style.visibility = 'hidden';
    }

    s.inDashboard = false;
    s.onCover = false;
    s.isOverSpine = false;
    s.isOverBtn = false;

    setSelectedSubject(chosen);
    setActiveView('shelf');

    try {
      localStorage.setItem(STORAGE_SUBJECT_KEY, JSON.stringify(chosen));
      localStorage.setItem('studyhive_selected_subject_id', chosen.code);
      localStorage.setItem(STORAGE_VIEW_KEY, 'shelf');
    } catch {
      // Ignore storage errors
    }

    playCardSound(1.4);
    navigate('/dashboard/' + chosen.code);
  }, [navigate, playCardSound, swapCaption]);

  // Switch Subject -> return to bookshelf
  const handleSwitchSubject = useCallback(() => {
    const s = stateRef.current;
    s.inDashboard = false;
    s.isOverBtn = false;
    setActiveView('shelf');

    try {
      localStorage.setItem(STORAGE_VIEW_KEY, 'shelf');
    } catch {
      // Ignore storage errors
    }

    playCardSound(1.0);
  }, [playCardSound]);

  // Open center featured-book pop-out Detail
  const openDetail = useCallback(() => {
    const s = stateRef.current;
    if (s.isOpen) return;

    s.isOpen = true;
    s.T = Math.round(s.T);
    playCardSound(1.5);

    const activeData = SUBJECTS[s.activeIdx];
    setDetailSubject(activeData);

    const detailEl = detailRef.current;
    if (!detailEl) return;

    // Get active tape cover bounding rect
    const activeVirtual = ((Math.round(s.s) % 36) + 36) % 36;
    const activeCover = coverElsRef.current[activeVirtual];
    let top = 0;
    let right = 0;
    let bottom = 0;
    let left = 0;

    if (activeCover) {
      const rect = activeCover.getBoundingClientRect();
      top = rect.top;
      right = window.innerWidth - rect.right;
      bottom = window.innerHeight - rect.bottom;
      left = rect.left;
      detailEl.style.transformOrigin = `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`;
    } else {
      detailEl.style.transformOrigin = '50% 50%';
    }

    detailEl.style.visibility = 'visible';

    // Position SVG image to active cover crop
    if (detailPosterImageRef.current) {
      const coverCrop = activeData.cover;
      const sheet = SHEETS[coverCrop.sheet];
      detailPosterImageRef.current.setAttribute('href', sheet.url);
      detailPosterImageRef.current.setAttribute('x', `${(-coverCrop.x * 474) / coverCrop.w}`);
      detailPosterImageRef.current.setAttribute('y', `${(-coverCrop.y * 900) / coverCrop.h}`);
      detailPosterImageRef.current.setAttribute('width', `${(sheet.w * 474) / coverCrop.w}`);
      detailPosterImageRef.current.setAttribute('height', `${(sheet.h * 900) / coverCrop.h}`);
    }

    // Reset ink blobs
    blobCircleRefs.current.forEach((circle) => {
      if (circle) circle.setAttribute('r', '0');
    });

    if (s.isReducedMotion) {
      detailEl.style.clipPath = 'inset(0px 0px 0px 0px round 0px)';
      detailEl.style.transform = 'rotate(0deg)';
      detailLinesRef.current.forEach((line) => {
        if (line) line.style.transform = 'translateY(0)';
      });
      blobCircleRefs.current.forEach((circle) => {
        if (circle) circle.setAttribute('r', '720');
      });
      return;
    }

    // Sheet expands from cover
    detailEl.animate(
      [
        { clipPath: `inset(${top}px ${right}px ${bottom}px ${left}px round 3px)`, transform: 'rotate(-4.5deg)' },
        { clipPath: 'inset(0px 0px 0px 0px round 0px)', transform: 'rotate(0deg)' },
      ],
      { duration: 1050, easing: 'cubic-bezier(.76,0,.18,1)', fill: 'both' }
    );

    // Text lines rise
    detailLinesRef.current.forEach((line, idx) => {
      if (!line) return;
      line.animate(
        [
          { transform: 'translateY(110%)' },
          { transform: 'translateY(0)' },
        ],
        {
          duration: 900,
          delay: 620 + idx * 75,
          easing: 'cubic-bezier(.2,.8,.2,1)',
          fill: 'both',
        }
      );
    });

    // Poster ink bleed rAF
    const startTime = performance.now() + 520;
    const animateBlobs = (t: number) => {
      if (!s.isOpen) return;
      const elapsed = t - startTime;
      if (elapsed > 0) {
        blobCircleRefs.current.forEach((circle, i) => {
          if (!circle) return;
          const blob = INK_BLOBS[i];
          const blobElapsed = elapsed - blob.delay;
          if (blobElapsed <= 0) {
            circle.setAttribute('r', '0');
          } else {
            const p = Math.min(1, blobElapsed / 1250);
            const ease = 1 - Math.pow(1 - p, 3);
            const r = ease * 720;
            circle.setAttribute('r', r.toFixed(2));
          }
        });
      }
      if (elapsed < 2400) {
        requestAnimationFrame(animateBlobs);
      }
    };
    requestAnimationFrame(animateBlobs);
  }, [playCardSound]);

  // Close Detail
  const closeDetail = useCallback(() => {
    const s = stateRef.current;
    if (!s.isOpen) return;

    const detailEl = detailRef.current;
    if (!detailEl) return;

    playCardSound(0.9);

    if (s.isReducedMotion) {
      s.isOpen = false;
      detailEl.style.visibility = 'hidden';
      return;
    }

    const activeVirtual = ((Math.round(s.s) % 36) + 36) % 36;
    const activeCover = coverElsRef.current[activeVirtual];
    let top = 0;
    let right = 0;
    let bottom = 0;
    let left = 0;

    if (activeCover) {
      const rect = activeCover.getBoundingClientRect();
      top = rect.top;
      right = window.innerWidth - rect.right;
      bottom = window.innerHeight - rect.bottom;
      left = rect.left;
    }

    const anim = detailEl.animate(
      [
        { clipPath: 'inset(0px 0px 0px 0px round 0px)', transform: 'rotate(0deg)' },
        { clipPath: `inset(${top}px ${right}px ${bottom}px ${left}px round 3px)`, transform: 'rotate(-4.5deg)' },
      ],
      { duration: 850, easing: 'cubic-bezier(.76,0,.18,1)', fill: 'both' }
    );

    anim.onfinish = () => {
      s.isOpen = false;
      detailEl.style.visibility = 'hidden';
    };
  }, [playCardSound]);

  // Jump to tab group
  const handleTabClick = useCallback((tabName: string) => {
    const s = stateRef.current;
    if (s.isOpen) return;

    let targetIdx = 0;
    if (tabName === '19–21') targetIdx = 0;
    else if (tabName === '24–26') targetIdx = 2;
    else if (tabName === '28 AN') targetIdx = 4;
    else if (tabName === 'DEC 2') targetIdx = 5;
    else if (tabName === 'ALL / すべて') targetIdx = 0;

    const currIdx = ((Math.round(s.s) % 6) + 6) % 6;
    let delta = (targetIdx - currIdx) % 6;
    if (delta > 3) delta -= 6;
    if (delta < -3) delta += 6;

    s.T = Math.round(s.s) + delta;
    playCardSound(1.1);
  }, [playCardSound]);

  // Arrow navigation
  const handleArrow = useCallback((dir: number) => {
    const s = stateRef.current;
    if (s.isOpen) return;
    s.T = Math.round(s.T) + dir;
    playCardSound(1.0);
  }, [playCardSound]);

  // Dimension probe and measurement
  const updateDimensions = useCallback(() => {
    if (!probeRef.current) return;
    const h = probeRef.current.offsetHeight || 340;
    const ws = (h * 142) / 840;
    const d = (h * 474) / 900;
    const gap = h * 0.03;
    const w = window.innerWidth;
    const wh = window.innerHeight;

    stateRef.current.H = h;
    stateRef.current.ws = ws;
    stateRef.current.d = d;
    stateRef.current.gap = gap;
    stateRef.current.W = w;
    stateRef.current.windowH = wh;

    if (stageRef.current) {
      stageRef.current.style.setProperty('--ws', `${ws.toFixed(2)}px`);
      stageRef.current.style.setProperty('--d', `${d.toFixed(2)}px`);
      stageRef.current.style.setProperty('--H', `${h.toFixed(2)}px`);
    }

    // Sync tab indicator position
    const subj = SUBJECTS[stateRef.current.activeIdx];
    if (subj) updateTabIndicator(subj.tabGroup);
  }, [updateTabIndicator]);

  // Initial setup & rAF engine
  useEffect(() => {
    preloadAllSheets();

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    stateRef.current.isReducedMotion = mql.matches;
    const handleMqlChange = (e: MediaQueryListEvent) => {
      stateRef.current.isReducedMotion = e.matches;
    };
    mql.addEventListener('change', handleMqlChange);

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Initial caption set
    const initialSubj = SUBJECTS[initialSubjectIdx];
    swapCaption(initialSubj, 1);

    // Mouse movement
    const onMouseMove = (e: MouseEvent) => {
      stateRef.current.mx = e.clientX;
      stateRef.current.my = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Keyboard navigation
    const onKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current;

      if (e.key === 'ArrowLeft') {
        handleArrow(-1);
      } else if (e.key === 'ArrowRight') {
        handleArrow(1);
      } else if (e.key === 'Enter') {
        if (!s.isOpen) {
          openDetail();
        }
      } else if (e.key === 'Escape') {
        if (s.isOpen) {
          closeDetail();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);

    // Wheel scrolling
    const onWheel = (e: WheelEvent) => {
      const s = stateRef.current;
      if (s.isOpen) return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      s.T += (delta / (s.ws + s.gap)) * 0.5;

      if (s.wheelTimer) clearTimeout(s.wheelTimer);
      s.wheelTimer = setTimeout(() => {
        s.T = Math.round(s.T);
      }, 160);
    };
    window.addEventListener('wheel', onWheel, { passive: true });

    // Main 60fps rAF loop
    let animId: number;
    let lastSoundActive = initialSubjectIdx;

    const smoothstep = (val: number) => {
      const c = Math.max(0, Math.min(1, val));
      return c * c * (3 - 2 * c);
    };

    const frameLoop = (timestamp: number) => {
      const s = stateRef.current;
      if (!s.lastTime) s.lastTime = timestamp;
      const rawDt = (timestamp - s.lastTime) / 1000;
      s.lastTime = timestamp;
      const dt = Math.min(0.05, Math.max(0.001, rawDt));

      // Cursor smoothing (always runs even in dashboard)
      s.cx += (s.mx - s.cx) * (1 - Math.exp(-16 * dt));
      s.cy += (s.my - s.cy) * (1 - Math.exp(-16 * dt));

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${s.cx.toFixed(1)}px, ${s.cy.toFixed(1)}px, 0)`;

        if (s.isOpen) {
          cursorRingRef.current?.classList.remove('scale-[1.75]', 'scale-[0.72]', 'bg-[var(--cobalt)]', 'border-[var(--cobalt)]');
          if (s.isOverBtn) {
            cursorRingRef.current?.classList.add('scale-[0.55]');
            cursorDotRef.current?.classList.add('scale-0');
          } else {
            cursorRingRef.current?.classList.remove('scale-[0.55]');
            cursorDotRef.current?.classList.remove('scale-0');
          }
          cursorLabelRef.current?.classList.remove('scale-100');
        } else if (s.onCover) {
          cursorRingRef.current?.classList.add('scale-[1.75]', 'bg-[var(--cobalt)]', 'border-[var(--cobalt)]');
          cursorRingRef.current?.classList.remove('scale-[0.72]', 'scale-[0.55]');
          cursorDotRef.current?.classList.add('scale-0');
          cursorLabelRef.current?.classList.add('scale-100');
        } else if (s.isOverSpine) {
          cursorRingRef.current?.classList.add('scale-[0.72]');
          cursorRingRef.current?.classList.remove('scale-[1.75]', 'scale-[0.55]', 'bg-[var(--cobalt)]', 'border-[var(--cobalt)]');
          cursorDotRef.current?.classList.remove('scale-0');
          cursorLabelRef.current?.classList.remove('scale-100');
        } else if (s.isOverBtn) {
          cursorRingRef.current?.classList.add('scale-[0.55]');
          cursorRingRef.current?.classList.remove('scale-[1.75]', 'scale-[0.72]', 'bg-[var(--cobalt)]', 'border-[var(--cobalt)]');
          cursorDotRef.current?.classList.add('scale-0');
          cursorLabelRef.current?.classList.remove('scale-100');
        } else {
          cursorRingRef.current?.classList.remove('scale-[1.75]', 'scale-[0.72]', 'scale-[0.55]', 'bg-[var(--cobalt)]', 'border-[var(--cobalt)]');
          cursorDotRef.current?.classList.remove('scale-0');
          cursorLabelRef.current?.classList.remove('scale-100');
        }
      }

      // Scroll spring integration
      if (s.isReducedMotion) {
        s.s = s.T;
      } else {
        const k = s.isDragging ? 18 : 5.2;
        s.s += (s.T - s.s) * (1 - Math.exp(-k * dt));
        if (Math.abs(s.T - s.s) < 1e-4) {
          s.s = s.T;
        }
      }

      // Loop normalisation (keep virtual scroll in comfortable range around 12..24)
      while (s.s > 24) {
        s.s -= 6;
        s.T -= 6;
      }
      while (s.s < 12) {
        s.s += 6;
        s.T += 6;
      }

      // Check active subject index
      const roundScroll = Math.round(s.s);
      const currIdx = ((roundScroll % 6) + 6) % 6;

      if (currIdx !== s.activeIdx) {
        const dir = Math.sign(s.T - s.s) || 1;
        s.lastActiveIdx = s.activeIdx;
        s.activeIdx = currIdx;
        const newSubj = SUBJECTS[currIdx];
        setActiveSubject(newSubj);
        swapCaption(newSubj, dir);

        if (currIdx !== lastSoundActive) {
          playCardSound(0.8);
          lastSoundActive = currIdx;
        }
      }

      // Tilt math towards cursor
      const cy = s.windowH / 2;
      const onCoverCheck =
        Math.abs(s.mx - s.W / 2) < 0.55 * s.d &&
        Math.abs(s.my - cy) < 0.55 * s.H &&
        !s.isOpen &&
        Math.abs(s.T - s.s) < 0.3;

      s.onCover = onCoverCheck;

      let targetTiltY = 0;
      let targetTiltX = 0;

      if (onCoverCheck) {
        targetTiltY = ((s.mx - s.W / 2) / (0.55 * s.d)) * 9;
        targetTiltX = (-(s.my - cy) / (s.H / 2)) * 6;
      } else {
        targetTiltY = ((s.mx - s.W / 2) / (s.W || 1)) * 5;
        targetTiltX = 0;
      }

      s.tiltY += (targetTiltY - s.tiltY) * (1 - Math.exp(-7 * dt));
      s.tiltX += (targetTiltX - s.tiltX) * (1 - Math.exp(-7 * dt));

      // Update play ring position & scale
      if (playRingRef.current) {
        const ringScale = s.isOpen ? 0 : smoothstep(Math.max(0, 1 - Math.abs(s.T - s.s) * 3));
        const playLeft = s.W / 2 - 0.5 * s.d - 6;
        const playTop = cy + 0.36 * s.H;
        playRingRef.current.style.transform = `translate3d(${playLeft.toFixed(1)}px, ${playTop.toFixed(1)}px, 0) scale(${ringScale.toFixed(3)})`;
      }

      // Render 36 tapes in 3D
      const W2 = s.W / 2;
      const cullingLimit = W2 + 1.5 * s.d;

      for (let v = 0; v < 36; v++) {
        const tapeEl = tapeElsRef.current[v];
        if (!tapeEl) continue;

        let r = (v - s.s) % 36;
        if (r > 18) r -= 36;
        if (r < -18) r += 36;

        // Smooth step B(r)
        let Br = 0;
        if (Math.abs(r) < 1) {
          Br = (r + Math.sin(Math.PI * r) / Math.PI) / 2;
        } else {
          Br = r >= 1 ? 0.5 : -0.5;
        }

        const x = r * (s.ws + s.gap) + (s.d - s.ws + 1.6 * s.gap) * Br;

        // Culling
        if (Math.abs(x) > cullingLimit) {
          tapeEl.style.visibility = 'hidden';
          continue;
        } else {
          tapeEl.style.visibility = 'visible';
        }

        // Lift easing
        const targetLift = (s.hoveredVirtualIdx === v && Math.abs(r) > 0.5) ? 1 : 0;
        s.targetLifts[v] = targetLift;
        s.lifts[v] += (targetLift - s.lifts[v]) * (1 - Math.exp(-12 * dt));
        const lift = s.lifts[v];

        // Openness & rotations
        const o = smoothstep(Math.max(0, 1 - Math.abs(r)));
        const ry = -90 * o + s.tiltY * o;
        const rx = s.tiltX * o;
        const rz = -4.5 * o;
        const tz = o * 0.2 * s.H;
        const ty = -o * 0.025 * s.H - lift * 0.045 * s.H;
        const zIndex = Math.round(100 - Math.abs(r) * 4);

        tapeEl.style.zIndex = `${zIndex}`;
        tapeEl.style.transform = `translate3d(${x.toFixed(2)}px, ${ty.toFixed(2)}px, ${tz.toFixed(2)}px) rotateZ(${rz.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;

        // Shading
        const spineEl = spineElsRef.current[v];
        const coverEl = coverElsRef.current[v];
        if (spineEl) {
          spineEl.style.setProperty('--shade', (o * 0.55).toFixed(3));
        }
        if (coverEl) {
          coverEl.style.setProperty('--shade', ((1 - o) * 0.5).toFixed(3));
        }
      }

      animId = requestAnimationFrame(frameLoop);
    };

    animId = requestAnimationFrame(frameLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('wheel', onWheel);
      mql.removeEventListener('change', handleMqlChange);
    };
  }, [handleArrow, openDetail, closeDetail, playCardSound, swapCaption, updateDimensions, initialSubjectIdx]);

  // Shelf Drag handlers
  const onShelfPointerDown = (e: React.PointerEvent) => {
    const s = stateRef.current;
    if (s.isOpen) return;
    s.isDragging = true;
    s.dragStartX = e.clientX;
    s.dragStartT = s.T;
    s.hasMovedDuringDrag = false;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onShelfPointerMove = (e: React.PointerEvent) => {
    const s = stateRef.current;
    if (!s.isDragging) return;
    const dx = e.clientX - s.dragStartX;
    if (Math.abs(dx) > 5) {
      s.hasMovedDuringDrag = true;
    }
    if (s.hasMovedDuringDrag) {
      s.T = s.dragStartT - dx / (s.ws + s.gap);
    }
  };

  const onShelfPointerUp = (e: React.PointerEvent) => {
    const s = stateRef.current;
    if (!s.isDragging) return;
    s.isDragging = false;
    s.T = Math.round(s.T);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Tape click
  const handleTapeClick = (virtualIdx: number) => {
    const s = stateRef.current;
    if (s.hasMovedDuringDrag) return;

    let r = (virtualIdx - s.s) % 36;
    if (r > 18) r -= 36;
    if (r < -18) r += 36;

    if (Math.abs(r) < 0.5) {
      openDetail();
    } else {
      s.T = Math.round(s.T + r);
      playCardSound(1.0);
    }
  };

  return (
    <div
      ref={containerRef}
      className="bookshelf-container relative w-screen h-screen overflow-hidden bg-[var(--paper)] text-[var(--ink)] select-none"
    >
      {/* Off-screen probe to measure real computed --H */}
      <div
        ref={probeRef}
        className="pointer-events-none fixed -top-[9999px] -left-[9999px] h-[var(--H)] opacity-0"
        aria-hidden="true"
      />

      {/* SVG Ink Filter Definition for Poster Bleed */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="inkFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves={3} seed={7} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={120} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Paper Grain Overlay */}
      <div className="paper-grain" aria-hidden="true" />

      {/* Custom Cursor (shown on pointer: fine) */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 -ml-[29px] -mt-[29px] w-[58px] h-[58px] pointer-events-none z-[100] hidden md:flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          ref={cursorRingRef}
          className="absolute inset-0 rounded-full border-[1.5px] border-[var(--ink)] bg-transparent transition-[transform,background-color,border-color] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] will-change-transform"
        />
        <div
          ref={cursorDotRef}
          className="w-[6px] h-[6px] rounded-full bg-[var(--ink)] transition-transform duration-400 ease-[cubic-bezier(.2,.8,.2,1)]"
        />
        <div
          ref={cursorLabelRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-white scale-0 transition-transform duration-450 ease-[cubic-bezier(.2,.8,.2,1)] leading-[1.25]"
        >
          <span className="font-sans-vasari font-semibold text-[10px] tracking-[0.1em]">OPEN</span>
          <span className="font-sans-vasari font-semibold text-[10px] tracking-[0.1em]">開く</span>
        </div>
      </div>

      {/* 1. Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-[84px] max-md:h-[64px] px-[32px] max-md:px-[16px] grid grid-cols-[1fr_auto_1fr] items-center z-30">
        <div className="flex items-center justify-start">
          <a
            href="#catalogue"
            className="box-btn lbl text-[var(--ink)] hover:text-[var(--cobalt)] transition-colors"
            onMouseEnter={() => { stateRef.current.isOverBtn = true; }}
            onMouseLeave={() => { stateRef.current.isOverBtn = false; }}
            onClick={(e) => { e.preventDefault(); handleTabClick('ALL / すべて'); }}
          >
            BACK / 戻る
          </a>
        </div>

        <div className="flex flex-col items-center justify-center gap-[5px] text-[var(--cobalt)]">
          <span className="font-sc-logo font-bold text-[22px] max-md:text-[17px] tracking-[0.04em] leading-none">
            学习蜂巢
          </span>
          <span className="font-sans-vasari font-semibold text-[9px] max-md:text-[7.5px] tracking-[0.34em] pl-[0.34em] leading-none uppercase">
            STUDYHIVE
          </span>
        </div>

        <div className="flex items-center justify-end">
          <span className="lbl text-[var(--ink)] hidden md:inline-block">
            SEM 5 · NOV/DEC 2026
          </span>
        </div>
      </header>

      {/* 2. Exam Group Tabs */}
      <nav
        ref={tabsContainerRef}
        aria-label="Exam groups"
        className="fixed left-1/2 -translate-x-1/2 top-[calc(50%-var(--H)/2-86px)] max-md:top-[calc(50%-var(--H)/2-70px)] z-30 flex items-center bg-transparent"
      >
        {/* Sliding Cobalt Indicator Block */}
        <div
          ref={tabIndicatorRef}
          className="absolute top-0 left-0 h-[23px] bg-[var(--cobalt)] pointer-events-none transition-[width,transform] duration-600 ease-[cubic-bezier(.2,.8,.2,1)]"
        />

        {DECADES.map((dec, i) => {
          const isCurrentActive =
            (dec === '19–21' && activeSubject.tabGroup === '19–21') ||
            (dec === '24–26' && activeSubject.tabGroup === '24–26') ||
            (dec === '28 AN' && activeSubject.tabGroup === '28 AN') ||
            (dec === 'DEC 2' && activeSubject.tabGroup === 'DEC 2');

          return (
            <button
              key={dec}
              ref={(el) => { tabBtnRefs.current[i] = el; }}
              className={`box-btn lbl relative h-[23px] px-[11px] max-md:px-[7px] max-md:text-[9px] -ml-[1px] first:ml-0 whitespace-nowrap transition-colors duration-450 z-10 ${
                isCurrentActive ? 'text-white' : 'text-[var(--ink)] hover:text-[var(--cobalt)]'
              }`}
              onClick={() => handleTabClick(dec)}
              onMouseEnter={() => { stateRef.current.isOverBtn = true; }}
              onMouseLeave={() => { stateRef.current.isOverBtn = false; }}
            >
              {dec}
            </button>
          );
        })}
      </nav>

      {/* 3. The Shelf (3D Stage) */}
      <section
        aria-label="Subject shelf"
        className="fixed left-0 w-full top-[calc(50%-var(--H)/2-40px)] h-[calc(var(--H)+80px)] overflow-visible z-20"
        style={{
          perspective: '2200px',
          perspectiveOrigin: '50% 50%',
          touchAction: 'pan-y',
        }}
        onPointerDown={onShelfPointerDown}
        onPointerMove={onShelfPointerMove}
        onPointerUp={onShelfPointerUp}
      >
        <div ref={stageRef} className="shelf-stage">
          {Array.from({ length: 36 }).map((_, v) => {
            const subj = SUBJECTS[v % 6];
            const spineStyle = getCropCss(subj.spine);
            const coverStyle = getCropCss(subj.cover);

            return (
              <div
                key={v}
                ref={(el) => { tapeElsRef.current[v] = el; }}
                className="tape cursor-pointer"
                onClick={() => handleTapeClick(v)}
                onPointerEnter={() => {
                  stateRef.current.hoveredVirtualIdx = v;
                  stateRef.current.isOverSpine = true;
                }}
                onPointerLeave={() => {
                  if (stateRef.current.hoveredVirtualIdx === v) {
                    stateRef.current.hoveredVirtualIdx = -1;
                  }
                  stateRef.current.isOverSpine = false;
                }}
              >
                {/* Spine Face */}
                <div
                  ref={(el) => { spineElsRef.current[v] = el; }}
                  className="tape-face sp"
                  style={spineStyle}
                />

                {/* Cover Face */}
                <div
                  ref={(el) => { coverElsRef.current[v] = el; }}
                  className="tape-face cv"
                  style={coverStyle}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Play Ring (Selects subject, saves in state & localStorage, opens dashboard) */}
      <button
        ref={playRingRef}
        type="button"
        aria-label="Open subject dashboard"
        className="fixed top-0 left-0 -ml-[21px] -mt-[21px] w-[42px] h-[42px] rounded-full border border-[var(--cobalt)] text-[var(--cobalt)] bg-[rgba(237,235,230,0.75)] flex items-center justify-center z-30 transition-transform cursor-pointer shadow-sm"
        onClick={() => openDashboardForSubject()}
        onMouseEnter={() => { stateRef.current.isOverBtn = true; }}
        onMouseLeave={() => { stateRef.current.isOverBtn = false; }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" className="ml-[2px]" fill="currentColor">
          <polygon points="2,1 11,6 2,11" />
        </svg>
      </button>

      {/* 5. Caption */}
      <div
        className="fixed left-0 right-0 top-[calc(50%+var(--H)/2+30px)] flex flex-col items-center justify-center gap-[9px] pointer-events-none z-30 px-4"
        aria-live="polite"
      >
        <div ref={captionTitleMaskRef} className="relative overflow-hidden w-full max-w-[760px] h-[36px] max-md:h-[28px] flex items-center justify-center" />
        <div ref={captionSubMaskRef} className="relative overflow-hidden w-full max-w-[760px] h-[16px] flex items-center justify-center" />
        <div ref={captionYearMaskRef} className="relative overflow-hidden w-full max-w-[760px] h-[16px] flex items-center justify-center" />
      </div>

      {/* 6. Arrows */}
      <button
        type="button"
        aria-label="Previous subject"
        className="fixed left-[20px] max-md:left-[6px] top-[calc(50%+var(--H)/2+40px)] w-[44px] h-[44px] flex items-center justify-center text-[var(--ink)] hover:text-[var(--cobalt)] z-30 cursor-pointer"
        onClick={() => handleArrow(-1)}
        onMouseEnter={() => { stateRef.current.isOverBtn = true; }}
        onMouseLeave={() => { stateRef.current.isOverBtn = false; }}
      >
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M5 1 L1 5 L5 9" />
          <path d="M1 5 L17 5" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Next subject"
        className="fixed right-[20px] max-md:right-[6px] top-[calc(50%+var(--H)/2+40px)] w-[44px] h-[44px] flex items-center justify-center text-[var(--ink)] hover:text-[var(--cobalt)] z-30 cursor-pointer"
        onClick={() => handleArrow(1)}
        onMouseEnter={() => { stateRef.current.isOverBtn = true; }}
        onMouseLeave={() => { stateRef.current.isOverBtn = false; }}
      >
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M13 1 L17 5 L13 9" />
          <path d="M1 5 L17 5" />
        </svg>
      </button>

      {/* 7. Footer */}
      <footer className="fixed bottom-[26px] max-md:bottom-[18px] left-[32px] max-md:left-[16px] right-[32px] max-md:right-[16px] flex items-center justify-between z-30">
        <span className="lbl text-[var(--ink)] max-md:text-[9px]">
          © STUDYHIVE. ALL RIGHTS RESERVED.
        </span>
        <div className="flex items-center gap-3">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="lbl text-[var(--ink)] hover:text-[var(--cobalt)] transition-colors"
            onMouseEnter={() => { stateRef.current.isOverBtn = true; }}
            onMouseLeave={() => { stateRef.current.isOverBtn = false; }}
          >
            FB
          </a>
          <span className="text-[10px] text-[var(--muted)]">/</span>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="lbl text-[var(--ink)] hover:text-[var(--cobalt)] transition-colors"
            onMouseEnter={() => { stateRef.current.isOverBtn = true; }}
            onMouseLeave={() => { stateRef.current.isOverBtn = false; }}
          >
            TW
          </a>
        </div>
      </footer>

      {/* 8. Center Featured-Book Pop-out Detail Dialog */}
      <div
        ref={detailRef}
        role="dialog"
        aria-modal="true"
        aria-label={detailSubject.shortName}
        className="fixed inset-0 z-[60] bg-[var(--sheet)] overflow-y-auto max-md:overflow-y-scroll overflow-x-hidden"
        style={{ visibility: 'hidden' }}
      >
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close detail"
          className="box-btn lbl fixed top-[32px] max-md:top-[16px] left-[31px] max-md:left-[16px] z-50 text-[var(--ink)] hover:text-[var(--cobalt)] transition-colors cursor-pointer bg-[var(--sheet)]"
          onClick={closeDetail}
          onMouseEnter={() => { stateRef.current.isOverBtn = true; }}
          onMouseLeave={() => { stateRef.current.isOverBtn = false; }}
        >
          CLOSE / 閉じる
        </button>

        {/* Top Centered Logo in Detail */}
        <div className="fixed top-0 left-0 right-0 h-[84px] max-md:h-[64px] flex flex-col items-center justify-center gap-[5px] text-[var(--cobalt)] pointer-events-none z-40 bg-[var(--sheet)]">
          <span className="font-sc-logo font-bold text-[22px] max-md:text-[17px] tracking-[0.04em] leading-none">
            学习蜂巢
          </span>
          <span className="font-sans-vasari font-semibold text-[9px] max-md:text-[7.5px] tracking-[0.34em] pl-[0.34em] leading-none uppercase">
            STUDYHIVE
          </span>
        </div>

        {/* Two-Column Grid Desktop / Single Column Mobile */}
        <div className="min-h-full w-full grid grid-cols-2 max-md:grid-cols-1 gap-[4vw] max-md:gap-[24px] pt-[110px] pb-[56px] px-[7vw] max-md:pt-[84px] max-md:pb-[40px] max-md:px-[22px] items-center">
          {/* Left Column */}
          <div className="flex flex-col justify-center max-w-[520px] gap-[18px] z-10 max-md:order-2">
            {/* 1. Subtitle */}
            <div className="overflow-hidden">
              <div
                ref={(el) => { detailLinesRef.current[0] = el; }}
                className="lbl text-[var(--cobalt)] font-[500] will-change-transform"
              >
                {detailSubject.code}
              </div>
            </div>

            {/* 2. Main Title */}
            <div className="overflow-hidden">
              <h1
                ref={(el) => { detailLinesRef.current[1] = el; }}
                className="font-serif-newsreader text-[clamp(44px,5.4vw,84px)] max-md:text-[42px] leading-[1.0] tracking-[-0.025em] text-[var(--ink)] will-change-transform"
              >
                {detailSubject.shortName}
              </h1>
            </div>

            {/* 3. Meta line */}
            <div className="overflow-hidden">
              <div
                ref={(el) => { detailLinesRef.current[2] = el; }}
                className="lbl text-[var(--muted)] will-change-transform"
              >
                {detailSubject.examDate} · {detailSubject.session} / SEM 5 CSE
              </div>
            </div>

            {/* 4. Summary */}
            <div className="overflow-hidden">
              <p
                ref={(el) => { detailLinesRef.current[3] = el; }}
                className="font-serif-newsreader text-[17px] max-md:text-[16px] leading-[1.5] max-w-[42ch] text-[var(--ink)] will-change-transform"
              >
                {detailSubject.fullName} — Anna University Sem 5 examination track scheduled for {detailSubject.examDate} ({detailSubject.session}).
              </p>
            </div>

            {/* 5. Italic Credit */}
            <div className="overflow-hidden">
              <p
                ref={(el) => { detailLinesRef.current[4] = el; }}
                className="font-serif-newsreader italic text-[15px] text-[var(--muted)] will-change-transform"
              >
                Curated by StudyHive. Nov/Dec 2026.
              </p>
            </div>

            {/* 6. Open Study Button */}
            <div className="overflow-hidden pt-2">
              <div
                ref={(el) => { detailLinesRef.current[5] = el; }}
                className="will-change-transform"
              >
                <button
                  type="button"
                  className="box-btn lbl h-[44px] px-[20px] text-[var(--cobalt)] border-[var(--cobalt)] hover:bg-[var(--cobalt)] hover:text-white transition-colors cursor-pointer"
                  onClick={() => openDashboardForSubject(detailSubject)}
                  onMouseEnter={() => { stateRef.current.isOverBtn = true; }}
                  onMouseLeave={() => { stateRef.current.isOverBtn = false; }}
                >
                  OPEN STUDY
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: The Poster with Ink Mask Bleed */}
          <div className="flex items-center justify-center max-md:order-1">
            <div className="relative w-full max-w-[474px] h-[min(100%,78vh)] max-md:h-[46svh] aspect-[474/900] shadow-[0_30px_70px_-20px_rgba(20,16,10,0.4)]">
              <svg
                viewBox="0 0 474 900"
                className="w-full h-full overflow-hidden rounded-[3px]"
                aria-hidden="true"
              >
                <defs>
                  <clipPath id="posterClip">
                    <rect x="0" y="0" width="474" height="900" rx="3" ry="3" />
                  </clipPath>

                  <mask id="inkMask" maskUnits="userSpaceOnUse" x="-200" y="-200" width="874" height="1300">
                    <g filter="url(#inkFilter)">
                      {INK_BLOBS.map((blob, idx) => (
                        <circle
                          key={idx}
                          ref={(el) => { blobCircleRefs.current[idx] = el; }}
                          cx={blob.cx}
                          cy={blob.cy}
                          r="0"
                          fill="white"
                        />
                      ))}
                    </g>
                  </mask>
                </defs>

                <g clipPath="url(#posterClip)" mask="url(#inkMask)">
                  <image
                    ref={detailPosterImageRef}
                    preserveAspectRatio="none"
                    href=""
                    x="0"
                    y="0"
                    width="474"
                    height="900"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
