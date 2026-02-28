import { UsersList } from "@/components/UserCard";
import { Button } from "@/components/ui/button";
import { useGetUsers } from "@/hooks/useQueries";
import { exportToCsv } from "@/utils/exportToExcel";
import { Download } from "lucide-react";
import { toast } from "sonner";

export function AllUsersPage() {
  const { data: users } = useGetUsers();

  const handleExport = () => {
    if (!users || users.length === 0) {
      toast.error("No users to export.");
      return;
    }
    const rows = users.map((u) => ({
      ID: String(u.id),
      Name: u.name,
      Role: u.role,
      "Created At": new Date(
        Number(u.createdAt) / 1_000_000,
      ).toLocaleDateString("en-IN"),
    }));
    exportToCsv("users.csv", rows);
    toast.success("Users exported.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            All Users
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View all registered users and their roles.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 h-9 shrink-0"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
      <UsersList />
    </div>
  );
}
