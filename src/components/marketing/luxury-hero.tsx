"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function LuxuryHero() {
  return (
    <section className="relative min-h-[min(100svh,920px)] overflow-hidden bg-onyx">
      <Image
        src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=2000&q=80"
        alt=""
        fill
        priority
        className="object-cover object-center opacity-90"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/50 to-onyx/20"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-onyx/80 via-transparent to-onyx/30" />

      <div className="relative z-10 mx-auto flex min-h-[min(100svh,920px)] max-w-6xl flex-col justify-end px-6 pb-20 pt-32 md:px-10 md:pb-28 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne/90">
            Mobile massage concierge
          </p>
          <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,4.75rem)] font-light leading-[1.05] tracking-[-0.02em] text-champagne">
            Stillness, brought to your door.
          </h1>
          <p className="mt-8 max-w-xl text-lg font-light leading-relaxed text-champagne/85 md:text-xl">
            A private wellness experience for the moments that matter—whether you
            are at home, in residence, or traveling. Discreet. Licensed.
            Impeccably considered.
          </p>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="#reserve"
                className="inline-flex min-h-[3.25rem] items-center justify-center border border-gold/60 bg-gold/10 px-10 text-[11px] font-semibold uppercase tracking-[0.25em] text-champagne backdrop-blur-sm transition-colors duration-300 hover:border-gold hover:bg-gold/25 touch-manipulation"
              >
                Request a session
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/therapist"
                scroll={false}
                className="inline-flex min-h-[3.25rem] items-center justify-center px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-champagne/80 underline-offset-8 transition-colors duration-300 hover:text-champagne hover:underline touch-manipulation"
              >
                Independent professionals →
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
