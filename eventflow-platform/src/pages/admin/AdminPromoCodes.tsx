import AdminLayout from "@/components/admin/AdminLayout";
import PromoCodeManagement from "@/components/promo/PromoCodeManagement";

const AdminPromoCodes = () => {
    return (
        <AdminLayout>
            <PromoCodeManagement isAdmin={true} />
        </AdminLayout>
    );
};

export default AdminPromoCodes;
