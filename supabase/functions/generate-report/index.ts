// Generate a startup validation report using Lovable AI (Gemini Flash Lite — low-cost).
// Returns structured JSON matching the GeneratedOutputs type used by the frontend.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const reportSchema = {
  type: "object",
  properties: {
    market_data: {
      type: "object",
      properties: {
        tam: { type: "number", description: "Total Addressable Market in ₹ Crore" },
        sam: { type: "number", description: "Serviceable Addressable Market in ₹ Crore" },
        som: { type: "number", description: "Serviceable Obtainable Market in ₹ Crore" },
      },
      required: ["tam", "sam", "som"],
      additionalProperties: false,
    },
    competitors: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          type: { type: "string", enum: ["Unicorn", "Bootstrap"] },
          funding: { type: "string" },
          monthly_users: { type: "string" },
          pricing: { type: "string" },
          weakness: { type: "string" },
          url: { type: "string", description: "Official website URL of the competitor (https://...)" },
        },
        required: ["name", "type", "funding", "monthly_users", "pricing", "weakness", "url"],
        additionalProperties: false,
      },
    },
    swadeshi_stack: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          category: { type: "string" },
          price: { type: "string" },
          why: { type: "string" },
          url: { type: "string" },
        },
        required: ["name", "category", "price", "why", "url"],
        additionalProperties: false,
      },
    },
    product: {
      type: "object",
      properties: {
        mvp_features: {
          type: "array",
          minItems: 5,
          maxItems: 7,
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              priority: { type: "string", enum: ["Must", "Should", "Later"] },
              effort: { type: "string" },
            },
            required: ["name", "priority", "effort"],
            additionalProperties: false,
          },
        },
        user_flow: { type: "array", minItems: 4, maxItems: 7, items: { type: "string" } },
        tech_stack: {
          type: "array",
          minItems: 4,
          maxItems: 6,
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              category: { type: "string" },
              price: { type: "string" },
              why: { type: "string" },
            },
            required: ["name", "category", "price", "why"],
            additionalProperties: false,
          },
        },
      },
      required: ["mvp_features", "user_flow", "tech_stack"],
      additionalProperties: false,
    },
    brand: {
      type: "object",
      properties: {
        names: {
          type: "array",
          minItems: 4,
          maxItems: 4,
          items: {
            type: "object",
            properties: { name: { type: "string" }, rationale: { type: "string" } },
            required: ["name", "rationale"],
            additionalProperties: false,
          },
        },
        taglines: { type: "array", minItems: 3, maxItems: 3, items: { type: "string" } },
        palette: {
          type: "array",
          minItems: 4,
          maxItems: 4,
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              hex: { type: "string", description: "Hex color like #FF9933" },
            },
            required: ["name", "hex"],
            additionalProperties: false,
          },
        },
        tone: { type: "string" },
        logo_prompt: { type: "string", description: "A detailed image-generation prompt for a logo" },
      },
      required: ["names", "taglines", "palette", "tone", "logo_prompt"],
      additionalProperties: false,
    },
    data: {
      type: "object",
      properties: {
        unit_economics: {
          type: "object",
          properties: {
            ltv: { type: "number" },
            cac: { type: "number" },
            payback_months: { type: "number" },
          },
          required: ["ltv", "cac", "payback_months"],
          additionalProperties: false,
        },
        funnel: {
          type: "array",
          minItems: 4,
          maxItems: 4,
          items: {
            type: "object",
            properties: { stage: { type: "string" }, rate: { type: "string" } },
            required: ["stage", "rate"],
            additionalProperties: false,
          },
        },
        kpis: {
          type: "array",
          minItems: 4,
          maxItems: 4,
          items: {
            type: "object",
            properties: { label: { type: "string" }, value: { type: "string" } },
            required: ["label", "value"],
            additionalProperties: false,
          },
        },
      },
      required: ["unit_economics", "funnel", "kpis"],
      additionalProperties: false,
    },
    content: {
      type: "object",
      properties: {
        landing_headline: { type: "string" },
        landing_sub: { type: "string" },
        social_posts: {
          type: "array",
          minItems: 4,
          maxItems: 4,
          items: {
            type: "object",
            properties: {
              platform: {
                type: "string",
                enum: ["LinkedIn", "Instagram", "Twitter", "WhatsApp"],
              },
              copy: { type: "string" },
            },
            required: ["platform", "copy"],
            additionalProperties: false,
          },
        },
        cold_email: {
          type: "object",
          properties: { subject: { type: "string" }, body: { type: "string" } },
          required: ["subject", "body"],
          additionalProperties: false,
        },
      },
      required: ["landing_headline", "landing_sub", "social_posts", "cold_email"],
      additionalProperties: false,
    },
  },
  required: ["market_data", "competitors", "swadeshi_stack", "product", "brand", "data", "content"],
  additionalProperties: false,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { raw_text_input, target_city_tier, b2b_or_b2c } = await req.json();

    if (!raw_text_input || typeof raw_text_input !== "string") {
      return new Response(JSON.stringify({ error: "Missing raw_text_input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are HeadStart — an India-first startup validation analyst.
Generate a realistic, India-specific startup validation report. Use credible Indian market data,
real Indian competitors (unicorns + bootstrapped), Indian SaaS/infra tools (Razorpay, MSG91,
Delhivery, Sarvam AI, etc.), INR pricing, Hinglish-aware brand voice, and UPI/COD-aware product
flows. Be concrete, numeric, and honest. Avoid generic Western examples.`;

    const userPrompt = `Founder's idea: ${raw_text_input}
Target city tier: ${target_city_tier}
Audience: ${b2b_or_b2c}

Produce a complete validation report. Sizing should reflect the city tier (Tier 1 largest,
Tier 3 smallest). Pick 4 real Indian competitors (mix of unicorn + bootstrap). Recommend a
"Swadeshi stack" of 5 Indian-built or India-friendly tools with real URLs. Include a
detailed logo_prompt suitable for image generators.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_report",
              description: "Submit the complete India-first startup validation report.",
              parameters: reportSchema,
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_report" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "AI credits exhausted. Add credits in Settings → Workspace → Usage.",
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "AI returned no structured output" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let report;
    try {
      report = JSON.parse(toolCall.function.arguments);
    } catch (e) {
      console.error("Failed to parse AI output:", toolCall.function.arguments);
      return new Response(JSON.stringify({ error: "Malformed AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const fullReport = {
      id: crypto.randomUUID(),
      idea_id: crypto.randomUUID(),
      ...report,
      generated_at: new Date().toISOString(),
    };

    return new Response(JSON.stringify(fullReport), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-report error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
