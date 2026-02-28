import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWebsiteStore } from "@/hooks/useWebsiteStore";
import { approveTestimonial, rejectTestimonial } from "@/store/websiteStore";
import { CheckCircle, Star, ThumbsDown, XCircle } from "lucide-react";
import { toast } from "sonner";

const STAR_POS = [1, 2, 3, 4, 5];

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {STAR_POS.map((pos) => (
        <Star
          key={pos}
          className="w-3 h-3"
          style={{
            fill: pos <= rating ? "#f59e0b" : "transparent",
            color: pos <= rating ? "#f59e0b" : "#d1d5db",
          }}
        />
      ))}
    </div>
  );
}

export function TestimonialsAdminPage() {
  const store = useWebsiteStore();
  const testimonials = store.testimonials;

  const approvedCount = testimonials.filter((t) => t.approved).length;
  const pendingCount = testimonials.filter((t) => !t.approved).length;

  const handleApprove = (id: string) => {
    approveTestimonial(id);
    toast.success("Testimonial approved.");
  };

  const handleReject = (id: string) => {
    if (confirm("Remove this testimonial?")) {
      rejectTestimonial(id);
      toast.success("Testimonial removed.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Testimonials
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage customer reviews submitted through the website.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total",
            value: testimonials.length,
            bg: "#dbeafe",
            color: "#2563eb",
          },
          {
            label: "Approved",
            value: approvedCount,
            bg: "#dcfce7",
            color: "#16a34a",
          },
          {
            label: "Pending Review",
            value: pendingCount,
            bg: "#fef3c7",
            color: "#d97706",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-xs"
          >
            <p
              className="font-display text-2xl font-semibold"
              style={{ color: s.color }}
            >
              {s.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden shadow-xs">
        {testimonials.length === 0 ? (
          <div className="py-16 text-center">
            <XCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-sm text-muted-foreground">
              No testimonials yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {t.role}
                    </TableCell>
                    <TableCell>
                      <StarDisplay rating={t.rating} />
                    </TableCell>
                    <TableCell className="max-w-[220px]">
                      <p
                        className="text-xs text-muted-foreground truncate"
                        title={t.message}
                      >
                        {t.message}
                      </p>
                    </TableCell>
                    <TableCell>
                      {t.approved ? (
                        <Badge
                          className="text-[10px] font-semibold"
                          style={{
                            background: "#dcfce7",
                            color: "#16a34a",
                            border: "1px solid #bbf7d0",
                          }}
                        >
                          Approved
                        </Badge>
                      ) : (
                        <Badge
                          className="text-[10px] font-semibold"
                          style={{
                            background: "#fef3c7",
                            color: "#d97706",
                            border: "1px solid #fde68a",
                          }}
                        >
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(t.createdAt).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {!t.approved && (
                          <Button
                            type="button"
                            size="sm"
                            className="h-7 text-xs gap-1 text-white"
                            style={{ background: "#16a34a" }}
                            onClick={() => handleApprove(t.id)}
                          >
                            <CheckCircle className="w-3 h-3" />
                            Approve
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={() => handleReject(t.id)}
                        >
                          <ThumbsDown className="w-3 h-3" />
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
