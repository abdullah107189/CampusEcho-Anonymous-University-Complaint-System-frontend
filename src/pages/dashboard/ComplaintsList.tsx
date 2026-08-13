import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetComplaintsQuery } from "../../lib/api/complaintApi";
import { Card, CardContent } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import { format } from "date-fns";
import { Eye, Search } from "lucide-react";
import { Complaint } from "../../types/complaint.types";

const statusColors: Record<string, string> = {
  Pending:
    "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20",
  Under_Review:
    "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20",
  Investigating:
    "bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20",
  Resolved:
    "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20",
  Rejected: "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20",
};

const priorityColors: Record<string, string> = {
  Low: "bg-gray-500/10 text-gray-500",
  Medium: "bg-blue-500/10 text-blue-500",
  High: "bg-orange-500/10 text-orange-500",
  Urgent: "bg-red-500/10 text-red-500",
};

const categories = [
  "Facilities",
  "Academic",
  "Finance",
  "Transportation",
  "Hostel",
  "Other",
];

export default function ComplaintsList() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 10;

  const { data, isLoading, isFetching } = useGetComplaintsQuery({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    category: categoryFilter === "ALL" ? undefined : categoryFilter,
    search: search.trim() || undefined,
    page,
    limit,
  });

  const complaints: Complaint[] = data?.data?.complaints || [];

  // Adjust this according to your actual API response
  const pagination = data?.data?.pagination;

  const totalPages =
    pagination?.totalPages || Math.ceil((pagination?.total || 0) / limit) || 1;

  const handleStatusChange = (value: string | null) => {
    if (value === null) return;
    setStatusFilter(value);
    setPage(1);
  };

  const handleCategoryChange = (value: string | null) => {
    if (value === null) return;
    setCategoryFilter(value);
    setPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Complaints</h1>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

            <Input
              type="search"
              placeholder="Search ID or Title..."
              value={search}
              onChange={handleSearchChange}
              className="pl-8 w-full"
            />
          </div>

          {/* Status */}
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Under_Review">Under Review</SelectItem>
              <SelectItem value="Investigating">Investigating</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          {/* Category */}
          <Select value={categoryFilter} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>

              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading || isFetching ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>

                        <TableCell>
                          <Skeleton className="h-4 w-48" />
                        </TableCell>

                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>

                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>

                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>

                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>

                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                ) : complaints.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No complaints found.
                    </TableCell>
                  </TableRow>
                ) : (
                  complaints.map((complaint: Complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-mono text-sm">
                        {complaint.trackingId}
                      </TableCell>

                      <TableCell
                        className="font-medium max-w-[200px] truncate"
                        title={complaint.title}
                      >
                        {complaint.title}
                      </TableCell>

                      <TableCell>{complaint.category}</TableCell>

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={priorityColors[complaint.priority]}
                        >
                          {complaint.priority}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusColors[complaint.status]}
                        >
                          {complaint.status.replace("_", " ")}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(complaint.createdAt), "MMM d, yyyy")}
                      </TableCell>

                      <TableCell className="text-right">
                        <Link to={`/admin/complaints/${complaint.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || isFetching}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
