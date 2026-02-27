import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Loader2, UserPlus, Users, Home, CheckCircle2, ShieldCheck, Wrench, User,
  BookOpen, TrendingUp, Wallet, BadgePercent, CalendarDays, LayoutDashboard,
  Phone, CreditCard, ClipboardList, AlertCircle, FileText, XCircle, BarChart2,
  MapPin, Clock, StickyNote, Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetUsers, useCreateUser, useGetServices, useGetSubServicesByService,
  useCreateBooking, useGetBookings, useUpdateBookingStatus, useGetAllSubServices,
  useGetTechnicians, useCreateTechnician, useAssignTechnician, useMarkPayment,
  useDeactivateTechnician, useGenerateInvoice,
  Role, BookingStatus,
} from "./hooks/useQueries";
import type { User as UserType, Booking, Technician } from "./backend";

/* ─── WhatsApp Notification Simulation ──────────────────────── */

function sendWhatsAppNotification(
  type: string,
  details: { to: string; bookingId: bigint; service: string; date: string }
) {
  console.log(
    `[WHATSAPP]\nTo: ${details.to}\nMessage: Booking #${details.bookingId} ${type} for ${details.service} on ${details.date}.`
  );
}

/* ─── Helpers ─────────────────────────────────────────────────── */

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / 1_000_000n);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));
}

const ROLE_CONFIG: Record<Role, { label: string; icon: React.FC<{ className?: string }>; className: string }> = {
  [Role.admin]: {
    label: "Admin",
    icon: ShieldCheck,
    className: "role-admin",
  },
  [Role.technician]: {
    label: "Technician",
    icon: Wrench,
    className: "role-technician",
  },
  [Role.customer]: {
    label: "Customer",
    icon: User,
    className: "role-customer",
  },
};

/* ─── Smart Status Transitions ───────────────────────────────── */

function getValidNextStatuses(current: BookingStatus): BookingStatus[] {
  switch (current) {
    case BookingStatus.pending:    return [BookingStatus.assigned, BookingStatus.cancelled];
    case BookingStatus.confirmed:  return [BookingStatus.assigned, BookingStatus.cancelled];
    case BookingStatus.assigned:   return [BookingStatus.inProgress, BookingStatus.cancelled];
    case BookingStatus.inProgress: return [BookingStatus.completed, BookingStatus.cancelled];
    case BookingStatus.completed:  return [];
    case BookingStatus.cancelled:  return [];
    default: return [];
  }
}

const STATUS_LABEL: Record<BookingStatus, string> = {
  [BookingStatus.pending]:    "Pending",
  [BookingStatus.confirmed]:  "Confirmed",
  [BookingStatus.assigned]:   "Assigned",
  [BookingStatus.inProgress]: "In Progress",
  [BookingStatus.completed]:  "Completed",
  [BookingStatus.cancelled]:  "Cancelled",
};

/* ─── Role Selector ───────────────────────────────────────────── */

type AppRole = "admin" | "technician" | "customer";

function RoleSelector({
  role,
  setRole,
  activeTechnicianId,
  setActiveTechnicianId,
}: {
  role: AppRole;
  setRole: (r: AppRole) => void;
  activeTechnicianId: bigint | null;
  setActiveTechnicianId: (id: bigint | null) => void;
}) {
  const [techInput, setTechInput] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border bg-card shadow-xs p-4 sm:p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="w-4 h-4 text-muted-foreground" />
        <h2 className="font-semibold text-foreground text-sm">View As</h2>
        <span className="text-xs text-muted-foreground">(simulated role)</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        {(["admin", "technician", "customer"] as AppRole[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              role === r
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {role === "technician" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 flex items-center gap-3 overflow-hidden"
          >
            <Label htmlFor="tech-id-input" className="text-xs text-muted-foreground whitespace-nowrap">
              Technician ID:
            </Label>
            <Input
              id="tech-id-input"
              type="number"
              min="0"
              placeholder="e.g. 0"
              value={techInput}
              onChange={(e) => {
                setTechInput(e.target.value);
                const val = e.target.value.trim();
                setActiveTechnicianId(val !== "" ? BigInt(val) : null);
              }}
              className="h-7 text-xs bg-background w-28"
            />
            {activeTechnicianId !== null && (
              <span className="text-xs text-muted-foreground">
                Viewing as Technician #{String(activeTechnicianId)}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── User Card ───────────────────────────────────────────────── */

function UserCard({ user, index }: { user: UserType; index: number }) {
  const config = ROLE_CONFIG[user.role];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-center gap-4 px-4 py-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
    >
      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
        <span className="font-display text-sm font-semibold text-foreground/70">
          {user.name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{user.name}</p>
        <p className="text-xs text-muted-foreground">{formatDate(user.createdAt)}</p>
      </div>
      <span className="text-xs text-muted-foreground font-mono hidden sm:block">
        #{String(user.id).padStart(4, "0")}
      </span>
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    </motion.div>
  );
}

/* ─── Skeleton Rows ───────────────────────────────────────────── */

function UserSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-lg border border-border">
      <Skeleton className="w-9 h-9 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full hidden sm:block" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}

/* ─── Create User Form ────────────────────────────────────────── */

function CreateUserForm() {
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [lastCreated, setLastCreated] = useState<UserType | null>(null);

  const { mutateAsync: createUser, isPending } = useCreateUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role) return;

    try {
      const newUser = await createUser({ name: name.trim(), role: role as Role });
      setLastCreated(newUser);
      setName("");
      setRole("");
      toast.success(`User "${newUser.name}" created successfully`);
    } catch {
      toast.error("Failed to create user. Please try again.");
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="e.g. Mounith H C"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            className="bg-background"
            autoComplete="name"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="role" className="text-sm font-medium text-foreground">
            Role
          </Label>
          <Select value={role} onValueChange={(v) => setRole(v as Role)} disabled={isPending}>
            <SelectTrigger id="role" className="bg-background w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Role.admin}>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Admin
                </span>
              </SelectItem>
              <SelectItem value={Role.technician}>
                <span className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-emerald-700" />
                  Technician
                </span>
              </SelectItem>
              <SelectItem value={Role.customer}>
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-700" />
                  Customer
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={isPending || !name.trim() || !role}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Create User
            </>
          )}
        </Button>
      </form>

      <AnimatePresence>
        {lastCreated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
              <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Last created</p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">{lastCreated.name}</span>
                  {" · "}
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border ${ROLE_CONFIG[lastCreated.role].className}`}>
                    {ROLE_CONFIG[lastCreated.role].label}
                  </span>
                  {" · "}ID #{String(lastCreated.id).padStart(4, "0")}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Users List ─────────────────────────────────────────────── */

function UsersList() {
  const { data: users, isLoading, isError } = useGetUsers();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">All Users</h2>
        </div>
        {!isLoading && users && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {users.length} {users.length === 1 ? "user" : "users"}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <UserSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          Failed to load users. Please refresh the page.
        </div>
      )}

      {!isLoading && !isError && users && users.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10 space-y-1"
        >
          <p className="text-muted-foreground text-sm">No users yet.</p>
          <p className="text-muted-foreground/60 text-xs">Create one using the form above.</p>
        </motion.div>
      )}

      {!isLoading && !isError && users && users.length > 0 && (
        <div className="space-y-2">
          {users.map((user, i) => (
            <UserCard key={String(user.id)} user={user} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Technician Card ────────────────────────────────────────── */

function TechnicianCard({
  tech,
  index,
  isAdmin,
}: {
  tech: Technician;
  index: number;
  isAdmin: boolean;
}) {
  const { mutateAsync: deactivateTechnician, isPending: isDeactivating } = useDeactivateTechnician();

  const handleDeactivate = async () => {
    try {
      await deactivateTechnician({ technicianId: tech.id });
      toast.success(`Technician "${tech.name}" deactivated`);
    } catch {
      toast.error("Failed to deactivate technician.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="flex items-center gap-4 px-4 py-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
    >
      <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
        <Wrench className="w-4 h-4 text-emerald-700" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{tech.name}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Phone className="w-3 h-3" />
          {tech.phone}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Assigned: {String(tech.totalAssigned)} | Completed: {String(tech.totalCompleted)}
        </p>
      </div>
      <span className="text-xs text-muted-foreground font-mono hidden sm:block">
        ID #{String(tech.id)}
      </span>
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
            tech.activeStatus
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-muted text-muted-foreground border-border"
          }`}
        >
          {tech.activeStatus ? "Active" : "Inactive"}
        </span>
        {isAdmin && tech.activeStatus && (
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-xs px-2 border-red-200 text-red-600 hover:bg-red-50"
            onClick={handleDeactivate}
            disabled={isDeactivating}
          >
            {isDeactivating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Ban className="h-3 w-3" />
            )}
            <span className="ml-1 hidden sm:inline">Deactivate</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
}

function TechnicianManagement() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const { data: technicians, isLoading } = useGetTechnicians();
  const { mutateAsync: createTechnician, isPending } = useCreateTechnician();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    try {
      const tech = await createTechnician({ name: name.trim(), phone: phone.trim() });
      toast.success(`Technician "${tech.name}" added successfully`);
      setName("");
      setPhone("");
    } catch {
      toast.error("Failed to add technician.");
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="tech-name" className="text-sm font-medium text-foreground">
              Full Name
            </Label>
            <Input
              id="tech-name"
              placeholder="e.g. Raju Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className="bg-background"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tech-phone" className="text-sm font-medium text-foreground">
              Phone Number
            </Label>
            <Input
              id="tech-phone"
              type="tel"
              placeholder="+91XXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isPending}
              className="bg-background"
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={isPending || !name.trim() || !phone.trim()}
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Technician
            </>
          )}
        </Button>
      </form>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium text-foreground text-sm">Technician List</h3>
          </div>
          {!isLoading && technicians && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {technicians.length} {technicians.length === 1 ? "technician" : "technicians"}
            </span>
          )}
        </div>

        {isLoading && (
          <div className="space-y-2">
            {[0, 1].map((i) => <UserSkeleton key={i} />)}
          </div>
        )}

        {!isLoading && technicians && technicians.length === 0 && (
          <div className="text-center py-8 space-y-1">
            <p className="text-muted-foreground text-sm">No technicians yet.</p>
            <p className="text-muted-foreground/60 text-xs">Add one using the form above.</p>
          </div>
        )}

        {!isLoading && technicians && technicians.length > 0 && (
          <div className="space-y-2">
            {technicians.map((tech, i) => (
              <TechnicianCard key={String(tech.id)} tech={tech} index={i} isAdmin={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Booking Form ───────────────────────────────────────────── */

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM",
];

const DEFAULT_SERVICES = [
  { id: "1", name: "Plumbing" },
  { id: "2", name: "Electrical" },
  { id: "3", name: "Deep Cleaning" },
  { id: "4", name: "Painting" },
  { id: "5", name: "AC Service" },
  { id: "6", name: "Pest Control" },
  { id: "7", name: "Estate Maintenance" },
];

const DEFAULT_SUB_SERVICES = [
  { id: "1", serviceId: "1", name: "Leak Fix" },
  { id: "2", serviceId: "1", name: "Pipe Installation" },
  { id: "3", serviceId: "2", name: "Wiring" },
  { id: "4", serviceId: "2", name: "Switch Board Repair" },
  { id: "5", serviceId: "3", name: "Home Deep Cleaning" },
  { id: "6", serviceId: "3", name: "Apartment Deep Cleaning" },
  { id: "7", serviceId: "4", name: "Interior Painting" },
  { id: "8", serviceId: "4", name: "Exterior Painting" },
  { id: "9", serviceId: "5", name: "AC General Service" },
  { id: "10", serviceId: "5", name: "AC Gas Refill" },
  { id: "11", serviceId: "6", name: "Termite Treatment" },
  { id: "12", serviceId: "6", name: "General Pest Control" },
  { id: "13", serviceId: "7", name: "Garden Maintenance" },
  { id: "14", serviceId: "7", name: "Full Estate Management" },
];

interface LocalService { id: string; name: string; }
interface LocalSubService { id: string; serviceId: string; name: string; }

function getLocalServices(): LocalService[] {
  try {
    const stored = JSON.parse(localStorage.getItem("services") || "[]");
    if (Array.isArray(stored) && stored.length > 0) return stored;
  } catch { /* ignore */ }
  // Seed defaults
  localStorage.setItem("services", JSON.stringify(DEFAULT_SERVICES));
  return DEFAULT_SERVICES;
}

function getLocalSubServices(): LocalSubService[] {
  try {
    const stored = JSON.parse(localStorage.getItem("subServices") || "[]");
    if (Array.isArray(stored) && stored.length > 0) return stored;
  } catch { /* ignore */ }
  // Seed defaults
  localStorage.setItem("subServices", JSON.stringify(DEFAULT_SUB_SERVICES));
  return DEFAULT_SUB_SERVICES;
}

function BookingForm() {
  const [serviceId, setServiceId] = useState<string>("");
  const [subServiceId, setSubServiceId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Load from localStorage on mount (with seed fallback)
  const [services] = useState<LocalService[]>(() => getLocalServices());
  const [allSubServices] = useState<LocalSubService[]>(() => getLocalSubServices());

  console.log("Services:", services);

  const filteredSubServices = allSubServices.filter(
    (sub) => sub.serviceId === serviceId
  );

  const { mutateAsync: createBooking, isPending } = useCreateBooking();
  const queryClient = useQueryClient();

  const handleCreateBooking = async () => {
    console.log("Button clicked");

    if (!serviceId) {
      toast.error("Please select a service.");
      return;
    }
    if (!subServiceId) {
      toast.error("Please select a sub-service.");
      return;
    }
    const qty = Number(quantity);
    if (!quantity || isNaN(qty) || qty <= 0) {
      toast.error("Please enter a valid quantity (must be greater than 0).");
      return;
    }
    if (!scheduledDate) {
      toast.error("Please select a scheduled date.");
      return;
    }
    if (!scheduledTime) {
      toast.error("Please select a time slot.");
      return;
    }
    if (!address.trim()) {
      toast.error("Please enter the service address.");
      return;
    }

    try {
      const booking = await createBooking({
        customerId: 0n,
        subServiceId: BigInt(subServiceId),
        propertyType: "Apartment",
        quantity: BigInt(qty),
        scheduledDate,
        scheduledTime,
        address: address.trim(),
        notes: notes.trim(),
      });

      console.log("Booking saved:", booking);

      await queryClient.refetchQueries({ queryKey: ["bookings"], type: "active" });

      const subServiceName = filteredSubServices.find(ss => ss.id === subServiceId)?.name ?? "Service";
      sendWhatsAppNotification("confirmed", {
        to: "+91XXXXXXXXXX",
        bookingId: booking.id,
        service: subServiceName,
        date: scheduledDate,
      });

      console.log("Booking Created:", booking);
      alert("Booking Created Successfully");
      setServiceId("");
      setSubServiceId("");
      setQuantity("");
      setScheduledDate("");
      setScheduledTime("");
      setAddress("");
      setNotes("");
    } catch {
      toast.error("Failed to create booking. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Service dropdown — native select for reliable interactivity */}
      <div className="space-y-1.5">
        <Label htmlFor="service" className="text-sm font-medium text-foreground">Service</Label>
        <select
          id="service"
          value={serviceId}
          onChange={(e) => {
            setServiceId(e.target.value);
            setSubServiceId("");
          }}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      {/* SubService dropdown — native select, filtered by selected service */}
      <div className="space-y-1.5">
        <Label htmlFor="subservice" className="text-sm font-medium text-foreground">Sub-Service</Label>
        <select
          id="subservice"
          value={subServiceId}
          onChange={(e) => setSubServiceId(e.target.value)}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="">{serviceId ? "Select a sub-service" : "Select a service first"}</option>
          {filteredSubServices.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity input */}
      <div className="space-y-1.5">
        <Label htmlFor="quantity" className="text-sm font-medium text-foreground">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          placeholder="e.g. 1200"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={isPending}
          className="bg-background"
          required
        />
      </div>

      {/* Scheduled Date */}
      <div className="space-y-1.5">
        <Label htmlFor="scheduledDate" className="text-sm font-medium text-foreground flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
          Scheduled Date
        </Label>
        <Input
          id="scheduledDate"
          type="date"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          disabled={isPending}
          className="bg-background"
          required
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      {/* Time Slot — native select */}
      <div className="space-y-1.5">
        <Label htmlFor="timeSlot" className="text-sm font-medium text-foreground flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          Time Slot
        </Label>
        <select
          id="timeSlot"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="">Select a time slot</option>
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>
      </div>

      {/* Address */}
      <div className="space-y-1.5">
        <Label htmlFor="address" className="text-sm font-medium text-foreground flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
          Service Address <span className="text-red-500 ml-0.5">*</span>
        </Label>
        <Textarea
          id="address"
          placeholder="Enter service address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={isPending}
          className="bg-background resize-none"
          rows={2}
          required
        />
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes" className="text-sm font-medium text-foreground flex items-center gap-1.5">
          <StickyNote className="w-3.5 h-3.5 text-muted-foreground" />
          Notes <span className="text-xs text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Textarea
          id="notes"
          placeholder="Any special instructions (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isPending}
          className="bg-background resize-none"
          rows={2}
        />
      </div>

      <Button
        type="button"
        onClick={handleCreateBooking}
        disabled={isPending}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Booking...
          </>
        ) : (
          "Create Booking"
        )}
      </Button>
    </div>
  );
}

/* ─── Status Badge ───────────────────────────────────────────── */

const STATUS_CONFIG: Record<BookingStatus, { label: string; className: string }> = {
  [BookingStatus.pending]:    { label: "Pending",     className: "bg-amber-50 text-amber-700 border-amber-200" },
  [BookingStatus.confirmed]:  { label: "Confirmed",   className: "bg-blue-50 text-blue-700 border-blue-200" },
  [BookingStatus.assigned]:   { label: "Assigned",    className: "bg-orange-50 text-orange-700 border-orange-200" },
  [BookingStatus.inProgress]: { label: "In Progress", className: "bg-orange-50 text-orange-700 border-orange-200" },
  [BookingStatus.completed]:  { label: "Completed",   className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  [BookingStatus.cancelled]:  { label: "Cancelled",   className: "bg-red-50 text-red-700 border-red-200" },
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, className: "bg-muted text-muted-foreground border-border" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

/* ─── Payment Status Badge ────────────────────────────────────── */

function PaymentBadge({ paymentStatus }: { paymentStatus: string }) {
  const cfg: Record<string, { label: string; className: string }> = {
    unpaid:  { label: "Unpaid",   className: "bg-red-50 text-red-700 border-red-200" },
    partial: { label: "Partial",  className: "bg-amber-50 text-amber-700 border-amber-200" },
    paid:    { label: "Paid",     className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  };
  const entry = cfg[paymentStatus] ?? { label: paymentStatus, className: "bg-muted text-muted-foreground border-border" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${entry.className}`}>
      <CreditCard className="w-3 h-3" />
      {entry.label}
    </span>
  );
}

/* ─── Status Timeline ────────────────────────────────────────── */

function StatusTimeline({ status }: { status: BookingStatus }) {
  const steps: { key: BookingStatus; label: string }[] = [
    { key: BookingStatus.pending,    label: "Pending" },
    { key: BookingStatus.assigned,   label: "Assigned" },
    { key: BookingStatus.inProgress, label: "In Progress" },
    { key: BookingStatus.completed,  label: "Completed" },
  ];

  if (status === BookingStatus.cancelled) {
    return (
      <div className="flex items-center gap-1.5 mt-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
        <span className="text-xs text-red-600 font-medium">Cancelled</span>
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.key === status);
  // confirmed is treated as between pending and assigned
  const effectiveIndex = status === BookingStatus.confirmed ? 0 : currentIndex;

  return (
    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
      {steps.map((step, i) => {
        const isPast = i <= effectiveIndex;
        const isCurrent = i === effectiveIndex;
        return (
          <div key={step.key} className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-full border ${
              isCurrent
                ? "bg-primary border-primary"
                : isPast
                  ? "bg-emerald-500 border-emerald-500"
                  : "bg-background border-muted-foreground/30"
            }`} />
            <span className={`text-xs ${
              isCurrent
                ? "text-primary font-medium"
                : isPast
                  ? "text-muted-foreground"
                  : "text-muted-foreground/50"
            }`}>
              {step.label}
            </span>
            {i < steps.length - 1 && (
              <span className={`text-xs mx-0.5 ${isPast && i < effectiveIndex ? "text-muted-foreground" : "text-muted-foreground/30"}`}>
                →
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Invoice Modal ──────────────────────────────────────────── */

function InvoiceModal({
  bookingId,
  onClose,
}: {
  bookingId: bigint | null;
  onClose: () => void;
}) {
  const { data: invoice, isLoading } = useGenerateInvoice(bookingId);

  const paymentCfg: Record<string, { label: string; className: string }> = {
    unpaid:  { label: "Unpaid",  className: "bg-red-50 text-red-700 border-red-200" },
    partial: { label: "Partial", className: "bg-amber-50 text-amber-700 border-amber-200" },
    paid:    { label: "Paid",    className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  };

  return (
    <Dialog open={bookingId !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md print:shadow-none print:border-none">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Invoice
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-3 py-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        )}

        {!isLoading && !invoice && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Invoice not found. Booking may not exist.
          </div>
        )}

        {!isLoading && invoice && (
          <div className="space-y-0 print:text-black">
            {/* Header */}
            <div className="pb-3 border-b border-border">
              <p className="font-display font-semibold text-foreground text-base">
                Indu Home &amp; Estate Services
              </p>
              <p className="text-xs text-muted-foreground">Chikmagalur, Karnataka, India</p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                Booking #{String(invoice.bookingId).padStart(4, "0")}
              </p>
            </div>

            {/* Service Details */}
            <div className="py-3 border-b border-border space-y-1.5">
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-muted-foreground">Service</span>
                <span className="text-foreground font-medium text-right">{invoice.serviceName}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-muted-foreground">Sub-Service</span>
                <span className="text-foreground font-medium text-right">{invoice.subServiceName}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-muted-foreground">Quantity</span>
                <span className="text-foreground font-medium text-right">{String(invoice.quantity)}</span>
              </div>
              {invoice.scheduledDate && (
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <span className="text-muted-foreground">Scheduled</span>
                  <span className="text-foreground font-medium text-right">
                    {invoice.scheduledDate}{invoice.scheduledTime ? ` at ${invoice.scheduledTime}` : ""}
                  </span>
                </div>
              )}
              {invoice.address && (
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <span className="text-muted-foreground">Address</span>
                  <span className="text-foreground font-medium text-right text-xs leading-snug">{invoice.address}</span>
                </div>
              )}
            </div>

            {/* Payment Details */}
            <div className="py-3 space-y-1.5">
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="text-foreground font-semibold text-right">
                  ₹{invoice.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-muted-foreground">Advance Paid</span>
                <span className="text-emerald-700 font-medium text-right">
                  ₹{invoice.advanceAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm border-t border-border pt-1.5 mt-1">
                <span className="text-muted-foreground font-medium">Balance Due</span>
                <span className="text-foreground font-semibold text-right">
                  ₹{invoice.balanceAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-muted-foreground">Commission</span>
                <span className="text-amber-700 font-medium text-right">
                  ₹{invoice.commission.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm items-center">
                <span className="text-muted-foreground">Payment Status</span>
                <div className="flex justify-end">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                    (paymentCfg[invoice.paymentStatus] ?? paymentCfg.unpaid).className
                  }`}>
                    {(paymentCfg[invoice.paymentStatus] ?? { label: invoice.paymentStatus }).label}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-border print:hidden">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.print()}
              >
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                Download Invoice
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                <XCircle className="mr-1.5 h-3.5 w-3.5" />
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ─── Dashboard Cards ────────────────────────────────────────── */

function DashboardCards() {
  const { data: bookings, isLoading } = useGetBookings();
  const { data: services } = useGetServices();

  const uniqueServiceIds = useMemo(() => (services ?? []).map((s) => s.id), [services]);
  const subServiceResults = useGetAllSubServices(uniqueServiceIds);

  // Build subServiceId → serviceId map
  const subServiceToServiceMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const result of subServiceResults) {
      for (const ss of result.data ?? []) {
        map.set(ss.id.toString(), ss.serviceId.toString());
      }
    }
    return map;
  }, [subServiceResults]);

  // Build serviceId → serviceName map
  const serviceMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of services ?? []) map.set(s.id.toString(), s.name);
    return map;
  }, [services]);

  // Today's date midnight
  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const stats = useMemo(() => {
    const list = bookings ?? [];
    if (isLoading || list.length === 0) {
      return {
        totalBookings: 0,
        totalRevenue: 0n,
        totalAdvance: 0n,
        totalCommission: 0n,
        pendingPayments: 0,
        assignedBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        todayBookings: 0,
      };
    }
    return {
      totalBookings:     list.length,
      totalRevenue:      list.reduce((sum, b) => sum + (b.totalAmount ?? 0n), 0n),
      totalAdvance:      list.reduce((sum, b) => {
        const ps = b.paymentStatus ?? "unpaid";
        return ps === "partial" || ps === "paid" ? sum + (b.advanceAmount ?? 0n) : sum;
      }, 0n),
      totalCommission:   list.reduce((sum, b) => sum + (b.commission ?? 0n), 0n),
      pendingPayments:   list.filter((b) => (b.paymentStatus ?? "unpaid") === "unpaid").length,
      assignedBookings:  list.filter((b) => b.status === BookingStatus.assigned).length,
      completedBookings: list.filter((b) => b.status === BookingStatus.completed).length,
      cancelledBookings: list.filter((b) => b.status === BookingStatus.cancelled).length,
      todayBookings:     list.filter((b) => {
        const ms = Number(b.createdAt / 1_000_000n);
        return ms >= todayStart;
      }).length,
    };
  }, [bookings, isLoading, todayStart]);

  // Bookings per service chart data
  const serviceBookingCounts = useMemo(() => {
    if (!bookings || !services) return [];
    const countMap = new Map<string, number>();
    for (const b of bookings) {
      const serviceId = subServiceToServiceMap.get(b.subServiceId.toString());
      if (!serviceId) continue;
      const serviceName = serviceMap.get(serviceId) ?? `Service #${serviceId}`;
      countMap.set(serviceName, (countMap.get(serviceName) ?? 0) + 1);
    }
    const entries = Array.from(countMap.entries()).sort((a, b) => b[1] - a[1]);
    const maxCount = entries.length > 0 ? entries[0][1] : 1;
    return entries.map(([name, count]) => ({ name, count, pct: Math.round((count / maxCount) * 100) }));
  }, [bookings, services, subServiceToServiceMap, serviceMap]);

  const cards = [
    {
      label: "Total Bookings",
      value: isLoading ? null : String(stats.totalBookings),
      icon: BookOpen,
      iconClass: "text-primary",
      bgClass: "bg-primary/8",
    },
    {
      label: "Total Revenue",
      value: isLoading ? null : `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      iconClass: "text-emerald-700",
      bgClass: "bg-emerald-50",
    },
    {
      label: "Advance Collected",
      value: isLoading ? null : `₹${stats.totalAdvance.toLocaleString("en-IN")}`,
      icon: Wallet,
      iconClass: "text-blue-700",
      bgClass: "bg-blue-50",
    },
    {
      label: "Commission Earned",
      value: isLoading ? null : `₹${stats.totalCommission.toLocaleString("en-IN")}`,
      icon: BadgePercent,
      iconClass: "text-amber-700",
      bgClass: "bg-amber-50",
    },
    {
      label: "Pending Payments",
      value: isLoading ? null : String(stats.pendingPayments),
      icon: AlertCircle,
      iconClass: "text-red-600",
      bgClass: "bg-red-50",
    },
    {
      label: "Assigned Bookings",
      value: isLoading ? null : String(stats.assignedBookings),
      icon: ClipboardList,
      iconClass: "text-orange-600",
      bgClass: "bg-orange-50",
    },
    {
      label: "Completed Bookings",
      value: isLoading ? null : String(stats.completedBookings),
      icon: CheckCircle2,
      iconClass: "text-emerald-700",
      bgClass: "bg-emerald-50",
    },
    {
      label: "Cancelled Bookings",
      value: isLoading ? null : String(stats.cancelledBookings),
      icon: XCircle,
      iconClass: "text-red-500",
      bgClass: "bg-red-50",
    },
    {
      label: "Today's Bookings",
      value: isLoading ? null : String(stats.todayBookings),
      icon: CalendarDays,
      iconClass: "text-primary",
      bgClass: "bg-primary/8",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
        <h2 className="font-semibold text-foreground">Dashboard Overview</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3"
            >
              <div className={`w-8 h-8 rounded-md ${card.bgClass} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${card.iconClass}`} />
              </div>
              <div>
                {isLoading ? (
                  <>
                    <Skeleton className="h-6 w-20 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </>
                ) : (
                  <>
                    <p className="font-display text-xl font-semibold text-foreground">{card.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bookings by Service chart */}
      {serviceBookingCounts.length > 0 && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium text-foreground text-sm">Bookings by Service</h3>
          </div>
          <div className="space-y-2">
            {serviceBookingCounts.map(({ name, count, pct }) => (
              <div key={name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium truncate max-w-[70%]">{name}</span>
                  <span className="text-muted-foreground ml-2 shrink-0">{count}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Booking Row Skeleton ───────────────────────────────────── */

function BookingRowSkeleton() {
  return (
    <div className="flex flex-col gap-2 px-4 py-3 rounded-lg border border-border">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3 w-40" />
      <div className="flex gap-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

/* ─── Booking Row ────────────────────────────────────────────── */

interface BookingRowProps {
  booking: Booking;
  index: number;
  isAdmin: boolean;
  readOnly?: boolean;
  subServiceMap: Map<string, string>;
  serviceMap: Map<string, string>;
  subServiceToServiceMap: Map<string, string>;
  technicians: Technician[];
  onViewInvoice: (bookingId: bigint) => void;
}

function BookingRow({
  booking,
  index,
  isAdmin,
  readOnly,
  subServiceMap,
  serviceMap,
  subServiceToServiceMap,
  technicians,
  onViewInvoice,
}: BookingRowProps) {
  const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateBookingStatus();
  const { mutateAsync: assignTechnician, isPending: isAssigning } = useAssignTechnician();
  const { mutateAsync: markPayment, isPending: isMarkingPayment } = useMarkPayment();

  const subServiceName = subServiceMap.get(booking.subServiceId.toString()) ?? `#${booking.subServiceId}`;
  const serviceId = subServiceToServiceMap.get(booking.subServiceId.toString());
  const serviceName = serviceId ? (serviceMap.get(serviceId) ?? `Service #${serviceId}`) : "—";

  const assignedTech = technicians.find((t) => t.id === booking.technicianId);

  const validNextStatuses = getValidNextStatuses(booking.status);
  const canTransition = validNextStatuses.length > 0;

  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      await updateStatus({ bookingId: booking.id, newStatus });
      toast.success(`Booking #${booking.id} → ${STATUS_CONFIG[newStatus]?.label ?? newStatus}`);
      sendWhatsAppNotification(`status updated to ${STATUS_CONFIG[newStatus]?.label ?? newStatus}`, {
        to: "+91XXXXXXXXXX",
        bookingId: booking.id,
        service: subServiceName,
        date: new Date().toLocaleDateString("en-IN"),
      });
    } catch {
      toast.error("Failed to update booking status.");
    }
  };

  const handleAssignTechnician = async (techIdStr: string) => {
    if (!techIdStr) return;
    const techId = BigInt(techIdStr);
    try {
      await assignTechnician({ bookingId: booking.id, technicianId: techId });
      const tech = technicians.find((t) => t.id === techId);
      toast.success(`Technician assigned to Booking #${booking.id}`);
      sendWhatsAppNotification("assigned to you", {
        to: tech?.phone ?? "+91XXXXXXXXXX",
        bookingId: booking.id,
        service: subServiceName,
        date: new Date().toLocaleDateString("en-IN"),
      });
    } catch {
      toast.error("Failed to assign technician.");
    }
  };

  const handleMarkPayment = async () => {
    try {
      await markPayment({ bookingId: booking.id, referenceId: `REF-${Date.now()}` });
      toast.success(`Advance payment recorded for Booking #${booking.id}`);
    } catch {
      toast.error("Failed to mark payment.");
    }
  };

  return (
    <motion.div
      key={String(booking.id)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="rounded-lg border border-border bg-card px-4 py-3 space-y-2 hover:border-primary/25 transition-colors"
    >
      {/* Row 1: ID + status badges + admin status dropdown */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-muted-foreground">
            #{String(booking.id).padStart(4, "0")}
          </span>
          <StatusBadge status={booking.status} />
          <PaymentBadge paymentStatus={booking.paymentStatus} />
        </div>
        {isAdmin && !readOnly && (
          canTransition ? (
            <Select
              value=""
              onValueChange={(v) => handleStatusChange(v as BookingStatus)}
              disabled={isUpdating}
            >
              <SelectTrigger className="h-7 text-xs w-[140px] bg-background">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                {validNextStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="text-xs text-muted-foreground italic">No further transitions</span>
          )
        )}
      </div>

      {/* Row 2: Service & sub-service name */}
      <div className="text-sm text-foreground font-medium">
        {serviceName}
        {subServiceName !== "—" && (
          <span className="text-muted-foreground font-normal"> · {subServiceName}</span>
        )}
      </div>

      {/* Row 3: Amounts */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>Qty: <span className="text-foreground font-medium">{String(booking.quantity)}</span></span>
        <span>Total: <span className="text-foreground font-medium">₹{booking.totalAmount.toLocaleString("en-IN")}</span></span>
        <span>Advance: <span className="text-foreground font-medium">₹{booking.advanceAmount.toLocaleString("en-IN")}</span></span>
        <span>Commission: <span className="text-amber-700 font-medium">₹{booking.commission.toLocaleString("en-IN")}</span></span>
      </div>

      {/* Row 4: Schedule & address */}
      {(booking.scheduledDate || booking.address) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {booking.scheduledDate && (
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              {booking.scheduledDate}
              {booking.scheduledTime && ` at ${booking.scheduledTime}`}
            </span>
          )}
          {booking.address && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[160px]">{booking.address}</span>
            </span>
          )}
        </div>
      )}

      {/* Row 5: Assigned technician info */}
      {assignedTech && (
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Wrench className="w-3 h-3 text-emerald-600" />
          <span>Assigned: <span className="text-foreground font-medium">{assignedTech.name}</span></span>
        </div>
      )}

      {/* Row 6: Admin controls */}
      {isAdmin && !readOnly && (
        <div className="flex flex-wrap gap-2 pt-1">
          {/* Assign Technician dropdown */}
          {technicians.length > 0 && (
            <Select
              value={booking.technicianId !== undefined ? String(booking.technicianId) : ""}
              onValueChange={handleAssignTechnician}
              disabled={isAssigning}
            >
              <SelectTrigger className="h-7 text-xs w-[180px] bg-background">
                <SelectValue placeholder="Assign Technician" />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((t) => (
                  <SelectItem key={String(t.id)} value={String(t.id)}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Mark Advance Paid button */}
          {(booking.paymentStatus === "unpaid" || booking.paymentStatus === "partial") && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              onClick={handleMarkPayment}
              disabled={isMarkingPayment}
            >
              {isMarkingPayment ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <CreditCard className="mr-1 h-3 w-3" />
              )}
              Mark Advance Paid
            </Button>
          )}

          {/* View Invoice button */}
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => onViewInvoice(booking.id)}
          >
            <FileText className="mr-1 h-3 w-3" />
            View Invoice
          </Button>
        </div>
      )}

      {/* Technician panel: smart status buttons */}
      {readOnly && (
        <div className="pt-1 flex gap-2">
          {booking.status === BookingStatus.assigned && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs border-orange-200 text-orange-700 hover:bg-orange-50"
              onClick={() => handleStatusChange(BookingStatus.inProgress)}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <Wrench className="mr-1 h-3 w-3" />
              )}
              Mark In Progress
            </Button>
          )}
          {booking.status === BookingStatus.inProgress && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              onClick={() => handleStatusChange(BookingStatus.completed)}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-1 h-3 w-3" />
              )}
              Mark Completed
            </Button>
          )}
          {(booking.status === BookingStatus.completed || booking.status === BookingStatus.cancelled) && (
            <span className="text-xs text-muted-foreground italic self-center">
              {booking.status === BookingStatus.completed ? "Job completed" : "Cancelled"}
            </span>
          )}
          {/* Invoice for technician view */}
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => onViewInvoice(booking.id)}
          >
            <FileText className="mr-1 h-3 w-3" />
            Invoice
          </Button>
        </div>
      )}

      {/* Customer view: Invoice button */}
      {!isAdmin && !readOnly && (
        <div className="pt-1">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => onViewInvoice(booking.id)}
          >
            <FileText className="mr-1 h-3 w-3" />
            View Invoice
          </Button>
        </div>
      )}

      {/* Row: Date */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <CalendarDays className="w-3 h-3" />
        {formatDate(booking.createdAt)}
      </div>
    </motion.div>
  );
}

/* ─── Booking List ───────────────────────────────────────────── */

function BookingList({ isAdmin }: { isAdmin: boolean }) {
  const [invoiceBookingId, setInvoiceBookingId] = useState<bigint | null>(null);
  const { data: bookings, isLoading: bookingsLoading, isError } = useGetBookings();
  const { data: services } = useGetServices();
  const { data: technicians } = useGetTechnicians();

  const uniqueServiceIds = useMemo(() => {
    if (!services) return [];
    return services.map((s) => s.id);
  }, [services]);

  const subServiceResults = useGetAllSubServices(uniqueServiceIds);

  const subServiceMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const result of subServiceResults) {
      for (const ss of result.data ?? []) {
        map.set(ss.id.toString(), ss.name);
      }
    }
    return map;
  }, [subServiceResults]);

  const serviceMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of services ?? []) {
      map.set(s.id.toString(), s.name);
    }
    return map;
  }, [services]);

  const subServiceToServiceMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const result of subServiceResults) {
      for (const ss of result.data ?? []) {
        map.set(ss.id.toString(), ss.serviceId.toString());
      }
    }
    return map;
  }, [subServiceResults]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">All Bookings</h2>
          {!bookingsLoading && bookings && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
            </span>
          )}
        </div>
        {isAdmin && (
          <Badge variant="outline" className="text-xs">
            <ShieldCheck className="w-3 h-3 mr-1 text-amber-600" />
            Admin Controls
          </Badge>
        )}
      </div>

      {bookingsLoading && (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => <BookingRowSkeleton key={i} />)}
        </div>
      )}

      {isError && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          Failed to load bookings. Please refresh the page.
        </div>
      )}

      {!bookingsLoading && !isError && bookings && bookings.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10 space-y-1"
        >
          <p className="text-muted-foreground text-sm">No bookings yet.</p>
          <p className="text-muted-foreground/60 text-xs">Create one using the form above.</p>
        </motion.div>
      )}

      {!bookingsLoading && !isError && bookings && bookings.length > 0 && (
        <div className="space-y-2">
          {bookings.map((booking, i) => (
            <BookingRow
              key={String(booking.id)}
              booking={booking}
              index={i}
              isAdmin={isAdmin}
              readOnly={false}
              subServiceMap={subServiceMap}
              serviceMap={serviceMap}
              subServiceToServiceMap={subServiceToServiceMap}
              technicians={technicians ?? []}
              onViewInvoice={setInvoiceBookingId}
            />
          ))}
        </div>
      )}

      <InvoiceModal
        bookingId={invoiceBookingId}
        onClose={() => setInvoiceBookingId(null)}
      />
    </div>
  );
}

/* ─── Customer Booking List ──────────────────────────────────── */

function CustomerBookingList() {
  const [invoiceBookingId, setInvoiceBookingId] = useState<bigint | null>(null);
  const { data: bookings, isLoading: bookingsLoading } = useGetBookings();
  const { data: services } = useGetServices();
  const { data: technicians } = useGetTechnicians();

  const uniqueServiceIds = useMemo(() => (services ?? []).map((s) => s.id), [services]);
  const subServiceResults = useGetAllSubServices(uniqueServiceIds);

  const subServiceMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const result of subServiceResults) {
      for (const ss of result.data ?? []) {
        map.set(ss.id.toString(), ss.name);
      }
    }
    return map;
  }, [subServiceResults]);

  const serviceMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of services ?? []) map.set(s.id.toString(), s.name);
    return map;
  }, [services]);

  const subServiceToServiceMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const result of subServiceResults) {
      for (const ss of result.data ?? []) {
        map.set(ss.id.toString(), ss.serviceId.toString());
      }
    }
    return map;
  }, [subServiceResults]);

  // Customer sees only bookings with customerId === 0 (hardcoded in BookingForm)
  const myBookings = useMemo(
    () => (bookings ?? []).filter((b) => b.customerId === 0n),
    [bookings]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-muted-foreground" />
        <h2 className="font-semibold text-foreground">My Bookings</h2>
        {!bookingsLoading && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {myBookings.length} {myBookings.length === 1 ? "booking" : "bookings"}
          </span>
        )}
      </div>

      {bookingsLoading && (
        <div className="space-y-2">
          {[0, 1].map((i) => <BookingRowSkeleton key={i} />)}
        </div>
      )}

      {!bookingsLoading && myBookings.length === 0 && (
        <div className="text-center py-10 space-y-1">
          <p className="text-muted-foreground text-sm">No bookings found.</p>
          <p className="text-muted-foreground/60 text-xs">Create a booking above to get started.</p>
        </div>
      )}

      {!bookingsLoading && myBookings.length > 0 && (
        <div className="space-y-2">
          {myBookings.map((booking, i) => (
            <div key={String(booking.id)} className="space-y-1">
              <BookingRow
                booking={booking}
                index={i}
                isAdmin={false}
                readOnly={false}
                subServiceMap={subServiceMap}
                serviceMap={serviceMap}
                subServiceToServiceMap={subServiceToServiceMap}
                technicians={technicians ?? []}
                onViewInvoice={setInvoiceBookingId}
              />
              <StatusTimeline status={booking.status} />
            </div>
          ))}
        </div>
      )}

      <InvoiceModal
        bookingId={invoiceBookingId}
        onClose={() => setInvoiceBookingId(null)}
      />
    </div>
  );
}

/* ─── Technician Panel ───────────────────────────────────────── */

function TechnicianPanel({ activeTechnicianId }: { activeTechnicianId: bigint | null }) {
  const [invoiceBookingId, setInvoiceBookingId] = useState<bigint | null>(null);
  const { data: bookings, isLoading: bookingsLoading } = useGetBookings();
  const { data: services } = useGetServices();
  const { data: technicians } = useGetTechnicians();

  const uniqueServiceIds = useMemo(() => (services ?? []).map((s) => s.id), [services]);
  const subServiceResults = useGetAllSubServices(uniqueServiceIds);

  const subServiceMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const result of subServiceResults) {
      for (const ss of result.data ?? []) {
        map.set(ss.id.toString(), ss.name);
      }
    }
    return map;
  }, [subServiceResults]);

  const serviceMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of services ?? []) map.set(s.id.toString(), s.name);
    return map;
  }, [services]);

  const subServiceToServiceMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const result of subServiceResults) {
      for (const ss of result.data ?? []) {
        map.set(ss.id.toString(), ss.serviceId.toString());
      }
    }
    return map;
  }, [subServiceResults]);

  const assignedBookings = useMemo(() => {
    if (activeTechnicianId === null) return [];
    return (bookings ?? []).filter(
      (b) => b.technicianId !== undefined && b.technicianId === activeTechnicianId
    );
  }, [bookings, activeTechnicianId]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Wrench className="w-4 h-4 text-muted-foreground" />
        <h2 className="font-semibold text-foreground">Technician Panel</h2>
        {activeTechnicianId !== null && !bookingsLoading && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {assignedBookings.length} assigned
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground">Showing bookings assigned to you.</p>

      {activeTechnicianId === null && (
        <div className="text-center py-10 space-y-1">
          <p className="text-muted-foreground text-sm">Enter your Technician ID above to view your assigned bookings.</p>
        </div>
      )}

      {activeTechnicianId !== null && bookingsLoading && (
        <div className="space-y-2">
          {[0, 1].map((i) => <BookingRowSkeleton key={i} />)}
        </div>
      )}

      {activeTechnicianId !== null && !bookingsLoading && assignedBookings.length === 0 && (
        <div className="text-center py-10 space-y-1">
          <p className="text-muted-foreground text-sm">No bookings assigned to Technician #{String(activeTechnicianId)}.</p>
        </div>
      )}

      {activeTechnicianId !== null && !bookingsLoading && assignedBookings.length > 0 && (
        <div className="space-y-2">
          {assignedBookings.map((booking, i) => (
            <BookingRow
              key={String(booking.id)}
              booking={booking}
              index={i}
              isAdmin={false}
              readOnly={true}
              subServiceMap={subServiceMap}
              serviceMap={serviceMap}
              subServiceToServiceMap={subServiceToServiceMap}
              technicians={technicians ?? []}
              onViewInvoice={setInvoiceBookingId}
            />
          ))}
        </div>
      )}

      <InvoiceModal
        bookingId={invoiceBookingId}
        onClose={() => setInvoiceBookingId(null)}
      />
    </div>
  );
}

/* ─── App Root ───────────────────────────────────────────────── */

export default function App() {
  const [role, setRole] = useState<AppRole>("admin");
  const [activeTechnicianId, setActiveTechnicianId] = useState<bigint | null>(null);

  const isAdmin = role === "admin";
  const isTechnician = role === "technician";
  const isCustomer = role === "customer";

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="relative overflow-hidden bg-primary bg-hatch border-b border-primary/20">
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/15 flex items-center justify-center shrink-0 backdrop-blur-sm">
              <Home className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-primary-foreground leading-tight">
                Indu Home &amp; Estate Services
              </h1>
              <p className="mt-1 text-primary-foreground/70 text-sm font-body">
                From Homes to Estates – We Handle It All.
              </p>
              <p className="mt-0.5 text-primary-foreground/50 text-xs">
                Chikmagalur, Karnataka, India
              </p>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-foreground/5 rounded-tl-full" />
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        {/* Role Selector */}
        <RoleSelector
          role={role}
          setRole={setRole}
          activeTechnicianId={activeTechnicianId}
          setActiveTechnicianId={setActiveTechnicianId}
        />

        {/* ── ADMIN ONLY SECTIONS ── */}
        <AnimatePresence>
          {isAdmin && (
            <motion.div
              key="admin-sections"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Create User Section */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="rounded-xl border border-border bg-card shadow-xs p-5 sm:p-6"
              >
                <div className="mb-5">
                  <h2 className="font-display text-lg font-semibold text-foreground">Add New User</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Register an admin, technician, or customer in the system.
                  </p>
                </div>
                <CreateUserForm />
              </motion.section>

              <Separator className="bg-border/60" />

              {/* Users List Section */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <UsersList />
              </motion.section>

              <Separator className="bg-border/60" />

              {/* Technician Management Section */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="rounded-xl border border-border bg-card shadow-xs p-5 sm:p-6"
              >
                <div className="mb-5">
                  <h2 className="font-display text-lg font-semibold text-foreground">Technician Management</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Add and manage field technicians.
                  </p>
                </div>
                <TechnicianManagement />
              </motion.section>

              <Separator className="bg-border/60" />

              {/* Dashboard Cards */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
              >
                <DashboardCards />
              </motion.section>

              <Separator className="bg-border/60" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ADMIN + CUSTOMER: Booking Form ── */}
        <AnimatePresence>
          {(isAdmin || isCustomer) && (
            <motion.section
              key="booking-form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-xl border border-border bg-card shadow-xs p-5 sm:p-6"
            >
              <div className="mb-5">
                <h2 className="font-display text-lg font-semibold text-foreground">Create Booking</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Select a service and sub-service to book.
                </p>
              </div>
              <BookingForm />
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── ADMIN: Full Booking List ── */}
        <AnimatePresence>
          {isAdmin && (
            <motion.section
              key="admin-booking-list"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <BookingList isAdmin={true} />
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── CUSTOMER: My Bookings ── */}
        <AnimatePresence>
          {isCustomer && (
            <motion.section
              key="customer-booking-list"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <CustomerBookingList />
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── TECHNICIAN: Technician Panel ── */}
        <AnimatePresence>
          {isTechnician && (
            <motion.section
              key="technician-panel"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl border border-border bg-card shadow-xs p-5 sm:p-6"
            >
              <TechnicianPanel activeTechnicianId={activeTechnicianId} />
            </motion.section>
          )}
        </AnimatePresence>

      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Built with ♥ using caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
