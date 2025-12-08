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
    const { action, data } = await req.json();
    
    if (!action || !data) {
      return new Response(
        JSON.stringify({ error: 'Missing action or data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    let systemPrompt = "";
    let userPrompt = "";
    let temperature = 0.7;

    switch (action) {
      case 'rewrite':
        systemPrompt = "You are a professional resume writer. Rewrite the provided text to be more professional, impactful, and concise. Use strong action verbs and quantify achievements where possible.";
        userPrompt = `Rewrite this ${data.section || 'text'}:\n\n${data.text}`;
        break;
      
      case 'job_match':
        systemPrompt = "You are a recruitment specialist. Analyze the match between a resume and a job description. Provide a score (0-100), matching keywords, missing keywords, and specific advice.";
        userPrompt = `Resume:\n${JSON.stringify(data.resume)}\n\nJob Description:\n${data.jobDescription}`;
        break;

      case 'cover_letter':
        systemPrompt = "You are a professional career coach. Write a compelling cover letter based on the candidate's resume and the job description. The tone should be professional yet enthusiastic.";
        userPrompt = `Resume:\n${JSON.stringify(data.resume)}\n\nJob Title/Description:\n${data.jobDescription}`;
        break;

      case 'interview_prep':
        systemPrompt = "You are an expert interviewer. Generate a list of likely interview questions based on the job description and resume, along with suggested answers and tips.";
        userPrompt = `Resume:\n${JSON.stringify(data.resume)}\n\nJob Description:\n${data.jobDescription}`;
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: temperature,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const result = await response.json();
    const content = result.choices[0].message.content;

    // Try to parse JSON if the action expects structured data (like job_match)
    let parsedContent = content;
    if (action === 'job_match') {
        try {
            // simple heuristic to extract json if wrapped in code blocks
            const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsedContent = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            }
        } catch (e) {
            console.warn("Failed to parse JSON from job match response", e);
        }
    }

    return new Response(
      JSON.stringify({ success: true, data: parsedContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in openai-proxy:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
