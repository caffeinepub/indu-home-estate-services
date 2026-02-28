import type { User as UserType } from "@/backend";
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
import { useCreateUser } from "@/hooks/useQueries";
import { ROLE_CONFIG, Role } from "@/lib/helpers";
import {
  CheckCircle2,
  Loader2,
  ShieldCheck,
  User,
  UserPlus,
  Wrench,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function AddUserPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [lastCreated, setLastCreated] = useState<UserType | null>(null);

  const { mutateAsync: createUser, isPending } = useCreateUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role) return;

    try {
      const newUser = await createUser({
        name: name.trim(),
        role: role as Role,
      });
      setLastCreated(newUser);
      setName("");
      setRole("");
      toast.success(`User "${newUser.name}" created successfully`);
    } catch {
      toast.error("Failed to create user. Please try again.");
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Add User
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Register an admin, technician, or customer in the system.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-xs p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-foreground"
            >
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
            <Label
              htmlFor="role"
              className="text-sm font-medium text-foreground"
            >
              Role
            </Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as Role)}
              disabled={isPending}
            >
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
              className="mt-4"
            >
              <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Last created</p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {lastCreated.name}
                    </span>
                    {" · "}
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border ${ROLE_CONFIG[lastCreated.role].className}`}
                    >
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
    </div>
  );
}
