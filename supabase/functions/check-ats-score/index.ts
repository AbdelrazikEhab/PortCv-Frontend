import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeData, jobDescription } = await req.json();

    if (!resumeData) {
      return new Response(
        JSON.stringify({ error: 'No resume data provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const systemPrompt = `You are an ATS (Applicant Tracking System) analyzer. Analyze the resume and provide a detailed score and recommendations.

Evaluate based on:
1. Keywords and skills match (if job description provided)
2. Formatting and structure
3. Content quality and clarity
4. Action verbs and quantifiable achievements
5. ATS-friendly formatting (no tables, complex formatting)

Return a JSON with:
- score: number 0-100
- strengths: array of strings (what's good)
- improvements: array of strings (what to improve)
- keywords: array of strings (missing important keywords)
- summary: brief overall assessment`;

    const resumeText = JSON.stringify(resumeData, null, 2);
    const prompt = jobDescription
      ? `Analyze this resume for ATS compatibility and match with this job description:\n\nJob Description:\n${jobDescription}\n\nResume:\n${resumeText}`
      : `Analyze this resume for general ATS compatibility:\n\nResume:\n${resumeText}`;

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "analyze_ats_score",
            description: "Analyze resume ATS score",
            parameters: {
              type: "object",
              properties: {
                score: {
                  type: "number",
                  description: "ATS score from 0-100"
                },
                strengths: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of strengths"
                },
                improvements: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of improvements needed"
                },
                keywords: {
                  type: "array",
                  items: { type: "string" },
                  description: "Missing important keywords"
                },
                summary: {
                  type: "string",
                  description: "Overall assessment summary"
                }
              },
              required: ["score", "strengths", "improvements", "summary"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "analyze_ats_score" } }
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      throw new Error('Failed to analyze resume with AI');
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error('No analysis data returned from AI');
    }

    const analysisData = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ success: true, data: analysisData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error analyzing ATS score:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
