import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWebsiteStore } from "@/hooks/useWebsiteStore";
import { addTestimonial } from "@/store/websiteStore";
import { CheckCircle2, Quote, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function StarRatingInput({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const starPositions = [1, 2, 3, 4, 5];
  return (
    <div className="flex gap-1">
      {starPositions.map((pos) => (
        <button
          key={pos}
          type="button"
          onMouseEnter={() => setHovered(pos)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(pos)}
        >
          <Star
            className="w-7 h-7 transition-colors"
            style={{
              fill: pos <= (hovered || rating) ? "#f59e0b" : "transparent",
              color: pos <= (hovered || rating) ? "#f59e0b" : "#d1d5db",
            }}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-500 self-center">
        {rating > 0
          ? `${rating} star${rating > 1 ? "s" : ""}`
          : "Select rating"}
      </span>
    </div>
  );
}

const RATING_POSITIONS = [1, 2, 3, 4, 5];

function StarRatingDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {RATING_POSITIONS.map((pos) => (
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

export function TestimonialsPage() {
  const store = useWebsiteStore();
  const approved = store.testimonials.filter((t) => t.approved);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !message.trim() || !rating) {
      toast.error("Please fill all fields and select a rating.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      addTestimonial({ name, role, message, rating });
      setLoading(false);
      setSubmitted(true);
    }, 500);
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-4">
            Reviews
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Customer Testimonials
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Real reviews from our satisfied customers across Chikmagalur and the
            Malnad region.
          </p>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {approved.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                No testimonials yet. Be the first!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approved.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl p-6 bg-white relative"
                  style={{
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="absolute top-4 right-4 opacity-10">
                    <Quote className="w-8 h-8 text-blue-600" />
                  </div>

                  <StarRatingDisplay rating={t.rating} />

                  <p className="text-gray-600 text-sm leading-relaxed mt-4 mb-5 italic">
                    "{t.message}"
                  </p>

                  <div className="flex items-center gap-3 mt-auto">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                      }}
                    >
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Submit form */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-extrabold text-gray-900 mb-4">
              Share Your Experience
            </h2>
            <p className="text-gray-500">
              Used our services? We'd love to hear from you.
            </p>
          </div>

          {submitted ? (
            <div
              className="rounded-3xl p-8 bg-white text-center"
              style={{ border: "1px solid #bbf7d0" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "#dcfce7" }}
              >
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
                Thank You for Your Review!
              </h3>
              <p className="text-gray-600 mb-4">
                Your testimonial is pending review by our team. It will appear
                on the website once approved.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setName("");
                  setRole("");
                  setMessage("");
                  setRating(5);
                }}
              >
                Submit Another Review
              </Button>
            </div>
          ) : (
            <div
              className="rounded-3xl p-8 bg-white"
              style={{
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="t-name">Your Name *</Label>
                    <Input
                      id="t-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="t-role">Your Role / Occupation *</Label>
                    <Input
                      id="t-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Homeowner, Chikmagalur"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="t-message">Your Review *</Label>
                  <Textarea
                    id="t-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your experience with our services..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label className="block mb-2">Rating *</Label>
                  <StarRatingInput rating={rating} onChange={setRating} />
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 text-white font-bold"
                  style={{ background: "#2563eb" }}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
