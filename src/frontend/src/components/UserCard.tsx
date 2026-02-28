import type { User as UserType } from "@/backend";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUsers } from "@/hooks/useQueries";
import { ROLE_CONFIG, formatDate } from "@/lib/helpers";
import { Role } from "@/lib/helpers";
import { Users } from "lucide-react";
import { motion } from "motion/react";

export function UserCard({ user, index }: { user: UserType; index: number }) {
  const config = ROLE_CONFIG[user.role];

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
        <p className="text-xs text-muted-foreground">
          {formatDate(user.createdAt)}
        </p>
      </div>
      <span className="text-xs text-muted-foreground font-mono hidden sm:block">
        #{String(user.id).padStart(4, "0")}
      </span>
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
      >
        {config.label}
      </span>
    </motion.div>
  );
}

export function UserSkeleton() {
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

export function UsersList() {
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
          <p className="text-muted-foreground/60 text-xs">
            Create one using the form above.
          </p>
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

// Re-export Role for use in AddUserPage
export { Role };
