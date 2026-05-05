-- 1) Lock down user_roles: add explicit admin-only policies for write operations
-- The existing "Admins manage roles" ALL policy is fine, but we add explicit per-command
-- policies as defense-in-depth and a RESTRICTIVE policy to block any non-admin write path.

CREATE POLICY "Only admins insert roles"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Only admins update roles"
ON public.user_roles
AS RESTRICTIVE
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Only admins delete roles"
ON public.user_roles
AS RESTRICTIVE
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 2) Lock down SECURITY DEFINER functions

-- handle_new_user is invoked by an auth trigger only; no client should call it.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- has_role is needed inside RLS policies (runs as definer), not by anon/public callers.
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
-- Keep EXECUTE for authenticated so app code/RLS contexts can call it as needed.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- update_updated_at_column is a trigger function; revoke from clients.
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
