import AdminLayout from "@/components/admin/AdminLayout";
import VenueManagement from "@/components/venues/VenueManagement";

const AdminVenues = () => {
    return (
        <AdminLayout>
            <VenueManagement isAdmin={true} />
        </AdminLayout>
    );
};

export default AdminVenues;
