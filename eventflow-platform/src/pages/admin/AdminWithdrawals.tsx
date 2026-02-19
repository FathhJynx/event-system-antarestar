import { useState } from "react";
import { motion } from "framer-motion";
import { Search, DollarSign, MoreHorizontal, CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useWithdrawals, useUpdateWithdrawalStatus, Withdrawal } from "@/hooks/useWithdrawals";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const statusColors = {
    pending: "bg-warning/20 text-warning border-warning/20",
    approved: "bg-primary/20 text-primary border-primary/20",
    completed: "bg-success/20 text-success border-success/20",
    rejected: "bg-destructive/20 text-destructive border-destructive/20",
};

const AdminWithdrawals = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { data: withdrawals, isLoading } = useWithdrawals();
    const updateStatus = useUpdateWithdrawalStatus();
    const { toast } = useToast();

    const filteredWithdrawals = withdrawals?.filter((w) =>
        w.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.bank_name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [viewingWithdrawal, setViewingWithdrawal] = useState<Withdrawal | null>(null);
    const [statusData, setStatusData] = useState({
        status: "",
        notes: "",
        proof_of_transfer: ""
    });

    const handleUpdateStatus = async (id: string | number, status: string, skipDialog: boolean = false) => {
        if (!skipDialog && (status === 'completed' || status === 'rejected')) {
            setViewingWithdrawal(withdrawals?.find(w => w.id.toString() === id.toString()) || null);
            setStatusData({ status, notes: "", proof_of_transfer: "" });
            setIsDialogOpen(true);
            return;
        }

        try {
            await updateStatus.mutateAsync({ id, status });
            toast({ title: "Success", description: `Withdrawal marked as ${status}.` });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
        }
    };

    const handleConfirmUpdate = async () => {
        if (!viewingWithdrawal) return;
        try {
            await updateStatus.mutateAsync({
                id: viewingWithdrawal.id,
                ...statusData
            });
            toast({ title: "Success", description: `Withdrawal marked as ${statusData.status}.` });
            setIsDialogOpen(false);
            setViewingWithdrawal(null); // Clear selected withdrawal after action
        } catch (error) {
            toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl">Withdrawals</h1>
                        <p className="text-muted-foreground">Manage payout requests from organizers</p>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by organizer name or bank..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Organizer</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Bank Info</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Requested</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    [...Array(5)].map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredWithdrawals.length > 0 ? (
                                    filteredWithdrawals.map((withdrawal: Withdrawal, index) => (
                                        <motion.tr
                                            key={withdrawal.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-border"
                                        >
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{withdrawal.user?.name}</p>
                                                    <p className="text-xs text-muted-foreground">{withdrawal.user?.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-bold text-primary">
                                                {formatCurrency(withdrawal.amount)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <p className="font-medium">{withdrawal.bank_name}</p>
                                                    <p className="font-mono text-xs">{withdrawal.account_number}</p>
                                                    <p className="text-xs text-muted-foreground">{withdrawal.account_holder_name}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={statusColors[withdrawal.status]}>
                                                    {withdrawal.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(withdrawal.requested_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {withdrawal.status === 'pending' && (
                                                            <>
                                                                <DropdownMenuItem
                                                                    className="gap-2 text-primary"
                                                                    onClick={() => handleUpdateStatus(withdrawal.id.toString(), 'approved')}
                                                                >
                                                                    <CheckCircle className="w-4 h-4" />
                                                                    Approve
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="gap-2 text-destructive"
                                                                    onClick={() => handleUpdateStatus(withdrawal.id.toString(), 'rejected')}
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                    Reject
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                        {withdrawal.status === 'approved' && (
                                                            <DropdownMenuItem
                                                                className="gap-2 text-success"
                                                                onClick={() => handleUpdateStatus(withdrawal.id.toString(), 'completed')}
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                                Mark Completed
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem className="gap-2">
                                                            <ExternalLink className="w-4 h-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No withdrawal requests found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Withdrawal Status</DialogTitle>
                        <DialogDescription>
                            {statusData.status === 'completed'
                                ? "Complete this payout by providing the transfer details."
                                : "Provide a reason for rejecting this payout request."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {statusData.status === 'completed' && (
                            <div className="space-y-2">
                                <Label>Proof of Transfer (URL or Ref No.)</Label>
                                <Input
                                    placeholder="e.g. TRF-12345678"
                                    value={statusData.proof_of_transfer}
                                    onChange={(e) => setStatusData({ ...statusData, proof_of_transfer: e.target.value })}
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Textarea
                                placeholder="Add internal notes or message to organizer..."
                                value={statusData.notes}
                                onChange={(e) => setStatusData({ ...statusData, notes: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button
                            className={statusData.status === 'rejected' ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "btn-hero"}
                            onClick={handleConfirmUpdate}
                            disabled={updateStatus.isPending}
                        >
                            {updateStatus.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            Confirm {statusData.status.charAt(0).toUpperCase() + statusData.status.slice(1)}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminWithdrawals;
