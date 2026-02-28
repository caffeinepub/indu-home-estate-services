import { UsersList } from "@/components/UserCard";

export function AllUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          All Users
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View all registered users and their roles.
        </p>
      </div>
      <UsersList />
    </div>
  );
}
