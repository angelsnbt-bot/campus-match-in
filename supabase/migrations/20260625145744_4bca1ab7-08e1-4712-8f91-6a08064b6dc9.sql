-- Tighten waitlist_users RLS: replace always-true INSERT policy with validated checks,
-- and add explicit restrictive SELECT policy so client roles cannot read submissions.

DROP POLICY IF EXISTS "Anyone can join the waitlist" ON public.waitlist_users;

CREATE POLICY "Anyone can submit valid waitlist entry"
ON public.waitlist_users
FOR INSERT
TO anon, authenticated
WITH CHECK (
  account_created = false
  AND length(btrim(name)) BETWEEN 1 AND 120
  AND length(btrim(email)) BETWEEN 3 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(btrim(erp_number)) BETWEEN 1 AND 64
  AND length(btrim(college)) BETWEEN 1 AND 200
  AND length(btrim(branch)) BETWEEN 1 AND 120
  AND length(btrim(year)) BETWEEN 1 AND 40
  AND (instagram IS NULL OR length(instagram) <= 100)
  AND (gender IS NULL OR length(gender) <= 40)
  AND (age IS NULL OR (age BETWEEN 15 AND 100))
  AND array_length(looking_for, 1) IS NULL OR array_length(looking_for, 1) <= 20
);

-- Explicit deny for SELECT from client roles. Service role bypasses RLS and
-- continues to power the admin dashboard via server functions.
CREATE POLICY "Waitlist entries are not client-readable"
ON public.waitlist_users
FOR SELECT
TO anon, authenticated
USING (false);
