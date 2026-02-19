import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import SavedEvents from "./pages/SavedEvents";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import EventRegistration from "./pages/EventRegistration";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminEventForm from "./pages/admin/AdminEventForm";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminVenues from "./pages/admin/AdminVenues";
import AdminPromoCodes from "./pages/admin/AdminPromoCodes";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminWithdrawals from "./pages/admin/AdminWithdrawals";
import AdminEventParticipants from "./pages/admin/AdminEventParticipants";
import MyBookings from "./pages/MyBookings";
import OrganizerPayouts from "./pages/OrganizerPayouts";
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import OrganizerEvents from "./pages/organizer/OrganizerEvents";
import OrganizerBookings from "./pages/organizer/OrganizerBookings";
import OrganizerEventForm from "./pages/organizer/OrganizerEventForm";
import OrganizerVenues from "./pages/organizer/OrganizerVenues";
import OrganizerPromoCodes from "./pages/organizer/OrganizerPromoCodes";
import OrganizerEventParticipants from "./pages/organizer/OrganizerEventParticipants";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/saved-events" element={<SavedEvents />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/events/:id/register" element={<EventRegistration />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/auth" element={<AdminAuth />} />

            <Route path="/my-bookings" element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            } />
            {/* Organizer routes */}
            <Route path="/organizer" element={
              <ProtectedRoute requireOrganizer>
                <OrganizerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/organizer/dashboard" element={
              <ProtectedRoute requireOrganizer>
                <OrganizerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/organizer/payouts" element={
              <ProtectedRoute requireOrganizer>
                <OrganizerPayouts />
              </ProtectedRoute>
            } />
            <Route path="/organizer/events" element={
              <ProtectedRoute requireOrganizer>
                <OrganizerEvents />
              </ProtectedRoute>
            } />
            <Route path="/organizer/events/new" element={
              <ProtectedRoute requireOrganizer>
                <OrganizerEventForm />
              </ProtectedRoute>
            } />
            <Route path="/organizer/events/:id/edit" element={
              <ProtectedRoute requireOrganizer>
                <OrganizerEventForm />
              </ProtectedRoute>
            } />
            <Route path="/organizer/events/:id/participants" element={
              <ProtectedRoute requireOrganizer>
                <OrganizerEventParticipants />
              </ProtectedRoute>
            } />
            <Route path="/organizer/bookings" element={
              <ProtectedRoute requireOrganizer>
                <OrganizerBookings />
              </ProtectedRoute>
            } />
            <Route path="/organizer/venues" element={
              <ProtectedRoute requireOrganizer>
                <OrganizerVenues />
              </ProtectedRoute>
            } />
            <Route path="/organizer/promo-codes" element={
              <ProtectedRoute requireOrganizer>
                <OrganizerPromoCodes />
              </ProtectedRoute>
            } />

            {/* Admin routes - protected */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/categories" element={
              <ProtectedRoute requireAdmin>
                <AdminCategories />
              </ProtectedRoute>
            } />
            <Route path="/admin/events" element={
              <ProtectedRoute requireAdmin>
                <AdminEvents />
              </ProtectedRoute>
            } />
            <Route path="/admin/events/new" element={
              <ProtectedRoute requireAdmin>
                <AdminEventForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/events/:id/edit" element={
              <ProtectedRoute requireAdmin>
                <AdminEventForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/events/:id/participants" element={
              <ProtectedRoute requireAdmin>
                <AdminEventParticipants />
              </ProtectedRoute>
            } />
            <Route path="/admin/bookings" element={
              <ProtectedRoute requireAdmin>
                <AdminBookings />
              </ProtectedRoute>
            } />
            <Route path="/admin/venues" element={
              <ProtectedRoute requireAdmin>
                <AdminVenues />
              </ProtectedRoute>
            } />
            <Route path="/admin/promo-codes" element={
              <ProtectedRoute requireAdmin>
                <AdminPromoCodes />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requireAdmin>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/withdrawals" element={
              <ProtectedRoute requireAdmin>
                <AdminWithdrawals />
              </ProtectedRoute>
            } />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
