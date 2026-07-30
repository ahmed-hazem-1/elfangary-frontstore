"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import type { Locale } from "@/i18n/routing";

type Slide = {
  id: string;
  image?: string | null;
  pill?: string;
  title: string;
  subtitle: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  bgColorClass?: string;
};

export default function HeroCarousel({ slides, locale }: { slides: Slide[]; locale: Locale }) {
  const [current, setCurrent] = useState(0);

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const next = () => setCurrent((p) => (p + 1) % slides.length);
  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);

  return (
    <section className="mt-2 sm:mt-4">
      {/* Premium Hero Container */}
      <div 
        className="relative mx-auto w-full max-w-[1920px] overflow-hidden sm:rounded-3xl sm:px-4 lg:px-8 h-[70vh] min-h-[400px] sm:h-[75vh] sm:min-h-[500px] lg:h-[85vh] lg:min-h-[700px] shadow-sm bg-ink-dark/5"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute inset-0 flex flex-col justify-center px-4 sm:px-12 lg:px-24 ${slides[current].bgColorClass || 'bg-white'}`}
          >
            {slides[current].image ? (
              <Image
                src={slides[current].image!}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-60 mix-blend-multiply"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent" />
            <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />

            <div className="relative z-10 w-full max-w-3xl mx-auto text-center flex flex-col items-center mt-12 lg:mt-0">
              {slides[current].pill && (
                <span className="pill mb-6 lg:mb-8 text-brand-orange border-brand-orange/20 bg-white/60 backdrop-blur-md px-4 py-1.5 text-sm lg:text-base font-medium shadow-sm">
                  {slides[current].pill}
                </span>
              )}
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight leading-[1.15] text-ink-dark lg:text-7xl font-arabic drop-shadow-sm">
                {slides[current].title}
              </h1>
              <p className="mt-4 sm:mt-6 lg:mt-8 text-base leading-relaxed text-ink-muted sm:text-xl lg:text-2xl max-w-2xl">
                {slides[current].subtitle}
              </p>
              <div className="mt-6 sm:mt-10 lg:mt-12 flex flex-col sm:flex-row flex-wrap gap-4 justify-center w-full sm:w-auto">
                {slides[current].ctaPrimary && (
                  <Link href={slides[current].ctaPrimary.href} className="btn-primary px-8 py-3.5 text-base lg:text-lg w-full sm:w-auto shadow-premium">
                    {slides[current].ctaPrimary.label}
                  </Link>
                )}
                {slides[current].ctaSecondary && (
                  <Link href={slides[current].ctaSecondary.href} className="btn-secondary px-8 py-3.5 text-base lg:text-lg w-full sm:w-auto bg-white/70 backdrop-blur-md">
                    {slides[current].ctaSecondary.label}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Premium Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                idx === current ? "w-10 bg-brand-orange" : "w-2.5 bg-ink-dark/30 hover:bg-ink-dark/50 hover:scale-110"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Subtle Navigation Arrows (Hidden on mobile for cleaner look) */}
        <button 
          onClick={locale === 'ar' ? next : prev}
          className="hidden sm:flex absolute top-1/2 -translate-y-1/2 z-20 left-6 lg:left-12 h-12 w-12 items-center justify-center rounded-full bg-white/50 backdrop-blur-md text-ink-dark/70 shadow-sm hover:bg-white hover:text-brand-orange hover:shadow-md transition-all duration-300 hover:scale-105"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
        </button>

        <button 
          onClick={locale === 'ar' ? prev : next}
          className="hidden sm:flex absolute top-1/2 -translate-y-1/2 z-20 right-6 lg:right-12 h-12 w-12 items-center justify-center rounded-full bg-white/50 backdrop-blur-md text-ink-dark/70 shadow-sm hover:bg-white hover:text-brand-orange hover:shadow-md transition-all duration-300 hover:scale-105"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
        </button>

      </div>
    </section>
  );
}
