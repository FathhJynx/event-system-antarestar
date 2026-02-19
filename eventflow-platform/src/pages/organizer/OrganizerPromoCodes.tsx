import OrganizerLayout from "@/components/organizer/OrganizerLayout";
import PromoCodeManagement from "@/components/promo/PromoCodeManagement";

const OrganizerPromoCodes = () => {
    return (
        <OrganizerLayout>
            <PromoCodeManagement isAdmin={false} />
        </OrganizerLayout>
    );
};

export default OrganizerPromoCodes;
