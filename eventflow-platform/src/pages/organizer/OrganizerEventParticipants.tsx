import { useParams } from "react-router-dom";
import OrganizerLayout from "@/components/organizer/OrganizerLayout";
import EventParticipantsView from "@/components/events/EventParticipantsView";

const OrganizerEventParticipants = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <OrganizerLayout>
            <EventParticipantsView
                eventId={id || ""}
                backPath="/organizer/events"
            />
        </OrganizerLayout>
    );
};

export default OrganizerEventParticipants;
