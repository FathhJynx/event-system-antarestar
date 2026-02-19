import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Tag, MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
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
import { usePromoCodes, useCreatePromoCode, useUpdatePromoCode, useDeletePromoCode, PromoCode } from "@/hooks/usePromoCodes";
import { useEvents } from "@/hooks/useEvents";
import { useOrganizerEvents } from "@/hooks/useOrganizer";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PromoCodeManagementProps {
    isAdmin?: boolean;
}

const PromoCodeManagement = ({ isAdmin = false }: PromoCodeManagementProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
    const [formData, setFormData] = useState({
        code: "",
        discount_percentage: "",
        discount_amount: "",
        usage_limit: "",
        valid_from: "",
        valid_until: "",
        is_active: true,
        event_id: "all",
    });

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const { data: promoCodes, isLoading } = usePromoCodes();
    const adminEvents = useEvents();
    const organizerEvents = useOrganizerEvents();
    const events = isAdmin ? adminEvents.data : organizerEvents.data;

    const createPromo = useCreatePromoCode();
    const updatePromo = useUpdatePromoCode();
    const deletePromoCode = useDeletePromoCode();
    const { toast } = useToast();

    const filteredPromoCodes = promoCodes?.filter((promo: PromoCode) =>
        promo.code.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleOpenDialog = (promo: PromoCode | null = null) => {
        if (promo) {
            setEditingPromo(promo);
            setFormData({
                code: promo.code,
                discount_percentage: promo.discount_percentage?.toString() || "",
                discount_amount: promo.discount_amount?.toString() || "",
                usage_limit: promo.usage_limit?.toString() || "",
                valid_from: promo.valid_from ? promo.valid_from.split('T')[0] : "",
                valid_until: promo.valid_until ? promo.valid_until.split('T')[0] : "",
                is_active: promo.is_active,
                event_id: promo.event_id?.toString() || "all",
            });
        } else {
            setEditingPromo(null);
            setFormData({
                code: "",
                discount_percentage: "",
                discount_amount: "",
                usage_limit: "",
                valid_from: "",
                valid_until: "",
                is_active: true,
                event_id: "all",
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                discount_percentage: formData.discount_percentage ? Number(formData.discount_percentage) : null,
                discount_amount: formData.discount_amount ? Number(formData.discount_amount) : null,
                usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
                event_id: formData.event_id === "all" ? null : Number(formData.event_id),
            };

            if (editingPromo) {
                await updatePromo.mutateAsync({ id: editingPromo.id.toString(), ...payload });
                toast({ title: "Success", description: "Promo code updated successfully." });
            } else {
                await createPromo.mutateAsync(payload);
                toast({ title: "Success", description: "Promo code created successfully." });
            }
            setIsDialogOpen(false);
        } catch (error) {
            toast({ title: "Error", description: "Failed to save promo code.", variant: "destructive" });
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        try {
            await deletePromoCode.mutateAsync(deleteId);
            toast({ title: "Success", description: "Promo code deleted successfully." });
            setDeleteId(null);
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete promo code.", variant: "destructive" });
        }
    };

    const formatDiscount = (promo: PromoCode) => {
        if (promo.discount_percentage) return `${promo.discount_percentage}%`;
        if (promo.discount_amount) return `Rp ${Number(promo.discount_amount).toLocaleString()}`;
        return "-";
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl">Promo Codes</h1>
                    <p className="text-muted-foreground">Manage discount codes for registrations</p>
                </div>
                <Button className="gap-2" onClick={() => handleOpenDialog()}>
                    <Plus className="w-4 h-4" />
                    Create Promo
                </Button>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by code..."
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
                                <TableHead>Code</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead>Applies To</TableHead>
                                <TableHead>Usage</TableHead>
                                <TableHead>Validity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredPromoCodes.length > 0 ? (
                                filteredPromoCodes.map((promo: PromoCode, index) => (
                                    <motion.tr
                                        key={promo.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-border"
                                    >
                                        <TableCell className="font-mono font-bold text-primary">{promo.code}</TableCell>
                                        <TableCell>{formatDiscount(promo)}</TableCell>
                                        <TableCell>
                                            {promo.event_id ? (
                                                <Badge variant="outline" className="font-normal capitalize text-xs">
                                                    {events?.find(e => e.id.toString() === promo.event_id?.toString())?.title || "Specific Event"}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="font-normal">All Events</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">
                                                {promo.usage_count} / {promo.usage_limit || "∞"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-xs text-muted-foreground">
                                                <span>From: {promo.valid_from ? new Date(promo.valid_from).toLocaleDateString() : "-"}</span>
                                                <span>Until: {promo.valid_until ? new Date(promo.valid_until).toLocaleDateString() : "-"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={promo.is_active ? "default" : "secondary"}>
                                                {promo.is_active ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="gap-2" onClick={() => handleOpenDialog(promo)}>
                                                        <Edit className="w-4 h-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2 text-destructive"
                                                        onClick={() => handleDeleteClick(promo.id.toString())}
                                                    >
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
                                        No promo codes found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingPromo ? "Edit Promo Code" : "Create New Promo Code"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Promo Code</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                placeholder="E.G. RAMADAN2024"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="event_id">Applies To</Label>
                            <Select
                                value={formData.event_id}
                                onValueChange={(value) => setFormData({ ...formData, event_id: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Event" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Events</SelectItem>
                                    {events?.map((event) => (
                                        <SelectItem key={event.id} value={event.id.toString()}>
                                            {event.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="percentage">Discount (%)</Label>
                                <Input
                                    id="percentage"
                                    type="number"
                                    value={formData.discount_percentage}
                                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value, discount_amount: "" })}
                                    placeholder="10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">Discount Amount</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={formData.discount_amount}
                                    onChange={(e) => setFormData({ ...formData, discount_amount: e.target.value, discount_percentage: "" })}
                                    placeholder="50000"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="usage_limit">Usage Limit (Optional)</Label>
                            <Input
                                id="usage_limit"
                                type="number"
                                value={formData.usage_limit}
                                onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                                placeholder="100"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="valid_from">Valid From</Label>
                                <Input
                                    id="valid_from"
                                    type="date"
                                    value={formData.valid_from}
                                    onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="valid_until">Valid Until</Label>
                                <Input
                                    id="valid_until"
                                    type="date"
                                    value={formData.valid_until}
                                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <Label htmlFor="active">Active Status</Label>
                            <Switch
                                id="active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createPromo.isPending || updatePromo.isPending}>
                                {createPromo.isPending || updatePromo.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : null}
                                {editingPromo ? "Update Promo" : "Create Promo"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <DeleteConfirmDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                isDeleting={deletePromoCode.isPending}
                title="Delete Promo Code"
                description="Are you sure you want to delete this promo code? This action cannot be undone."
            />
        </div>
    );
};

export default PromoCodeManagement;
