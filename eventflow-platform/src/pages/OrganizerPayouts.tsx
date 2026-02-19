import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    CheckCircle2,
    XCircle,
    BadgeIndianRupee as Landmark,
    Plus,
    Loader2,
    DollarSign
} from "lucide-react";
import OrganizerLayout from "@/components/organizer/OrganizerLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganizerStats, useWithdrawals, useRequestWithdrawal } from "@/hooks/useWithdrawals";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const statusColors = {
    pending: "secondary" as const,
    approved: "default" as const,
    completed: "outline" as const, // success not available in default shadcn badge usually
    rejected: "destructive" as const,
};

const OrganizerPayouts = () => {
    const { data: stats, isLoading: statsLoading } = useOrganizerStats();
    const { data: withdrawals, isLoading: listLoading } = useWithdrawals();
    const requestWithdrawal = useRequestWithdrawal();
    const { toast } = useToast();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        amount: "",
        bank_name: "",
        account_number: "",
        account_holder_name: "",
        notes: ""
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (Number(formData.amount) > (stats?.balance || 0)) {
            toast({
                title: "Invalid Amount",
                description: "You cannot withdraw more than your available balance.",
                variant: "destructive"
            });
            return;
        }

        try {
            await requestWithdrawal.mutateAsync({
                ...formData,
                amount: Number(formData.amount)
            });
            toast({
                title: "Withdrawal Requested",
                description: "Your request has been submitted for approval."
            });
            setIsDialogOpen(false);
            setFormData({
                amount: "",
                bank_name: "",
                account_number: "",
                account_holder_name: "",
                notes: ""
            });
        } catch (error) {
            toast({
                title: "Request Failed",
                description: "Failed to submit withdrawal request.",
                variant: "destructive"
            });
        }
    };

    return (
        <OrganizerLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="font-display text-4xl mb-2">Earnings & Payouts</h1>
                        <p className="text-muted-foreground">Manage your event revenue and withdrawal requests.</p>
                    </div>
                    <Button
                        size="lg"
                        className="gap-2 btn-hero rounded-xl"
                        onClick={() => setIsDialogOpen(true)}
                        disabled={!stats || stats.balance <= 0}
                    >
                        <Plus className="w-5 h-5" />
                        Request Withdrawal
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <Card className="glass border-primary/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                            <Wallet className="w-4 h-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statsLoading ? <Skeleton className="h-8 w-32" /> : formatCurrency(stats?.balance || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Ready for withdrawal</p>
                        </CardContent>
                    </Card>

                    <Card className="glass border-primary/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                            <ArrowUpRight className="w-4 h-4 text-success" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-success">
                                {statsLoading ? <Skeleton className="h-8 w-32" /> : formatCurrency(stats?.totalEarnings || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Lifetime revenue</p>
                        </CardContent>
                    </Card>

                    <Card className="glass border-primary/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
                            <Clock className="w-4 h-4 text-warning" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-warning">
                                {statsLoading ? <Skeleton className="h-8 w-32" /> : formatCurrency(stats?.pendingWithdrawal || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">In review or processing</p>
                        </CardContent>
                    </Card>

                    <Card className="glass border-primary/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Withdrawn</CardTitle>
                            <ArrowDownLeft className="w-4 h-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">
                                {statsLoading ? <Skeleton className="h-8 w-32" /> : formatCurrency(stats?.totalWithdrawn || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Transferred to bank</p>
                        </CardContent>
                    </Card>
                </div>

                {/* History */}
                <Card className="glass border-primary/10">
                    <CardHeader>
                        <CardTitle>Withdrawal History</CardTitle>
                        <CardDescription>Track the status of your payout requests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {listLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border border-border rounded-xl">
                                        <div className="space-y-2">
                                            <Skeleton className="h-5 w-24" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                ))
                            ) : withdrawals && withdrawals.length > 0 ? (
                                withdrawals.map((w) => (
                                    <div
                                        key={w.id}
                                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center",
                                                w.status === 'completed' ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                                            )}>
                                                <Landmark className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold">{formatCurrency(w.amount)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {w.bank_name} • {w.account_number} • {new Date(w.requested_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant={statusColors[w.status] || "outline"}>
                                                {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Landmark className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>No withdrawal requests yet.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Request Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Request Withdrawal</DialogTitle>
                        <DialogDescription>
                            Enter the amount and bank details for your payout.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (IDR)</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="e.g. 1000000"
                                    className="pl-10"
                                    required
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                                Max available: {formatCurrency(stats?.balance || 0)}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bank_name">Bank Name</Label>
                                <Input
                                    id="bank_name"
                                    placeholder="e.g. BCA"
                                    required
                                    value={formData.bank_name}
                                    onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="account_number">Account Number</Label>
                                <Input
                                    id="account_number"
                                    placeholder="88301..."
                                    required
                                    value={formData.account_number}
                                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="account_holder">Account Holder Name</Label>
                            <Input
                                id="account_holder"
                                placeholder="FullName"
                                required
                                value={formData.account_holder_name}
                                onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                placeholder="..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={requestWithdrawal.isPending} className="btn-hero">
                                {requestWithdrawal.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                Submit Request
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </OrganizerLayout>
    );
};

export default OrganizerPayouts;
