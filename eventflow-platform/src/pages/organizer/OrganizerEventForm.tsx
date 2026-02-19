import { useParams } from "react-router-dom";
import OrganizerLayout from "@/components/organizer/OrganizerLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useEvent } from "@/hooks/useEvents";
import EventForm from "@/components/events/EventForm";

const OrganizerEventForm = () => {
    const { id } = useParams();
    const isEditing = !!id;
    const { data: event, isLoading: isLoadingEvent } = useEvent(id || "");

    if (isEditing && isLoadingEvent) {
        return (
            <OrganizerLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <LoadingSpinner className="w-8 h-8" />
                </div>
            </OrganizerLayout>
        );
    }

    return (
        <OrganizerLayout>
            <EventForm
                initialData={event}
                isEditing={isEditing}
                cancelPath="/organizer/events"
                successPath={(newId) => `/organizer/events/${newId}/edit`}
            />
        </OrganizerLayout>
    );
};

export default OrganizerEventForm;
