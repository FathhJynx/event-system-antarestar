import { useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import EventParticipantsView from "@/components/events/EventParticipantsView";

const AdminEventParticipants = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <AdminLayout>
            <EventParticipantsView
                eventId={id || ""}
                backPath="/admin/events"
            />
        </AdminLayout>
    );
};

export default AdminEventParticipants;
