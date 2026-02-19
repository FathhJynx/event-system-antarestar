-- Fix function search path issues
CREATE OR REPLACE FUNCTION public.generate_booking_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    new_number TEXT;
BEGIN
    new_number := 'AE' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
    RETURN new_number;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_booking_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    IF NEW.booking_number IS NULL THEN
        NEW.booking_number := public.generate_booking_number();
    END IF;
    RETURN NEW;
END;
$$;