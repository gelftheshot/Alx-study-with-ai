import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 300;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const YOUR_SITE_URL = process.env.YOUR_SITE_URL || 'http://localhost:3000';
const YOUR_SITE_NAME = process.env.YOUR_SITE_NAME || 'NotesWithAI';

export async function POST(req) {
  const { text, wordCount, complexity } = await req.json();

  if (!text) {
    return NextResponse.json({ error: 'No text provided' }, { status: 400 });
  }

  const systemPrompt = `Generate a comprehensive note based ONLY on the provided text content with approximately ${wordCount} words and a complexity level of ${complexity}% (1% simplest, 100% most complex).

  Instructions:
  1. Use ONLY the information from the text content provided. Do not use any external knowledge.
  2. The note should summarize key points and concepts from the text.
  3. Organize the note in a clear, logical structure with the following sections:
     - Introduction (brief overview)
     - Main Points (use bullet points or numbered list)
     - Key Concepts (explain important terms or ideas)
     - Summary (concise wrap-up)
  4. Adjust the language complexity to match the specified level.
  5. Return the note as plain text, using Markdown formatting for structure.

  Generate the note with approximately ${wordCount} words. Use Markdown formatting for better structure.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": YOUR_SITE_URL,
        "X-Title": YOUR_SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "meta-llama/llama-3.1-8b-instruct:free",
        "messages": [
          {"role": "system", "content": systemPrompt},
          {"role": "user", "content": text},
        ],
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API request failed with status ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices[0].message.content;
    console.log('Raw API response:', content);

    // Create a note object with the content
    const note = { content: content.trim() };

    return NextResponse.json({ note });
  } catch (error) {
    console.error('Error generating note:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}