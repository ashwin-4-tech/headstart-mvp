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

export interface GeneratedOutputs {
  id: string;
  idea_id: string;
  market_data: MarketData;
  competitors: Competitor[];
  swadeshi_stack: { name: string; category: string; price: string; why: string }[];
  generated_at: string;
}

// Mocked "AI" report generator — replace with real backend call.
export async function generateReport(idea: {
  raw_text_input: string;
  target_city_tier: string;
  b2b_or_b2c: string;
}): Promise<GeneratedOutputs> {
  await new Promise((r) => setTimeout(r, 2200));

  const tierMultiplier =
    idea.target_city_tier === "Tier 1" ? 1 : idea.target_city_tier === "Tier 2" ? 0.6 : 0.3;

  return {
    id: crypto.randomUUID(),
    idea_id: crypto.randomUUID(),
    market_data: {
      tam: Math.round(48000 * tierMultiplier),
      sam: Math.round(7200 * tierMultiplier),
      som: Math.round(420 * tierMultiplier),
    },
    competitors: [
      {
        name: "Zomato",
        type: "Unicorn",
        funding: "$2.1B",
        monthly_users: "80M+",
        pricing: "Freemium + Commission",
        weakness: "High burn in Tier 3 cities",
      },
      {
        name: "Swiggy",
        type: "Unicorn",
        funding: "$3.6B",
        monthly_users: "65M+",
        pricing: "Subscription (One)",
        weakness: "Limited regional language UX",
      },
      {
        name: "LocalBite",
        type: "Bootstrap",
        funding: "Self-funded",
        monthly_users: "180K",
        pricing: "₹49 / order",
        weakness: "No tech moat, poor app",
      },
      {
        name: "DesiKart",
        type: "Bootstrap",
        funding: "₹40L Angel",
        monthly_users: "45K",
        pricing: "COD-first",
        weakness: "Inventory bottlenecks",
      },
    ],
    swadeshi_stack: [
      { name: "Razorpay", category: "Payments", price: "2% / txn", why: "UPI + COD reconciliation built-in" },
      { name: "Lovable Cloud", category: "Backend", price: "Free tier", why: "Fastest auth + DB for MVPs" },
      { name: "MSG91", category: "OTP / SMS", price: "₹0.15 / SMS", why: "Best DLT compliance in India" },
      { name: "Delhivery API", category: "Logistics", price: "Pay per shipment", why: "Best Tier 2/3 pin-code coverage" },
      { name: "Sarvam AI", category: "AI / NLP", price: "Free trial", why: "Indic language LLMs" },
    ],
    generated_at: new Date().toISOString(),
  };
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
