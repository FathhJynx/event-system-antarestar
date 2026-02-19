import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MoreHorizontal, Eye, Edit, Calendar, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganizerEvents } from "@/hooks/useOrganizer";
import { EventWithDetails } from "@/hooks/useEvents";

const statusColors = {
    open: "bg-success/20 text-success",
    closed: "bg-muted text-muted-foreground",
    ended: "bg-secondary/20 text-secondary",
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);
};

const OrganizerEvents = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { data: events, isLoading } = useOrganizerEvents();
    const navigate = useNavigate();

    const filteredEvents = events?.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <OrganizerLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-3xl">My Events</h1>
                        <p className="text-muted-foreground">Manage your hosted events and track registrations</p>
                    </div>
                    <Button onClick={() => navigate("/organizer/events/new")} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Create Event
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search events..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Button variant="outline" className="gap-2">
                                <Filter className="w-4 h-4" />
                                Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Event</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Registered</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    [...Array(5)].map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredEvents.length > 0 ? (
                                    filteredEvents.map((event: EventWithDetails, index) => (
                                        <motion.tr
                                            key={event.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-border"
                                        >
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{event.title}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {event.venues?.name || "No venue"}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {event.event_categories?.name || "Event"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Calendar className="w-4 h-4" />
                                                    {event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={statusColors[event.status as keyof typeof statusColors]}>
                                                    {event.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className="font-medium">{event.price ? formatCurrency(Number(event.price)) : 'Free'}</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className="font-medium">{event.registered_count} / {event.max_participants || '-'}</span>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            className="gap-2"
                                                            onClick={() => navigate(`/organizer/events/${event.id}/participants`)}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View Participants
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="gap-2"
                                                            onClick={() => navigate(`/organizer/events/${event.id}/edit`)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                            Edit Event
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No events found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </OrganizerLayout>
    );
};

export default OrganizerEvents;
