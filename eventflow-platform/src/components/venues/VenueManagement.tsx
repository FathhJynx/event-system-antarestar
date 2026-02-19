import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, MapPin, MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useVenues, useCreateVenue, useUpdateVenue, useDeleteVenue, Venue } from "@/hooks/useVenues";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface VenueManagementProps {
    isAdmin?: boolean;
}

const VenueManagement = ({ isAdmin = false }: VenueManagementProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        city: "",
        address: "",
        capacity: "",
    });

    const { data: venues, isLoading } = useVenues();
    const createVenue = useCreateVenue();
    const updateVenue = useUpdateVenue();
    const deleteVenue = useDeleteVenue();
    const { toast } = useToast();

    const filteredVenues = venues?.filter((venue: Venue) =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.city?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleOpenDialog = (venue: Venue | null = null) => {
        if (venue) {
            setEditingVenue(venue);
            setFormData({
                name: venue.name,
                city: venue.city || "",
                address: venue.address || "",
                capacity: venue.capacity?.toString() || "",
            });
        } else {
            setEditingVenue(null);
            setFormData({
                name: "",
                city: "",
                address: "",
                capacity: "",
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                capacity: formData.capacity ? Number(formData.capacity) : null,
            };

            if (editingVenue) {
                await updateVenue.mutateAsync({ id: editingVenue.id.toString(), ...payload });
                toast({ title: "Success", description: "Venue updated successfully." });
            } else {
                await createVenue.mutateAsync(payload);
                toast({ title: "Success", description: "Venue created successfully." });
            }
            setIsDialogOpen(false);
        } catch (error) {
            toast({ title: "Error", description: "Failed to save venue.", variant: "destructive" });
        }
    };

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDeleteClick = (id: string | number) => {
        setDeleteId(id.toString());
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteVenue.mutateAsync(deleteId);
            toast({ title: "Success", description: "Venue deleted successfully." });
            setDeleteId(null);
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete venue.", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl">Venues</h1>
                    <p className="text-muted-foreground">Manage event locations</p>
                </div>
                <Button className="gap-2" onClick={() => handleOpenDialog()}>
                    <Plus className="w-4 h-4" />
                    Add Venue
                </Button>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search venues by name or city..."
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
                                <TableHead>Venue Name</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead className="text-right">Capacity</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredVenues.length > 0 ? (
                                filteredVenues.map((venue: Venue, index) => (
                                    <motion.tr
                                        key={venue.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-border"
                                    >
                                        <TableCell className="font-medium">{venue.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="w-3 h-3" />
                                                {venue.city}, {venue.address?.substring(0, 30)}...
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">{venue.capacity?.toLocaleString() || "-"}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="gap-2" onClick={() => handleOpenDialog(venue)}>
                                                        <Edit className="w-4 h-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2 text-destructive"
                                                        onClick={() => handleDeleteClick(venue.id)}
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
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No venues found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingVenue ? "Edit Venue" : "Add New Venue"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Venue Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Gelora Bung Karno"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    placeholder="Jakarta"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="capacity">Capacity</Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                    placeholder="5000"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Full address details..."
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createVenue.isPending || updateVenue.isPending}>
                                {createVenue.isPending || updateVenue.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : null}
                                {editingVenue ? "Update Venue" : "Create Venue"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <DeleteConfirmDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                isDeleting={deleteVenue.isPending}
                title="Delete Venue"
                description="Are you sure you want to delete this venue? This action cannot be undone."
            />
        </div>
    );
};

export default VenueManagement;
