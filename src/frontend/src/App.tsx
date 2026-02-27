import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Loader2, UserPlus, Users, Home, CheckCircle2, ShieldCheck, Wrench, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useGetUsers, useCreateUser, Role } from "./hooks/useQueries";
import type { User as UserType } from "./backend";

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
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
        <span className="font-display text-sm font-semibold text-foreground/70">
          {user.name.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{user.name}</p>
        <p className="text-xs text-muted-foreground">{formatDate(user.createdAt)}</p>
      </div>

      {/* ID */}
      <span className="text-xs text-muted-foreground font-mono hidden sm:block">
        #{String(user.id).padStart(4, "0")}
      </span>

      {/* Role badge */}
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

      {/* Success confirmation */}
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

/* ─── App Root ───────────────────────────────────────────────── */

export default function App() {
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

        {/* Decorative corner shape */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-foreground/5 rounded-tl-full" />
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">

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
