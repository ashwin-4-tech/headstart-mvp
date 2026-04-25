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
      { name: "Razorpay", category: "Payments", price: "2% / txn", why: "UPI + COD reconciliation built-in", url: "https://razorpay.com" },
      { name: "Lovable Cloud", category: "Backend", price: "Free tier", why: "Fastest auth + DB for MVPs", url: "https://lovable.dev" },
      { name: "MSG91", category: "OTP / SMS", price: "₹0.15 / SMS", why: "Best DLT compliance in India", url: "https://msg91.com" },
      { name: "Delhivery API", category: "Logistics", price: "Pay per shipment", why: "Best Tier 2/3 pin-code coverage", url: "https://www.delhivery.com/api-integration" },
      { name: "Sarvam AI", category: "AI / NLP", price: "Free trial", why: "Indic language LLMs", url: "https://www.sarvam.ai" },
    ],
    product: {
      mvp_features: [
        { name: "WhatsApp-based onboarding", priority: "Must", effort: "1 week" },
        { name: "UPI + COD checkout", priority: "Must", effort: "1 week" },
        { name: "Hindi + English UI toggle", priority: "Must", effort: "3 days" },
        { name: "Order tracking via SMS", priority: "Should", effort: "4 days" },
        { name: "Referral rewards engine", priority: "Should", effort: "1 week" },
        { name: "AI recommendation feed", priority: "Later", effort: "2 weeks" },
      ],
      user_flow: [
        "User lands via WhatsApp / Instagram ad",
        "OTP login (MSG91) — no password",
        "Picks language → browses catalog",
        "Adds to cart → UPI / COD checkout",
        "Order confirmation on WhatsApp",
        "Re-engagement via WhatsApp broadcast",
      ],
      tech_stack: [
        { name: "React + Vite", category: "Frontend", price: "Free", why: "Fast SPA, low bundle for 3G users" },
        { name: "Lovable Cloud", category: "Backend + Auth", price: "Free tier", why: "Zero-setup DB & auth" },
        { name: "Razorpay", category: "Payments", price: "2% / txn", why: "Native UPI" },
        { name: "Vercel / Cloudflare", category: "Hosting", price: "Free", why: "Edge POPs in Mumbai" },
      ],
    },
    brand: {
      names: [
        { name: "BharatBox", rationale: "Evokes 'Made in India' trust + a delivered package" },
        { name: "Apna Cart", rationale: "Hindi 'apna' (ours) builds emotional ownership" },
        { name: "Desi Drop", rationale: "Modern, alliterative, works in English & Hindi" },
        { name: "Namaste Now", rationale: "Greeting + speed; great for ads" },
      ],
      taglines: [
        "Bharat ka apna shop, ek tap mein.",
        "From your gali to your gate — in 30 minutes.",
        "Built for Bharat. Priced for you.",
      ],
      palette: [
        { name: "Saffron", hex: "#FF9933" },
        { name: "Indigo Night", hex: "#1E1B4B" },
        { name: "Teal Trust", hex: "#0D9488" },
        { name: "Cream", hex: "#FFF7ED" },
      ],
      tone: "Warm, confident, regional-friendly. Mix Hinglish in marketing; keep checkout clean English.",
      logo_prompt: "Design a minimalist, modern vector logo for \"BharatBox\" — a WhatsApp-native marketplace for Bharat (Tier 2/3 India). Concept: a stylized delivery box that subtly forms the letter 'B', with a small saffron-to-teal gradient accent suggesting motion and trust. Style: flat geometric, clean sans-serif wordmark below the mark, generous negative space, no gradients on the wordmark. Color palette: Saffron #FF9933, Teal Trust #0D9488, Indigo Night #1E1B4B on Cream #FFF7ED background. Avoid: clichés like the Indian flag, lotus, taj mahal, cliché 'desi' motifs, drop shadows, 3D, text in Devanagari. Output: a single centered logo on a solid cream background, square 1:1, vector-quality, suitable for an app icon and a website header.",
    },
    data: {
      unit_economics: { ltv: 1592, cac: 450, payback_months: 3 },
      funnel: [
        { stage: "Ad impression → click", rate: "1.8%" },
        { stage: "Click → signup", rate: "22%" },
        { stage: "Signup → first order", rate: "31%" },
        { stage: "First order → repeat (30d)", rate: "44%" },
      ],
      kpis: [
        { label: "Target MAU (Yr 1)", value: "1,20,000" },
        { label: "AOV", value: "₹420" },
        { label: "Gross Margin", value: "28%" },
        { label: "Burn / month (Yr 1)", value: "₹6.5L" },
      ],
    },
    content: {
      landing_headline: "India's first WhatsApp-native marketplace for Bharat.",
      landing_sub: "Order in your language. Pay with UPI or cash. Delivered to your gali in 30 mins.",
      social_posts: [
        { platform: "LinkedIn", copy: "We're building for the 600M Indians who shop on WhatsApp, not apps. Here's why Tier 2/3 is the real opportunity ↓" },
        { platform: "Instagram", copy: "Ab shopping bhi apni bhasha mein. 🇮🇳 Try the beta — link in bio." },
        { platform: "Twitter", copy: "If your app needs an English-only signup form, you're missing 80% of India. We fixed that." },
        { platform: "WhatsApp", copy: "Namaste! 🙏 Your first order is on us — reply 'START' to claim ₹100 off." },
      ],
      cold_email: {
        subject: "A 30-second ask from a fellow founder",
        body: "Hi {{first_name}},\n\nI'm building a WhatsApp-first marketplace for Tier 2/3 India. Saw your work at {{company}} and would love 15 mins to learn how you cracked vernacular UX.\n\nAny slot this week?\n\n— {{my_name}}",
      },
    },
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
