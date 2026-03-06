import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { exportToCsv } from "@/utils/exportToExcel";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  Plus,
  RefreshCw,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";

type AMCStatus = "active" | "expired" | "pending";

interface AMCContract {
  id: number;
  customerName: string;
  phone: string;
  service: string;
  startDate: string;
  endDate: string;
  value: number;
  status: AMCStatus;
  notes: string;
}

const SERVICES = [
  "Estate Maintenance",
  "AC Service",
  "Pest Control",
  "Deep Cleaning",
  "Plumbing",
  "Electrical",
  "Painting",
];

const SEED_CONTRACTS: AMCContract[] = [
  {
    id: 1,
    customerName: "Rajesh Kumar",
    phone: "9845123456",
    service: "Estate Maintenance",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    value: 25000,
    status: "active",
    notes: "Full estate 5 acres",
  },
  {
    id: 2,
    customerName: "Priya Nair",
    phone: "9980234567",
    service: "AC Service",
    startDate: "2025-06-01",
    endDate: "2026-05-31",
    value: 8500,
    status: "active",
    notes: "3 AC units",
  },
  {
    id: 3,
    customerName: "Mohammed Arif",
    phone: "8762345678",
    service: "Pest Control",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    value: 12000,
    status: "expired",
    notes: "Monthly visits",
  },
  {
    id: 4,
    customerName: "Sunitha Gowda",
    phone: "9741456789",
    service: "Deep Cleaning",
    startDate: "2026-02-01",
    endDate: "2027-01-31",
    value: 18000,
    status: "active",
    notes: "Villa 3500 sqft",
  },
  {
    id: 5,
    customerName: "Venkatesh Rao",
    phone: "9632567890",
    service: "Electrical",
    startDate: "2026-03-15",
    endDate: "2027-03-14",
    value: 6000,
    status: "pending",
    notes: "Annual inspection",
  },
];

function isExpiringSoon(endDate: string): boolean {
  const end = new Date(endDate).getTime();
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  return end - now <= thirtyDays && end > now;
}

function StatusBadgeAMC({ status }: { status: AMCStatus }) {
  if (status === "active") {
    return (
      <Badge className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Active
      </Badge>
    );
  }
  if (status === "expired") {
    return (
      <Badge className="text-xs bg-red-50 text-red-700 border border-red-200 font-medium">
        <XCircle className="w-3 h-3 mr-1" />
        Expired
      </Badge>
    );
  }
  return (
    <Badge className="text-xs bg-amber-50 text-amber-700 border border-amber-200 font-medium">
      <Clock className="w-3 h-3 mr-1" />
      Pending
    </Badge>
  );
}

export function AMCPage() {
  const [contracts, setContracts] = useState<AMCContract[]>(SEED_CONTRACTS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [nextId, setNextId] = useState(6);

  // Form state
  const [fName, setFName] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fService, setFService] = useState("Estate Maintenance");
  const [fStart, setFStart] = useState("");
  const [fEnd, setFEnd] = useState("");
  const [fValue, setFValue] = useState(0);
  const [fNotes, setFNotes] = useState("");

  const totalValue = contracts.reduce((sum, c) => sum + c.value, 0);
  const activeCount = contracts.filter((c) => c.status === "active").length;
  const expiredCount = contracts.filter((c) => c.status === "expired").length;
  const pendingCount = contracts.filter((c) => c.status === "pending").length;

  const handleSave = () => {
    if (!fName.trim() || !fPhone.trim() || !fStart || !fEnd) return;
    const newContract: AMCContract = {
      id: nextId,
      customerName: fName.trim(),
      phone: fPhone.trim(),
      service: fService,
      startDate: fStart,
      endDate: fEnd,
      value: fValue,
      status: "pending",
      notes: fNotes.trim(),
    };
    setContracts((prev) => [...prev, newContract]);
    setNextId((n) => n + 1);
    setFName("");
    setFPhone("");
    setFService("Estate Maintenance");
    setFStart("");
    setFEnd("");
    setFValue(0);
    setFNotes("");
    setShowAddForm(false);
  };

  const handleMarkExpired = (id: number) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "expired" as AMCStatus } : c,
      ),
    );
  };

  const handleRenew = (id: number) => {
    const today = new Date();
    const newEnd = new Date(today);
    newEnd.setFullYear(today.getFullYear() + 1);
    setContracts((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "active" as AMCStatus,
              startDate: today.toISOString().split("T")[0],
              endDate: newEnd.toISOString().split("T")[0],
            }
          : c,
      ),
    );
  };

  const handleDelete = (id: number) => {
    setContracts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleExport = () => {
    exportToCsv(
      "amc-contracts.csv",
      contracts.map((c) => ({
        ID: c.id,
        Customer: c.customerName,
        Phone: c.phone,
        Service: c.service,
        "Start Date": c.startDate,
        "End Date": c.endDate,
        "Value (₹)": c.value,
        Status: c.status,
        Notes: c.notes,
      })),
    );
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            AMC Contracts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage Annual Maintenance Contracts with customers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs"
            onClick={handleExport}
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => setShowAddForm((p) => !p)}
            data-ocid="amc.add_button"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Contract
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          {
            label: "Total",
            value: contracts.length,
            color: "#2563EB",
            bg: "#dbeafe",
          },
          {
            label: "Active",
            value: activeCount,
            color: "#16A34A",
            bg: "#dcfce7",
          },
          {
            label: "Expired",
            value: expiredCount,
            color: "#DC2626",
            bg: "#fee2e2",
          },
          {
            label: "Pending",
            value: pendingCount,
            color: "#EA580C",
            bg: "#ffedd5",
          },
          {
            label: "Total Value",
            value: `₹${totalValue.toLocaleString("en-IN")}`,
            color: "#7C3AED",
            bg: "#ede9fe",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-xs"
          >
            <p
              className="font-display text-xl font-bold"
              style={{ color: card.color }}
            >
              {card.value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Add Contract form */}
      {showAddForm && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground text-sm">
              Add New Contract
            </h2>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                Customer Name *
              </span>
              <input
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={fName}
                onChange={(e) => setFName(e.target.value)}
                placeholder="Customer name"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                Phone *
              </span>
              <input
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={fPhone}
                onChange={(e) => setFPhone(e.target.value)}
                placeholder="Phone number"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                Service *
              </span>
              <select
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={fService}
                onChange={(e) => setFService(e.target.value)}
              >
                {SERVICES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                Start Date *
              </span>
              <input
                type="date"
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={fStart}
                onChange={(e) => setFStart(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                End Date *
              </span>
              <input
                type="date"
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={fEnd}
                onChange={(e) => setFEnd(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                Contract Value (₹) *
              </span>
              <input
                type="number"
                min={0}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={fValue}
                onChange={(e) => setFValue(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1 sm:col-span-2 lg:col-span-3">
              <span className="text-xs font-medium text-muted-foreground">
                Notes
              </span>
              <input
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={fNotes}
                onChange={(e) => setFNotes(e.target.value)}
                placeholder="Additional notes..."
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button
              size="sm"
              className="h-8 text-xs"
              onClick={handleSave}
              data-ocid="amc.save_button"
            >
              Save Contract
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs"
              onClick={() => setShowAddForm(false)}
              data-ocid="amc.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Contracts Table */}
      <div
        className="rounded-xl border border-[#E5E7EB] bg-white shadow-xs overflow-hidden"
        data-ocid="amc.table"
      >
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground text-sm">
            Contract List
          </h2>
          <Badge variant="secondary" className="ml-auto text-xs">
            {contracts.length} contracts
          </Badge>
        </div>

        {contracts.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground text-sm"
            data-ocid="amc.empty_state"
          >
            No AMC contracts found. Add your first contract above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    ID
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">
                    Service
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">
                    Dates
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">
                    Value
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract, idx) => {
                  const isExpired = contract.status === "expired";
                  const expiringSoon =
                    contract.status === "active" &&
                    isExpiringSoon(contract.endDate);
                  return (
                    <tr
                      key={contract.id}
                      className={`border-t border-border/60 transition-colors ${isExpired ? "bg-red-50/50" : "hover:bg-muted/20"}`}
                      data-ocid={`amc.item.${idx + 1}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        #{String(contract.id).padStart(3, "0")}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground text-xs">
                          {contract.customerName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {contract.phone}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge variant="outline" className="text-xs">
                          {contract.service}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-xs text-foreground">
                          {contract.startDate}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          → {contract.endDate}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell">
                        <span className="font-semibold text-xs text-[#111827]">
                          ₹{contract.value.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <StatusBadgeAMC status={contract.status} />
                          {expiringSoon && (
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              <span className="text-[10px] text-amber-600 font-medium">
                                Expiring soon
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {contract.status !== "expired" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs text-amber-700 border-amber-200 hover:bg-amber-50"
                              onClick={() => handleMarkExpired(contract.id)}
                              title="Mark as Expired"
                            >
                              Expire
                            </Button>
                          )}
                          {contract.status === "expired" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50 gap-1"
                              onClick={() => handleRenew(contract.id)}
                              title="Renew for 1 year"
                            >
                              <RefreshCw className="w-3 h-3" />
                              Renew
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-1.5 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(contract.id)}
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
