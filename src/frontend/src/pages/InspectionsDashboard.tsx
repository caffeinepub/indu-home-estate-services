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
import { updateInspectionStatus } from "@/store/websiteStore";
import type { Inspection } from "@/types/website";
import { Calendar, CheckCircle, Clock, Search, XCircle } from "lucide-react";

const STATUS_CONFIG: Record<
  Inspection["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

function isNew(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000;
}

export function InspectionsDashboard() {
  const store = useWebsiteStore();
  const inspections = store.inspections;

  const pendingCount = inspections.filter((i) => i.status === "pending").length;
  const scheduledCount = inspections.filter(
    (i) => i.status === "scheduled",
  ).length;
  const completedCount = inspections.filter(
    (i) => i.status === "completed",
  ).length;

  const summary = [
    {
      label: "Total Inspections",
      value: inspections.length,
      icon: Search,
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
      label: "Scheduled",
      value: scheduledCount,
      icon: Calendar,
      bg: "#dbeafe",
      color: "#2563eb",
    },
    {
      label: "Completed",
      value: completedCount,
      icon: CheckCircle,
      bg: "#dcfce7",
      color: "#16a34a",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Inspections
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Free inspection requests submitted through the website.
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
        {inspections.length === 0 ? (
          <div className="py-16 text-center">
            <XCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-sm text-muted-foreground">
              No inspection requests yet. They will appear here when submitted
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
                  <TableHead>Service Type</TableHead>
                  <TableHead>Preferred Date</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspections.map((insp) => (
                  <TableRow key={insp.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {insp.name}
                        {isNew(insp.createdAt) && (
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
                    <TableCell>{insp.phone}</TableCell>
                    <TableCell>{insp.serviceType}</TableCell>
                    <TableCell>{insp.preferredDate}</TableCell>
                    <TableCell className="max-w-[200px]">
                      <span
                        className="text-xs truncate block"
                        title={insp.address}
                      >
                        {insp.address}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={insp.status}
                        onValueChange={(v) =>
                          updateInspectionStatus(
                            insp.id,
                            v as Inspection["status"],
                          )
                        }
                      >
                        <SelectTrigger className="w-32 h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(
                            [
                              "pending",
                              "scheduled",
                              "completed",
                              "cancelled",
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
                      {new Date(insp.createdAt).toLocaleDateString("en-IN", {
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
