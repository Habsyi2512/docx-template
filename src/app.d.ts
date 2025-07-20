// See https://svelte.dev/docs/kit/types#app.d.ts

import type { SupabaseClient, User, Session } from "@supabase/supabase-js";
import type {Database} from "$lib/database.types"

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			session: Session | null;
			safeGetSession: () => Promise<{session: Session | null; user: User | null}>
			user: User | null;
		}
		interface PageData {
			session: Session | null
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
