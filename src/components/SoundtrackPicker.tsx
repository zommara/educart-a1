import { motion } from "framer-motion";
import { AudioLines, MoonStar, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { engine, TRACKS, useAmbientTrack } from "@/lib/ambient";

function Equalizer({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-6 items-end gap-[3px]", className)} aria-hidden>
      {[0.9, 0.45, 0.65, 0.3, 0.75].map((peak, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-primary"
          style={{ height: "100%" }}
          animate={{ scaleY: [0.25, peak, 0.4, peak, 0.25] }}
          transition={{
            duration: 0.9 + i * 0.18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.12,
          }}
        />
      ))}
    </div>
  );
}

export function SoundtrackPicker() {
  const active = useAmbientTrack();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {TRACKS.map((track) => {
        const playing = active === track.id;
        const Icon = track.id === "tidal" ? Waves : MoonStar;
        return (
          <div
            key={track.id}
            className={cn(
              "group relative flex flex-col gap-5 rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300",
              playing
                ? "border-primary/40 shadow-lg shadow-primary/10"
                : "border-border/80 hover:border-primary/25 hover:shadow-md",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className={cn(
                  "flex size-11 items-center justify-center rounded-xl transition-colors",
                  playing
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-primary",
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="flex items-center gap-3">
                {playing && <Equalizer className="h-5" />}
                <Switch
                  checked={playing}
                  onCheckedChange={() => void engine.toggle(track.id)}
                  aria-label={`${playing ? "Stop" : "Play"} ${track.name}`}
                />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                  {track.name}
                </h3>
                <span className="text-sm font-medium text-primary">
                  {track.tagline}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {track.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {track.tempo}
                </span>
                <span className="rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {track.mood}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AudioLines className="size-3.5" />
              <span>
                {playing
                  ? `Now playing — ${track.name}`
                  : "Tap the toggle to preview. Only one track plays at a time."}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
