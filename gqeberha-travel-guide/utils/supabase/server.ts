import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export async function createClient(
  cookieStore?:
    | ReturnType<typeof cookies>
    | Promise<ReturnType<typeof cookies>>
) {
  // `cookies()` can be typed as a Promise in some environments; await either input or the default
  const rawStore = cookieStore ? await cookieStore : await cookies();

  // The runtime object exposes `getAll` and `set`, but TypeScript may treat it as ReadonlyRequestCookies.
  // Cast to `any` to avoid type errors while preserving runtime behavior.
  const store: any = rawStore as any;

  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return store.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => store.set(name, value, options));
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
