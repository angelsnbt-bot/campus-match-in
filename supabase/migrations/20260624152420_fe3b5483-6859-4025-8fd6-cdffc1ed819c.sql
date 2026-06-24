
CREATE TABLE public.waitlist_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  erp_number TEXT NOT NULL UNIQUE,
  college TEXT NOT NULL,
  branch TEXT NOT NULL,
  year TEXT NOT NULL,
  instagram TEXT,
  looking_for TEXT[] NOT NULL DEFAULT '{}',
  account_created BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.waitlist_users TO anon, authenticated;
GRANT ALL ON public.waitlist_users TO service_role;

ALTER TABLE public.waitlist_users ENABLE ROW LEVEL SECURITY;

-- Anyone can join the waitlist
CREATE POLICY "Anyone can join the waitlist"
  ON public.waitlist_users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No client SELECT policy. Reads happen only via the service role in server functions.

CREATE INDEX idx_waitlist_created_at ON public.waitlist_users(created_at DESC);

-- Public counter function (safe: returns only an aggregate count, no PII)
CREATE OR REPLACE FUNCTION public.get_waitlist_count()
RETURNS BIGINT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COUNT(*) FROM public.waitlist_users;
$$;

GRANT EXECUTE ON FUNCTION public.get_waitlist_count() TO anon, authenticated;
