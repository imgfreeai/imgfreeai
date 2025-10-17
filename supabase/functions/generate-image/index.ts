import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, aspectRatio, quality } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check and refresh credits if needed
    const { data: credits, error: creditsError } = await supabaseClient
      .from('user_credits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (creditsError || !credits) {
      console.error('Error fetching credits:', creditsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch credits" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if 24 hours have passed since last refresh
    const lastRefresh = new Date(credits.last_refresh_at);
    const now = new Date();
    const hoursSinceRefresh = (now.getTime() - lastRefresh.getTime()) / (1000 * 60 * 60);

    if (hoursSinceRefresh >= 24) {
      // Refresh credits to 30
      const { error: updateError } = await supabaseClient
        .from('user_credits')
        .update({ 
          credits_remaining: 30, 
          last_refresh_at: now.toISOString() 
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error refreshing credits:', updateError);
      }
      
      // Refresh the credits data
      const { data: refreshedCredits } = await supabaseClient
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (refreshedCredits && refreshedCredits.credits_remaining <= 0) {
        return new Response(
          JSON.stringify({ error: "No credits remaining" }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else if (credits.credits_remaining <= 0) {
      return new Response(
        JSON.stringify({ error: "No credits remaining. Credits refresh every 24 hours." }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map aspect ratio to dimensions
    let size = "1024x1024";
    switch (aspectRatio) {
      case "square":
        size = "1024x1024";
        break;
      case "landscape":
        size = "1536x1024";
        break;
      case "portrait":
        size = "1024x1536";
        break;
    }

    console.log('Generating image with prompt:', prompt);

    // Generate image using Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error('No image URL in response:', data);
      return new Response(
        JSON.stringify({ error: "Failed to generate image" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Deduct one credit
    const { error: deductError } = await supabaseClient
      .from('user_credits')
      .update({ 
        credits_remaining: credits.credits_remaining - 1 
      })
      .eq('user_id', user.id);

    if (deductError) {
      console.error('Error deducting credit:', deductError);
    }

    // Save to generated_images table
    const { error: saveError } = await supabaseClient
      .from('generated_images')
      .insert({
        user_id: user.id,
        prompt,
        image_url: imageUrl,
        aspect_ratio: aspectRatio,
        quality
      });

    if (saveError) {
      console.error('Error saving image:', saveError);
    }

    return new Response(
      JSON.stringify({ 
        imageUrl,
        creditsRemaining: credits.credits_remaining - 1 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-image function:', error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});