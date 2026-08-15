import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center"
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Compass className="size-6" />
      </div>
      <h1 className="mt-6 font-display text-6xl font-bold tracking-tight">404</h1>
      <p className="mt-3 max-w-sm text-muted-foreground">
        This page isn&apos;t part of the scene. Head back to the experience.
      </p>
      <Button asChild className="mt-8">
        <a href="/">Back to Diorama</a>
      </Button>
    </motion.div>
  );
}
