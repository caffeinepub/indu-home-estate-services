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
import { updateMessageStatus } from "@/store/websiteStore";
import type { ContactMessage } from "@/types/website";
import { Mail, MessageCircle, XCircle } from "lucide-react";

const STATUS_CONFIG: Record<
  ContactMessage["status"],
  { label: string; className: string }
> = {
  new: {
    label: "New",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  read: {
    label: "Read",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  replied: {
    label: "Replied",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

function isNew(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000;
}

export function ContactMessagesDashboard() {
  const store = useWebsiteStore();
  const messages = store.contactMessages;

  const newCount = messages.filter((m) => m.status === "new").length;
  const readCount = messages.filter((m) => m.status === "read").length;
  const repliedCount = messages.filter((m) => m.status === "replied").length;

  const summary = [
    {
      label: "Total Messages",
      value: messages.length,
      icon: MessageCircle,
      bg: "#dbeafe",
      color: "#2563eb",
    },
    {
      label: "New / Unread",
      value: newCount,
      icon: Mail,
      bg: "#fef3c7",
      color: "#d97706",
    },
    {
      label: "Read",
      value: readCount,
      icon: Mail,
      bg: "#dbeafe",
      color: "#2563eb",
    },
    {
      label: "Replied",
      value: repliedCount,
      icon: MessageCircle,
      bg: "#dcfce7",
      color: "#16a34a",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Contact Messages
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Messages received through the website contact form.
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
        {messages.length === 0 ? (
          <div className="py-16 text-center">
            <XCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-sm text-muted-foreground">
              No contact messages yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {m.name}
                        {isNew(m.createdAt) && (
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
                    <TableCell>{m.phone}</TableCell>
                    <TableCell className="text-sm text-blue-600">
                      <a href={`mailto:${m.email}`}>{m.email}</a>
                    </TableCell>
                    <TableCell className="max-w-[220px]">
                      <p
                        className="text-xs text-muted-foreground truncate"
                        title={m.message}
                      >
                        {m.message}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={m.status}
                        onValueChange={(v) =>
                          updateMessageStatus(
                            m.id,
                            v as ContactMessage["status"],
                          )
                        }
                      >
                        <SelectTrigger className="w-24 h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(["new", "read", "replied"] as const).map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">
                              {STATUS_CONFIG[s].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(m.createdAt).toLocaleDateString("en-IN", {
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
