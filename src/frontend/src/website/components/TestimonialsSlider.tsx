import { useWebsiteStore } from "@/hooks/useWebsiteStore";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";

const STAR_POSITIONS = [1, 2, 3, 4, 5];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {STAR_POSITIONS.map((pos) => (
        <Star
          key={pos}
          className="w-4 h-4"
          style={{
            fill: pos <= rating ? "#f59e0b" : "transparent",
            color: pos <= rating ? "#f59e0b" : "#d1d5db",
          }}
        />
      ))}
    </div>
  );
}

export function TestimonialsSlider() {
  const store = useWebsiteStore();
  const approved = store.testimonials.filter((t) => t.approved);
  const [current, setCurrent] = useState(0);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (approved.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % approved.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [approved.length]);

  if (approved.length === 0) return null;

  const prev = () =>
    setCurrent((c) => (c - 1 + approved.length) % approved.length);
  const next = () => setCurrent((c) => (c + 1) % approved.length);

  // Show 1 on mobile, up to 3 on desktop
  const visibleCount = Math.min(3, approved.length);
  const visibleTestimonials = Array.from(
    { length: visibleCount },
    (_, i) => approved[(current + i) % approved.length],
  );

  return (
    <section
      className="py-20"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-3">
            Customer Reviews
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-400 text-base max-w-xl mx-auto">
            Real experiences from our satisfied customers across Chikmagalur and
            the Malnad region.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {visibleTestimonials.map((t, i) => (
            <div
              key={t.id}
              className="rounded-2xl p-6 relative"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                opacity: i === 0 ? 1 : 0.85,
                transition: "all 0.5s ease",
              }}
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 opacity-20">
                <Quote className="w-8 h-8 text-blue-400" />
              </div>

              {/* Stars */}
              <div className="mb-4">
                <StarRating rating={t.rating} />
              </div>

              {/* Message */}
              <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
                "{t.message}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                  }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        {approved.length > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {approved.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? "24px" : "8px",
                    height: "8px",
                    background:
                      i === current ? "#3b82f6" : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
