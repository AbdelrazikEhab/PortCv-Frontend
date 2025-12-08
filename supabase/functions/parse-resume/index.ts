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
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Read file content - handle both text and binary files
    const fileBuffer = await file.arrayBuffer();
    let fileText = '';

    // Helper function to convert ArrayBuffer to base64 without stack overflow
    const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      const chunkSize = 8192; // Process in chunks to avoid stack overflow

      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.slice(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, Array.from(chunk));
      }

      return btoa(binary);
    };

    // For PDF and binary files, convert to base64
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf') ||
      file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      const base64 = arrayBufferToBase64(fileBuffer);
      // Limit to first 100KB of base64 to avoid token limits
      fileText = `[${file.type || 'Binary'} FILE]\nFilename: ${file.name}\nBase64 (first 100KB): ${base64.substring(0, 100000)}`;
    } else {
      // For text-based files, try to decode
      try {
        fileText = new TextDecoder().decode(fileBuffer);
      } catch (error) {
        const base64 = arrayBufferToBase64(fileBuffer);
        fileText = `[Binary file content]\nBase64: ${base64.substring(0, 100000)}`;
      }
    }

    // Use OpenAI to extract resume data
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const systemPrompt = `You are a professional resume parser. Extract ONLY the actual information present in the resume/CV.

CRITICAL RULES:
1. Extract ONLY information that is explicitly written in the resume
2. DO NOT fabricate, invent, or assume any data
3. If a field is not present in the resume, use empty strings "" or empty arrays []
4. Be precise - extract exactly what is written
5. Preserve original formatting for dates and text

Extract these fields:
- contact: name, title, location, phone (array), email, github, linkedin
- summary: professional summary text (exact text from resume)
- experience: array of {company, position, period, responsibilities (array), technologies (string)}
- education: {institution, period, degree, note}
- skills: {programmingLanguages, fundamentals, frameworks, databases, apiDesign, authentication, tools, designPatterns, frontend, devops} (all arrays)
- softSkills: array of strings
- projects: array of {name, url}
- languages: array of {language, proficiency}

Return structured data using the provided tool schema.`;

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
          { role: 'user', content: `Parse this resume:\n\n${fileText}` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "parse_resume",
            description: "Extract structured resume data",
            parameters: {
              type: "object",
              properties: {
                contact: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    title: { type: "string" },
                    location: { type: "string" },
                    phone: { type: "array", items: { type: "string" } },
                    email: { type: "string" },
                    github: { type: "string" },
                    linkedin: { type: "string" }
                  }
                },
                summary: { type: "string" },
                experience: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      company: { type: "string" },
                      position: { type: "string" },
                      period: { type: "string" },
                      responsibilities: { type: "array", items: { type: "string" } },
                      technologies: { type: "string" }
                    }
                  }
                },
                education: {
                  type: "object",
                  properties: {
                    institution: { type: "string" },
                    period: { type: "string" },
                    degree: { type: "string" },
                    note: { type: "string" }
                  }
                },
                skills: {
                  type: "object",
                  properties: {
                    programmingLanguages: { type: "array", items: { type: "string" } },
                    fundamentals: { type: "array", items: { type: "string" } },
                    frameworks: { type: "array", items: { type: "string" } },
                    databases: { type: "array", items: { type: "string" } },
                    apiDesign: { type: "array", items: { type: "string" } },
                    authentication: { type: "array", items: { type: "string" } },
                    tools: { type: "array", items: { type: "string" } },
                    designPatterns: { type: "array", items: { type: "string" } },
                    frontend: { type: "array", items: { type: "string" } },
                    devops: { type: "array", items: { type: "string" } }
                  }
                },
                softSkills: { type: "array", items: { type: "string" } },
                projects: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      url: { type: "string" }
                    }
                  }
                },
                languages: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      language: { type: "string" },
                      proficiency: { type: "string" }
                    }
                  }
                }
              },
              required: ["contact", "summary", "experience", "education", "skills"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "parse_resume" } }
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
      throw new Error('Failed to parse resume with AI');
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error('No structured data returned from AI');
    }

    const parsedData = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ success: true, data: parsedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error parsing resume:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
