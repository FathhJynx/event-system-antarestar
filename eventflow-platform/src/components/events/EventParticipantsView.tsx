import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowLeft, Download, CheckCircle, XCircle, Users, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useEventParticipants } from "@/hooks/useEvents";

interface EventParticipantsViewProps {
    eventId: string;
    backPath: string;
}

const EventParticipantsView = ({ eventId, backPath }: EventParticipantsViewProps) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const { data, isLoading } = useEventParticipants(eventId);

    const participants = data?.participants || [];
    const eventTitle = data?.event_title || "Loading event...";

    const filteredParticipants = participants.filter((p: any) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.bib_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.booking_code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: participants.length,
        checkedIn: participants.filter((p: any) => p.is_checked_in).length,
    };

    const handleExport = () => {
        const headers = ["BIB Number", "Name", "Email", "Phone", "Booking Code", "Check-in Status"];
        const csvData = participants.map((p: any) => [
            p.bib_number || "TBA",
            p.name,
            p.email,
            p.phone,
            p.booking_code,
            p.is_checked_in ? "Checked In" : "Pending"
        ]);

        const csvContent = [
            headers.join(","),
            ...csvData.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `participants_${eventTitle.replace(/\s+/g, '_').toLowerCase()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(backPath)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="font-display text-3xl">{eventTitle}</h1>
                    <p className="text-muted-foreground">Detailed participant list and registration data</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Participants</p>
                            <p className="text-2xl font-bold">{isLoading ? "..." : stats.total}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-success/5 border-success/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-success/10 rounded-lg">
                            <Users className="w-5 h-5 text-success" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Checked In</p>
                            <p className="text-2xl font-bold">{isLoading ? "..." : stats.checkedIn}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-warning/5 border-warning/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-warning/10 rounded-lg">
                            <Users className="w-5 h-5 text-warning" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Check-in Rate</p>
                            <p className="text-2xl font-bold">
                                {isLoading ? "..." : `${stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0}%`}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, BIB, or booking code..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button variant="outline" className="gap-2" onClick={handleExport} disabled={participants.length === 0}>
                            <Download className="w-4 h-4" />
                            Export CSV
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">BIB</TableHead>
                                <TableHead>Participant</TableHead>
                                <TableHead>Booking Code</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredParticipants.length > 0 ? (
                                filteredParticipants.map((p: any, index: number) => (
                                    <motion.tr
                                        key={p.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="border-b border-border"
                                    >
                                        <TableCell>
                                            <span className="font-mono font-bold text-primary">
                                                {p.bib_number || "TBA"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium">{p.name}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-mono text-[10px]">
                                                {p.booking_code}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xs space-y-0.5 mt-1 text-muted-foreground">
                                                <p>{p.email}</p>
                                                <p>{p.phone}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {p.is_checked_in ? (
                                                <div className="flex items-center gap-1.5 text-success text-xs font-medium">
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Checked In
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    Pending
                                                </div>
                                            )}
                                        </TableCell>
                                    </motion.tr>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users className="w-8 h-8 opacity-20" />
                                            <p>No participants found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default EventParticipantsView;
