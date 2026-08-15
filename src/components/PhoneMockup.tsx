import { motion } from "framer-motion";
import { AudioLines, Scan, Sparkles, Target } from "lucide-react";
import { useAmbientTrack } from "@/lib/ambient";

function RobotArt() {
  return (
    <svg
      viewBox="0 0 240 300"
      className="h-auto w-40 sm:w-44"
      role="img"
      aria-label="Animated vintage robot"
    >
      <defs>
        <linearGradient id="robotBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e7e5e4" />
          <stop offset="55%" stopColor="#c9c5c2" />
          <stop offset="100%" stopColor="#a8a29e" />
        </linearGradient>
        <linearGradient id="robotDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#78716c" />
          <stop offset="100%" stopColor="#57534e" />
        </linearGradient>
      </defs>

      {/* shadow */}
      <ellipse cx="120" cy="286" rx="66" ry="10" fill="rgba(2,6,23,0.55)" />

      {/* legs */}
      <rect x="86" y="220" width="26" height="46" rx="10" fill="url(#robotDark)" />
      <rect x="128" y="220" width="26" height="46" rx="10" fill="url(#robotDark)" />
      <rect x="78" y="262" width="40" height="18" rx="9" fill="url(#robotDark)" />
      <rect x="122" y="262" width="40" height="18" rx="9" fill="url(#robotDark)" />

      {/* arms */}
      <rect x="30" y="136" width="26" height="84" rx="13" fill="url(#robotDark)" />
      <rect x="184" y="136" width="26" height="84" rx="13" fill="url(#robotDark)" />
      <circle cx="43" cy="224" r="15" fill="url(#robotDark)" />
      <circle cx="197" cy="224" r="15" fill="url(#robotDark)" />

      {/* body */}
      <rect x="58" y="120" width="124" height="112" rx="24" fill="url(#robotBody)" />
      {/* chest dial */}
      <circle cx="120" cy="168" r="24" fill="#0f172a" />
      <circle cx="120" cy="168" r="19" fill="none" stroke="#2dd4bf" strokeWidth="3" />
      <line x1="120" y1="149" x2="120" y2="158" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" />
      <line x1="120" y1="168" x2="133" y2="174" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" />
      <circle cx="120" cy="168" r="3" fill="#ccfbf1" />
      {/* vents */}
      <rect x="74" y="196" width="26" height="4" rx="2" fill="#a8a29e" />
      <rect x="74" y="206" width="26" height="4" rx="2" fill="#a8a29e" />
      <rect x="140" y="196" width="26" height="4" rx="2" fill="#a8a29e" />
      <rect x="140" y="206" width="26" height="4" rx="2" fill="#a8a29e" />

      {/* neck */}
      <rect x="108" y="102" width="24" height="20" rx="6" fill="url(#robotDark)" />

      {/* antenna */}
      <line x1="120" y1="42" x2="120" y2="14" stroke="#78716c" strokeWidth="5" strokeLinecap="round" />
      <circle cx="120" cy="13" r="7" fill="#2dd4bf" />

      {/* head */}
      <rect x="76" y="34" width="88" height="72" rx="20" fill="url(#robotBody)" />
      <rect x="62" y="56" width="14" height="26" rx="7" fill="url(#robotDark)" />
      <rect x="164" y="56" width="14" height="26" rx="7" fill="url(#robotDark)" />
      {/* eyes */}
      <circle cx="104" cy="66" r="11" fill="#0f172a" />
      <circle cx="136" cy="66" r="11" fill="#0f172a" />
      <circle cx="104" cy="66" r="6.5" fill="#2dd4bf" />
      <circle cx="136" cy="66" r="6.5" fill="#2dd4bf" />
      <circle cx="106.5" cy="63.5" r="2" fill="#f0fdfa" />
      <circle cx="138.5" cy="63.5" r="2" fill="#f0fdfa" />
      {/* mouth */}
      <rect x="110" y="86" width="20" height="6" rx="3" fill="#78716c" />
    </svg>
  );
}

export function PhoneMockup() {
  const active = useAmbientTrack();

  return (
    <div className="relative mx-auto w-full max-w-[330px]">
      {/* ambient glow */}
      <div className="absolute -inset-8 rounded-full bg-primary/15 blur-3xl" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        className="relative overflow-hidden rounded-[2.4rem] border border-stone-800/90 bg-stone-950 shadow-2xl shadow-stone-900/40"
      >
        {/* status bar */}
        <div className="flex items-center justify-between px-7 pt-5 text-[11px] font-semibold tracking-wide text-stone-400">
          <span>9:41</span>
          <span className="text-primary/90">Diorama</span>
          <span className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-teal-400" />
            AR
          </span>
        </div>

        {/* camera viewport */}
        <div className="relative mt-3 h-[400px] overflow-hidden sm:h-[430px]">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 0%, #134e4a 0%, #0f172a 55%, #020617 100%)",
            }}
          />
          {/* subtle vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_45%,transparent_55%,rgba(2,6,23,0.75)_100%)]" />

          {/* floor grid */}
          <div
            className="absolute inset-x-[-30%] bottom-[-30%] h-[68%] [transform:perspective(480px)_rotateX(58deg)]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(45,212,191,0.16) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(45,212,191,0.16) 1.5px, transparent 1.5px)",
              backgroundSize: "42px 42px",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 28%, black 70%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 28%, black 70%, transparent 100%)",
            }}
          />

          {/* viewfinder corners */}
          {[
            "left-5 top-5 border-l-2 border-t-2 rounded-tl-lg",
            "right-5 top-5 border-r-2 border-t-2 rounded-tr-lg",
            "left-5 bottom-24 border-l-2 border-b-2 rounded-bl-lg",
            "right-5 bottom-24 border-r-2 border-b-2 rounded-br-lg",
          ].map((cls) => (
            <div
              key={cls}
              className={`absolute size-8 border-teal-300/70 ${cls}`}
              aria-hidden
            />
          ))}

          {/* robot */}
          <div className="absolute inset-x-0 bottom-[84px] flex justify-center">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <RobotArt />
            </motion.div>
          </div>

          {/* chips */}
          <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-teal-200 backdrop-blur">
            AR Quick Look
          </div>
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-stone-200 backdrop-blur">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-teal-400" />
            </span>
            Tracking
          </div>
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 bottom-8 flex justify-center"
          >
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-stone-900/80 px-4 py-2 text-[11px] font-medium text-stone-100 backdrop-blur">
              <Target className="size-3.5 text-teal-300" />
              Tap the floor to place the robot
            </div>
          </motion.div>
        </div>

        {/* bottom bar */}
        <div className="flex items-center justify-between border-t border-white/10 bg-stone-900/90 px-6 py-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500">
              Soundtrack
            </p>
            <p className="truncate text-sm font-medium text-stone-100">
              {active ? `${active === "tidal" ? "Tidal" : "Night Drive"} · playing` : "None — choose below"}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-teal-900/50">
            <Scan className="size-5" strokeWidth={2.2} />
          </div>
        </div>
      </motion.div>

      {/* floating cards */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="absolute -left-6 top-24 hidden rounded-xl border border-border bg-white/90 px-4 py-3 shadow-xl shadow-stone-900/10 backdrop-blur sm:block"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
            <Sparkles className="size-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Animated in place</p>
            <p className="text-[11px] text-muted-foreground">Idle walk loop</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="absolute -right-6 bottom-32 hidden rounded-xl border border-border bg-white/90 px-4 py-3 shadow-xl shadow-stone-900/10 backdrop-blur sm:block"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
            <AudioLines className="size-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Two soundtracks</p>
            <p className="text-[11px] text-muted-foreground">Tidal or Night Drive</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
