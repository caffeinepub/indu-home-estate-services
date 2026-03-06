import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  MessageSquare,
  Star,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { useState } from "react";

type ReviewStatus = "approved" | "pending" | "rejected";

interface Review {
  id: number;
  customerName: string;
  service: string;
  subService: string;
  rating: number;
  comment: string;
  date: string;
  status: ReviewStatus;
}

const SEED_REVIEWS: Review[] = [
  {
    id: 1,
    customerName: "Ravi Shankar",
    service: "Deep Cleaning",
    subService: "Full House Deep Cleaning",
    rating: 5,
    comment: "Excellent service! Team was professional and thorough.",
    date: "2026-03-01",
    status: "approved",
  },
  {
    id: 2,
    customerName: "Lakshmi Devi",
    service: "Plumbing",
    subService: "Pipe Installation",
    rating: 4,
    comment: "Good work, completed on time.",
    date: "2026-03-02",
    status: "approved",
  },
  {
    id: 3,
    customerName: "Suresh Babu",
    service: "AC Service",
    subService: "AC Gas Filling",
    rating: 3,
    comment: "Average service, took longer than expected.",
    date: "2026-03-03",
    status: "pending",
  },
  {
    id: 4,
    customerName: "Anitha Kumari",
    service: "Painting",
    subService: "Interior Painting",
    rating: 5,
    comment: "Beautiful finish, very happy!",
    date: "2026-03-04",
    status: "pending",
  },
  {
    id: 5,
    customerName: "Prakash Hegde",
    service: "Pest Control",
    subService: "Termite Control",
    rating: 2,
    comment: "Treatment done but pests still visible.",
    date: "2026-03-05",
    status: "pending",
  },
  {
    id: 6,
    customerName: "Meera Nair",
    service: "Estate Maintenance",
    subService: "Garden Maintenance",
    rating: 5,
    comment: "Amazing team, our estate looks beautiful now.",
    date: "2026-02-28",
    status: "approved",
  },
];

type FilterTab = "all" | "pending" | "approved" | "rejected";

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

function StatusBadgeReview({ status }: { status: ReviewStatus }) {
  if (status === "approved") {
    return (
      <Badge className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
        Approved
      </Badge>
    );
  }
  if (status === "rejected") {
    return (
      <Badge className="text-xs bg-red-50 text-red-700 border border-red-200">
        Rejected
      </Badge>
    );
  }
  return (
    <Badge className="text-xs bg-amber-50 text-amber-700 border border-amber-200">
      Pending
    </Badge>
  );
}

export function RatingsPage() {
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const totalReviews = reviews.length;
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;

  const filtered = reviews.filter((r) => {
    if (activeTab === "all") return true;
    return r.status === activeTab;
  });

  const handleApprove = (id: number) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "approved" as ReviewStatus } : r,
      ),
    );
  };

  const handleReject = (id: number) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "rejected" as ReviewStatus } : r,
      ),
    );
  };

  const handleDelete = (id: number) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: `All (${totalReviews})` },
    { key: "pending", label: `Pending (${pendingCount})` },
    { key: "approved", label: `Approved (${approvedCount})` },
    {
      key: "rejected",
      label: `Rejected (${reviews.filter((r) => r.status === "rejected").length})`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Customer Ratings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and moderate customer feedback and ratings.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <p className="text-xs text-muted-foreground">Total Reviews</p>
          </div>
          <p className="font-display text-2xl font-bold text-[#2563EB]">
            {totalReviews}
          </p>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-amber-500" />
            <p className="text-xs text-muted-foreground">Avg Rating</p>
          </div>
          <p className="font-display text-2xl font-bold text-amber-600">
            {avgRating.toFixed(1)}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              /5
            </span>
          </p>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-amber-500" />
            <p className="text-xs text-muted-foreground">Pending Approval</p>
          </div>
          <p className="font-display text-2xl font-bold text-[#EA580C]">
            {pendingCount}
          </p>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <p className="text-xs text-muted-foreground">Approved</p>
          </div>
          <p className="font-display text-2xl font-bold text-[#16A34A]">
            {approvedCount}
          </p>
        </div>
      </div>

      {/* Rating bar */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-display text-3xl font-bold text-[#111827]">
              {avgRating.toFixed(1)}
            </span>
            <div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i <= Math.round(avgRating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Based on {totalReviews} reviews
              </p>
            </div>
          </div>
          <div className="flex-1 min-w-[200px] space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-3">
                    {star}
                  </span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-4 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-white border border-[#E5E7EB] text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab(tab.key)}
            data-ocid="ratings.tab"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Review cards */}
      {filtered.length === 0 ? (
        <div
          className="rounded-xl border border-[#E5E7EB] bg-white p-12 text-center text-muted-foreground text-sm shadow-xs"
          data-ocid="ratings.empty_state"
        >
          No reviews found for this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((review, idx) => (
            <div
              key={review.id}
              className={`rounded-xl border bg-white p-5 shadow-xs transition-colors ${
                review.status === "pending"
                  ? "border-amber-300"
                  : "border-[#E5E7EB]"
              }`}
              data-ocid={`ratings.card.${idx + 1}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground text-sm">
                      {review.customerName}
                    </p>
                    <StatusBadgeReview status={review.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {review.service} — {review.subService}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <StarDisplay rating={review.rating} />
                    <span className="text-xs text-muted-foreground">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-foreground mt-3 leading-relaxed">
                "{review.comment}"
              </p>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/60">
                {review.status !== "approved" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2.5 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50 gap-1"
                    onClick={() => handleApprove(review.id)}
                    data-ocid={`ratings.approve_button.${idx + 1}`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    Approve
                  </Button>
                )}
                {review.status !== "rejected" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2.5 text-xs text-red-600 border-red-200 hover:bg-red-50 gap-1"
                    onClick={() => handleReject(review.id)}
                  >
                    <ThumbsDown className="w-3 h-3" />
                    Reject
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-1.5 ml-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(review.id)}
                  data-ocid={`ratings.delete_button.${idx + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
