import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  Check,
  Compass,
  Hand,
  Info,
  Scan,
  Smartphone,
  Sparkles,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PhoneMockup } from "@/components/PhoneMockup";
import { SoundtrackPicker } from "@/components/SoundtrackPicker";
import { deviceState, guidanceFor, launchQuickLook } from "@/lib/ar";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const STEPS = [
  {
    icon: Smartphone,
    step: "01",
    title: "Open on your iPhone",
    body: "Visit this page in Safari on your iPhone or iPad. Everything runs in the browser — no app store, no install.",
  },
  {
    icon: Camera,
    step: "02",
    title: "Scan your floor",
    body: "Tap Launch AR and move the phone slowly until a tracking grid appears on the surface. A well-lit room helps.",
  },
  {
    icon: Hand,
    step: "03",
    title: "Place & play",
    body: "Tap the surface to anchor the robot. It settles into the scene, animates in place, and you can walk around it.",
  },
];

const REQUIREMENTS = [
  "iOS 13 or later — AR Quick Look is built into every modern iPhone and iPad",
  "Safari — Chrome and Firefox on iOS route through WebKit, so Quick Look still works",
  "Rear camera — used for world tracking and surface placement",
  "Sound on — for the two ambient soundtracks",
];

const STATS = [
  { value: "1", label: "animated object, nothing else in the scene" },
  { value: "2", label: "ambient soundtracks, one toggle each" },
  { value: "12 MB", label: "model streams on demand, then you're in AR" },
  { value: "iOS", label: "only — AR Quick Look is Apple's own viewer" },
];

export default function Landing() {
  const [helpOpen, setHelpOpen] = useState(false);
  const guidance = guidanceFor(deviceState());

  const handleLaunch = () => {
    if (launchQuickLook()) {
      toast("Opening AR Quick Look…", {
        description: "Scan the floor, then tap to place the robot.",
        icon: <Scan className="size-4 text-primary" />,
      });
    } else {
      setHelpOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* top glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] -z-10"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 0%, oklch(0.88 0.05 190 / 0.35) 0%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="#" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/30">
              <Scan className="size-4" strokeWidth={2.4} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Diorama
            </span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#soundtracks" className="transition-colors hover:text-foreground">
              Soundtracks
            </a>
            <a href="#how" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#requirements" className="transition-colors hover:text-foreground">
              Requirements
            </a>
          </nav>
          <Button size="sm" onClick={handleLaunch} className="gap-1.5">
            Open in AR
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28 lg:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Sparkles className="size-3.5" />
              iOS · AR Quick Look experience
            </div>

            <h1 className="mt-6 font-display text-[2.6rem] font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.1rem]">
              One object.
              <br />
              <span className="text-primary">Your space.</span>
              <br />
              Your soundtrack.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Diorama places a single animated 3D model onto any real surface
              through your iPhone&apos;s rear camera — then lets you set the mood
              with two ambient soundtracks. No app to install. Just Safari.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={handleLaunch} className="gap-2">
                <Scan className="size-5" strokeWidth={2.2} />
                Launch AR experience
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => {
                  document
                    .getElementById("soundtracks")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Volume2 className="size-4" />
                Preview soundtracks
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Smartphone className="size-4 text-primary" />
                iPhone &amp; iPad
              </span>
              <span className="flex items-center gap-2">
                <Camera className="size-4 text-primary" />
                Rear-camera tracking
              </span>
              <span className="flex items-center gap-2">
                <Check className="size-4 text-primary" />
                Works only on iOS
              </span>
            </div>
          </motion.div>

          <PhoneMockup />
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-border/70 bg-card/60">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-5 py-10 sm:px-8 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.value}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            >
              <p className="font-display text-3xl font-bold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Soundtracks */}
      <section id="soundtracks" className="scroll-mt-20">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Soundtracks
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Two moods. One toggle each.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Both tracks are generated live in your browser — no audio files to
              buffer. They play while you browse, and pause while AR is open.
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="mt-10">
            <SoundtrackPicker />
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 border-y border-border/70 bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Three steps to your own diorama
            </h2>
          </motion.div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, step, title, body }, i) => (
              <motion.div
                key={step}
                {...fadeUp}
                transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5"
              >
                <span className="pointer-events-none absolute -right-2 -top-5 font-display text-[5.5rem] font-bold leading-none text-foreground/[0.04] transition-colors group-hover:text-primary/[0.07]">
                  {step}
                </span>
                <div className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
                  {body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section id="requirements" className="scroll-mt-20">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
          <motion.div
            {...fadeUp}
            className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-xl shadow-primary/[0.04]"
          >
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative overflow-hidden bg-stone-950 p-9 sm:p-12">
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(90% 70% at 20% 0%, oklch(0.45 0.11 190 / 0.45) 0%, transparent 60%)",
                  }}
                  aria-hidden
                />
                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
                    Built for iOS
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white">
                    AR Quick Look,
                    <br />
                    front and center.
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-stone-300">
                    This site hands a single USDZ model to Apple&apos;s native AR
                    viewer and gets out of the way. The rear camera does real
                    world tracking; the grid is your cue to place.
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-xs text-stone-400">
                    <Info className="size-3.5" />
                    Android and desktop fall back to a preview of this page.
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-4 p-9 sm:p-12">
                {REQUIREMENTS.map((req) => (
                  <div key={req} className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <p className="text-sm leading-6 text-foreground/85">{req}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA band */}
      <section className="px-5 pb-24 sm:px-8">
        <motion.div
          {...fadeUp}
          className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl bg-stone-950 px-6 py-16 text-center sm:px-12 lg:py-20"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(75% 80% at 50% 0%, oklch(0.45 0.11 190 / 0.5) 0%, transparent 65%)",
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-teal-300/20 bg-teal-400/10 text-teal-300">
              <Scan className="size-5" strokeWidth={2.2} />
            </div>
            <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Step into the scene.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-300 sm:text-base">
              Point your rear camera at the floor, watch the grid form, and let
              the robot join your room. Pick a soundtrack first if you like.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={handleLaunch}
                className="bg-white text-stone-950 shadow-xl shadow-black/30 hover:bg-stone-100"
              >
                <Scan className="size-4" strokeWidth={2.2} />
                Launch AR experience
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/10"
                onClick={() => {
                  document
                    .getElementById("soundtracks")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Compass className="size-4" />
                Choose a soundtrack
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Scan className="size-3.5" strokeWidth={2.4} />
            </span>
            <span className="font-display text-base font-bold tracking-tight">
              Diorama
            </span>
            <span className="ml-1 text-sm text-muted-foreground">
              — one animated object, placed in the real world.
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#soundtracks" className="transition-colors hover:text-foreground">
              Soundtracks
            </a>
            <a href="#how" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Back to top
            </a>
          </div>
        </div>
        <div className="border-t border-border/50 py-4 text-center text-xs text-muted-foreground/80">
          Made with AR Quick Look · USDZ · Web Audio — iOS only
        </div>
      </footer>

      {/* Unsupported device dialog */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Smartphone className="size-5" />
            </div>
            <DialogTitle className="font-display text-xl tracking-tight">
              {guidance.title}
            </DialogTitle>
            <DialogDescription className="leading-6">
              {guidance.body}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setHelpOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setHelpOpen(false);
                if (launchQuickLook()) {
                  toast("Opening AR Quick Look…", {
                    description: "Scan the floor, then tap to place the robot.",
                  });
                } else {
                  setHelpOpen(true);
                }
              }}
            >
              Retry on iPhone
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
