"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const next = () => {
    setDirection(1);
    setCurrent((p) => (p + 1) % slides.length);
  };
  const prev = () => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? (locale === "ar" ? "-100%" : "100%") : (locale === "ar" ? "100%" : "-100%"),
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? (locale === "ar" ? "-100%" : "100%") : (locale === "ar" ? "100%" : "-100%"),
      opacity: 0,
    }),
  };

  return (
    <section className="mt-2 sm:mt-4">
      {/* Premium Hero Container */}
      <div 
        className="relative mx-auto w-full max-w-[1920px] overflow-hidden sm:rounded-3xl sm:px-4 lg:px-8 h-[calc(100vh-120px)] min-h-[350px] sm:min-h-[400px] lg:min-h-[450px] shadow-sm bg-ink-dark/5"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current + "-bg"}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -10000 || offset.x < -50) {
                locale === 'ar' ? prev() : next();
              } else if (swipe > 10000 || offset.x > 50) {
                locale === 'ar' ? next() : prev();
              }
            }}
            className={`absolute inset-0 cursor-grab active:cursor-grabbing ${slides[current].bgColorClass || 'bg-white'}`}
          >
            {slides[current].image && (
              <Image
                src={slides[current].image}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-60 mix-blend-multiply"
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-t from-white/90 via-white/50 to-transparent" />
        <div className="pointer-events-none absolute inset-0 z-[5] bg-white/20 backdrop-blur-[2px]" />

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={current + "-text"}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -10000 || offset.x < -50) {
                locale === 'ar' ? prev() : next();
              } else if (swipe > 10000 || offset.x > 50) {
                locale === 'ar' ? next() : prev();
              }
            }}
            className="absolute inset-0 z-10 flex flex-col justify-center px-4 sm:px-12 lg:px-24 pointer-events-none"
          >
            <div className="relative w-full max-w-3xl mx-auto text-center flex flex-col items-center mt-12 lg:mt-0 pointer-events-auto cursor-grab active:cursor-grabbing">
              {slides[current].pill && (
                <span className="pill mb-4 lg:mb-5 text-brand-orange border-brand-orange/20 bg-white/60 backdrop-blur-md px-2 py-0.5 text-[10px] lg:text-xs font-medium shadow-sm">
                  {slides[current].pill}
                </span>
              )}
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight leading-[1.15] text-ink-dark lg:text-4xl font-arabic drop-shadow-sm">
                {slides[current].title}
              </h1>
              <p className="mt-3 sm:mt-4 lg:mt-5 text-xs leading-relaxed text-ink-muted sm:text-sm lg:text-base max-w-xl">
                {slides[current].subtitle}
              </p>
              <div className="mt-5 sm:mt-6 lg:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 justify-center w-full sm:w-auto">
                {slides[current].ctaPrimary && (
                  <Link href={slides[current].ctaPrimary.href} className="btn-primary px-5 py-2 text-xs lg:text-sm w-full sm:w-auto shadow-premium">
                    {slides[current].ctaPrimary.label}
                  </Link>
                )}
                {slides[current].ctaSecondary && (
                  <Link href={slides[current].ctaSecondary.href} className="btn-secondary px-5 py-2 text-xs lg:text-sm w-full sm:w-auto bg-white/70 backdrop-blur-md">
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
              onClick={() => {
                setDirection(idx > current ? 1 : -1);
                setCurrent(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                idx === current ? "w-10 bg-brand-orange" : "w-2.5 bg-ink-dark/30 hover:bg-ink-dark/50 hover:scale-110"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
