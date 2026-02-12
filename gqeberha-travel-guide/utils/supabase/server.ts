// Server-side helper that returns a Supabase client tied to the current request cookies.
// Use dynamic imports to avoid importing `next/headers` at module top-level which
// causes this module to be included in client bundles and break Turbopack builds.
export async function getServerSupabase() {
  const { createServerClient } = await import("@supabase/ssr");
  const { cookies } = await import("next/headers");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

  // `cookies()` can be typed as a Promise in some environments; await it to be safe
  const rawStore = await cookies();
  const store: any = rawStore as any;

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Ignore set failures when called from contexts that don't support modifying cookies.
        }
      },
    },
  });
}
