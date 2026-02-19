import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, CheckCircle, Eye, MoreHorizontal, Loader2 } from "lucide-react";
import OrganizerLayout from "@/components/organizer/OrganizerLayout";
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
import { useOrganizerBookings } from "@/hooks/useOrganizer";
import { useCheckInBooking, Booking } from "@/hooks/useBookings";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const statusColors = {
    pending: "bg-warning/20 text-warning",
    success: "bg-success/20 text-success",
    failed: "bg-destructive/20 text-destructive",
    challenge: "bg-warning/20 text-warning",
};

const OrganizerBookings = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const { data: bookings, isLoading } = useOrganizerBookings();
    const checkInBooking = useCheckInBooking();
    const { toast } = useToast();

    const [viewingParticipants, setViewingParticipants] = useState<Booking | null>(null);

    const filteredBookings = bookings?.filter((booking: Booking) => {
        const matchesSearch =
            booking.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || booking.payment_status === statusFilter;
        return matchesSearch && matchesStatus;
    }) || [];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleCheckIn = async (id: string | number) => {
        try {
            await checkInBooking.mutateAsync({ id: id.toString(), isOrganizer: true });
            toast({ title: "Success", description: "Checked in successfully." });
        } catch (err) {
            toast({ title: "Error", description: "Failed to update check-in status.", variant: "destructive" });
        }
    };

    return (
        <OrganizerLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="font-display text-3xl">Bookings</h1>
                    <p className="text-muted-foreground">Manage participant bookings and check-ins for your events</p>
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
                                                    <p className="font-medium">{booking.name}</p>
                                                    <p className="text-xs text-muted-foreground">{booking.email}</p>
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
        </OrganizerLayout>
    );
};

export default OrganizerBookings;
