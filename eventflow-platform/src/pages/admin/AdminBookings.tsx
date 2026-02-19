import { useState } from "react";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { motion } from "framer-motion";
import { Search, Filter, Download, CheckCircle, Eye, MoreHorizontal, Edit, Trash2, Loader2, RefreshCw } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAdminBookings, useUpdateBooking, useDeleteBooking, useCheckInBooking, useVerifyBookingStatus, Booking } from "@/hooks/useBookings";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const statusColors = {
  pending: "bg-warning/20 text-warning",
  success: "bg-success/20 text-success",
  failed: "bg-destructive/20 text-destructive",
  challenge: "bg-warning/20 text-warning",
};

const AdminBookings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: bookingsData, isLoading } = useAdminBookings();
  const updateBooking = useUpdateBooking();
  const deleteBooking = useDeleteBooking();
  const checkInBooking = useCheckInBooking();
  const verifyStatus = useVerifyBookingStatus();
  const { toast } = useToast();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    payment_status: "pending" as Booking["payment_status"]
  });
  const [viewingParticipants, setViewingParticipants] = useState<Booking | null>(null);

  const bookings = bookingsData || [];

  const filteredBookings = bookings.filter((booking: Booking) => {
    const matchesSearch =
      booking.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setEditFormData({
      name: booking.name || "",
      email: booking.email || "",
      phone: booking.phone || "",
      payment_status: booking.payment_status
    });
  };

  const handleUpdate = async () => {
    try {
      await updateBooking.mutateAsync({ id: editingBooking.id, data: editFormData });
      toast({ title: "Success", description: "Booking updated successfully." });
      setEditingBooking(null);
    } catch (err) {
      toast({ title: "Error", description: "Failed to update booking.", variant: "destructive" });
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBooking.mutateAsync(deleteId);
      toast({ title: "Success", description: "Booking deleted successfully." });
      setDeleteId(null);
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete booking.", variant: "destructive" });
    }
  };

  const handleCheckIn = async (id: string | number) => {
    try {
      await checkInBooking.mutateAsync({ id: id.toString() });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update check-in status.", variant: "destructive" });
    }
  };

  const handleSync = async (id: string | number) => {
    try {
      await verifyStatus.mutateAsync(id);
      toast({ title: "Success", description: "Booking status synchronized with Midtrans." });
    } catch (err: any) {
      toast({
        title: "Sync Failed",
        description: err.response?.data?.message || "Could not sync with Midtrans API.",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">Bookings</h1>
            <p className="text-muted-foreground">Manage participant bookings and check-ins</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Bookings</p>
            <p className="text-2xl font-bold">{bookings.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Successful</p>
            <p className="text-2xl font-bold text-success">
              {bookings.filter((b: Booking) => b.payment_status === "success").length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-warning">
              {bookings.filter((b: Booking) => b.payment_status === "pending").length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Checked In</p>
            <p className="text-2xl font-bold text-secondary">
              {bookings.filter((b: Booking) => b.is_checked_in).length}
            </p>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or booking ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking Code</TableHead>
                  <TableHead>Participant</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredBookings.length > 0 ? (
                  filteredBookings.map((booking: Booking, index) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border"
                    >
                      <TableCell className="font-mono text-xs">{booking.code}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{booking.name}</p>
                            {booking.participants && booking.participants.length > 1 && (
                              <Badge variant="outline" className="text-[10px] h-4 px-1">
                                +{booking.participants.length - 1} more
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{booking.email}</p>
                          {booking.participants && booking.participants.length > 1 && (
                            <Button
                              variant="link"
                              className="h-auto p-0 text-[10px] text-primary w-fit"
                              onClick={() => setViewingParticipants(booking)}
                            >
                              View all participants
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{booking.Event?.title || "Event"}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(Number(booking.total))}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[booking.payment_status as keyof typeof statusColors]}>
                          {booking.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {booking.payment_status === "success" && (
                          <Button
                            variant={booking.is_checked_in ? "default" : "outline"}
                            size="sm"
                            className="gap-1"
                            onClick={() => handleCheckIn(booking.id)}
                            disabled={checkInBooking.isPending}
                          >
                            {checkInBooking.isPending && checkInBooking.variables?.id === booking.id.toString() ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : booking.is_checked_in ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Checked In
                              </>
                            ) : (
                              "Check In"
                            )}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2" onClick={() => setViewingParticipants(booking)}>
                              <Eye className="w-4 h-4" />
                              View Participants
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => handleEdit(booking)}>
                              <Edit className="w-4 h-4" />
                              Edit Booking
                            </DropdownMenuItem>
                            {booking.payment_status === 'pending' && (
                              <DropdownMenuItem className="gap-2" onClick={() => handleSync(booking.id)}>
                                <RefreshCw className={`w-4 h-4 ${verifyStatus.isPending && verifyStatus.variables === booking.id ? 'animate-spin' : ''}`} />
                                Sync Status
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDeleteClick(booking.id.toString())}>
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No bookings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingBooking} onOpenChange={() => setEditingBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Payment Status</Label>
              <Select
                value={editFormData.payment_status}
                onValueChange={(value) => setEditFormData({ ...editFormData, payment_status: value as Booking["payment_status"] })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBooking(null)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateBooking.isPending}>
              {updateBooking.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Participants Dialog */}
      <Dialog open={!!viewingParticipants} onOpenChange={() => setViewingParticipants(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Participants Detail</DialogTitle>
            <p className="text-sm text-muted-foreground">Booking Code: {viewingParticipants?.code}</p>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>BIB Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewingParticipants?.participants?.map((p, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-bold text-primary">{p.bib_number || "TBA"}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell className="text-xs">{p.email}</TableCell>
                    <TableCell className="text-xs">{p.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button onClick={() => setViewingParticipants(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteBooking.isPending}
        title="Delete Booking"
        description="Are you sure you want to delete this booking? This action cannot be undone."
      />
    </AdminLayout>
  );
};

export default AdminBookings;
