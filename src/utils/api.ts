// Placeholder API utility — swap with Supabase / your backend later.
// Mirrors the planned database schema:
//   User_Profile, Startup_Idea, Market_Data, Generated_Outputs

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  industry_focus: string;
  preferred_language: string;
  budget_range: string;
}

export interface StartupIdea {
  id: string;
  user_id: string;
  raw_text_input: string;
  target_city_tier: "Tier 1" | "Tier 2" | "Tier 3";
  b2b_or_b2c: "B2B" | "B2C";
  created_at: string;
}

export interface MarketData {
  tam: number; // Total Addressable Market (₹ Cr)
  sam: number;
  som: number;
}

export interface Competitor {
  name: string;
  type: "Unicorn" | "Bootstrap";
  funding: string;
  monthly_users: string;
  pricing: string;
  weakness: string;
}

export interface ProductPlan {
  mvp_features: { name: string; priority: "Must" | "Should" | "Later"; effort: string }[];
  user_flow: string[];
  tech_stack: { name: string; category: string; price: string; why: string }[];
}

export interface BrandKit {
  names: { name: string; rationale: string }[];
  taglines: string[];
  palette: { name: string; hex: string }[];
  tone: string;
  logo_prompt: string;
}

export interface DataInsights {
  unit_economics: { ltv: number; cac: number; payback_months: number };
  funnel: { stage: string; rate: string }[];
  kpis: { label: string; value: string }[];
}

export interface ContentPack {
  landing_headline: string;
  landing_sub: string;
  social_posts: { platform: "LinkedIn" | "Instagram" | "Twitter" | "WhatsApp"; copy: string }[];
  cold_email: { subject: string; body: string };
}

export interface GeneratedOutputs {
  id: string;
  idea_id: string;
  market_data: MarketData;
  competitors: Competitor[];
  swadeshi_stack: { name: string; category: string; price: string; why: string; url: string }[];
  product: ProductPlan;
  brand: BrandKit;
  data: DataInsights;
  content: ContentPack;
  generated_at: string;
}

// Real AI-powered report generator using Lovable AI via edge function.
export async function generateReport(idea: {
  raw_text_input: string;
  target_city_tier: string;
  b2b_or_b2c: string;
}): Promise<GeneratedOutputs> {
  const { supabase } = await import("@/integrations/supabase/client");
  const { data, error } = await supabase.functions.invoke("generate-report", {
    body: idea,
  });

  if (error) {
    // Try to surface the structured error message from the edge function
    const ctx = (error as unknown as { context?: Response }).context;
    if (ctx && typeof ctx.json === "function") {
      try {
        const body = await ctx.json();
        if (body?.error) throw new Error(body.error);
      } catch { /* fall through */ }
    }
    throw new Error(error.message || "Failed to generate report");
  }
  if (!data) throw new Error("No data returned from AI");
  if ((data as { error?: string }).error) throw new Error((data as { error: string }).error);

  return data as GeneratedOutputs;
}

// Mock auth — replace with Supabase auth later.
const STORAGE_KEY = "headstart_user";

export const auth = {
  getUser(): UserProfile | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  },
  signIn(email: string): UserProfile {
    const user: UserProfile = {
      id: crypto.randomUUID(),
      name: email.split("@")[0],
      email,
      industry_focus: "Tech",
      preferred_language: "English",
      budget_range: "₹0 – ₹50K",
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },
  signUp(profile: Omit<UserProfile, "id">): UserProfile {
    const user: UserProfile = { id: crypto.randomUUID(), ...profile };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },
  signOut() {
    localStorage.removeItem(STORAGE_KEY);
  },
};
