import { useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useEvent } from "@/hooks/useEvents";
import EventForm from "@/components/events/EventForm";

const AdminEventForm = () => {
    const { id } = useParams();
    const isEditing = !!id;
    const { data: event, isLoading: isLoadingEvent } = useEvent(id || "");

    if (isEditing && isLoadingEvent) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <LoadingSpinner className="w-8 h-8" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <EventForm
                initialData={event}
                isEditing={isEditing}
                cancelPath="/admin/events"
                successPath={(newId) => `/admin/events/${newId}/edit`}
            />
        </AdminLayout>
    );
};

export default AdminEventForm;
