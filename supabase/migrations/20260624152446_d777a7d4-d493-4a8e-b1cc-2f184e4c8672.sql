
REVOKE EXECUTE ON FUNCTION public.get_waitlist_count() FROM anon, authenticated;
DROP FUNCTION IF EXISTS public.get_waitlist_count();
