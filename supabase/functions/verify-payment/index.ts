import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_id,
      plan, // 'monthly' or 'yearly'
    } = await req.json();

    // Verify signature
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET") ?? "";
    const body      = `${razorpay_order_id}|${razorpay_payment_id}`;

    console.log("keySecret exists:", !!keySecret);
console.log("keySecret length:", keySecret.length);
console.log("body:", body);
console.log("received signature:", razorpay_signature);

    const encoder   = new TextEncoder();
    const keyData   = encoder.encode(keySecret);
    const msgData   = encoder.encode(body);

    const cryptoKey = await crypto.subtle.importKey(
      "raw", keyData,
      { name: "HMAC", hash: "SHA-256" },
      false, ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
    const hashHex   = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

      console.log("generated hash:", hashHex);
console.log("match:", hashHex === razorpay_signature);

    if (hashHex !== razorpay_signature) {
      return new Response(JSON.stringify({ error: "Payment verification failed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Payment verified — update user to Pro
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const now       = new Date();
    const expiresAt = new Date(now);
    if (plan === "yearly") {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        is_pro:        true,
        pro_plan:      plan,
        pro_expires_at: expiresAt.toISOString(),
      })
      .eq("id", user_id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    await supabase.from("subscriptions").insert({
        user_id,
        plan,
        status: "active",
        razorpay_payment_id,
        razorpay_order_id,
        started_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      });

    return new Response(JSON.stringify({ success: true, expires_at: expiresAt.toISOString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});