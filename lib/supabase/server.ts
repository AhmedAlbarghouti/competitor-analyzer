import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Regular client for authenticated user operations
export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) => {
							cookieStore.set(name, value, options);
						});
					} catch (error) {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		}
	);
}

// Service role client that bypasses RLS policies for admin/server operations
export async function createAdminClient() {
	if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
		throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
	}

	// Import directly from supabase-js for the admin client
	const { createClient } = await import("@supabase/supabase-js");

	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY,
		{
			auth: {
				persistSession: false,
			},
		}
	);
}
