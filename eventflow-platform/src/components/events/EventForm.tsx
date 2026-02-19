import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X, Plus, Trash2, Calendar, MapPin, Tag, Info, Trophy, Image as ImageIcon, Map as MapIcon } from "lucide-react";
import MapRoutePicker from "@/components/admin/MapRoutePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useCreateEvent, useUpdateEvent, EventWithDetails } from "@/hooks/useEvents";
import { useCategories, Category } from "@/hooks/useCategories";
import { useVenues, Venue } from "@/hooks/useVenues";
import { useToast } from "@/hooks/use-toast";

interface EventFormProps {
    initialData?: EventWithDetails;
    isEditing?: boolean;
    cancelPath: string;
    successPath: (id: string) => string;
}

const EventForm = ({ initialData, isEditing, cancelPath, successPath }: EventFormProps) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { data: categories } = useCategories();
    const { data: venues } = useVenues();

    const createEvent = useCreateEvent();
    const updateEvent = useUpdateEvent();

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        category_id: "",
        venue_id: "",
        date: "",
        registration_start: "",
        registration_end: "",
        image: "",
        status: "open" as EventWithDetails["status"],
        is_featured: false,
        price: "",
        prizepool: "",
        additional_rewards: "",
        schedule: "",
        max_participants: "",
        route_coordinates: "",
        route_start_name: "",
        route_end_name: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                slug: initialData.slug || "",
                description: initialData.description || "",
                category_id: initialData.event_categories?.id?.toString() || "",
                venue_id: initialData.venues?.id?.toString() || "",
                date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : "",
                registration_start: initialData.registration_start ? new Date(initialData.registration_start).toISOString().split('T')[0] : "",
                registration_end: initialData.registration_end ? new Date(initialData.registration_end).toISOString().split('T')[0] : "",
                image: initialData.image || "",
                status: initialData.status || "open",
                is_featured: !!initialData.is_featured,
                price: initialData.price?.toString() || "",
                prizepool: initialData.prizepool?.toString() || "",
                additional_rewards: initialData.additional_rewards || "",
                schedule: initialData.schedule || "",
                max_participants: initialData.max_participants?.toString() || "",
                route_coordinates: initialData.route_coordinates || "",
                route_start_name: initialData.route_start_name || "",
                route_end_name: initialData.route_end_name || "",
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            category_id: formData.category_id === "" ? null : formData.category_id,
            venue_id: formData.venue_id === "" ? null : formData.venue_id,
            price: formData.price ? Number(formData.price) : null,
            prizepool: formData.prizepool ? Number(formData.prizepool) : null,
            max_participants: formData.max_participants ? Number(formData.max_participants) : null,
        };

        try {
            if (isEditing && initialData) {
                await updateEvent.mutateAsync({ id: initialData.id.toString(), ...submissionData });
                toast({ title: "Success", description: "Event updated successfully." });
            } else {
                const newEvent = await createEvent.mutateAsync(submissionData);
                toast({ title: "Success", description: "Event created successfully." });
                navigate(successPath(newEvent.id));
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to save event.", variant: "destructive" });
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-4xl">
                        {isEditing ? "EDIT" : "CREATE"} <span className="text-gradient">EVENT</span>
                    </h1>
                    <p className="text-muted-foreground">Fill in the details for your athletic event</p>
                </div>
                <Button variant="ghost" onClick={() => navigate(cancelPath)} className="gap-2">
                    <X className="w-4 h-4" />
                    Cancel
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-primary" />
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Event Title</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Jakarta City Marathon 2024"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <Select
                                        value={formData.category_id}
                                        onValueChange={(v) => setFormData({ ...formData, category_id: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories?.map((c: Category) => (
                                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Venue</label>
                                    <Select
                                        value={formData.venue_id}
                                        onValueChange={(v) => setFormData({ ...formData, venue_id: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Venue" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {venues?.map((v: Venue) => (
                                                <SelectItem key={v.id} value={v.id.toString()}>{v.city} - {v.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Tell us about the event..."
                                    className="min-h-[150px]"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schedule & Prizes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-primary" />
                                Prizes & Rewards
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Registration Price (IDR)</label>
                                    <Input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="e.g. 150000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Total Prize Pool (IDR)</label>
                                    <Input
                                        type="number"
                                        value={formData.prizepool}
                                        onChange={(e) => setFormData({ ...formData, prizepool: e.target.value })}
                                        placeholder="e.g. 10000000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Max Participants</label>
                                    <Input
                                        type="number"
                                        value={formData.max_participants}
                                        onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                                        placeholder="e.g. 500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Additional Rewards</label>
                                <Textarea
                                    value={formData.additional_rewards}
                                    onChange={(e) => setFormData({ ...formData, additional_rewards: e.target.value })}
                                    placeholder="e.g. Medals, T-shirts, Goodie bags..."
                                    className="min-h-[80px]"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                Event Schedule
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={formData.schedule}
                                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                                placeholder="e.g. 08:00 - Registration&#10;09:00 - Opening Ceremony..."
                                className="min-h-[150px]"
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapIcon className="w-5 h-5 text-primary" />
                                Event Route
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Start Location Name</label>
                                    <Input
                                        value={formData.route_start_name}
                                        onChange={(e) => setFormData({ ...formData, route_start_name: e.target.value })}
                                        placeholder="e.g. GBK Main Gate"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">End Location Name</label>
                                    <Input
                                        value={formData.route_end_name}
                                        onChange={(e) => setFormData({ ...formData, route_end_name: e.target.value })}
                                        placeholder="e.g. Finish Line"
                                    />
                                </div>
                            </div>
                            <MapRoutePicker
                                value={formData.route_coordinates}
                                onChange={(val) => setFormData({ ...formData, route_coordinates: val })}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Calendar className="w-4 h-4 text-primary" />
                                Settings & Date
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Event Date</label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Registration Start</label>
                                    <Input
                                        type="date"
                                        value={formData.registration_start}
                                        onChange={(e) => setFormData({ ...formData, registration_start: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Registration End</label>
                                    <Input
                                        type="date"
                                        value={formData.registration_end}
                                        onChange={(e) => setFormData({ ...formData, registration_end: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(v: EventWithDetails["status"]) => setFormData({ ...formData, status: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="open">Open Registration</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                        <SelectItem value="ended">Ended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                                <div className="space-y-0.5">
                                    <label className="text-sm font-medium">Featured Event</label>
                                    <p className="text-xs text-muted-foreground">Highlight on homepage</p>
                                </div>
                                <Switch
                                    checked={formData.is_featured}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                                />
                            </div>
                            <div className="pt-4">
                                <Button type="submit" className="w-full gap-2" disabled={updateEvent.isPending || createEvent.isPending}>
                                    {updateEvent.isPending || createEvent.isPending ? (
                                        <LoadingSpinner className="w-4 h-4" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {isEditing ? "Update Event" : "Create Event"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <ImageIcon className="w-4 h-4 text-primary" />
                                Event Poster
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="aspect-video rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted overflow-hidden">
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                )}
                            </div>
                            <Input
                                placeholder="Image URL..."
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            />
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default EventForm;
