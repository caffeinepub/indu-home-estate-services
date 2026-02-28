import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWebsiteStore } from "@/hooks/useWebsiteStore";
import { updateQuotationStatus } from "@/store/websiteStore";
import type { Quotation } from "@/types/website";
import { CheckCircle, Clock, FileText, XCircle } from "lucide-react";

const STATUS_CONFIG: Record<
  Quotation["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  quoted: {
    label: "Quoted",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  accepted: {
    label: "Accepted",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

function isNew(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000;
}

export function QuotationsDashboard() {
  const store = useWebsiteStore();
  const quotations = store.quotations;

  const pendingCount = quotations.filter((q) => q.status === "pending").length;
  const quotedCount = quotations.filter((q) => q.status === "quoted").length;
  const acceptedCount = quotations.filter(
    (q) => q.status === "accepted",
  ).length;

  const summary = [
    {
      label: "Total Quotations",
      value: quotations.length,
      icon: FileText,
      bg: "#dbeafe",
      color: "#2563eb",
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: Clock,
      bg: "#fef3c7",
      color: "#d97706",
    },
    {
      label: "Quoted",
      value: quotedCount,
      icon: FileText,
      bg: "#dbeafe",
      color: "#2563eb",
    },
    {
      label: "Accepted",
      value: acceptedCount,
      icon: CheckCircle,
      bg: "#dcfce7",
      color: "#16a34a",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Quotation Requests
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quotation requests submitted through the website.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summary.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-xl border border-[#E5E7EB] bg-white p-4 flex flex-col gap-3 shadow-xs"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: s.bg }}
              >
                <Icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <div>
                <p
                  className="font-display text-2xl font-semibold"
                  style={{ color: s.color }}
                >
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden shadow-xs">
        {quotations.length === 0 ? (
          <div className="py-16 text-center">
            <XCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-sm text-muted-foreground">
              No quotation requests yet. They will appear here when submitted
              via the website.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Service Required</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {q.name}
                        {isNew(q.createdAt) && (
                          <Badge
                            className="text-[10px] px-1.5 py-0 h-4"
                            style={{
                              background: "#dcfce7",
                              color: "#16a34a",
                              border: "1px solid #bbf7d0",
                            }}
                          >
                            New
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{q.phone}</TableCell>
                    <TableCell>{q.serviceRequired}</TableCell>
                    <TableCell className="max-w-[180px]">
                      <span
                        className="text-xs truncate block"
                        title={q.description}
                      >
                        {q.description}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[160px]">
                      <span
                        className="text-xs truncate block"
                        title={q.address}
                      >
                        {q.address}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={q.status}
                        onValueChange={(v) =>
                          updateQuotationStatus(q.id, v as Quotation["status"])
                        }
                      >
                        <SelectTrigger className="w-28 h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(
                            [
                              "pending",
                              "quoted",
                              "accepted",
                              "rejected",
                            ] as const
                          ).map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">
                              {STATUS_CONFIG[s].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(q.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
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
