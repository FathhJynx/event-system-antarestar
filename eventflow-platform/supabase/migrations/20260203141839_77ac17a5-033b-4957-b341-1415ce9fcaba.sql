-- Create roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'organizer', 'user');

-- Create booking status enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'paid', 'failed', 'cancelled', 'refunded');

-- Create event status enum
CREATE TYPE public.event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');

-- Create promo type enum
CREATE TYPE public.promo_type AS ENUM ('percent', 'fixed');

-- Create withdrawal status enum
CREATE TYPE public.withdrawal_status AS ENUM ('pending', 'approved', 'rejected', 'completed');

-- Profiles table for user data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Venues table
CREATE TABLE public.venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Indonesia',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    description TEXT,
    image_url TEXT,
    capacity INTEGER,
    facilities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Event categories table
CREATE TABLE public.event_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Events table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    subtitle TEXT,
    description TEXT,
    category_id UUID REFERENCES public.event_categories(id) ON DELETE SET NULL,
    venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
    organizer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    registration_start TIMESTAMP WITH TIME ZONE NOT NULL,
    registration_end TIMESTAMP WITH TIME ZONE NOT NULL,
    image_url TEXT,
    gallery TEXT[],
    status event_status NOT NULL DEFAULT 'draft',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    highlights TEXT[],
    schedule JSONB,
    terms_conditions TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Event race categories (e.g., 10K, 21K, 42K for a marathon)
CREATE TABLE public.event_race_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    distance_km DECIMAL(6, 2),
    elevation_gain TEXT,
    price DECIMAL(12, 2) NOT NULL,
    early_bird_price DECIMAL(12, 2),
    early_bird_end TIMESTAMP WITH TIME ZONE,
    quota INTEGER NOT NULL,
    registered INTEGER NOT NULL DEFAULT 0,
    min_age INTEGER,
    max_age INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Event prizes table
CREATE TABLE public.event_prizes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    race_category_id UUID REFERENCES public.event_race_categories(id) ON DELETE CASCADE,
    place INTEGER NOT NULL,
    prize_type TEXT NOT NULL DEFAULT 'cash',
    prize_amount DECIMAL(12, 2),
    prize_description TEXT,
    gender TEXT,
    age_category TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Promo codes table
CREATE TABLE public.promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    promo_type promo_type NOT NULL,
    discount_value DECIMAL(12, 2) NOT NULL,
    min_purchase DECIMAL(12, 2) DEFAULT 0,
    max_discount DECIMAL(12, 2),
    usage_limit INTEGER,
    usage_count INTEGER NOT NULL DEFAULT 0,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL NOT NULL,
    race_category_id UUID REFERENCES public.event_race_categories(id) ON DELETE SET NULL NOT NULL,
    participant_name TEXT NOT NULL,
    participant_email TEXT NOT NULL,
    participant_phone TEXT NOT NULL,
    participant_gender TEXT,
    participant_dob DATE,
    participant_identity_number TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    tshirt_size TEXT,
    blood_type TEXT,
    medical_conditions TEXT,
    base_price DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    promo_code_id UUID REFERENCES public.promo_codes(id) ON DELETE SET NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    payment_status booking_status NOT NULL DEFAULT 'pending',
    payment_method TEXT,
    payment_token TEXT,
    payment_url TEXT,
    midtrans_order_id TEXT,
    midtrans_transaction_id TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    check_in_status BOOLEAN NOT NULL DEFAULT false,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    bib_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Withdrawals table (for organizers)
CREATE TABLE public.withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    amount DECIMAL(12, 2) NOT NULL,
    bank_name TEXT NOT NULL,
    bank_account_number TEXT NOT NULL,
    bank_account_name TEXT NOT NULL,
    status withdrawal_status NOT NULL DEFAULT 'pending',
    notes TEXT,
    processed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_race_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Function to check if user is organizer
CREATE OR REPLACE FUNCTION public.is_organizer(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'organizer') OR public.has_role(_user_id, 'admin')
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON public.venues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_event_categories_updated_at BEFORE UPDATE ON public.event_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_event_race_categories_updated_at BEFORE UPDATE ON public.event_race_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON public.promo_codes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_withdrawals_updated_at BEFORE UPDATE ON public.withdrawals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Profiles: Users can view and edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin(auth.uid()));

-- User roles: Only admins can manage roles
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Venues: Public read, admin/organizer write
CREATE POLICY "Anyone can view venues" ON public.venues FOR SELECT USING (true);
CREATE POLICY "Admins can manage venues" ON public.venues FOR ALL USING (public.is_admin(auth.uid()));

-- Event categories: Public read, admin write
CREATE POLICY "Anyone can view categories" ON public.event_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.event_categories FOR ALL USING (public.is_admin(auth.uid()));

-- Events: Public read published, organizer can manage own events
CREATE POLICY "Anyone can view published events" ON public.events FOR SELECT USING (status = 'published' OR public.is_admin(auth.uid()) OR (public.is_organizer(auth.uid()) AND organizer_id = auth.uid()));
CREATE POLICY "Organizers can create events" ON public.events FOR INSERT WITH CHECK (public.is_organizer(auth.uid()));
CREATE POLICY "Organizers can update own events" ON public.events FOR UPDATE USING (organizer_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete events" ON public.events FOR DELETE USING (public.is_admin(auth.uid()));

-- Event race categories: Public read, organizer can manage for own events
CREATE POLICY "Anyone can view race categories" ON public.event_race_categories FOR SELECT USING (true);
CREATE POLICY "Organizers can manage race categories" ON public.event_race_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND (organizer_id = auth.uid() OR public.is_admin(auth.uid())))
);

-- Event prizes: Public read
CREATE POLICY "Anyone can view prizes" ON public.event_prizes FOR SELECT USING (true);
CREATE POLICY "Organizers can manage prizes" ON public.event_prizes FOR ALL USING (
    EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND (organizer_id = auth.uid() OR public.is_admin(auth.uid())))
);

-- Promo codes: Admins and organizers can manage
CREATE POLICY "Anyone can view active promos" ON public.promo_codes FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage all promos" ON public.promo_codes FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Organizers can manage event promos" ON public.promo_codes FOR ALL USING (
    event_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND organizer_id = auth.uid())
);

-- Bookings: Users can view own, organizers can view event bookings
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Organizers can view event bookings" ON public.bookings FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND organizer_id = auth.uid())
);
CREATE POLICY "Organizers can update event bookings" ON public.bookings FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND (organizer_id = auth.uid() OR public.is_admin(auth.uid())))
);

-- Withdrawals: Organizers can manage own, admins can manage all
CREATE POLICY "Organizers can view own withdrawals" ON public.withdrawals FOR SELECT USING (organizer_id = auth.uid());
CREATE POLICY "Organizers can create withdrawals" ON public.withdrawals FOR INSERT WITH CHECK (organizer_id = auth.uid());
CREATE POLICY "Admins can manage all withdrawals" ON public.withdrawals FOR ALL USING (public.is_admin(auth.uid()));

-- Function to generate booking number
CREATE OR REPLACE FUNCTION public.generate_booking_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    new_number TEXT;
BEGIN
    new_number := 'AE' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
    RETURN new_number;
END;
$$;

-- Trigger to auto-generate booking number
CREATE OR REPLACE FUNCTION public.set_booking_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.booking_number IS NULL THEN
        NEW.booking_number := public.generate_booking_number();
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_booking_number_trigger
    BEFORE INSERT ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.set_booking_number();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email
    );
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();