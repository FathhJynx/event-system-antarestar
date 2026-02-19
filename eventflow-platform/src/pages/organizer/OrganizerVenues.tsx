import OrganizerLayout from "@/components/organizer/OrganizerLayout";
import VenueManagement from "@/components/venues/VenueManagement";

const OrganizerVenues = () => {
    return (
        <OrganizerLayout>
            <VenueManagement isAdmin={false} />
        </OrganizerLayout>
    );
};

export default OrganizerVenues;
